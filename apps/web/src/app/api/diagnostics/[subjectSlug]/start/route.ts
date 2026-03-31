import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { canViewSubject } from "@/lib/subject-visibility";
import {
  diagnosticsService,
  NoDiagnosticQuestionsError,
} from "@/services/diagnostics-service";
import { featureGateService } from "@/features/billing/feature-gate.service";
import { usageService } from "@/features/billing/usage.service";
import { FEATURE_KEYS } from "@mindorbit/lib";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";

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
  if (!canViewSubject(subject, session.user.id)) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });
  }

  const gate = await featureGateService.canStartDiagnostic(session.user.id);
  if (!gate.allowed) {
    await AnalyticsService.track(session.user.id, EVENT_TYPES.feature_limit_hit, {
      feature: "diagnostic",
      reason: gate.reason,
    });
    return NextResponse.json(
      { error: gate.reason ?? "Diagnostic limit reached", upgradeRequired: true },
      { status: 403 }
    );
  }

  try {
    const { attempt, questions } = await diagnosticsService.startDiagnostic(subject.id, session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { planTier: true },
    });
    if (user?.planTier === "FREE") {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      await usageService.incrementUsage(session.user.id, FEATURE_KEYS.DIAGNOSTIC_RUNS, {
        periodStart: start,
        periodEnd: end,
      });
    }
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
