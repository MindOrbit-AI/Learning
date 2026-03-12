import { describe, it, expect } from "vitest";
import { ReviewScheduler } from "./review-scheduler";

describe("ReviewScheduler.getNextDueDate", () => {
  it("returns 1 day ahead for interval 0", () => {
    const from = new Date("2025-01-01T12:00:00Z");
    const next = ReviewScheduler.getNextDueDate(0, from);
    expect(next.getDate()).toBe(2);
  });

  it("returns 3 days ahead for interval 1", () => {
    const from = new Date("2025-01-01T12:00:00Z");
    const next = ReviewScheduler.getNextDueDate(1, from);
    expect(next.getDate()).toBe(4);
  });

  it("returns 7 days ahead for interval 2", () => {
    const from = new Date("2025-01-01T12:00:00Z");
    const next = ReviewScheduler.getNextDueDate(2, from);
    expect(next.getDate()).toBe(8);
  });
});
