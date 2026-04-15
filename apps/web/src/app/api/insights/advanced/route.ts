import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { featureGateService } from "@/features/billing/feature-gate.service";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { planTier: true, bonusProUntil: true },
  });

  if (!featureGateService.canAccessAdvancedInsights(user)) {
    return NextResponse.json(
      { error: "Advanced insights require Pro", upgradeRequired: true },
      { status: 403 }
    );
  }

  const nodeStates = await prisma.userNodeState.findMany({
    where: { userId: session.user.id },
    include: { node: { select: { title: true, slug: true } } },
    orderBy: { lastPracticedAt: "desc" },
    take: 100,
  });

  const missions = await prisma.mission.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      status: true,
      createdAt: true,
      node: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const completedMissions = missions.filter((m) => m.status === "completed");
  const velocity = completedMissions.length > 0
    ? completedMissions.length / Math.max(1, daysSince(completedMissions[completedMissions.length - 1]?.createdAt ?? new Date()))
    : 0;

  const masteryByState = nodeStates.reduce(
    (acc, s) => {
      acc[s.state] = (acc[s.state] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return NextResponse.json({
    masteryDistribution: masteryByState,
    weakNodeTrend: nodeStates
      .filter((s) => s.state === "weak")
      .map((s) => ({
        nodeId: s.nodeId,
        title: s.node.title,
        mastery: s.mastery,
        lastPracticed: s.lastPracticedAt,
      })),
    missionVelocity: Math.round(velocity * 10) / 10,
    totalNodes: nodeStates.length,
    totalMissionsCompleted: completedMissions.length,
  });
}

function daysSince(d: Date): number {
  return (Date.now() - new Date(d).getTime()) / (24 * 60 * 60 * 1000);
}
