import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";
import type { FindErrorBlockConfig } from "@/features/lesson-blocks/types/block.types";

export function validateFindError(
  config: FindErrorBlockConfig,
  answer: unknown
): ValidationResult {
  const selectedId = String(answer ?? "").trim();
  const isCorrect = selectedId === config.correctId;

  return {
    isCorrect,
    status: isCorrect ? "correct" : "incorrect",
    score: isCorrect ? 1 : 0,
    message: isCorrect ? "Correct — you found the error!" : "That step doesn't contain the error.",
  };
}
