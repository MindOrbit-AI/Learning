import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/auth";
import { missionsService } from "@/services/missions-service";
import { completeSceneMission } from "@/services/mission-engine";

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
      mistakeCategory?: string;
    }> | undefined;

    if (sceneResponses && Array.isArray(sceneResponses) && sceneResponses.length > 0) {
      await completeSceneMission(id, session.user.id, sceneResponses);
    } else {
      await missionsService.completeMission(id, session.user.id);
    }
    revalidatePath("/missions");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }
}
