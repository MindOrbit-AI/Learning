/**
 * Builds plain-language "why" explanations for parents and learners.
 */

import { prisma } from "@mindorbit/db";
import { resolveDisplayNodeState } from "./learning-state-engine";

export interface PrerequisiteLink {
  title: string;
  state: string;
  isWeak: boolean;
}

export interface WhyPanelData {
  nodeTitle: string;
  state: string;
  mastery: number | null;
  misconception: string | null;
  prerequisiteChain: PrerequisiteLink[];
  summary: string;
}

function parseMisconception(raw: unknown): string | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.label === "string" && obj.label.trim()) return obj.label.trim();
  if (typeof obj.category === "string" && obj.category.trim()) return obj.category.trim();
  return null;
}

function buildSummary(
  nodeTitle: string,
  state: string,
  misconception: string | null,
  weakPrereqs: PrerequisiteLink[]
): string {
  if (misconception) {
    return `Struggling with ${nodeTitle} often comes from a specific misconception: "${misconception}". Targeted practice on this concept should address the root cause.`;
  }
  if (weakPrereqs.length > 0) {
    const names = weakPrereqs.slice(0, 2).map((p) => p.title).join(" and ");
    return `Weakness in ${nodeTitle} is likely connected to gaps in ${names}. Strengthening those prerequisites usually unlocks faster progress here.`;
  }
  if (state === "weak") {
    return `${nodeTitle} needs focused practice. The diagnostic shows this as a priority gap — fixing it first typically gives the fastest gains.`;
  }
  if (state === "learning") {
    return `${nodeTitle} is in progress. A few more targeted reps should move this toward mastered.`;
  }
  return `${nodeTitle} looks solid. Keep reviewing on schedule so it stays mastered.`;
}

export async function buildWhyPanel(
  userId: string,
  nodeId: string,
  subjectId: string
): Promise<WhyPanelData | null> {
  const [node, uns, prereqEdges] = await Promise.all([
    prisma.conceptNode.findUnique({ where: { id: nodeId } }),
    prisma.userNodeState.findUnique({
      where: { userId_subjectId_nodeId: { userId, subjectId, nodeId } },
    }),
    prisma.conceptEdge.findMany({
      where: { subjectId, targetNodeId: nodeId, relationshipType: "prerequisite" },
      include: { sourceNode: true },
    }),
  ]);

  if (!node) return null;

  const state = resolveDisplayNodeState(uns?.mastery, uns?.state);
  const misconception = parseMisconception(uns?.misconceptionJson);

  const prereqIds = prereqEdges.map((e) => e.sourceNodeId);
  const prereqStates =
    prereqIds.length > 0
      ? await prisma.userNodeState.findMany({
          where: { userId, nodeId: { in: prereqIds } },
        })
      : [];
  const prereqStateMap = new Map(prereqStates.map((s) => [s.nodeId, s]));

  const prerequisiteChain: PrerequisiteLink[] = prereqEdges.map((e) => {
    const ps = prereqStateMap.get(e.sourceNodeId);
    const pState = resolveDisplayNodeState(ps?.mastery, ps?.state);
    return {
      title: e.sourceNode.title,
      state: pState,
      isWeak: pState === "weak" || pState === "learning",
    };
  });

  const weakPrereqs = prerequisiteChain.filter((p) => p.isWeak);

  return {
    nodeTitle: node.title,
    state,
    mastery: uns?.mastery ?? null,
    misconception,
    prerequisiteChain,
    summary: buildSummary(node.title, state, misconception, weakPrereqs),
  };
}

export async function buildWhyPanelsForNodes(
  userId: string,
  subjectId: string,
  nodeIds: string[]
): Promise<Map<string, WhyPanelData>> {
  const results = new Map<string, WhyPanelData>();
  await Promise.all(
    nodeIds.map(async (nodeId) => {
      const panel = await buildWhyPanel(userId, nodeId, subjectId);
      if (panel) results.set(nodeId, panel);
    })
  );
  return results;
}
