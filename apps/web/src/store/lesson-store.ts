"use client";

import { create } from "zustand";
import type { VisualLesson } from "@/types/lesson";
import type { SceneUserInput } from "@/types/scene";

export type LessonRuntime = {
  dbLessonId: string | null;
  lesson: VisualLesson | null;
  sceneIndex: number;
  /** Inputs keyed by scene id */
  inputsBySceneId: Record<string, SceneUserInput>;
  feedbackOpen: boolean;
  feedbackText: string;
  lastCorrect: boolean | null;
  hintOpen: boolean;
  completed: boolean;
};

type Actions = {
  reset: () => void;
  loadLesson: (lesson: VisualLesson, dbLessonId?: string | null) => void;
  setSceneIndex: (i: number) => void;
  setUserInput: (sceneId: string, input: SceneUserInput) => void;
  setFeedback: (open: boolean, text?: string, isCorrect?: boolean | null) => void;
  setHintOpen: (open: boolean) => void;
  setCompleted: (v: boolean) => void;
};

const initial: LessonRuntime = {
  dbLessonId: null,
  lesson: null,
  sceneIndex: 0,
  inputsBySceneId: {},
  feedbackOpen: false,
  feedbackText: "",
  lastCorrect: null,
  hintOpen: false,
  completed: false,
};

export const useLessonStore = create<LessonRuntime & Actions>((set) => ({
  ...initial,
  reset: () => set(initial),
  loadLesson: (lesson, dbLessonId = null) =>
    set({
      ...initial,
      lesson,
      dbLessonId,
    }),
  setSceneIndex: (sceneIndex) => set({ sceneIndex, feedbackOpen: false, hintOpen: false }),
  setUserInput: (sceneId, input) =>
    set((s) => ({
      inputsBySceneId: { ...s.inputsBySceneId, [sceneId]: input },
    })),
  setFeedback: (feedbackOpen, feedbackText = "", lastCorrect = null) =>
    set({ feedbackOpen, feedbackText, lastCorrect }),
  setHintOpen: (hintOpen) => set({ hintOpen }),
  setCompleted: (completed) => set({ completed }),
}));
