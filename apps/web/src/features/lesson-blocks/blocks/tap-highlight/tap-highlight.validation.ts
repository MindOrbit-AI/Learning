import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";
import type { TapHighlightBlockConfig } from "@/features/lesson-blocks/types/block.types";

export function validateTapHighlight(
  config: TapHighlightBlockConfig,
  answer: unknown
): ValidationResult {
  const ids = Array.isArray(answer) ? answer.map(String) : [];
  const correct = new Set(config.correctIds.map(String));

  if (config.highlightOrder) {
    const matches = ids.filter((id, i) => id === config.correctIds[i]).length;
    const isCorrect = matches === correct.size && ids.length === correct.size;
    return {
      isCorrect,
      status: isCorrect ? "correct" : "incorrect",
      score: correct.size > 0 ? matches / correct.size : 0,
      message: isCorrect ? "Correct order!" : "Tap in the correct order.",
    };
  }

  const selectedSet = new Set(ids);
  const matchCount = [...correct].filter((id) => selectedSet.has(id)).length;
  const wrongCount = ids.filter((id) => !correct.has(id)).length;
  const isCorrect = matchCount === correct.size && wrongCount === 0;

  return {
    isCorrect,
    status: isCorrect ? "correct" : "incorrect",
    score: correct.size > 0 ? matchCount / correct.size : 0,
    message: isCorrect ? "Correct!" : "Select the right elements.",
  };
}
