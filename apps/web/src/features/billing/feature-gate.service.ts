/**
 * Feature gate service - centralized access control for gated features
 */

import { prisma } from "@mindorbit/db";
import { PLAN_LIMITS, getFeatureAccess, FEATURE_KEYS, effectivePlanTier } from "@mindorbit/lib";
import type { FeatureAccessKey } from "@mindorbit/lib";
import { usageService } from "./usage.service";
import type { PlanTier } from "@prisma/client";

export interface FeatureGateResult {
  allowed: boolean;
  reason?: string;
  upgradeRequired?: boolean;
}

export const featureGateService = {
  async canAccessFeature(
    userId: string,
    featureKey: FeatureAccessKey
  ): Promise<FeatureGateResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { planTier: true, bonusProUntil: true },
    });
    const planTier = effectivePlanTier({
      planTier: (user?.planTier ?? "FREE") as PlanTier,
      bonusProUntil: user?.bonusProUntil,
    }) as PlanTier;
    const access = getFeatureAccess(planTier, featureKey);

    if (!access.allowed) {
      return { allowed: false, reason: access.reason ?? "Upgrade to Pro", upgradeRequired: true };
    }

    if (featureKey === "missions") {
      const hasReached = await usageService.hasReachedLimit(userId, FEATURE_KEYS.MISSIONS_STARTED, planTier);
      if (hasReached) {
        return {
          allowed: false,
          reason: `You've reached the limit of ${PLAN_LIMITS.FREE.maxMissionStartsPerMonth} missions this month. Upgrade to Pro for unlimited.`,
          upgradeRequired: true,
        };
      }
    }

    if (featureKey === "subject_creation") {
      const count = await usageService.getSubjectCreationCount(userId);
      const limit = PLAN_LIMITS.FREE.maxSubjectCreations;
      if (planTier === "FREE" && limit != null && count >= limit) {
        return {
          allowed: false,
          reason: `You've created the maximum of ${limit} subjects. Upgrade to Pro for unlimited.`,
          upgradeRequired: true,
        };
      }
    }

    if (featureKey === "diagnostic") {
      const hasReached = await usageService.hasReachedLimit(
        userId,
        FEATURE_KEYS.DIAGNOSTIC_RUNS,
        planTier
      );
      if (hasReached) {
        return {
          allowed: false,
          reason: `You've reached the limit of ${PLAN_LIMITS.FREE.maxDiagnosticsPerMonth} diagnostics this month. Upgrade to Pro for unlimited.`,
          upgradeRequired: true,
        };
      }
    }

    return { allowed: true };
  },

  async canStartDiagnostic(userId: string): Promise<FeatureGateResult> {
    return this.canAccessFeature(userId, "diagnostic");
  },

  canCreateSubject(user: { planTier: PlanTier; bonusProUntil?: Date | null } | null): boolean {
    if (!user) return false;
    const tier = effectivePlanTier({
      planTier: user.planTier,
      bonusProUntil: user.bonusProUntil,
    });
    return tier === "PRO" || PLAN_LIMITS.FREE.subjectCreationAllowed;
  },

  async canStartMission(userId: string): Promise<FeatureGateResult> {
    return this.canAccessFeature(userId, "missions");
  },

  canAccessAdvancedInsights(user: { planTier: PlanTier; bonusProUntil?: Date | null } | null): boolean {
    if (!user) return false;
    return (
      effectivePlanTier({ planTier: user.planTier, bonusProUntil: user.bonusProUntil }) === "PRO"
    );
  },

  getMasteryMapAccessLevel(user: { planTier: PlanTier; bonusProUntil?: Date | null } | null): "limited" | "full" {
    if (!user) return "limited";
    return effectivePlanTier({ planTier: user.planTier, bonusProUntil: user.bonusProUntil }) === "PRO"
      ? "full"
      : "limited";
  },

  async getUpgradeReason(userId: string, featureKey: FeatureAccessKey): Promise<string> {
    const result = await this.canAccessFeature(userId, featureKey);
    return result.reason ?? "Upgrade to Pro for full access";
  },
};
