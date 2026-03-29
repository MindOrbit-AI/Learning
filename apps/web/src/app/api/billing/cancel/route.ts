import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { subscriptionService } from "@/features/billing/subscription.service";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";

export async function POST() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await subscriptionService.cancelSubscription(session.user.id);
    await AnalyticsService.track(session.user.id, EVENT_TYPES.subscription_canceled, {});
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Cancel error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to cancel" },
      { status: 500 }
    );
  }
}
