import { create } from "zustand";
import type { Lesson } from "../types/lesson.types";
import type { ValidationResult } from "@/features/lesson-blocks/types/validation.types";

export interface LessonRuntimeState {
  lesson: Lesson | null;
  currentStepIndex: number;
  answersByStepId: Record<string, unknown>;
  validationByStepId: Record<string, ValidationResult>;
  attemptsByStepId: Record<string, number>;
  completedStepIds: Set<string>;
  isLessonComplete: boolean;

  setLesson: (lesson: Lesson) => void;
  setCurrentStepIndex: (index: number) => void;
  setAnswer: (stepId: string, answer: unknown) => void;
  setValidation: (stepId: string, result: ValidationResult) => void;
  incrementAttempt: (stepId: string) => void;
  markStepCompleted: (stepId: string) => void;
  clearValidation: (stepId: string) => void;
  resetStep: (stepId: string) => void;
  goNext: () => void;
  goPrev: () => void;
  completeLesson: () => void;
  resetLesson: () => void;
}

export const useLessonRuntimeStore = create<LessonRuntimeState>((set) => ({
  lesson: null,
  currentStepIndex: 0,
  answersByStepId: {},
  validationByStepId: {},
  attemptsByStepId: {},
  completedStepIds: new Set(),
  isLessonComplete: false,

  setLesson: (lesson) =>
    set({
      lesson,
      currentStepIndex: 0,
      answersByStepId: {},
      validationByStepId: {},
      attemptsByStepId: {},
      completedStepIds: new Set(),
      isLessonComplete: false,
    }),

  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),

  setAnswer: (stepId, answer) =>
    set((s) => ({
      answersByStepId: { ...s.answersByStepId, [stepId]: answer },
    })),

  setValidation: (stepId, result) =>
    set((s) => ({
      validationByStepId: { ...s.validationByStepId, [stepId]: result },
    })),

  incrementAttempt: (stepId) =>
    set((s) => ({
      attemptsByStepId: {
        ...s.attemptsByStepId,
        [stepId]: (s.attemptsByStepId[stepId] ?? 0) + 1,
      },
    })),

  markStepCompleted: (stepId) =>
    set((s) => ({
      completedStepIds: new Set([...s.completedStepIds, stepId]),
    })),

  clearValidation: (stepId) =>
    set((s) => {
      const next = { ...s.validationByStepId };
      delete next[stepId];
      return { validationByStepId: next };
    }),

  resetStep: (stepId) =>
    set((s) => {
      const nextAnswers = { ...s.answersByStepId };
      const nextValidation = { ...s.validationByStepId };
      delete nextAnswers[stepId];
      delete nextValidation[stepId];
      return {
        answersByStepId: nextAnswers,
        validationByStepId: nextValidation,
        attemptsByStepId: { ...s.attemptsByStepId, [stepId]: 0 },
      };
    }),

  goNext: () =>
    set((s) => {
      if (!s.lesson) return s;
      const next = Math.min(s.currentStepIndex + 1, s.lesson.steps.length - 1);
      return { currentStepIndex: next };
    }),

  goPrev: () =>
    set((s) => ({
      currentStepIndex: Math.max(0, s.currentStepIndex - 1),
    })),

  completeLesson: () => set({ isLessonComplete: true }),

  resetLesson: () =>
    set({
      currentStepIndex: 0,
      answersByStepId: {},
      validationByStepId: {},
      attemptsByStepId: {},
      completedStepIds: new Set(),
      isLessonComplete: false,
    }),
}));
