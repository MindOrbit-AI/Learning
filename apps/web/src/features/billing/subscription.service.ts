/**
 * Subscription service - manages user plan and subscription state
 */

import { prisma } from "@mindorbit/db";
import { effectivePlanTier } from "@mindorbit/lib";
import type { PlanTier, SubscriptionStatus } from "@prisma/client";

export interface SubscriptionState {
  planTier: PlanTier;
  subscriptionStatus: SubscriptionStatus;
  currentPeriodEnd: Date | null;
  canceledAt: Date | null;
}

export const subscriptionService = {
  /**
   * Raw DB plan (billing). Prefer `getEffectivePlanTier` for feature access.
   */
  async getUserPlan(userId: string): Promise<PlanTier> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { planTier: true },
    });
    return user?.planTier ?? "FREE";
  },

  /** Includes bonus Pro time from referrals and rewards. */
  async getEffectivePlanTier(userId: string): Promise<PlanTier> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { planTier: true, bonusProUntil: true },
    });
    if (!user) return "FREE";
    return effectivePlanTier({
      planTier: user.planTier,
      bonusProUntil: user.bonusProUntil,
    });
  },

  async getSubscriptionState(userId: string): Promise<SubscriptionState | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        planTier: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        canceledAt: true,
      },
    });
    if (!user) return null;
    return {
      planTier: user.planTier,
      subscriptionStatus: user.subscriptionStatus,
      currentPeriodEnd: user.currentPeriodEnd,
      canceledAt: user.canceledAt,
    };
  },

  async activatePro(
    userId: string,
    details: {
      subscriptionId?: string;
      currentPeriodStart: Date;
      currentPeriodEnd: Date;
    }
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        planTier: "PRO",
        subscriptionStatus: "ACTIVE",
        billingSubscriptionId: details.subscriptionId ?? undefined,
        currentPeriodStart: details.currentPeriodStart,
        currentPeriodEnd: details.currentPeriodEnd,
        canceledAt: null,
      },
    });
  },

  async downgradeToFree(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        planTier: "FREE",
        subscriptionStatus: "INACTIVE",
        billingSubscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        canceledAt: new Date(),
      },
    });
  },

  async cancelSubscription(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { billingSubscriptionId: true },
    });
    if (user?.billingSubscriptionId) {
      const { billingService } = await import("./billing.service");
      await billingService.getProvider().cancelSubscription(user.billingSubscriptionId);
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "CANCELED",
        canceledAt: new Date(),
      },
    });
  },
};
