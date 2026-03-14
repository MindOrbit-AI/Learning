import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";

/** Reveal is correct when user has viewed */
export function validateReveal(_config: unknown, answer: unknown): ValidationResult {
  const viewed = answer === "viewed";
  return {
    isCorrect: viewed,
    status: "correct",
    score: viewed ? 1 : 0,
    message: undefined,
  };
}
