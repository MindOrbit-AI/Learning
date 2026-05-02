import type { Scene } from "./scene";

export type LessonLevel = "beginner" | "intermediate" | "advanced";

export type VisualLesson = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  level: LessonLevel;
  scenes: Scene[];
  finalMasteryCheck: Scene;
};

export type LessonSceneIndex =
  | { kind: "scene"; index: number }
  | { kind: "mastery" };
