/**
 * Usage service - tracks and enforces feature usage limits
 */

import { prisma } from "@mindorbit/db";
import { PLAN_LIMITS, FEATURE_KEYS } from "@mindorbit/lib";
import type { FeatureKey } from "@mindorbit/lib";
import type { PlanTier } from "@prisma/client";

function getMonthBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export const usageService = {
  async incrementUsage(
    userId: string,
    featureKey: FeatureKey,
    options?: { periodStart?: Date; periodEnd?: Date }
  ): Promise<void> {
    const now = new Date();
    const { start, end } = options?.periodStart && options?.periodEnd
      ? { start: options.periodStart, end: options.periodEnd }
      : getMonthBounds(now);

    await prisma.featureUsage.upsert({
      where: {
        userId_featureKey_periodStart: {
          userId,
          featureKey,
          periodStart: start,
        },
      },
      create: {
        userId,
        featureKey,
        usageCount: 1,
        periodStart: start,
        periodEnd: end,
      },
      update: { usageCount: { increment: 1 }, updatedAt: now },
    });
  },

  async getUsage(
    userId: string,
    featureKey: FeatureKey,
    periodDate?: Date
  ): Promise<number> {
    const { start } = periodDate ? getMonthBounds(periodDate) : getMonthBounds(new Date());
    const record = await prisma.featureUsage.findUnique({
      where: {
        userId_featureKey_periodStart: {
          userId,
          featureKey,
          periodStart: start,
        },
      },
    });
    return record?.usageCount ?? 0;
  },

  async hasReachedLimit(
    userId: string,
    featureKey: FeatureKey,
    planTier: PlanTier
  ): Promise<boolean> {
    const limits = PLAN_LIMITS[planTier];
    if (featureKey === FEATURE_KEYS.MISSIONS_STARTED) {
      const limit = limits.maxMissionStartsPerMonth;
      if (limit == null) return false;
      const usage = await this.getUsage(userId, featureKey);
      return usage >= limit;
    }
    if (featureKey === FEATURE_KEYS.SUBJECT_CREATIONS) {
      const limit = limits.maxSubjectCreations;
      if (limit == null) return false;
      const count = await this.getSubjectCreationCount(userId);
      return count >= limit;
    }
    if (featureKey === FEATURE_KEYS.DIAGNOSTIC_RUNS) {
      const limit = limits.maxDiagnosticsPerMonth;
      if (limit == null) return false;
      const usage = await this.getUsage(userId, featureKey);
      return usage >= limit;
    }
    return false;
  },

  async getSubjectCreationCount(userId: string): Promise<number> {
    const count = await prisma.subject.count({
      where: { createdById: userId },
    });
    return count;
  },
};
