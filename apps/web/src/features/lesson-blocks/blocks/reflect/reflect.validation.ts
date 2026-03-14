import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";

/** Reflect blocks accept any non-empty response */
export function validateReflect(_config: unknown, answer: unknown): ValidationResult {
  const text = String(answer ?? "").trim();
  return {
    isCorrect: text.length > 0,
    status: text.length > 0 ? "correct" : "incorrect",
    score: text.length > 0 ? 1 : 0,
    message: text.length > 0 ? "Thanks for sharing!" : "Please share your thoughts.",
  };
}
