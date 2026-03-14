import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";
import type { MultipleChoiceBlockConfig } from "@/features/lesson-blocks/types/block.types";

function normalizeLinearEquation(s: string): string {
  let t = s.replace(/\s/g, "").toLowerCase();
  t = t.replace(/-x/g, "-1x");
  t = t.replace(/\+x/g, "+1x");
  t = t.replace(/=x/g, "=1x");
  t = t.replace(/(^|[=+\-])x\b/g, "$11x");
  return t;
}

export function validateMultipleChoice(
  config: MultipleChoiceBlockConfig,
  answer: unknown
): ValidationResult {
  const selectedId = String(answer ?? "").trim();
  const correctOpt = config.options.find((o) => o.id === config.correctId);
  const selectedOpt = config.options.find((o) => o.id === selectedId || o.label === selectedId);

  const selectedLabel = selectedOpt?.label ?? selectedId;
  const correctLabel = correctOpt?.label ?? config.correctId;

  let isCorrect = selectedId === config.correctId || selectedLabel === correctLabel;
  if (!isCorrect && /^\d+(\.\d+)?$/.test(selectedLabel) && /^\d+(\.\d+)?$/.test(correctLabel)) {
    isCorrect = parseFloat(selectedLabel) === parseFloat(correctLabel);
  }
  if (!isCorrect && /y\s*=.+x.+/.test(selectedLabel) && /y\s*=.+x.+/.test(correctLabel)) {
    isCorrect = normalizeLinearEquation(selectedLabel) === normalizeLinearEquation(correctLabel);
  }

  return {
    isCorrect,
    status: isCorrect ? "correct" : "incorrect",
    score: isCorrect ? 1 : 0,
    message: isCorrect ? "Correct!" : "Not quite right. Try again.",
    misconceptionCode: isCorrect ? undefined : "INCORRECT_CHOICE",
  };
}
