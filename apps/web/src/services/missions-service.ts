/**
 * Missions Service - Generate learning missions for concept nodes
 */

import { prisma } from "@mindorbit/db";
import { getAIProvider } from "@mindorbit/ai";
import { AnalyticsService, EVENT_TYPES } from "./analytics-service";

export const missionsService = {
  /**
   * Generate a mission for a specific node and user
   */
  async generateMission(nodeId: string, userId: string): Promise<string | null> {
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

    const content = await getAIProvider().generateMissionContent({
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

  async completeMission(missionId: string, userId: string): Promise<void> {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission || mission.userId !== userId) {
      throw new Error("Mission not found");
    }

    await prisma.mission.update({
      where: { id: missionId },
      data: { status: "completed" },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: mission.xpReward } },
    });

    await prisma.userNodeState.updateMany({
      where: { userId, nodeId: mission.nodeId },
      data: {
        state: "learning",
        mastery: { increment: 15 },
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
    });
  },
};
