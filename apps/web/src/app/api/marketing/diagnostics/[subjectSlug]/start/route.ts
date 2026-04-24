import { NextResponse } from "next/server";
import { prisma } from "@mindorbit/db";
import {
  diagnosticsService,
  NoDiagnosticQuestionsError,
} from "@/services/diagnostics-service";

/** Platform (catalog) subjects only — no sign-in, no usage limits. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ subjectSlug: string }> }
) {
  const { subjectSlug } = await params;
  const subject = await prisma.subject.findFirst({
    where: { slug: subjectSlug, createdById: null, status: "published" },
  });
  if (!subject) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });
  }

  try {
    const { attempt, questions } = await diagnosticsService.startDiagnostic(subject.id, null);
    return NextResponse.json({
      attemptId: attempt.id,
      questions: questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        type: q.type,
        optionsJson: q.optionsJson,
        correctAnswer: q.correctAnswer,
      })),
    });
  } catch (e) {
    if (e instanceof NoDiagnosticQuestionsError) {
      return NextResponse.json(
        {
          error:
            "This subject has no diagnostic questions yet. Add concept nodes with descriptions, or run content ingestion.",
          code: "NO_DIAGNOSTIC_QUESTIONS",
        },
        { status: 422 }
      );
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to start diagnostic" }, { status: 500 });
  }
}
