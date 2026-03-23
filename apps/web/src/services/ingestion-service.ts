/**
 * Content Ingestion Service - Pipeline for uploaded learning materials
 * Upload → Parse (PDF/YouTube/text) → AI Summarize (flashcards, summaries, quizzes) → Extract Concepts → Create Nodes
 */

import { prisma } from "@mindorbit/db";
import { getAIProvider } from "@mindorbit/ai";
import { conceptExtractionService } from "./concept-extraction-service";
import { graphAlignmentService } from "@/services/graph-alignment-service";
import { contentParsers } from "../lib/content-parsers";
import type { ContentSummaryJson } from "@mindorbit/ai";

const COMMUNITY_SLUG = "community";
const COMMUNITY_CLUSTER_SLUG = "general";

/** Slug from title for community upload nodes */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "upload";
}

/** Create a Resource for standalone uploads (no subject) under Community subject */
async function createCommunityResource(
  source: { id: string; userId: string; content: string | null; sourceUrl: string | null },
  summary: ContentSummaryJson
): Promise<string | null> {
  const title = summary.title?.trim() || "Untitled";
  const slug = toSlug(title);

  const subject = await prisma.subject.upsert({
    where: { slug: COMMUNITY_SLUG },
    create: {
      slug: COMMUNITY_SLUG,
      title: "Community",
      description: "User-uploaded notes and summaries.",
      icon: "🌐",
      color: "#6B7280",
      createdById: null, // Platform subject, visible to all
    },
    update: {},
  });

  const cluster = await prisma.cluster.upsert({
    where: {
      subjectId_slug: { subjectId: subject.id, slug: COMMUNITY_CLUSTER_SLUG },
    },
    create: {
      subjectId: subject.id,
      slug: COMMUNITY_CLUSTER_SLUG,
      title: "General",
      description: "Community uploads not tied to a specific subject.",
      orderIndex: 0,
    },
    update: {},
  });

  const maxOrder = await prisma.conceptNode.aggregate({
    where: { clusterId: cluster.id },
    _max: { orderIndex: true },
  });
  const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;

  // Create a unique node per upload (slug + short id to avoid collisions)
  const uniqueSlug = `${slug}-${source.id.slice(-8)}`;
  const node = await prisma.conceptNode.create({
    data: {
      subjectId: subject.id,
      clusterId: cluster.id,
      slug: uniqueSlug,
      title,
      description: summary.shortSummary?.slice(0, 500) ?? "",
      orderIndex,
    },
  });

  return graphAlignmentService.createResourceForNode(node.id, {
    subjectId: subject.id,
    userId: source.userId,
    sourceId: source.id,
    summary,
    sourceUrl: source.sourceUrl,
    conceptText: source.content?.slice(0, 500) ?? undefined,
    originalText: source.content ?? undefined,
    status: "approved", // Community uploads visible immediately
  });
}

export type SourceType = "pdf" | "youtube" | "image" | "text" | "url";

