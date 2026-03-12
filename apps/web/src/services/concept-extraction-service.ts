/**
 * Concept Extraction Service - Extract concepts from parsed chunks
 * Aligns to existing nodes via similarity; uses AI to extract new concepts from unmatched content
 */

import { prisma } from "@mindorbit/db";
import { getAIProvider } from "@mindorbit/ai";

export interface ConceptExtractionResult {
  conceptText: string;
  nodeId: string | null;
  confidence: number;
  /** When nodeId is null, new concept to create */
  newConcept?: { title: string; description: string; slug: string };
}

export const conceptExtractionService = {
  async extractConcepts(
    sourceId: string,
    subjectId: string | null,
    fullContent?: string
  ): Promise<ConceptExtractionResult[]> {
    let fullText: string;
    let chunks: Array<{ content: string }>;

    if (fullContent) {
      fullText = fullContent;
      chunks = fullContent
        .split(/\n\n+/)
        .filter((p) => p.trim().length > 0)
        .map((content) => ({ content }));
    } else {
      const dbChunks = await prisma.parsedChunk.findMany({
        where: { sourceId },
        orderBy: { orderIndex: "asc" },
      });
      chunks = dbChunks;
      fullText = dbChunks.map((c) => c.content).join("\n\n");
    }

    const results: ConceptExtractionResult[] = [];

    if (subjectId) {
      const nodes = await prisma.conceptNode.findMany({
        where: { subjectId },
        select: { id: true, title: true, slug: true },
      });

      for (const chunk of chunks) {
        const words = chunk.content.toLowerCase().split(/\s+/);
        for (const node of nodes) {
          const nodeTerms = [
            ...node.title.toLowerCase().split(/\s+/),
            ...node.slug.toLowerCase().split("-"),
          ];
        const matches = nodeTerms.filter((t) =>
          words.some((w: string) => w.includes(t) || t.includes(w))
        );
          if (matches.length > 0) {
            const confidence = Math.min(
              0.95,
              (matches.length / nodeTerms.length) * 0.8 + 0.2
            );
            const conceptText = chunk.content.slice(0, 500);
            results.push({
              conceptText,
              nodeId: node.id,
              confidence,
            });
          }
        }
      }
    }

    const uniqueByNode = new Map<string, ConceptExtractionResult>();
    for (const r of results) {
      if (
        r.nodeId &&
        (!uniqueByNode.has(r.nodeId) ||
          r.confidence > (uniqueByNode.get(r.nodeId)?.confidence ?? 0))
      ) {
        uniqueByNode.set(r.nodeId, r);
      }
    }
    const aligned = Array.from(uniqueByNode.values());

    if (subjectId && fullText.length > 100) {
      const extracted = await getAIProvider().extractConceptsFromContent(fullText);
      for (const c of extracted) {
        const alreadyAligned = aligned.some(
          (a) =>
            a.nodeId &&
            a.conceptText.toLowerCase().includes(c.title.toLowerCase())
        );
        if (alreadyAligned || extracted.length > 10) continue;
        const existingNode = await prisma.conceptNode.findFirst({
          where: {
            subjectId,
            slug: c.slug,
          },
        });
        if (existingNode) continue;
        aligned.push({
          conceptText: c.description,
          nodeId: null,
          confidence: c.confidence,
          newConcept: {
            title: c.title,
            description: c.description,
            slug: c.slug,
          },
        });
      }
    }

    await prisma.conceptExtraction.createMany({
      data: aligned
        .filter((r) => r.nodeId)
        .map((r) => ({
          sourceId,
          nodeId: r.nodeId!,
          conceptText: r.conceptText,
          confidence: r.confidence,
        })),
    });

    return aligned;
  },
};
