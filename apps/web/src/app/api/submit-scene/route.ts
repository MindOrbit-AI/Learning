import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { loadVisualLessonById } from "@/lib/load-visual-lesson";
import { mergedScenes, sceneIndexById } from "@/lib/lesson-helpers";
import { validateSceneWithFeedback } from "@/lib/feedback-engine";
import { resolveSubjectIdForCatalogLabel } from "@/lib/subject-resolve";
import { computeMasteryUpdate, persistMasterySideEffects, buildEasierFollowUpScene } from "@/lib/mastery-engine";

const bodySchema = z.object({
  lessonId: z.string().min(1),
  sceneId: z.string().min(1),
  userInput: z.record(z.unknown()),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  const userId = session?.user?.id ?? null;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { lessonId, sceneId, userInput } = parsed.data;

  let lesson;
  let row;
  try {
    const loaded = await loadVisualLessonById(prisma, lessonId);
    lesson = loaded.lesson;
    row = loaded.row;
  } catch {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const scene = mergedScenes(lesson).find((s) => s.id === sceneId);
  if (!scene) {
    return NextResponse.json({ error: "Scene not found" }, { status: 404 });
  }

  const fb = validateSceneWithFeedback(scene, userInput);
  const idx = sceneIndexById(lesson, sceneId);
  const isLast = idx >= 0 && idx === mergedScenes(lesson).length - 1;

  const masteryUpdate = computeMasteryUpdate(fb.isCorrect);

  if (userId && row) {
    try {
      await prisma.sceneAttempt.create({
        data: {
          userId,
          sceneLessonId: row.id,
          sceneId,
          userInputJson: userInput as Prisma.InputJsonValue,
          isCorrect: fb.isCorrect,
          feedback: fb.feedback,
          misconception: fb.misconception,
        },
      });
    } catch {
      // Ignore when DB unavailable — validation feedback still returned below.
    }
  }

  if (userId) {
    try {
      const subjectIdForMastery =
        row?.subjectId ?? (await resolveSubjectIdForCatalogLabel(prisma, lesson.subject));

      await persistMasterySideEffects(prisma, {
        userId,
        subjectId: subjectIdForMastery,
        scene,
        lesson,
        isCorrect: fb.isCorrect,
        misconceptionLabel: fb.misconception,
      });
    } catch {
      // Ignore when DB unavailable — guest and offline-dev flows keep working.
    }
  }

  let nextScene = null;
  if (fb.isCorrect && !isLast) {
    nextScene = mergedScenes(lesson)[idx + 1] ?? null;
  } else if (!fb.isCorrect) {
    nextScene = buildEasierFollowUpScene(scene);
  }

  if (userId && fb.isCorrect && isLast && row) {
    try {
      const prior = await prisma.lessonAttempt.findFirst({
        where: { userId, sceneLessonId: row.id, completed: true },
      });
      if (!prior) {
        await prisma.lessonAttempt.create({
          data: {
            userId,
            sceneLessonId: row.id,
            score: 1,
            completed: true,
            mistakesJson: [],
          },
        });
      }
    } catch {
      // Ignore when DB unavailable.
    }
  }

  return NextResponse.json({
    isCorrect: fb.isCorrect,
    feedback: fb.feedback,
    misconception: fb.misconception,
    visualCorrection: fb.visualCorrection,
    masteryUpdate,
    nextScene,
    completedLesson: fb.isCorrect && isLast,
  });
}
