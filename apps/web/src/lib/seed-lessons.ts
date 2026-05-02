import { VISUAL_ENGINE_LESSON_SEEDS } from "@mindorbit/content";
import { visualLessonSchema } from "./lesson-schema";
import type { VisualLesson } from "@/types/lesson";

export const SEED_VISUAL_LESSONS: VisualLesson[] = VISUAL_ENGINE_LESSON_SEEDS.map((seed) =>
  visualLessonSchema.parse(seed),
);

export const FRACTIONS_VISUAL_LESSON =
  SEED_VISUAL_LESSONS.find((l) => l.id === "lesson-fractions-parts-of-whole") ?? SEED_VISUAL_LESSONS[0]!;

export function findSeedLessonById(id: string): VisualLesson | undefined {
  return SEED_VISUAL_LESSONS.find((l) => l.id === id);
}

/** Stable ids for deduping DB rows on the learn catalog. */
export const SEED_VISUAL_LESSON_IDS = new Set(SEED_VISUAL_LESSONS.map((l) => l.id));
