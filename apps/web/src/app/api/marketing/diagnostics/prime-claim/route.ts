import { NextResponse } from "next/server";
import { prisma } from "@mindorbit/db";
import { GUEST_DIAGNOSTIC_ATTEMPT_COOKIE } from "@/lib/guest-diagnostic-cookie";

/**
 * Sets the guest diagnostic cookie when a visitor opens a valid completed guest results URL,
 * so sign-up on the same browser can attach the attempt to their account.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as {
    attemptId?: string;
    subjectSlug?: string;
  } | null;
  const attemptId = body?.attemptId;
  const subjectSlug = body?.subjectSlug;
  if (!attemptId || !subjectSlug) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const subject = await prisma.subject.findFirst({
    where: { slug: subjectSlug, createdById: null, status: "published" },
  });
  if (!subject) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const attempt = await prisma.diagnosticAttempt.findFirst({
    where: {
      id: attemptId,
      userId: null,
      subjectId: subject.id,
      completedAt: { not: null },
    },
  });
  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(GUEST_DIAGNOSTIC_ATTEMPT_COOKIE, attemptId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
