import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { ReviewScheduler } from "@/services/review-scheduler";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";
import { z } from "zod";

const schema = z.object({
  correct: z.boolean(),
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
    const { correct } = schema.parse(body);
    await ReviewScheduler.completeReview(id, session.user.id, correct);

    await AnalyticsService.track(session.user.id, EVENT_TYPES.review_completed, {
      reviewItemId: id,
      correct,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Review completion failed" },
      { status: 404 }
    );
  }
}
