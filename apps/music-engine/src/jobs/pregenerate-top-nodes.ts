import type { GenerateSongDifficulty } from "../models/types.js";
import { getPrisma } from "../lib/prisma.js";
import { generateMusicAssets } from "../services/music.service.js";

function mapDifficulty(raw: string): GenerateSongDifficulty {
  const d = raw.toLowerCase();
  if (d === "easy" || d === "low" || d === "beginner") return "beginner";
  if (d === "hard" || d === "high" || d === "advanced") return "advanced";
  return "intermediate";
}

/**
 * Finds concept nodes with the most missions (proxy for "most used") and
 * generates music assets in-process. Does not persist results (see future DB cache).
 */
export async function pregenerateTopNodes(limit = 100): Promise<{
  processed: number;
  errors: Array<{ nodeId: string; message: string }>;
}> {
  const prisma = getPrisma();
  const rows = await prisma.mission.groupBy({
    by: ["nodeId"],
    _count: { nodeId: true },
    orderBy: { _count: { nodeId: "desc" } },
    take: limit,
  });

  const nodeIds = rows.map((r) => r.nodeId);
  const nodes = await prisma.conceptNode.findMany({
    where: { id: { in: nodeIds } },
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const errors: Array<{ nodeId: string; message: string }> = [];
  let processed = 0;

  for (const row of rows) {
    const node = byId.get(row.nodeId);
    if (!node) continue;
    try {
      await generateMusicAssets({
        conceptId: node.id,
        title: node.title,
        explanation: [node.description, node.learningObjective].filter(Boolean).join("\n\n"),
        difficulty: mapDifficulty(node.difficulty),
      });
      processed += 1;
    } catch (e) {
      errors.push({
        nodeId: row.nodeId,
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return { processed, errors };
}
