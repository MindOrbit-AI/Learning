import type { InteractiveBlockConfig } from "@/features/lesson-blocks/types/block.types";

export interface Lesson {
  id: string;
  title: string;
  missionId?: string;
  description?: string;
  steps: LessonStep[];
}

export interface LessonStep {
  id: string;
  title?: string;
  instruction: string;
  block: InteractiveBlockConfig;
  hints?: HintConfig[];
  feedback?: FeedbackConfig;
  explanation?: string;
}

export interface HintConfig {
  level: number;
  text: string;
}

export interface FeedbackConfig {
  correct?: string;
  incorrect?: string;
  partial?: string;
}
