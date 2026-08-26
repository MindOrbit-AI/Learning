import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { ReviewScheduler } from "@/services/review-scheduler";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";
import { logInterventionOutcome } from "@/services/intervention-log-service";
import { prisma } from "@mindorbit/db";
import { z } from "zod";

const legacySchema = z.object({
  correct: z.boolean(),
});

const sessionSchema = z.object({
  session: z.literal(true),
  correct: z.number().int().min(0),
  total: z.number().int().min(1),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const item = await prisma.reviewQueueItem.findUnique({ where: { id } });
    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const unsBefore = await prisma.userNodeState.findUnique({
      where: {
        userId_subjectId_nodeId: {
          userId: session.user.id,
          subjectId: item.subjectId,
          nodeId: item.nodeId,
        },
      },
    });

    if (body.session === true) {
      const { correct, total } = sessionSchema.parse(body);
      const result = await ReviewScheduler.completeReviewSession(id, session.user.id, {
        correct,
        total,
      });

      const unsAfter = await prisma.userNodeState.findUnique({
        where: {
          userId_subjectId_nodeId: {
            userId: session.user.id,
            subjectId: item.subjectId,
            nodeId: item.nodeId,
          },
        },
      });

      await logInterventionOutcome(session.user.id, item.subjectId, item.nodeId, "review", {
        masteryBefore: unsBefore?.mastery ?? 0,
        masteryAfter: unsAfter?.mastery ?? 0,
        stateBefore: unsBefore?.state ?? "untouched",
        stateAfter: unsAfter?.state ?? "untouched",
      });

      await AnalyticsService.track(session.user.id, EVENT_TYPES.review_completed, {
        reviewItemId: id,
        correct,
        total,
        correctRate: result.correctRate,
        passed: result.passed,
        session: true,
      });

      return NextResponse.json({ ok: true, passed: result.passed, correctRate: result.correctRate });
    }

    const { correct } = legacySchema.parse(body);
    await ReviewScheduler.completeReview(id, session.user.id, correct);

    await AnalyticsService.track(session.user.id, EVENT_TYPES.review_completed, {
      reviewItemId: id,
      correct,
    });

    return NextResponse.json({ ok: true, passed: correct });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Review completion failed" }, { status: 404 });
  }
}
