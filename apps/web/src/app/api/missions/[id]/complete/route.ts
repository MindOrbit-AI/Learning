import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const mission = await prisma.mission.findUnique({
    where: { id },
  });

  if (!mission || mission.userId !== session.user.id) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  await prisma.mission.update({
    where: { id },
    data: { status: "completed" },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { xp: { increment: mission.xpReward } },
  });

  await prisma.userNodeState.updateMany({
    where: {
      userId: session.user.id,
      nodeId: mission.nodeId,
    },
    data: {
      state: "learning",
      mastery: { increment: 15 },
    },
  });

  const badge = await prisma.badge.findUnique({
    where: { slug: "mission-finisher" },
  });
  if (badge) {
    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId: session.user.id,
          badgeId: badge.id,
        },
      },
      create: {
        userId: session.user.id,
        badgeId: badge.id,
      },
      update: {},
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
