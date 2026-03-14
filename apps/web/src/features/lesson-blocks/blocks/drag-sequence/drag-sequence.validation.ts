import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";
import type { DragSequenceBlockConfig } from "@/features/lesson-blocks/types/block.types";

export function validateDragSequence(
  config: DragSequenceBlockConfig,
  answer: unknown
): ValidationResult {
  const order = Array.isArray(answer) ? answer.map(String) : [];
  const correct = config.correctOrder.map(String);

  if (order.length !== correct.length) {
    return {
      isCorrect: false,
      status: "incorrect",
      score: 0,
      message: "Please arrange all items in order.",
    };
  }

  const matches = order.filter((id, i) => id === correct[i]).length;
  const isCorrect = matches === correct.length;

  return {
    isCorrect,
    status: isCorrect ? "correct" : "incorrect",
    score: matches / correct.length,
    message: isCorrect ? "Perfect order!" : "The order isn't quite right. Try again.",
  };
}
