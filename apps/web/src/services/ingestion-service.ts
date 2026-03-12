/**
 * Content Ingestion Service - Pipeline for uploaded learning materials
 * Upload → Parse (PDF/YouTube/text) → AI Summarize (flashcards, summaries, quizzes) → Extract Concepts → Create Nodes
 */

import { prisma } from "@mindorbit/db";
import { getAIProvider } from "@mindorbit/ai";
import { conceptExtractionService } from "./concept-extraction-service";
import { graphAlignmentService } from "@/services/graph-alignment-service";
import { contentParsers } from "./content-parsers";

export type SourceType = "pdf" | "youtube" | "image" | "text" | "notes" | "textbook";

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
      subjectId: string;
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
    } else if (
      (data.sourceType === "text" || data.sourceType === "notes" || data.sourceType === "textbook") &&
      data.content
    ) {
      const parsed = contentParsers.parseText(data.content);
      content = parsed.text;
    }

    const source = await prisma.uploadedSource.create({
      data: {
        userId,
        subjectId: data.subjectId,
        sourceType: data.sourceType,
        sourceUrl: data.sourceUrl ?? null,
        content,
        status: content ? "pending" : "failed",
      },
    });
    return source.id;
  },

  async processSource(sourceId: string): Promise<{ nodeIds: string[] }> {
    const source = await prisma.uploadedSource.findUnique({
      where: { id: sourceId },
    });
    if (!source) return { nodeIds: [] };
    if (!source.content) {
      await prisma.uploadedSource.update({
        where: { id: sourceId },
        data: { status: "failed" },
      });
      return { nodeIds: [] };
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

    const extractions = await conceptExtractionService.extractConcepts(
      sourceId,
      source.subjectId ?? null,
      source.content
    );

    let nodeIds: string[] = [];
    if (extractions.length > 0 && source.subjectId) {
      const cluster = await prisma.cluster.findFirst({
        where: { subjectId: source.subjectId },
        orderBy: { orderIndex: "asc" },
      });
      const result = await graphAlignmentService.alignToGraph(extractions, {
        subjectId: source.subjectId,
        userId: source.userId,
        sourceId,
        clusterId: cluster?.id,
      });
      nodeIds = result.nodeIds;
    }

    await prisma.uploadedSource.update({
      where: { id: sourceId },
      data: { status: "completed" },
    });

    return { nodeIds };
  },
};
