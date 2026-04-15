import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/auth";
import type { MistakeCategory } from "@mindorbit/types";
import { missionsService } from "@/services/missions-service";
import { completeSceneMission } from "@/services/mission-engine";
import { maybeQualifyReferralAfterMission } from "@/services/referral-service";

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
    const body = await req.json().catch(() => ({}));
    const sceneResponses = body.sceneResponses as Array<{
      sceneId: string;
      isCorrect: boolean;
      attempts: number;
      maxHintLevel?: number;
      mistakeCategory?: MistakeCategory | null;
    }> | undefined;

    let xpEarned = 0;
    let stars = 2;

    if (sceneResponses && Array.isArray(sceneResponses) && sceneResponses.length > 0) {
      const result = await completeSceneMission(id, session.user.id, sceneResponses);
      xpEarned = result.xpEarned;
      stars = result.stars;
    } else {
      const taskResponses = body.responses as
        | Array<{ taskId: string; selectedAnswer: string }>
        | undefined;
      const taskCheckCounts = body.taskCheckCounts as Record<string, number> | undefined;
      const result = await missionsService.completeMission(id, session.user.id, {
        taskResponses: Array.isArray(taskResponses) ? taskResponses : [],
        taskCheckCounts,
      });
      xpEarned = result.xpEarned;
      stars = result.stars;
    }
    await maybeQualifyReferralAfterMission(session.user.id, id);

    revalidatePath("/missions");
    revalidatePath(`/missions/${id}`);
    return NextResponse.json({ ok: true, xpEarned, stars });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Task responses required")) {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }
}
