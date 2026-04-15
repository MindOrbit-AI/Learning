import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { z } from "zod";
import {
  SUBJECTS,
  isSubjectKey,
  subjectKeysForGradeLevel,
  subjectSlugForKey,
  type SubjectKey,
} from "@mindorbit/lib";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";

/** Matches onboarding step 4 options in `apps/web/src/app/onboarding/page.tsx`. */
const TARGET_EXAM_OPTIONS = new Set([
  "SAT",
  "ACT",
  "AP Chemistry",
  "AP Biology",
  "AP Calculus",
  "Other",
]);

const schema = z
  .object({
    gradeLevel: z.string(),
    studyGoal: z.string(),
    favoriteSubjects: z.array(z.string()).min(1, "Select at least one subject"),
    targetExams: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    const allowedForGrade = new Set(subjectKeysForGradeLevel(data.gradeLevel));
    for (const k of data.favoriteSubjects) {
      if (!isSubjectKey(k) || !allowedForGrade.has(k)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid subject for your grade",
          path: ["favoriteSubjects"],
        });
        return;
      }
    }
  })
  .superRefine((data, ctx) => {
    for (const e of data.targetExams ?? []) {
      if (!TARGET_EXAM_OPTIONS.has(e)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid target exam",
          path: ["targetExams"],
        });
        return;
      }
    }
  });

export async function POST(req: Request) {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const uniqueKeys = [...new Set(data.favoriteSubjects)] as SubjectKey[];
    const slugs = uniqueKeys.map((k) => subjectSlugForKey(k));

    await prisma.$transaction(async (tx) => {
      // Only materialize catalog rows for subjects the user picked (not the full catalog).
      for (const key of uniqueKeys) {
        const meta = SUBJECTS[key];
        const description = `${meta.title} — study paths, diagnostics, and missions.`;
        await tx.subject.upsert({
          where: { slug: meta.slug },
          create: {
            slug: meta.slug,
            title: meta.title,
            description,
            icon: meta.icon,
            color: meta.color,
            status: "published",
          },
          update: {
            title: meta.title,
            description,
            icon: meta.icon,
            color: meta.color,
          },
        });
      }

      const resolved = await tx.subject.findMany({
        where: { slug: { in: slugs }, createdById: null },
        select: { id: true, slug: true },
      });

      if (resolved.length !== slugs.length) {
        throw new Error("Subject resolution mismatch after catalog upsert");
      }

      // Clear prior catalog library rows only; community adds (user-owned subjects) stay.
      await tx.userSubjectAdd.deleteMany({
        where: {
          userId,
          subject: { createdById: null },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          gradeLevel: data.gradeLevel,
          studyGoal: data.studyGoal,
          targetExams: data.targetExams ?? [],
          onboardingCompleted: true,
        },
      });

      await tx.userSubjectAdd.createMany({
        data: resolved.map((s) => ({
          userId,
          subjectId: s.id,
        })),
        skipDuplicates: true,
      });
    });

    await AnalyticsService.track(userId, EVENT_TYPES.funnel_onboarding_completed, {});

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Onboarding failed" }, { status: 500 });
  }
}
