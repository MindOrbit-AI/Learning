import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { billingService } from "@/features/billing/billing.service";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";

export async function POST() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url, sessionId } = await billingService.createCheckoutSession(session.user.id);
    await AnalyticsService.track(session.user.id, EVENT_TYPES.checkout_started, {
      sessionId,
    });
    return NextResponse.json({ url, sessionId });
  } catch (e) {
    console.error("Checkout error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
