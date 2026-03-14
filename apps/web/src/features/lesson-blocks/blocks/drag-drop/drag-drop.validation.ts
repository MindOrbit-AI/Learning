import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";
import type { DragDropBlockConfig } from "@/features/lesson-blocks/types/block.types";

export function validateDragDrop(
  config: DragDropBlockConfig,
  answer: unknown
): ValidationResult {
  const slots = answer as Record<string, string> | undefined;
  if (!slots || typeof slots !== "object") {
    return {
      isCorrect: false,
      status: "incorrect",
      score: 0,
      message: "Please place items in the slots.",
    };
  }

  const correct = config.correctSlots;
  const slotIds = config.slots.map((s) => s.id);
  let matches = 0;
  for (const slotId of slotIds) {
    if (String(slots[slotId] ?? "") === String(correct[slotId] ?? "")) {
      matches++;
    }
  }
  const total = slotIds.length;
  const isCorrect = matches === total;

  return {
    isCorrect,
    status: isCorrect ? "correct" : "incorrect",
    score: total > 0 ? matches / total : 0,
    message: isCorrect ? "Correct!" : "Not quite. Check your placements.",
  };
}
