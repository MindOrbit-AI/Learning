/**
 * Feature access rules - maps plan tier to feature access
 */

import type { PlanTier } from "./plan-config";
import { PLAN_LIMITS } from "./plan-config";

export type FeatureAccessKey =
  | "diagnostic"
  | "missions"
  | "mastery_map"
  | "subject_creation"
  | "advanced_insights";

export interface FeatureAccessResult {
  allowed: boolean;
  reason?: string;
}

export function getFeatureAccess(
  planTier: PlanTier,
  featureKey: FeatureAccessKey
): FeatureAccessResult {
  const limits = PLAN_LIMITS[planTier];

  switch (featureKey) {
    case "diagnostic":
      return {
        allowed: limits.diagnosticAllowed,
        reason: limits.maxDiagnosticsPerMonth != null
          ? `Limited to ${limits.maxDiagnosticsPerMonth} diagnostics per month`
          : undefined,
      };

    case "missions":
      return {
        allowed: limits.missionsAllowed,
        reason: limits.maxMissionStartsPerMonth != null
          ? `Limited to ${limits.maxMissionStartsPerMonth} missions per month`
          : undefined,
      };

    case "mastery_map":
      return {
        allowed: true,
        reason:
          limits.masteryMapAccess === "limited"
            ? "Limited view - upgrade for full map"
            : undefined,
      };

    case "subject_creation":
      return {
        allowed: limits.subjectCreationAllowed,
        reason:
          limits.maxSubjectCreations != null
            ? `Limited to ${limits.maxSubjectCreations} subjects`
            : undefined,
      };

    case "advanced_insights":
      return {
        allowed: limits.advancedInsights,
        reason: limits.advancedInsights ? undefined : "Pro feature",
      };

    default:
      return { allowed: false };
  }
}
