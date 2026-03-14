import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";
import type { SliderBlockConfig } from "@/features/lesson-blocks/types/block.types";

const TOLERANCE = 0.01;

export function validateSlider(config: SliderBlockConfig, answer: unknown): ValidationResult {
  const target = config.targetValue;
  if (target == null) {
    return { isCorrect: true, status: "correct", score: 1, message: "Submitted." };
  }

  const val = typeof answer === "number" ? answer : parseFloat(String(answer ?? ""));
  if (Number.isNaN(val)) {
    return {
      isCorrect: false,
      status: "incorrect",
      score: 0,
      message: "Please adjust the slider.",
    };
  }

  const isCorrect = Math.abs(val - target) <= TOLERANCE;
  return {
    isCorrect,
    status: isCorrect ? "correct" : "incorrect",
    score: isCorrect ? 1 : 0,
    message: isCorrect ? "Correct!" : "Adjust to the target value.",
  };
}
