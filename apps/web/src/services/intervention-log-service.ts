/**
 * P3 — Tracks intervention outcomes per node for efficacy analysis.
 */

import { prisma } from "@mindorbit/db";

export type InterventionType = "mission" | "review" | "diagnostic";

export async function logInterventionStart(
  userId: string,
  subjectId: string,
  nodeId: string,
  interventionType: InterventionType,
  options?: { missionType?: string; misconceptionCategory?: string }
): Promise<string> {
  const uns = await prisma.userNodeState.findUnique({
    where: { userId_subjectId_nodeId: { userId, subjectId, nodeId } },
  });

  const log = await prisma.nodeInterventionLog.create({
    data: {
      userId,
      subjectId,
      nodeId,
      interventionType,
      missionType: options?.missionType ?? null,
      misconceptionCategory: options?.misconceptionCategory ?? null,
      masteryBefore: uns?.mastery ?? 0,
      stateBefore: uns?.state ?? "untouched",
    },
  });
  return log.id;
}

export async function logInterventionComplete(
  logId: string,
  userId: string,
  subjectId: string,
  nodeId: string
): Promise<void> {
  const uns = await prisma.userNodeState.findUnique({
    where: { userId_subjectId_nodeId: { userId, subjectId, nodeId } },
  });

  await prisma.nodeInterventionLog.update({
    where: { id: logId },
    data: {
      masteryAfter: uns?.mastery ?? 0,
      stateAfter: uns?.state ?? "untouched",
      completedAt: new Date(),
    },
  });
}

export async function logInterventionOutcome(
  userId: string,
  subjectId: string,
  nodeId: string,
  interventionType: InterventionType,
  options?: {
    missionType?: string;
    misconceptionCategory?: string;
    masteryBefore?: number;
    masteryAfter?: number;
    stateBefore?: string;
    stateAfter?: string;
  }
): Promise<void> {
  await prisma.nodeInterventionLog.create({
    data: {
      userId,
      subjectId,
      nodeId,
      interventionType,
      missionType: options?.missionType ?? null,
      misconceptionCategory: options?.misconceptionCategory ?? null,
      masteryBefore: options?.masteryBefore ?? 0,
      masteryAfter: options?.masteryAfter ?? null,
      stateBefore: options?.stateBefore ?? "untouched",
      stateAfter: options?.stateAfter ?? null,
      completedAt: new Date(),
    },
  });
}
