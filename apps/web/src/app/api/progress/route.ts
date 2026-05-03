import { NextResponse } from "next/server";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [user, states, reviews, completed] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    }),
    prisma.userNodeState.findMany({
      where: { userId, state: { in: ["weak", "learning"] } },
      select: { mastery: true, confidence: true, node: { select: { title: true } } },
      take: 40,
    }),
    prisma.reviewQueueItem.findMany({
      where: { userId, status: "pending" },
      select: { node: { select: { title: true } } },
      take: 30,
    }),
    prisma.lessonAttempt.count({
      where: { userId, completed: true },
    }),
  ]);

  const masteryAvg =
    states.length === 0 ? 0 : states.reduce((s, r) => s + r.mastery, 0) / states.length;
  const confAvg =
    states.length === 0 ? 0 : states.reduce((s, r) => s + r.confidence, 0) / states.length;

  const weakConcepts = [...new Set(states.map((s) => s.node.title))];
  const reviewQueue = [...new Set(reviews.map((r) => r.node.title))];

  return NextResponse.json({
    masteryScore: Math.round(masteryAvg * 100) / 100,
    confidence: Math.round(confAvg * 100) / 100,
    completedLessons: completed,
    weakConcepts,
    reviewQueue,
    xp: user?.xp ?? 0,
  });
}
