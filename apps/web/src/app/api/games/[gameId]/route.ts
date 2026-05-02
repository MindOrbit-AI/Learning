import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getGameBundle } from "@/services/interactive-games-service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gameId } = await params;
  const bundle = await getGameBundle(gameId, session.user.id);
  if (!bundle) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(bundle);
}
