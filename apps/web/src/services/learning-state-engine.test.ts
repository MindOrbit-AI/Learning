import { describe, it, expect } from "vitest";
import {
  LearningStateEngine,
  isPracticePriorityNodeState,
  resolveDisplayNodeState,
} from "./learning-state-engine";

describe("LearningStateEngine.assignNodeState", () => {
  it("returns mastered for >= 85%", () => {
    expect(LearningStateEngine.assignNodeState(100)).toBe("mastered");
    expect(LearningStateEngine.assignNodeState(85)).toBe("mastered");
    expect(LearningStateEngine.assignNodeState(90)).toBe("mastered");
  });

  it("returns learning for mastery 30–84", () => {
    expect(LearningStateEngine.assignNodeState(30)).toBe("learning");
    expect(LearningStateEngine.assignNodeState(41)).toBe("learning");
    expect(LearningStateEngine.assignNodeState(60)).toBe("learning");
    expect(LearningStateEngine.assignNodeState(84)).toBe("learning");
  });

  it("returns weak for mastery under 30", () => {
    expect(LearningStateEngine.assignNodeState(0)).toBe("weak");
    expect(LearningStateEngine.assignNodeState(29)).toBe("weak");
  });
});

describe("resolveDisplayNodeState", () => {
  it("derives from mastery when set (ignores stale stored missing)", () => {
    expect(resolveDisplayNodeState(20, "missing")).toBe("weak");
    expect(resolveDisplayNodeState(50, "missing")).toBe("learning");
  });

  it("falls back to coerced stored when mastery absent", () => {
    expect(resolveDisplayNodeState(undefined, "missing")).toBe("weak");
    expect(resolveDisplayNodeState(undefined, undefined)).toBe("untouched");
  });
});

describe("isPracticePriorityNodeState", () => {
  it("is true for weak and learning", () => {
    expect(isPracticePriorityNodeState("weak")).toBe(true);
    expect(isPracticePriorityNodeState("learning")).toBe(true);
    expect(isPracticePriorityNodeState("mastered")).toBe(false);
    expect(isPracticePriorityNodeState("untouched")).toBe(false);
  });
});

describe("LearningStateEngine.computeRetention", () => {
  it("returns ~1 when just practiced", () => {
    const now = new Date();
    const retention = LearningStateEngine.computeRetention(now, 7, now);
    expect(retention).toBeCloseTo(1, 2);
  });

  it("returns lower retention after time passes", () => {
    const now = new Date();
    const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const retention = LearningStateEngine.computeRetention(past, 7, now);
    expect(retention).toBeLessThan(0.5);
    expect(retention).toBeGreaterThan(0);
  });
});
