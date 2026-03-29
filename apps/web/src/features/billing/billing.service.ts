/**
 * Billing service - orchestrates billing provider and user updates
 */

import { prisma } from "@mindorbit/db";
import { MockBillingProvider, isMockCheckoutSession } from "./mock-billing.provider";
import { StripeBillingProvider } from "./stripe-billing.provider";
import type { BillingProvider } from "./billing-provider.interface";
import type { PlanTier, SubscriptionStatus } from "@prisma/client";

function getBillingProvider(): BillingProvider {
  const provider = process.env.BILLING_PROVIDER ?? "mock";
  if (
    provider === "stripe" &&
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_WEBHOOK_SECRET &&
    process.env.STRIPE_PRICE_ID
  ) {
    return new StripeBillingProvider(
      process.env.STRIPE_SECRET_KEY,
      process.env.STRIPE_WEBHOOK_SECRET,
      process.env.STRIPE_PRICE_ID
    );
  }
  return new MockBillingProvider();
}

const billingProvider = getBillingProvider();

export const billingService = {
  getProvider(): BillingProvider {
    return billingProvider;
  },

  async createCheckoutSession(userId: string): Promise<{ url: string; sessionId: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, billingCustomerId: true },
    });
    if (!user) throw new Error("User not found");

    let customerId = user.billingCustomerId;
    if (!customerId) {
      customerId = await billingProvider.createCustomer({
        email: user.email,
        name: user.name,
      });
      await prisma.user.update({
        where: { id: userId },
        data: { billingCustomerId: customerId },
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const result = await billingProvider.createCheckoutSession({
      userId,
      customerId,
      successUrl: `${baseUrl}/api/billing/success?user_id=${userId}`,
      cancelUrl: `${baseUrl}/pricing`,
      metadata: { userId },
    });

    await prisma.billingEvent.create({
      data: {
        userId,
        eventType: "checkout_started",
        provider: process.env.BILLING_PROVIDER ?? "mock",
        externalEventId: result.sessionId,
        payloadJson: JSON.stringify({ sessionId: result.sessionId }),
      },
    });

    return result;
  },

  async createPortalSession(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { billingCustomerId: true },
    });
    if (!user?.billingCustomerId) throw new Error("No billing customer");
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    return billingProvider.createPortalSession({
      userId,
      customerId: user.billingCustomerId,
      returnUrl: `${baseUrl}/settings/billing`,
    });
  },

  async handleStripeCheckoutSuccess(sessionId: string): Promise<{
    planTier: PlanTier;
    subscriptionStatus: SubscriptionStatus;
  } | null> {
    const provider = billingProvider;
    if (!("retrieveCheckoutSession" in provider) || typeof provider.retrieveCheckoutSession !== "function") {
      return null;
    }
    const details = await provider.retrieveCheckoutSession(sessionId);
    if (!details?.subscriptionId || !details?.userId) return null;

    const status = await provider.getSubscriptionStatus(details.subscriptionId);
    if (!status || status.status !== "active") return null;

    const periodEnd =
      details.currentPeriodEnd ??
      status.currentPeriodEnd ??
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const periodStart =
      details.currentPeriodStart ??
      new Date(periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000);

    const user = await prisma.user.findUnique({
      where: { id: details.userId },
      select: { billingCustomerId: true },
    });
    const updateData: Record<string, unknown> = {
      planTier: "PRO",
      subscriptionStatus: "ACTIVE",
      billingSubscriptionId: details.subscriptionId,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      canceledAt: status.cancelAtPeriodEnd ? new Date() : null,
    };
    if (!user?.billingCustomerId && details.customerId) {
      updateData.billingCustomerId = details.customerId;
    }
    await prisma.user.update({
      where: { id: details.userId },
      data: updateData as Parameters<typeof prisma.user.update>[0]["data"],
    });

    await prisma.billingEvent.create({
      data: {
        userId: details.userId,
        eventType: "subscription_activated",
        provider: "stripe",
        externalEventId: sessionId,
        payloadJson: JSON.stringify({
          sessionId,
          subscriptionId: details.subscriptionId,
          periodEnd: periodEnd.toISOString(),
        }),
      },
    });

    return { planTier: "PRO", subscriptionStatus: "ACTIVE" };
  },

  async processWebhookEvent(event: { type: string; id: string; data: Record<string, unknown> }): Promise<void> {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as { id?: string; subscription?: string; metadata?: { userId?: string } };
      const sessionId = session?.id;
      const userId = session?.metadata?.userId;
      if (sessionId && userId) {
        await this.handleStripeCheckoutSuccess(sessionId);
      }
      return;
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub = event.data.object as {
        id?: string;
        status?: string;
        current_period_end?: number;
        cancel_at_period_end?: boolean;
        metadata?: { userId?: string };
      };
      let userId = sub?.metadata?.userId;
      if (!userId && sub?.id) {
        const user = await prisma.user.findFirst({
          where: { billingSubscriptionId: sub.id },
          select: { id: true },
        });
        userId = user?.id ?? undefined;
      }
      if (!userId) return;

      const subscriptionId = sub?.id;
      if (!subscriptionId) return;

      const isDeleted = event.type === "customer.subscription.deleted";
      const isCanceled = sub?.status === "canceled" || isDeleted;
      const isActive = sub?.status === "active";

      const periodEnd = sub?.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : undefined;

      if (isCanceled) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            planTier: "FREE",
            subscriptionStatus: "EXPIRED",
            billingSubscriptionId: null,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            canceledAt: new Date(),
          },
        });
      } else if (isActive && periodEnd) {
        const periodStart = new Date(periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
        await prisma.user.update({
          where: { id: userId },
          data: {
            planTier: "PRO",
            subscriptionStatus: sub.cancel_at_period_end ? "CANCELED" : "ACTIVE",
            billingSubscriptionId: subscriptionId,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            canceledAt: sub.cancel_at_period_end ? new Date() : null,
          },
        });
      }
    }
  },

  async handleMockCheckoutSuccess(
    userId: string,
    sessionId: string
  ): Promise<{ planTier: PlanTier; subscriptionStatus: SubscriptionStatus }> {
    if (!isMockCheckoutSession(sessionId)) {
      throw new Error("Invalid mock session");
    }

    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const mockSubId = `mock_sub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    await prisma.user.update({
      where: { id: userId },
      data: {
        planTier: "PRO",
        subscriptionStatus: "ACTIVE",
        billingSubscriptionId: mockSubId,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        canceledAt: null,
      },
    });

    await prisma.billingEvent.create({
      data: {
        userId,
        eventType: "subscription_activated",
        provider: "mock",
        externalEventId: sessionId,
        payloadJson: JSON.stringify({
          sessionId,
          subscriptionId: mockSubId,
          periodEnd: periodEnd.toISOString(),
        }),
      },
    });

    return { planTier: "PRO", subscriptionStatus: "ACTIVE" };
  },
};
