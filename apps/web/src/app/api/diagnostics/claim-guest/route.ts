import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "@/lib/auth";
import { GUEST_DIAGNOSTIC_ATTEMPT_COOKIE } from "@/lib/guest-diagnostic-cookie";
import { diagnosticsService } from "@/services/diagnostics-service";

function clearGuestAttemptCookie(res: NextResponse) {
  res.cookies.set(GUEST_DIAGNOSTIC_ATTEMPT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function POST() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const attemptId = cookieStore.get(GUEST_DIAGNOSTIC_ATTEMPT_COOKIE)?.value;
  if (!attemptId) {
    return NextResponse.json({ ok: false, skipped: true });
  }

  try {
    await diagnosticsService.claimGuestDiagnosticAttempt(attemptId, session.user.id);
  } catch (e) {
    console.error("claim-guest:", e);
    const res = NextResponse.json({ ok: false, error: "claim_failed" }, { status: 400 });
    clearGuestAttemptCookie(res);
    return res;
  }

  const res = NextResponse.json({ ok: true, attemptId });
  clearGuestAttemptCookie(res);
  return res;
}
