import type { PrismaClient } from "@mindorbit/db";
import type { SceneLesson } from "@prisma/client";
import { visualLessonSchema } from "./lesson-schema";
import { isPrismaDbUnavailable } from "./prisma-errors";
import { findSeedLessonById } from "./seed-lessons";
import type { VisualLesson } from "@/types/lesson";

export async function loadVisualLessonById(
  prisma: PrismaClient,
  lessonId: string,
): Promise<{ lesson: VisualLesson; row: SceneLesson | null }> {
  try {
    const row = await prisma.sceneLesson.findUnique({ where: { id: lessonId } });
    if (row) {
      const lesson = visualLessonSchema.parse(row.lessonJson);
      return { lesson, row };
    }
  } catch (error) {
    if (!isPrismaDbUnavailable(error)) throw error;
  }

  const seed = findSeedLessonById(lessonId);
  if (seed) {
    return { lesson: seed, row: null };
  }
  throw new Error("Lesson not found");
}
