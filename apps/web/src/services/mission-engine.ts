/**
 * Mission Engine - Brilliant-style interactive scene-based missions
 * Handles partial progress, scene responses, and evaluation
 */

import { prisma } from "@mindorbit/db";
import type { MistakeCategory } from "@mindorbit/types";
import { LearningStateEngine } from "./learning-state-engine";
import { AnalyticsService, EVENT_TYPES } from "./analytics-service";

/** Save partial progress (completed indices, answers) for resume */
export async function savePartialProgress(
  missionId: string,
  userId: string,
  data: {
    currentSceneIndex?: number;
    completedIndices?: number[];
    answers?: Record<string, unknown>;
  }
): Promise<void> {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  });
  if (!mission || mission.userId !== userId) {
    throw new Error("Mission not found");
  }

  await prisma.mission.update({
    where: { id: missionId },
    data: {
      currentSceneIndex: data.currentSceneIndex ?? mission.currentSceneIndex,
      status: "in_progress",
    },
  });

  const existing = await prisma.missionProgress.findUnique({
    where: { missionId },
  });

  const completedIndices = JSON.stringify(data.completedIndices ?? []);
  const answersJson = data.answers
    ? JSON.stringify(data.answers)
    : existing?.answersJson;

  await prisma.missionProgress.upsert({
    where: { missionId },
    create: {
      missionId,
      completedIndices,
      answersJson,
    },
    update: {
      completedIndices,
      answersJson,
    },
  });
}

/** Record a scene response and optionally classify mistake */
export async function recordSceneResponse(
  missionId: string,
  sceneId: string,
  userId: string,
  userAnswerJson: string,
  isCorrect: boolean,
  mistakeCategory?: MistakeCategory
): Promise<void> {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
  });
  if (!mission || mission.userId !== userId) {
    throw new Error("Mission not found");
  }

  await prisma.missionSceneResponse.create({
    data: {
      missionId,
      sceneId,
      userAnswerJson,
      isCorrect,
      mistakeCategory: mistakeCategory ?? null,
    },
  });
}

/** Complete a scene-based mission and update mastery, confidence, stability, XP */
export async function completeSceneMission(
  missionId: string,
  userId: string,
  sceneResponses: Array<{
    sceneId: string;
    isCorrect: boolean;
    attempts: number;
    mistakeCategory?: MistakeCategory | null;
  }>
): Promise<void> {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    include: { node: true },
  });

  if (!mission || mission.userId !== userId) {
    throw new Error("Mission not found");
  }

  const correctCount = sceneResponses.filter((r) => r.isCorrect).length;
  const totalCount = sceneResponses.length;
  const accuracy = totalCount > 0 ? correctCount / totalCount : 0;

  // Persist responses
  for (const r of sceneResponses) {
    await prisma.missionSceneResponse.create({
      data: {
        missionId,
        sceneId: r.sceneId,
        userAnswerJson: JSON.stringify({ isCorrect: r.isCorrect }),
        isCorrect: r.isCorrect,
        attempts: r.attempts,
        mistakeCategory: r.mistakeCategory ?? null,
      },
    }).catch(() => {});
  }

  await prisma.mission.update({
    where: { id: missionId },
    data: { status: "completed" },
  });

  // XP scaled by accuracy
  const xpEarned = Math.round(mission.xpReward * (0.5 + 0.5 * accuracy));

  await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: xpEarned } },
  });

  // Update mastery, confidence, stability
  const masteryDelta = Math.min(20, Math.round(accuracy * 25));
  const confidenceDelta = Math.min(0.15, accuracy * 0.2);
  const stabilityDelta = Math.min(0.1, accuracy * 0.15);

  const existing = await prisma.userNodeState.findUnique({
    where: {
      userId_subjectId_nodeId: {
        userId,
        subjectId: mission.subjectId,
        nodeId: mission.nodeId,
      },
    },
  });
  const newMastery = (existing?.mastery ?? 0) + masteryDelta;
  const newState = LearningStateEngine.assignNodeState(newMastery);

  await prisma.userNodeState.upsert({
    where: {
      userId_subjectId_nodeId: {
        userId,
        subjectId: mission.subjectId,
        nodeId: mission.nodeId,
      },
    },
    create: {
      userId,
      subjectId: mission.subjectId,
      nodeId: mission.nodeId,
      state: newState,
      mastery: masteryDelta,
      confidence: confidenceDelta,
      stability: stabilityDelta,
      lastPracticedAt: new Date(),
    },
    update: {
      state: newState,
      mastery: { increment: masteryDelta },
      confidence: { increment: confidenceDelta },
      stability: { increment: stabilityDelta },
      lastPracticedAt: new Date(),
    },
  });

  const badge = await prisma.badge.findUnique({
    where: { slug: "mission-finisher" },
  });
  if (badge) {
    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: { userId, badgeId: badge.id },
      },
      create: { userId, badgeId: badge.id },
      update: {},
    }).catch(() => {});
  }

  await AnalyticsService.track(userId, EVENT_TYPES.mission_completed, {
    missionId,
    nodeId: mission.nodeId,
    correctCount,
    totalCount,
    xpEarned,
  });
}
