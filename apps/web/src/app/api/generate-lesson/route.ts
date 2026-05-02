import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { generateOrRejectLesson } from "@/lib/lesson-generator";
import { FRACTIONS_VISUAL_LESSON } from "@/lib/seed-lessons";
import { lessonPassesVisualInteractionRule } from "@/lib/scene-registry";
import { resolveSubjectIdForCatalogLabel } from "@/lib/subject-resolve";

const bodySchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

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

  const subjectId = await resolveSubjectIdForCatalogLabel(prisma, parsed.data.subject);

  const lesson = await generateOrRejectLesson(
    {
      subject: parsed.data.subject,
      topic: parsed.data.topic,
      level: parsed.data.level,
      userId,
    },
    FRACTIONS_VISUAL_LESSON,
  );

  if (!lessonPassesVisualInteractionRule(lesson)) {
    return NextResponse.json({ error: "Lesson failed visual-interaction ratio gate" }, { status: 422 });
  }

  const row = await prisma.sceneLesson.upsert({
    where: { id: lesson.id },
    create: {
      id: lesson.id,
      userId,
      subjectId,
      topic: lesson.topic,
      level: lesson.level,
      title: lesson.title,
      lessonJson: lesson as object,
    },
    update: {
      lessonJson: lesson as object,
      topic: lesson.topic,
      level: lesson.level,
      title: lesson.title,
      subjectId,
    },
  });

  return NextResponse.json({ lesson, sceneLessonId: row.id });
}
