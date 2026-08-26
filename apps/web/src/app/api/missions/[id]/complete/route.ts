import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/auth";
import type { MistakeCategory } from "@mindorbit/types";
import { missionsService } from "@/services/missions-service";
import { completeSceneMission } from "@/services/mission-engine";
import { maybeQualifyReferralAfterMission } from "@/services/referral-service";
import { getMissionCompletionExpand } from "@/services/learning-path-service";

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
    let nodeId = "";
    let subjectId = "";
    let nodeTitle = "";
    let masteryBefore = 0;
    let masteryAfter = 0;
    let stateBefore = "untouched";
    let stateAfter = "learning";

    if (sceneResponses && Array.isArray(sceneResponses) && sceneResponses.length > 0) {
      const result = await completeSceneMission(id, session.user.id, sceneResponses);
      xpEarned = result.xpEarned;
      stars = result.stars;
      nodeId = result.nodeId;
      subjectId = result.subjectId;
      nodeTitle = result.nodeTitle;
      masteryBefore = result.masteryBefore;
      masteryAfter = result.masteryAfter;
      stateBefore = result.stateBefore;
      stateAfter = result.stateAfter;
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
      nodeId = result.nodeId;
      subjectId = result.subjectId;
      nodeTitle = result.nodeTitle;
      masteryBefore = result.masteryBefore;
      masteryAfter = result.masteryAfter;
      stateBefore = result.stateBefore;
      stateAfter = result.stateAfter;
    }
    await maybeQualifyReferralAfterMission(session.user.id, id);

    const expand =
      nodeId && subjectId
        ? await getMissionCompletionExpand(session.user.id, nodeId, subjectId)
        : null;

    revalidatePath("/missions");
    revalidatePath(`/missions/${id}`);
    revalidatePath("/dashboard");
    return NextResponse.json({
      ok: true,
      xpEarned,
      stars,
      nodeTitle,
      masteryBefore,
      masteryAfter,
      stateBefore,
      stateAfter,
      unlockedNodes: expand?.unlockedNodes ?? [],
      nextAction: expand?.nextAction ?? null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Task responses required")) {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }
}
