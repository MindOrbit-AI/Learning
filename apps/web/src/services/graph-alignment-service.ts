/**
 * Graph Alignment Service - Align extracted concepts to knowledge graph
 * Creates new nodes, diagnostic questions, and summary resources
 */

import { prisma } from "@mindorbit/db";
import { getAIProvider } from "@mindorbit/ai";
import type { ConceptExtractionResult } from "./concept-extraction-service";

export interface IngestSummary {
  title?: string;
  flashcards?: Array<{ front: string; back: string }>;
  shortSummary?: string;
  deepSummary?: string;
  quizzes?: Array<{
    prompt: string;
    type: string;
    options: string[] | null;
    correctAnswer: string;
    explanation: string;
  }>;
}

export interface AlignOptions {
  subjectId: string;
  userId: string;
  sourceId: string;
  clusterId?: string;
  /** Full AI summary from ingestion - stored in Resource for ingest-style display */
  summary?: IngestSummary;
  /** Original URL for YouTube/URL sources - shown as access link on UI */
  sourceUrl?: string | null;
  /** Full original text (e.g. from text upload) - stored and displayed */
  originalText?: string | null;
  /** Auto-approve for community visibility */
  status?: "pending" | "approved";
}

export const graphAlignmentService = {
  /**
   * Ensures a subject has diagnostic questions when concept nodes exist but the
   * question bank is empty (e.g. admin-created graphs without running ingestion).
   */
  async ensureDiagnosticQuestionsForSubject(subjectId: string): Promise<void> {
    const existing = await prisma.diagnosticQuestion.count({ where: { subjectId } });
    if (existing > 0) return;

    const nodes = await prisma.conceptNode.findMany({
      where: { subjectId },
      orderBy: { orderIndex: "asc" },
    });

    for (const node of nodes) {
      const conceptText = [node.description, node.title].filter(Boolean).join("\n\n").trim();
      if (!conceptText) continue;

      const questions = await getAIProvider().generateDiagnosticQuestionsFromContent(
        conceptText.slice(0, 1500),
        node.title,
        2
      );

      for (const q of questions) {
        await prisma.diagnosticQuestion
          .create({
            data: {
              subjectId,
              nodeId: node.id,
              prompt: q.prompt,
              type: q.type,
              optionsJson: q.options ? JSON.stringify(q.options) : null,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            },
          })
          .catch(() => {});
      }
    }
  },

  async alignToGraph(
    extractions: ConceptExtractionResult[],
    options: AlignOptions
  ): Promise<{ nodeIds: string[]; resourceIds: string[] }> {
    const { subjectId, userId, sourceId, clusterId: optClusterId, summary, sourceUrl, originalText, status } = options;

    let defaultClusterId = optClusterId;
    if (!defaultClusterId) {
      const cluster = await prisma.cluster.findFirst({
        where: { subjectId },
        orderBy: { orderIndex: "asc" },
      });
      defaultClusterId = cluster?.id ?? undefined;
    }
    if (!defaultClusterId) return { nodeIds: [], resourceIds: [] };

    const nodeIds: string[] = [];
    const resourceIds: string[] = [];

    for (const ext of extractions) {
      let nodeId = ext.nodeId;

      if (!nodeId && ext.newConcept) {
        const slug = ext.newConcept.slug;
        const existing = await prisma.conceptNode.findFirst({
          where: { subjectId, slug },
        });
        if (existing) {
          nodeId = existing.id;
        } else {
          const maxOrder = await prisma.conceptNode.aggregate({
            where: { clusterId: defaultClusterId },
            _max: { orderIndex: true },
          });
          const node = await prisma.conceptNode.create({
            data: {
              subjectId,
              clusterId: defaultClusterId,
              slug,
              title: ext.newConcept.title,
              description: ext.newConcept.description.slice(0, 1000),
              orderIndex: (maxOrder._max.orderIndex ?? 0) + 1,
            },
          });
          nodeId = node.id;
        }
      }
      if (!nodeId) continue;

      nodeIds.push(nodeId);
      const node = await prisma.conceptNode.findUnique({
        where: { id: nodeId },
      });
      if (!node) continue;

      const questions = await getAIProvider().generateDiagnosticQuestionsFromContent(
        ext.conceptText,
        node.title,
        2
      );

      for (const q of questions) {
        await prisma.diagnosticQuestion
          .create({
            data: {
              subjectId,
              nodeId,
              prompt: q.prompt,
              type: q.type,
              optionsJson: q.options ? JSON.stringify(q.options) : null,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
            },
          })
          .catch(() => {});
      }

      const contentJson = summary
        ? JSON.stringify({
            summary: {
              title: summary.title ?? "",
              flashcards: summary.flashcards ?? [],
              shortSummary: summary.shortSummary ?? "",
              deepSummary: summary.deepSummary ?? "",
              quizzes: summary.quizzes ?? [],
            },
            source: "Content Ingestion Engine",
            ...(sourceUrl && { sourceUrl }),
            ...(originalText && { originalText }),
          })
        : JSON.stringify({
            markdown: ext.conceptText.slice(0, 2000),
            source: "Content Ingestion Engine",
            ...(sourceUrl && { sourceUrl }),
            ...(originalText && { originalText }),
          });

      const created = await prisma.resource
        .create({
          data: {
            userId,
            subjectId,
            clusterId: node.clusterId,
            nodeId,
            type: "summary",
            title: summary?.title?.trim() ? summary.title : node.title,
            description: ext.conceptText.slice(0, 200),
            contentJson,
            ...(status && { status }),
          },
        })
        .catch(() => null);
      if (created) resourceIds.push(created.id);
    }

    return { nodeIds, resourceIds };
  },

  /**
   * Create a resource for an existing node (AI-selected cluster + node flow).
   */
  async createResourceForNode(
    nodeId: string,
    options: {
      subjectId: string;
      userId: string;
      sourceId: string;
      summary?: IngestSummary;
      sourceUrl?: string | null;
      conceptText?: string;
      /** Full original text (e.g. from text upload) - stored and displayed */
      originalText?: string | null;
      /** Auto-approve for community visibility (e.g. standalone uploads) */
      status?: "pending" | "approved";
    }
  ): Promise<string | null> {
    const { subjectId, userId, sourceId, summary, sourceUrl, conceptText, originalText, status } = options;
    const node = await prisma.conceptNode.findUnique({
      where: { id: nodeId },
    });
    if (!node) return null;

    const textForQuestions = conceptText ?? summary?.shortSummary ?? summary?.deepSummary ?? node.description ?? "";
    const questions = await getAIProvider().generateDiagnosticQuestionsFromContent(
      textForQuestions.slice(0, 500),
      node.title,
      2
    );

    for (const q of questions) {
      await prisma.diagnosticQuestion
        .create({
          data: {
            subjectId,
            nodeId,
            prompt: q.prompt,
            type: q.type,
            optionsJson: q.options ? JSON.stringify(q.options) : null,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
          },
        })
        .catch(() => {});
    }

    const contentJson = summary
      ? JSON.stringify({
          summary: {
            title: summary.title ?? "",
            flashcards: summary.flashcards ?? [],
            shortSummary: summary.shortSummary ?? "",
            deepSummary: summary.deepSummary ?? "",
            quizzes: summary.quizzes ?? [],
          },
          source: "Content Ingestion Engine",
          ...(sourceUrl && { sourceUrl }),
          ...(originalText && { originalText }),
        })
      : JSON.stringify({
          markdown: (conceptText ?? node.description ?? "").slice(0, 2000),
          source: "Content Ingestion Engine",
          ...(sourceUrl && { sourceUrl }),
          ...(originalText && { originalText }),
        });

    const created = await prisma.resource
      .create({
        data: {
          userId,
          subjectId,
          clusterId: node.clusterId,
          nodeId,
          type: "summary",
          title: summary?.title?.trim() ? summary.title : node.title,
          description: (conceptText ?? node.description ?? "").slice(0, 200),
          contentJson,
          ...(status && { status }),
        },
      })
      .catch(() => null);

    return created?.id ?? null;
  },
};
