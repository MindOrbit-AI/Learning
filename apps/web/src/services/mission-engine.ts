/**
 * Mission Engine - Brilliant-style interactive scene-based missions
 * Handles partial progress, scene responses, and evaluation
 */

import { prisma } from "@mindorbit/db";
import type { MistakeCategory } from "@mindorbit/types";
import {
  starsFromSceneOutcomes,
  xpFromMissionPerformance,
} from "@mindorbit/lib";
import { LearningStateEngine } from "./learning-state-engine";
import { AnalyticsService, EVENT_TYPES } from "./analytics-service";
import { awardMissionCompletionBadges } from "./mission-badges";
import { applyMissionCompletionStreak } from "./mission-streak";

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

  // Don't overwrite "completed" status – savePartialProgress is for in-progress saves only
  const status = mission.status === "completed" ? "completed" : "in_progress";

  await prisma.mission.update({
    where: { id: missionId },
    data: {
      currentSceneIndex: data.currentSceneIndex ?? mission.currentSceneIndex,
      status,
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
    maxHintLevel?: number;
    mistakeCategory?: MistakeCategory | null;
  }>
): Promise<{ xpEarned: number; stars: number }> {
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
        userAnswerJson: JSON.stringify({
          isCorrect: r.isCorrect,
          maxHintLevel: r.maxHintLevel ?? 0,
        }),
        isCorrect: r.isCorrect,
        attempts: r.attempts,
        mistakeCategory: r.mistakeCategory ?? null,
      },
    }).catch(() => {});
  }

  const stars = starsFromSceneOutcomes(
    sceneResponses.map((r) => ({
      isCorrect: r.isCorrect,
      attempts: r.attempts,
      maxHintLevel: r.maxHintLevel ?? 0,
    }))
  );
  const xpEarned = xpFromMissionPerformance({
    xpReward: mission.xpReward,
    accuracy01: accuracy,
    stars,
    missionType: mission.missionType,
  });
  const completedAt = new Date();

  await prisma.mission.update({
    where: { id: missionId },
    data: {
      status: "completed",
      completedAt,
      xpGranted: xpEarned,
      starsGranted: stars,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: xpEarned } },
  });

  await applyMissionCompletionStreak(userId, completedAt);

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

  await awardMissionCompletionBadges(userId, {
    missionType: mission.missionType,
    completedAt,
    sceneResponses: sceneResponses.map((r) => ({
      isCorrect: r.isCorrect,
      attempts: r.attempts,
    })),
  });

  await AnalyticsService.track(userId, EVENT_TYPES.mission_completed, {
    missionId,
    nodeId: mission.nodeId,
    correctCount,
    totalCount,
    xpEarned,
    stars,
  });

  return { xpEarned, stars };
}
