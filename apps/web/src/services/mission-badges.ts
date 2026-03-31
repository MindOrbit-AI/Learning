import { prisma } from "@mindorbit/db";
import type { MissionType } from "@prisma/client";
import { startOfUtcWeek } from "@/lib/utc-calendar";

async function grantBadge(userId: string, slug: string): Promise<void> {
  const badge = await prisma.badge.findUnique({ where: { slug } });
  if (!badge) return;
  await prisma.userBadge
    .upsert({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
      create: { userId, badgeId: badge.id },
      update: {},
    })
    .catch(() => {});
}

/**
 * Milestone badges after a mission is marked completed (and completedAt / xpGranted set).
 */
export async function awardMissionCompletionBadges(
  userId: string,
  options: {
    missionType: MissionType;
    completedAt: Date;
    sceneResponses?: Array<{ isCorrect: boolean; attempts: number }>;
  }
): Promise<void> {
  const completedCount = await prisma.mission.count({
    where: { userId, status: "completed" },
  });

  if (completedCount === 1) await grantBadge(userId, "mission-finisher");
  if (completedCount >= 10) await grantBadge(userId, "mission-veteran");
  if (completedCount >= 25) await grantBadge(userId, "mission-legend");

  if (options.missionType === "challenge") {
    await grantBadge(userId, "challenge-taker");
  }

  const sr = options.sceneResponses;
  if (sr && sr.length > 0 && sr.every((r) => r.isCorrect && r.attempts <= 1)) {
    await grantBadge(userId, "scene-sharp");
  }

  const weekStart = startOfUtcWeek(options.completedAt);
  const weekCount = await prisma.mission.count({
    where: {
      userId,
      status: "completed",
      completedAt: { gte: weekStart },
    },
  });
  if (weekCount >= 3) {
    await grantBadge(userId, "weekly-warrior");
  }
}
