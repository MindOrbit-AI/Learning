import type { ComponentType } from "react";
import type { InteractiveBlockConfig } from "../types/block.types";
import type { ValidationResult } from "../types/validation.types";
import { MultipleChoiceBlock } from "../blocks/multiple-choice/MultipleChoiceBlock";
import { DragSequenceBlock } from "../blocks/drag-sequence/DragSequenceBlock";
import { DragDropBlock } from "../blocks/drag-drop/DragDropBlock";
import { ConstructAnswerBlock } from "../blocks/construct-answer/ConstructAnswerBlock";
import { ReflectBlock } from "../blocks/reflect/ReflectBlock";
import { ObserveBlock } from "../blocks/observe/ObserveBlock";
import { RevealBlock } from "../blocks/reveal/RevealBlock";
import { TapHighlightBlock } from "../blocks/tap-highlight/TapHighlightBlock";
import { FindErrorBlock } from "../blocks/find-error/FindErrorBlock";
import { SliderBlock } from "../blocks/slider/SliderBlock";

type BlockComponentProps<T = unknown> = {
  config: InteractiveBlockConfig;
  onAnswerChange: (answer: T) => void;
  submittedAnswer?: T | null;
  validationResult?: ValidationResult | null;
  disabled?: boolean;
  mode?: "active" | "review";
};

type BlockComponent<T = unknown> = ComponentType<BlockComponentProps<T>>;

const registry: Record<string, BlockComponent> = {
  "multiple-choice": MultipleChoiceBlock as BlockComponent,
  "drag-sequence": DragSequenceBlock as BlockComponent,
  "drag-drop": DragDropBlock as BlockComponent,
  "construct-answer": ConstructAnswerBlock as BlockComponent,
  reflect: ReflectBlock as BlockComponent,
  observe: ObserveBlock as BlockComponent,
  reveal: RevealBlock as BlockComponent,
  "tap-highlight": TapHighlightBlock as BlockComponent,
  "find-error": FindErrorBlock as BlockComponent,
  slider: SliderBlock as BlockComponent,
};

export function getBlockComponent(
  blockType: InteractiveBlockConfig["type"]
): BlockComponent | null {
  return registry[blockType] ?? null;
}
