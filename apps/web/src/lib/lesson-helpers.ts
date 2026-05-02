import type { VisualLesson } from "@/types/lesson";
import type { Scene } from "@/types/scene";

export function mergedScenes(lesson: VisualLesson): Scene[] {
  return [...lesson.scenes, lesson.finalMasteryCheck];
}

export function sceneIndexById(lesson: VisualLesson, sceneId: string): number {
  return mergedScenes(lesson).findIndex((s) => s.id === sceneId);
}
