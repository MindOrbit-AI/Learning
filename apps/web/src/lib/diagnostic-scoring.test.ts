import { describe, it, expect } from "vitest";

/**
 * Extracted logic for unit testing - mirrors diagnostic engine
 */
function assignNodeState(correctCount: number, totalCount: number): string {
  if (totalCount === 0) return "untouched";
  const pct = (correctCount / totalCount) * 100;
  if (pct >= 80) return "mastered";
  if (pct >= 50) return "weak";
  return "missing";
}

describe("assignNodeState", () => {
  it("returns mastered for >= 80%", () => {
    expect(assignNodeState(4, 4)).toBe("mastered");
    expect(assignNodeState(8, 10)).toBe("mastered");
    expect(assignNodeState(80, 100)).toBe("mastered");
  });

  it("returns weak for 50-79%", () => {
    expect(assignNodeState(2, 4)).toBe("weak");
    expect(assignNodeState(5, 10)).toBe("weak");
    expect(assignNodeState(79, 100)).toBe("weak");
  });

  it("returns missing for < 50%", () => {
    expect(assignNodeState(0, 4)).toBe("missing");
    expect(assignNodeState(2, 10)).toBe("missing");
    expect(assignNodeState(49, 100)).toBe("missing");
  });

  it("returns untouched for zero total", () => {
    expect(assignNodeState(0, 0)).toBe("untouched");
  });
});
