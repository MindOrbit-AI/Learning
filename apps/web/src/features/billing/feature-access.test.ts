import { describe, it, expect } from "vitest";
import { getFeatureAccess } from "@mindorbit/lib";

describe("feature-access", () => {
  it("FREE user has diagnostic access", () => {
    const r = getFeatureAccess("FREE", "diagnostic");
    expect(r.allowed).toBe(true);
  });

  it("FREE user has limited missions", () => {
    const r = getFeatureAccess("FREE", "missions");
    expect(r.allowed).toBe(true);
    expect(r.reason).toContain("10");
  });

  it("FREE user has limited mastery map", () => {
    const r = getFeatureAccess("FREE", "mastery_map");
    expect(r.allowed).toBe(true);
    expect(r.reason).toContain("limited");
  });

  it("FREE user has limited subject creation", () => {
    const r = getFeatureAccess("FREE", "subject_creation");
    expect(r.allowed).toBe(true);
    expect(r.reason).toContain("3");
  });

  it("FREE user cannot access advanced insights", () => {
    const r = getFeatureAccess("FREE", "advanced_insights");
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("Pro feature");
  });

  it("PRO user has full access", () => {
    expect(getFeatureAccess("PRO", "diagnostic").allowed).toBe(true);
    expect(getFeatureAccess("PRO", "missions").allowed).toBe(true);
    expect(getFeatureAccess("PRO", "mastery_map").allowed).toBe(true);
    expect(getFeatureAccess("PRO", "subject_creation").allowed).toBe(true);
    expect(getFeatureAccess("PRO", "advanced_insights").allowed).toBe(true);
  });
});
