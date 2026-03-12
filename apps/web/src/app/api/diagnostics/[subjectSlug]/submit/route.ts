import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { submitDiagnostic } from "@/lib/diagnostic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ subjectSlug: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subjectSlug } = await params;
  const body = await req.json();
  const { attemptId, responses } = body;

  if (!attemptId || !Array.isArray(responses)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const attempt = await prisma.diagnosticAttempt.findUnique({
    where: { id: attemptId },
  });
  if (!attempt || attempt.userId !== session.user.id) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  try {
    const result = await submitDiagnostic(attemptId, responses);
    return NextResponse.json({
      attemptId: result.attemptId,
      overallScore: result.overallScore,
      weakMissingNodes: result.weakMissingNodes,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
