/**
 * Graph Alignment Service - Align extracted concepts to knowledge graph
 * Creates new nodes, diagnostic questions, and summary resources
 */

import { prisma } from "@mindorbit/db";
import { getAIProvider } from "@mindorbit/ai";
import type { ConceptExtractionResult } from "./concept-extraction-service";

export interface AlignOptions {
  subjectId: string;
  userId: string;
  sourceId: string;
  clusterId?: string;
}

export const graphAlignmentService = {
  async alignToGraph(
    extractions: ConceptExtractionResult[],
    options: AlignOptions
  ): Promise<{ nodeIds: string[] }> {
    const { subjectId, userId, sourceId, clusterId: optClusterId } = options;

    let defaultClusterId = optClusterId;
    if (!defaultClusterId) {
      const cluster = await prisma.cluster.findFirst({
        where: { subjectId },
        orderBy: { orderIndex: "asc" },
      });
      defaultClusterId = cluster?.id ?? undefined;
    }
    if (!defaultClusterId) return { nodeIds: [] };

    const nodeIds: string[] = [];

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

      await prisma.resource
        .create({
          data: {
          userId,
          subjectId,
          clusterId: node.clusterId,
          nodeId,
          type: "summary",
          title: `Summary: ${node.title}`,
          description: ext.conceptText.slice(0, 200),
          contentJson: JSON.stringify({
            markdown: ext.conceptText.slice(0, 2000),
            source: "Content Ingestion Engine",
          }),
        },
      })
      .catch(() => {});
    }

    return { nodeIds };
  },
};
