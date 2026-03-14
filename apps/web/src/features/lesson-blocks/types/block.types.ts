import type { ValidationResult } from "./validation.types";

export interface InteractiveBlockProps<TConfig, TAnswer> {
  config: TConfig;
  onAnswerChange: (answer: TAnswer) => void;
  submittedAnswer?: TAnswer | null;
  validationResult?: ValidationResult | null;
  disabled?: boolean;
  mode?: "active" | "review";
}

export type InteractiveBlockConfig =
  | MultipleChoiceBlockConfig
  | StepReasoningBlockConfig
  | DragSequenceBlockConfig
  | DragDropBlockConfig
  | ConstructAnswerBlockConfig
  | ReflectBlockConfig
  | ObserveBlockConfig
  | RevealBlockConfig
  | TapHighlightBlockConfig
  | FindErrorBlockConfig
  | SliderBlockConfig;

export interface MultipleChoiceBlockConfig {
  type: "multiple-choice";
  options: Array<{ id: string; label: string }>;
  correctId: string;
  shuffle?: boolean;
}

export interface StepReasoningBlockConfig {
  type: "step-reasoning";
  question: string;
  options: Array<{ id: string; label: string }>;
  correctId: string;
}

export interface DragSequenceBlockConfig {
  type: "drag-sequence";
  items: Array<{ id: string; label: string }>;
  correctOrder: string[];
}

export interface DragDropBlockConfig {
  type: "drag-drop";
  items: Array<{ id: string; label: string }>;
  slots: Array<{ id: string; label?: string }>;
  correctSlots: Record<string, string>; // slotId -> itemId
}

export interface ConstructAnswerBlockConfig {
  type: "construct-answer";
  placeholder?: string;
  expectedFormat?: string;
  correctAnswer: string; // flexible: can be string, number, or match logic
}

export interface ReflectBlockConfig {
  type: "reflect";
  prompt: string;
}

/** Segment on a number line: from `start` to `end`; filled circle = inclusive (≤/≥), open = exclusive (</>) */
export interface NumberLineSegment {
  start: number;
  end: number;
  startFilled?: boolean;
  endFilled?: boolean;
}

export interface NumberLineData {
  min: number;
  max: number;
  segments: NumberLineSegment[];
}

export interface ObserveBlockConfig {
  type: "observe";
  visual?: string;
  description?: string;
  /** URL to an image (e.g. graph, diagram) */
  imageUrl?: string;
  /** Data to render inequalities on a number line */
  numberLine?: NumberLineData;
}

export interface RevealBlockConfig {
  type: "reveal";
  content: string;
  label?: string;
}

export interface TapHighlightBlockConfig {
  type: "tap-highlight";
  targets: Array<{ id: string; label: string }>;
  correctIds: string[];
  highlightOrder?: boolean;
}

export interface FindErrorBlockConfig {
  type: "find-error";
  statements: Array<{ id: string; text: string; hasError: boolean }>;
  correctId: string; // id of statement with error
}

export interface SliderBlockConfig {
  type: "slider";
  min: number;
  max: number;
  step: number;
  initialValue?: number;
  targetValue?: number; // when set, validate against this
  unit?: string;
}
