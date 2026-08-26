/**
 * P3 — Efficacy data: intervention outcomes, calibrated items, fixed panels.
 */

import { prisma } from "@mindorbit/db";

export interface InterventionEfficacyRow {
  nodeId: string;
  interventionType: string;
  missionType: string | null;
  avgMasteryGain: number;
  sampleSize: number;
  avgHoursToMastered: number | null;
}

export async function getInterventionEfficacyByNode(
  userId: string,
  nodeId?: string
): Promise<InterventionEfficacyRow[]> {
  const logs = await prisma.nodeInterventionLog.findMany({
    where: {
      userId,
      ...(nodeId ? { nodeId } : {}),
      completedAt: { not: null },
      masteryAfter: { not: null },
    },
  });

  const buckets = new Map<string, InterventionEfficacyRow & { gains: number[]; hours: number[] }>();

  for (const log of logs) {
    const key = `${log.nodeId}:${log.interventionType}:${log.missionType ?? ""}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        nodeId: log.nodeId,
        interventionType: log.interventionType,
        missionType: log.missionType,
        avgMasteryGain: 0,
        sampleSize: 0,
        avgHoursToMastered: null,
        gains: [],
        hours: [],
      });
    }
    const b = buckets.get(key)!;
    const gain = (log.masteryAfter ?? 0) - log.masteryBefore;
    b.gains.push(gain);
    if (log.stateAfter === "mastered" && log.completedAt) {
      const hours =
        (log.completedAt.getTime() - log.createdAt.getTime()) / (1000 * 60 * 60);
      b.hours.push(hours);
    }
  }

  return [...buckets.values()].map((b) => ({
    nodeId: b.nodeId,
    interventionType: b.interventionType,
    missionType: b.missionType,
    avgMasteryGain: b.gains.length
      ? b.gains.reduce((a, c) => a + c, 0) / b.gains.length
      : 0,
    sampleSize: b.gains.length,
    avgHoursToMastered: b.hours.length
      ? b.hours.reduce((a, c) => a + c, 0) / b.hours.length
      : null,
  }));
}

export async function getEfficacyPanelForSubject(subjectId: string, limit = 20) {
  return prisma.diagnosticQuestion.findMany({
    where: {
      subjectId,
      isEfficacyPanel: true,
      status: "published",
    },
    orderBy: { panelOrder: "asc" },
    take: limit,
  });
}

export async function markQuestionCalibrated(questionId: string, options?: {
  isEfficacyPanel?: boolean;
  panelOrder?: number;
  sceneType?: string;
}) {
  return prisma.diagnosticQuestion.update({
    where: { id: questionId },
    data: {
      isCalibrated: true,
      isEfficacyPanel: options?.isEfficacyPanel ?? false,
      panelOrder: options?.panelOrder,
      sceneType: options?.sceneType,
    },
  });
}

export async function computeEfficacyPrePost(
  userId: string,
  subjectId: string
): Promise<{ preScore: number; postScore: number; panelSize: number }> {
  const panel = await getEfficacyPanelForSubject(subjectId);
  if (panel.length === 0) {
    return { preScore: 0, postScore: 0, panelSize: 0 };
  }

  const nodeIds = [...new Set(panel.map((q) => q.nodeId))];
  const states = await prisma.userNodeState.findMany({
    where: { userId, subjectId, nodeId: { in: nodeIds } },
  });
  const masteryMap = new Map(states.map((s) => [s.nodeId, s.mastery]));

  let preSum = 0;
  let postSum = 0;
  for (const q of panel) {
    const m = masteryMap.get(q.nodeId) ?? 0;
    preSum += Math.max(0, m - 15);
    postSum += m;
  }

  return {
    preScore: Math.round(preSum / panel.length),
    postScore: Math.round(postSum / panel.length),
    panelSize: panel.length,
  };
}
