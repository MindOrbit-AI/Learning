import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { PLAN_LIMITS, effectivePlanTier } from "@mindorbit/lib";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clusters = await prisma.cluster.findMany({
    where: { subjectId: id },
    select: { id: true, title: true },
    orderBy: { orderIndex: "asc" },
  });

  const session = await getServerSession();
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { planTier: true, bonusProUntil: true },
      })
    : null;
  const planTier = effectivePlanTier({
    planTier: user?.planTier ?? "FREE",
    bonusProUntil: user?.bonusProUntil,
  });
  const maxClusters = PLAN_LIMITS[planTier].maxClustersVisible;
  const limited =
    maxClusters != null ? clusters.slice(0, maxClusters) : clusters;

  return NextResponse.json({
    clusters: limited,
    hasMore: clusters.length > limited.length,
  });
}
