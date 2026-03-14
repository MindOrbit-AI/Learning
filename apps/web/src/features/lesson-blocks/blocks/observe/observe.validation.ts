import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";

/** Observe is always correct when advanced */
export function validateObserve(_config: unknown, answer: unknown): ValidationResult {
  return {
    isCorrect: true,
    status: "correct",
    score: 1,
    message: undefined,
  };
}
