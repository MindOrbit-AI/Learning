/**
 * Billing types and constants
 */

export type PlanTierType = "FREE" | "PRO";

export type SubscriptionStatusType =
  | "INACTIVE"
  | "ACTIVE"
  | "CANCELED"
  | "PAST_DUE"
  | "EXPIRED"
  | "TRIALING";

export const FEATURE_KEYS = {
  DIAGNOSTIC_RUNS: "diagnostic_runs",
  MISSIONS_STARTED: "missions_started",
  SUBJECT_CREATIONS: "subject_creations",
  MASTERY_MAP_EXPANDS: "mastery_map_expands",
} as const;

export type FeatureKey = (typeof FEATURE_KEYS)[keyof typeof FEATURE_KEYS];
