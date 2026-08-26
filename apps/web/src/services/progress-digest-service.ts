/**
 * Weekly in-app progress digest for parents (P0 — email infra not yet wired).
 */

import { prisma } from "@mindorbit/db";

const DIGEST_INTERVAL_DAYS = 7;

interface MasterySnapshot {
  capturedAt: string;
  masteryPct: number;
  masteredCount: number;
  weakCount: number;
}

function parseSnapshot(raw: unknown): MasterySnapshot | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.capturedAt !== "string") return null;
  return {
    capturedAt: o.capturedAt,
    masteryPct: Number(o.masteryPct) || 0,
    masteredCount: Number(o.masteredCount) || 0,
    weakCount: Number(o.weakCount) || 0,
  };
}

export async function maybeCreateWeeklyDigest(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastProgressDigestAt: true, masterySnapshotJson: true },
  });
  if (!user) return;

  const now = new Date();
  if (user.lastProgressDigestAt) {
    const daysSince =
      (now.getTime() - user.lastProgressDigestAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < DIGEST_INTERVAL_DAYS) return;
  }

  const [masteredCount, weakCount, totalNodes] = await Promise.all([
    prisma.userNodeState.count({ where: { userId, state: "mastered" } }),
    prisma.userNodeState.count({
      where: { userId, state: { in: ["weak", "learning"] } },
    }),
    prisma.conceptNode.count(),
  ]);

  const masteryPct = totalNodes > 0 ? Math.round((masteredCount / totalNodes) * 100) : 0;
  const previous = parseSnapshot(user.masterySnapshotJson);

  let body: string;
  if (previous) {
    const masteryDelta = masteryPct - previous.masteryPct;
    const masteredDelta = masteredCount - previous.masteredCount;
    const deltaSign = masteryDelta >= 0 ? "+" : "";
    body = `This week: ${masteryPct}% mastery (${deltaSign}${masteryDelta} pts). ${masteredDelta >= 0 ? "+" : ""}${masteredDelta} concepts mastered, ${weakCount} still need work.`;
  } else {
    body = `Your learning snapshot: ${masteryPct}% mastery, ${masteredCount} concepts mastered, ${weakCount} areas to improve.`;
  }

  const existingUnread = await prisma.notification.findFirst({
    where: { userId, type: "weekly_progress_digest", readAt: null },
  });
  if (existingUnread) return;

  await prisma.$transaction([
    prisma.notification.create({
      data: {
        userId,
        type: "weekly_progress_digest",
        title: "Weekly progress update",
        body,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        lastProgressDigestAt: now,
        masterySnapshotJson: {
          capturedAt: now.toISOString(),
          masteryPct,
          masteredCount,
          weakCount,
        },
      },
    }),
  ]);
}

export async function getUnreadDigests(userId: string) {
  return prisma.notification.findMany({
    where: { userId, type: "weekly_progress_digest", readAt: null },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}
