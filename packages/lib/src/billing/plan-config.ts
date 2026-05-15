/**
 * Central plan configuration and usage limits
 */

export type PlanTier = "FREE" | "PRO";
export type MasteryMapAccessLevel = "limited" | "full";

export const PLAN_TIERS = {
  FREE: "FREE" as const,
  PRO: "PRO" as const,
};

export const MASTERY_MAP_ACCESS = {
  LIMITED: "limited" as const,
  FULL: "full" as const,
};

export interface PlanLimits {
  maxMissionStartsPerMonth: number | null;
  maxDiagnosticsPerMonth: number | null;
  maxSubjectCreations: number | null;
  maxClustersVisible: number | null;
  masteryMapAccess: MasteryMapAccessLevel;
  advancedInsights: boolean;
  /** Marketing STEM puzzle arcade (/puzzles). */
  stemPuzzles: boolean;
  diagnosticAllowed: boolean;
  missionsAllowed: boolean;
  subjectCreationAllowed: boolean;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  FREE: {
    maxMissionStartsPerMonth: 10,
    maxDiagnosticsPerMonth: 3,
    maxSubjectCreations: 3,
    maxClustersVisible: 2,
    masteryMapAccess: MASTERY_MAP_ACCESS.LIMITED,
    advancedInsights: false,
    stemPuzzles: false,
    diagnosticAllowed: true,
    missionsAllowed: true,
    subjectCreationAllowed: true,
  },
  PRO: {
    maxMissionStartsPerMonth: null,
    maxDiagnosticsPerMonth: null,
    maxSubjectCreations: null,
    maxClustersVisible: null,
    masteryMapAccess: MASTERY_MAP_ACCESS.FULL,
    advancedInsights: true,
    stemPuzzles: true,
    diagnosticAllowed: true,
    missionsAllowed: true,
    subjectCreationAllowed: true,
  },
};

export const PRO_PRICE_MONTHLY = 15.99;

export const MASTERY_MAP_FREE_NODE_THRESHOLD = 6;
