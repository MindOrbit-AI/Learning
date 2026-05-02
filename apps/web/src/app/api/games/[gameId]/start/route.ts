import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { startAttempt } from "@/services/interactive-games-service";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gameId } = await params;
  try {
    const out = await startAttempt(gameId, session.user.id);
    return NextResponse.json(out);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Start failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
