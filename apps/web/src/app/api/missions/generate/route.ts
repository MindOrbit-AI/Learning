import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { missionsService } from "@/services/missions-service";
import { featureGateService } from "@/features/billing/feature-gate.service";
import { usageService } from "@/features/billing/usage.service";
import { FEATURE_KEYS } from "@mindorbit/lib";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";
import { subscriptionService } from "@/features/billing/subscription.service";
import { z } from "zod";

const schema = z.object({
  nodeId: z.string().min(1),
  sceneBased: z.boolean().optional(),
  /** When true, deletes the user's active (not_started / in_progress) mission for this node, then creates a new one. */
  regenerate: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nodeId, sceneBased, regenerate } = schema.parse(body);

    const gate = await featureGateService.canStartMission(session.user.id);
    if (!gate.allowed) {
      await AnalyticsService.track(session.user.id, EVENT_TYPES.feature_limit_hit, {
        feature: "missions",
        reason: gate.reason,
      });
      return NextResponse.json(
        { error: gate.reason ?? "Mission limit reached", upgradeRequired: true },
        { status: 403 }
      );
    }

    const node = await prisma.conceptNode.findUnique({
      where: { id: nodeId },
    });
    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }

    const missionId = await missionsService.generateMission(nodeId, session.user.id, {
      sceneBased: sceneBased ?? false,
      regenerate: regenerate ?? false,
    });

    const effectiveTier = await subscriptionService.getEffectivePlanTier(session.user.id);
    if (effectiveTier === "FREE" && !regenerate) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      await usageService.incrementUsage(session.user.id, FEATURE_KEYS.MISSIONS_STARTED, {
        periodStart: start,
        periodEnd: end,
      });
    }
    if (!missionId) {
      return NextResponse.json(
        { error: "Mission already exists or failed to create" },
        { status: 400 }
      );
    }

    return NextResponse.json({ missionId });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to generate mission" }, { status: 500 });
  }
}
