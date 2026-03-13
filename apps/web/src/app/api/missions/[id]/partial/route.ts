import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { savePartialProgress } from "@/services/mission-engine";

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
    await savePartialProgress(id, session.user.id, {
      currentSceneIndex: body.currentSceneIndex,
      completedIndices: body.completedIndices ?? [],
      answers: body.answers ?? {},
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }
}
