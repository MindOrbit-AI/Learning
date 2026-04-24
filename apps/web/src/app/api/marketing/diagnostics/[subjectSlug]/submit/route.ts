import { NextResponse } from "next/server";
import { prisma } from "@mindorbit/db";
import { GUEST_DIAGNOSTIC_ATTEMPT_COOKIE } from "@/lib/guest-diagnostic-cookie";
import { diagnosticsService } from "@/services/diagnostics-service";

function setGuestAttemptCookie(res: NextResponse, attemptId: string) {
  res.cookies.set(GUEST_DIAGNOSTIC_ATTEMPT_COOKIE, attemptId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ subjectSlug: string }> }
) {
  const { subjectSlug } = await params;
  const body = await req.json();
  const { attemptId, responses } = body;

  if (!attemptId || !Array.isArray(responses)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const subject = await prisma.subject.findFirst({
    where: { slug: subjectSlug, createdById: null, status: "published" },
  });
  if (!subject) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });
  }

  const attempt = await prisma.diagnosticAttempt.findUnique({
    where: { id: attemptId },
  });
  if (!attempt || attempt.userId !== null || attempt.subjectId !== subject.id) {
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  try {
    const result = await diagnosticsService.submitDiagnostic(attemptId, responses);
    const res = NextResponse.json({
      attemptId: result.attemptId,
      overallScore: result.overallScore,
      weakMissingNodes: result.weakMissingNodes,
    });
    setGuestAttemptCookie(res, result.attemptId);
    return res;
  } catch (e) {
    if (e instanceof Error && e.message === "Already completed") {
      const res = NextResponse.json({
        attemptId,
        overallScore: attempt.overallScore ?? 0,
        weakMissingNodes: 0,
      });
      setGuestAttemptCookie(res, attemptId);
      return res;
    }
    console.error(e);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
