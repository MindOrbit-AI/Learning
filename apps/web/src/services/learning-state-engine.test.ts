import { describe, it, expect } from "vitest";
import { LearningStateEngine } from "./learning-state-engine";

describe("LearningStateEngine.assignNodeState", () => {
  it("returns mastered for >= 85%", () => {
    expect(LearningStateEngine.assignNodeState(100)).toBe("mastered");
    expect(LearningStateEngine.assignNodeState(85)).toBe("mastered");
    expect(LearningStateEngine.assignNodeState(90)).toBe("mastered");
  });

  it("returns weak for 60-84%", () => {
    expect(LearningStateEngine.assignNodeState(60)).toBe("weak");
    expect(LearningStateEngine.assignNodeState(84)).toBe("weak");
    expect(LearningStateEngine.assignNodeState(72)).toBe("weak");
  });

  it("returns missing for < 60%", () => {
    expect(LearningStateEngine.assignNodeState(0)).toBe("missing");
    expect(LearningStateEngine.assignNodeState(59)).toBe("missing");
    expect(LearningStateEngine.assignNodeState(30)).toBe("missing");
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
