import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";
import type { ConstructAnswerBlockConfig } from "@/features/lesson-blocks/types/block.types";

function normalizeLinearEquation(s: string): string {
  let t = s.replace(/\s/g, "").toLowerCase();
  t = t.replace(/-x/g, "-1x");
  t = t.replace(/\+x/g, "+1x");
  t = t.replace(/=x/g, "=1x");
  t = t.replace(/(^|[=+\-])x\b/g, "$11x");
  return t;
}

export function validateConstructAnswer(
  config: ConstructAnswerBlockConfig,
  answer: unknown
): ValidationResult {
  const correct = config.correctAnswer?.trim() ?? "";
  const user = String(answer ?? "").trim();

  if (!correct) {
    return {
      isCorrect: true,
      status: "correct",
      score: 1,
      message: "Submitted.",
    };
  }

  if (user.toLowerCase() === correct.toLowerCase()) {
    return { isCorrect: true, status: "correct", score: 1, message: "Correct!" };
  }
  if (/^\d+(\.\d+)?$/.test(user) && /^\d+(\.\d+)?$/.test(correct)) {
    const ok = parseFloat(user) === parseFloat(correct);
    return {
      isCorrect: ok,
      status: ok ? "correct" : "incorrect",
      score: ok ? 1 : 0,
      message: ok ? "Correct!" : "Not quite right.",
    };
  }
  if (/y\s*=.+x.+/.test(user) && /y\s*=.+x.+/.test(correct)) {
    const ok = normalizeLinearEquation(user) === normalizeLinearEquation(correct);
    return {
      isCorrect: ok,
      status: ok ? "correct" : "incorrect",
      score: ok ? 1 : 0,
      message: ok ? "Correct!" : "Not quite right.",
    };
  }

  return {
    isCorrect: false,
    status: "incorrect",
    score: 0,
    message: "Not quite right. Try again.",
  };
}
