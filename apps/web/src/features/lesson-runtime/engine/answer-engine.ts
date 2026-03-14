import type {
  InteractiveBlockConfig,
  MultipleChoiceBlockConfig,
} from "@/features/lesson-blocks/types/block.types";
import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";
import { validateMultipleChoice } from "@/features/lesson-blocks/blocks/multiple-choice/multiple-choice.validation";
import { validateDragSequence } from "@/features/lesson-blocks/blocks/drag-sequence/drag-sequence.validation";
import { validateDragDrop } from "@/features/lesson-blocks/blocks/drag-drop/drag-drop.validation";
import { validateConstructAnswer } from "@/features/lesson-blocks/blocks/construct-answer/construct-answer.validation";
import { validateReflect } from "@/features/lesson-blocks/blocks/reflect/reflect.validation";
import { validateObserve } from "@/features/lesson-blocks/blocks/observe/observe.validation";
import { validateReveal } from "@/features/lesson-blocks/blocks/reveal/reveal.validation";
import { validateTapHighlight } from "@/features/lesson-blocks/blocks/tap-highlight/tap-highlight.validation";
import { validateFindError } from "@/features/lesson-blocks/blocks/find-error/find-error.validation";
import { validateSlider } from "@/features/lesson-blocks/blocks/slider/slider.validation";

export function validateAnswer(
  block: InteractiveBlockConfig,
  answer: unknown
): ValidationResult {
  switch (block.type) {
    case "multiple-choice":
    case "step-reasoning":
      return validateMultipleChoice(block as MultipleChoiceBlockConfig, answer);
    case "drag-sequence":
      return validateDragSequence(block, answer);
    case "drag-drop":
      return validateDragDrop(block, answer);
    case "construct-answer":
      return validateConstructAnswer(block, answer);
    case "reflect":
      return validateReflect(block, answer);
    case "observe":
      return validateObserve(block, answer);
    case "reveal":
      return validateReveal(block, answer);
    case "tap-highlight":
      return validateTapHighlight(block, answer);
    case "find-error":
      return validateFindError(block, answer);
    case "slider":
      return validateSlider(block, answer);
    default: {
      const _: never = block;
      return {
        isCorrect: false,
        status: "incorrect",
        score: 0,
        message: "Unknown block type",
      };
    }
  }
}

export const PASSIVE_BLOCK_TYPES = ["observe", "reveal", "reflect"] as const;
export function isPassiveBlock(block: InteractiveBlockConfig): boolean {
  return PASSIVE_BLOCK_TYPES.includes(block.type as (typeof PASSIVE_BLOCK_TYPES)[number]);
}
