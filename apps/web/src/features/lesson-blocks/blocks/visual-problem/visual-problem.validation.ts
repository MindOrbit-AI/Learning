import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";
import type { VisualProblemBlockConfig } from "@/features/lesson-blocks/types/block.types";
import { validateVisualProblem } from "@/features/visual-problem-solving/validateVisualProblem";

export function validateVisualProblemBlock(
  config: VisualProblemBlockConfig,
  answer: unknown
): ValidationResult {
  const ok = validateVisualProblem(config.correctSpec, answer);
  return {
    isCorrect: ok,
    status: ok ? "correct" : "incorrect",
    score: ok ? 1 : 0,
    message: ok ? "Correct — visual and answer line up." : "Adjust the visual model or the written answer.",
  };
}
