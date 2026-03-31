import { prisma } from "@mindorbit/db";
import { addUtcDays, utcDayKey } from "@/lib/utc-calendar";

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
 * Consecutive UTC calendar days with at least one mission completed.
 * Call once after each mission completion (same `completedAt` as stored on Mission).
 */
export async function applyMissionCompletionStreak(
  userId: string,
  completedAt: Date
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      streakCount: true,
      lastMissionCompletedAt: true,
      bestMissionStreak: true,
    },
  });
  if (!user) return;

  const todayKey = utcDayKey(completedAt);
  const last = user.lastMissionCompletedAt;
  const lastKey = last ? utcDayKey(last) : null;
  const yesterdayKey = utcDayKey(addUtcDays(completedAt, -1));

  let newStreak = user.streakCount;
  if (lastKey === todayKey) {
    newStreak = Math.max(user.streakCount, 1);
  } else if (lastKey === yesterdayKey) {
    newStreak = Math.max(1, user.streakCount) + 1;
  } else {
    newStreak = 1;
  }

  const best = Math.max(user.bestMissionStreak ?? 0, newStreak);

  await prisma.user.update({
    where: { id: userId },
    data: {
      streakCount: newStreak,
      bestMissionStreak: best,
      lastMissionCompletedAt: completedAt,
    },
  });

  if (newStreak >= 7) {
    await grantBadge(userId, "7-day-streak");
  }
}
