import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { startDiagnostic } from "@/lib/diagnostic";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ subjectSlug: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subjectSlug } = await params;
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
  });
  if (!subject) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });
  }

  try {
    const { attempt, questions } = await startDiagnostic(subject.id, session.user.id);
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
    console.error(e);
    return NextResponse.json({ error: "Failed to start diagnostic" }, { status: 500 });
  }
}
