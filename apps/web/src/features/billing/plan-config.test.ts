import { describe, it, expect } from "vitest";
import { PLAN_LIMITS, PRO_PRICE_MONTHLY, MASTERY_MAP_FREE_NODE_THRESHOLD } from "@mindorbit/lib";

describe("plan-config", () => {
  it("FREE plan has correct limits", () => {
    expect(PLAN_LIMITS.FREE.maxMissionStartsPerMonth).toBe(10);
    expect(PLAN_LIMITS.FREE.maxDiagnosticsPerMonth).toBe(3);
    expect(PLAN_LIMITS.FREE.maxSubjectCreations).toBe(3);
    expect(PLAN_LIMITS.FREE.maxClustersVisible).toBe(2);
    expect(PLAN_LIMITS.FREE.masteryMapAccess).toBe("limited");
    expect(PLAN_LIMITS.FREE.advancedInsights).toBe(false);
    expect(PLAN_LIMITS.FREE.stemPuzzles).toBe(false);
    expect(PLAN_LIMITS.FREE.diagnosticAllowed).toBe(true);
  });

  it("PRO plan has unlimited access", () => {
    expect(PLAN_LIMITS.PRO.maxMissionStartsPerMonth).toBeNull();
    expect(PLAN_LIMITS.PRO.maxSubjectCreations).toBeNull();
    expect(PLAN_LIMITS.PRO.masteryMapAccess).toBe("full");
    expect(PLAN_LIMITS.PRO.advancedInsights).toBe(true);
    expect(PLAN_LIMITS.PRO.stemPuzzles).toBe(true);
  });

  it("PRO price is 15.99", () => {
    expect(PRO_PRICE_MONTHLY).toBe(15.99);
  });

  it("mastery map free threshold is 6", () => {
    expect(MASTERY_MAP_FREE_NODE_THRESHOLD).toBe(6);
  });
});