export const ingestionService = {
  /**
   * Create an uploaded source record. Call parseAndProcessSource after for PDF/YouTube.
   */
  async uploadSource(
    userId: string,
    data: {
      sourceType: SourceType;
      sourceUrl?: string;
      content?: string;
      subjectId?: string;
      clusterId?: string;
      /** For PDF/image: raw file buffer */
      fileBuffer?: Buffer;
      /** For image: MIME type (e.g. image/png, image/jpeg) */
      fileMimeType?: string;
    }
  ): Promise<string> {
    let content = data.content ?? null;

    if (data.sourceType === "pdf" && data.fileBuffer) {
      const parsed = await contentParsers.parsePdf(data.fileBuffer);
      content = parsed.text;
    } else if (data.sourceType === "image" && data.fileBuffer && data.fileMimeType) {
      const parsed = await contentParsers.parseImage(data.fileBuffer, data.fileMimeType);
      content = parsed.text;
    } else if (data.sourceType === "youtube" && data.sourceUrl) {
      const parsed = await contentParsers.parseYouTube(data.sourceUrl);
      content = parsed.text;
    } else if (data.sourceType === "url" && data.sourceUrl) {
      const parsed = await contentParsers.parseUrl(data.sourceUrl);
      content = parsed.text;
    } else if (
      data.sourceType === "text" &&
      data.content
    ) {
      const parsed = contentParsers.parseText(data.content);
      content = parsed.text;
    }

    const source = await prisma.uploadedSource.create({
      data: {
        userId,
        subjectId: data.subjectId ?? null,
        clusterId: data.clusterId ?? null,
        sourceType: data.sourceType,
        sourceUrl: data.sourceUrl ?? null,
        content,
        status: content ? "pending" : "failed",
      },
    });
    return source.id;
  },

  async processSource(sourceId: string): Promise<{ nodeIds: string[]; resourceIds: string[] }> {
    const source = await prisma.uploadedSource.findUnique({
      where: { id: sourceId },
    });
    if (!source) return { nodeIds: [], resourceIds: [] };
    if (!source.content) {
      await prisma.uploadedSource.update({
        where: { id: sourceId },
        data: { status: "failed" },
      });
      return { nodeIds: [], resourceIds: [] };
    }

    await prisma.uploadedSource.update({
      where: { id: sourceId },
      data: { status: "parsing" },
    });

    const summary = await getAIProvider().summarizeContentToJson(source.content);
    const summaryJson = JSON.stringify(summary);
    await prisma.uploadedSource.update({
      where: { id: sourceId },
      data: { summaryJson },
    });

    await prisma.uploadedSource.update({
      where: { id: sourceId },
      data: { status: "extracting" },
    });

    let nodeIds: string[] = [];
    let resourceIds: string[] = [];

    let subjectId = source.subjectId;
    if (!subjectId) {
      // Infer subject from content (e.g. algebra video → Algebra)
      const subjects = await prisma.subject.findMany({
        where: { slug: { not: COMMUNITY_SLUG } },
        select: { id: true, slug: true, title: true, description: true },
      });
      if (subjects.length > 0) {
        const contentSummary = [summary.shortSummary, summary.deepSummary, summary.title].filter(Boolean).join("\n\n");
        const selectSubject = getAIProvider().selectMostRelevantSubject;
        subjectId = selectSubject ? await selectSubject(subjects, contentSummary) : null;
      }
      if (!subjectId) {
        // No match: create Resource under Community subject
        const resourceId = await createCommunityResource(source, summary);
        if (resourceId) resourceIds.push(resourceId);
        await prisma.uploadedSource.update({
          where: { id: sourceId },
          data: { status: "completed" },
        });
        return { nodeIds, resourceIds };
      }
      // Update source with inferred subject for consistency
      await prisma.uploadedSource.update({
        where: { id: sourceId },
        data: { subjectId },
      });
    }

    const contentSummary = [summary.shortSummary, summary.deepSummary, summary.title].filter(Boolean).join("\n\n");

    // 1. Get clusters and pick: user-selected or AI
    const clusters = await prisma.cluster.findMany({
      where: { subjectId },
      orderBy: { orderIndex: "asc" },
      select: { id: true, title: true, description: true },
    });
    if (clusters.length === 0) {
      await prisma.uploadedSource.update({
        where: { id: sourceId },
        data: { status: "completed" },
      });
      return { nodeIds, resourceIds };
    }

    let clusterId = source.clusterId;
    if (!clusterId || !clusters.some((c) => c.id === clusterId)) {
      clusterId = await getAIProvider().selectMostRelevantCluster(clusters, contentSummary);
    }
    if (!clusterId) {
      clusterId = clusters[0]?.id ?? null;
    }
    if (!clusterId) {
      await prisma.uploadedSource.update({
        where: { id: sourceId },
        data: { status: "completed" },
      });
      return { nodeIds, resourceIds };
    }

    // 2. Get nodes in cluster and pick: AI selects most relevant
    const nodes = await prisma.conceptNode.findMany({
      where: { clusterId },
      orderBy: { orderIndex: "asc" },
      select: { id: true, title: true, description: true },
    });

    const selectedNodeId = nodes.length > 0
      ? await getAIProvider().selectMostRelevantNode(nodes, contentSummary)
      : null;

    if (selectedNodeId) {
      const resourceId = await graphAlignmentService.createResourceForNode(selectedNodeId, {
        subjectId,
        userId: source.userId,
        sourceId,
        summary,
        sourceUrl: source.sourceUrl,
        conceptText: source.content?.slice(0, 500),
        originalText: source.content ?? undefined,
        status: "approved",
      });
      if (resourceId) {
        resourceIds.push(resourceId);
        nodeIds.push(selectedNodeId);
      }
    } else {
      // Fallback: extract concept and create new node in cluster
      const extraction = await conceptExtractionService.extractConcept(
        sourceId,
        subjectId,
        source.content
      );
      if (extraction) {
        const result = await graphAlignmentService.alignToGraph([extraction], {
          subjectId,
          userId: source.userId,
          sourceId,
          clusterId,
          summary,
          sourceUrl: source.sourceUrl,
          originalText: source.content ?? undefined,
          status: "approved",
        });
        nodeIds = result.nodeIds;
        resourceIds = result.resourceIds;
      }
    }

    await prisma.uploadedSource.update({
      where: { id: sourceId },
      data: { status: "completed" },
    });

    return { nodeIds, resourceIds };
  },
};
