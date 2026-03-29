import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { billingService } from "@/features/billing/billing.service";
import { isMockCheckoutSession } from "@/features/billing/mock-billing.provider";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  const userId = searchParams.get("user_id");
  const mock = searchParams.get("mock");

  if (!sessionId || !userId || userId !== session.user.id) {
    return NextResponse.redirect(new URL("/pricing", req.url));
  }

  if (mock === "1" && isMockCheckoutSession(sessionId)) {
    await billingService.handleMockCheckoutSuccess(userId, sessionId);
    await AnalyticsService.track(userId, EVENT_TYPES.checkout_completed, {
      sessionId,
      mock: true,
    });
    await AnalyticsService.track(userId, EVENT_TYPES.subscription_activated, {
      sessionId,
    });
    return NextResponse.redirect(new URL("/settings/billing?upgraded=1", req.url));
  }

  const result = await billingService.handleStripeCheckoutSuccess(sessionId);
  if (result) {
    await AnalyticsService.track(userId, EVENT_TYPES.checkout_completed, {
      sessionId,
      provider: "stripe",
    });
    await AnalyticsService.track(userId, EVENT_TYPES.subscription_activated, {
      sessionId,
    });
    return NextResponse.redirect(new URL("/settings/billing?upgraded=1", req.url));
  }

  return NextResponse.redirect(new URL("/settings/billing", req.url));
}
