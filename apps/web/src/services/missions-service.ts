/**
 * Missions Service - Generate learning missions for concept nodes
 * Supports both task-based (legacy) and scene-based (Brilliant-style) missions
 */

import { prisma } from "@mindorbit/db";
import { getAIProvider } from "@mindorbit/ai";
import {
  starsFromTaskOutcome,
  xpFromMissionPerformance,
} from "@mindorbit/lib";
import { LearningStateEngine } from "./learning-state-engine";
import { AnalyticsService, EVENT_TYPES } from "./analytics-service";
import { awardMissionCompletionBadges } from "./mission-badges";
import { applyMissionCompletionStreak } from "./mission-streak";

export const missionsService = {
  /**
   * Generate a mission for a specific node and user
   * @param sceneBased - if true, generates interactive scene-based mission (Brilliant-style)
   */
  async generateMission(
    nodeId: string,
    userId: string,
    options?: { sceneBased?: boolean }
  ): Promise<string | null> {
    const node = await prisma.conceptNode.findUnique({
      where: { id: nodeId },
      include: { subject: true },
    });
    if (!node) return null;

    const existing = await prisma.mission.findFirst({
      where: {
        userId,
        nodeId,
        status: { in: ["not_started", "in_progress"] },
      },
    });
    if (existing) return existing.id;

    const sceneBased = options?.sceneBased ?? false;
    const provider = getAIProvider();

    if (sceneBased && provider.generateSceneMissionContent) {
      const sceneContent = await provider.generateSceneMissionContent({
        nodeId: node.id,
        nodeSlug: node.slug,
        nodeTitle: node.title,
      });

      const mission = await prisma.mission.create({
        data: {
          userId,
          subjectId: node.subjectId,
          nodeId,
          title: sceneContent.title,
          missionType: sceneContent.missionType,
          estimatedMinutes: sceneContent.estimatedMinutes,
          status: "not_started",
        },
      });

      for (const s of sceneContent.scenes) {
        await prisma.missionScene.create({
          data: {
            missionId: mission.id,
            sceneType: s.sceneType,
            title: s.title,
            prompt: s.prompt,
            contentJson: JSON.stringify(s.contentJson ?? {}),
            correctAnswerJson:
              s.correctAnswerJson != null ? JSON.stringify(s.correctAnswerJson) : null,
            explanation: s.explanation ?? null,
            hintLevel1: s.hintLevel1 ?? null,
            hintLevel2: s.hintLevel2 ?? null,
            hintLevel3: s.hintLevel3 ?? null,
            orderIndex: s.orderIndex,
          },
        });
      }

      return mission.id;
    }

    const content = await provider.generateMissionContent({
      nodeId: node.id,
      nodeSlug: node.slug,
      nodeTitle: node.title,
    });

    const mission = await prisma.mission.create({
      data: {
        userId,
        subjectId: node.subjectId,
        nodeId,
        title: content.title,
        explanation: content.explanation,
        example: content.example,
        reflectionPrompt: content.reflectionPrompt,
        variationPrompt: content.variationPrompt,
        estimatedMinutes: content.estimatedMinutes,
        status: "not_started",
      },
    });

    for (const t of content.practiceQuestions) {
      await prisma.missionTask.create({
        data: {
          missionId: mission.id,
          type: t.type,
          prompt: t.prompt,
          optionsJson: t.options ? JSON.stringify(t.options) : null,
          correctAnswer: t.correctAnswer,
          explanation: t.explanation,
          orderIndex: t.orderIndex,
        },
      });
    }

    return mission.id;
  },

  async completeMission(
    missionId: string,
    userId: string,
    options?: {
      taskResponses: Array<{ taskId: string; selectedAnswer: string }>;
      taskCheckCounts?: Record<string, number>;
    }
  ): Promise<{ xpEarned: number; stars: number }> {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { tasks: { orderBy: { orderIndex: "asc" } } },
    });

    if (!mission || mission.userId !== userId) {
      throw new Error("Mission not found");
    }

    const completedAt = new Date();
    const taskList = mission.tasks;
    const totalTasks = taskList.length;
    const taskIds = taskList.map((t) => t.id);
    const taskById = Object.fromEntries(taskList.map((t) => [t.id, t]));

    let correctCount = 0;
    if (totalTasks > 0) {
      const responses = options?.taskResponses ?? [];
      if (responses.length === 0) {
        throw new Error("Task responses required");
      }
      for (const r of responses) {
        const t = taskById[r.taskId];
        if (!t) continue;
        const ok =
          r.selectedAnswer.toLowerCase().trim() === t.correctAnswer.toLowerCase().trim();
        if (ok) correctCount++;
      }
    } else {
      correctCount = 0;
    }

    const accuracy = totalTasks > 0 ? correctCount / totalTasks : 1;
    const stars =
      totalTasks === 0
        ? 2
        : starsFromTaskOutcome({
            totalTasks,
            correctCount,
            taskIds,
            checkCountsByTask: options?.taskCheckCounts ?? {},
          });

    const xpEarned = xpFromMissionPerformance({
      xpReward: mission.xpReward,
      accuracy01: accuracy,
      stars,
      missionType: mission.missionType,
    });

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

    const MASTERY_DELTA = 15;
    const existing = await prisma.userNodeState.findUnique({
      where: {
        userId_subjectId_nodeId: {
          userId,
          subjectId: mission.subjectId,
          nodeId: mission.nodeId,
        },
      },
    });
    const newMastery = (existing?.mastery ?? 0) + MASTERY_DELTA;
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
        mastery: MASTERY_DELTA,
        lastPracticedAt: new Date(),
      },
      update: {
        state: newState,
        mastery: { increment: MASTERY_DELTA },
        lastPracticedAt: new Date(),
      },
    });

    await awardMissionCompletionBadges(userId, {
      missionType: mission.missionType,
      completedAt,
    });

    await AnalyticsService.track(userId, EVENT_TYPES.mission_completed, {
      missionId,
      nodeId: mission.nodeId,
      stars,
    });

    return { xpEarned, stars };
  },
};
