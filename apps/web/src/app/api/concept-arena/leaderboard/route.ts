import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getArenaLeaderboard } from "@/services/concept-arena-service";

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(50, Math.max(5, parseInt(searchParams.get("limit") ?? "15", 10) || 15));

  const leaderboard = await getArenaLeaderboard(limit);

  return NextResponse.json({
    leaderboard,
    you: leaderboard.find((r) => r.userId === session.user.id) ?? null,
  });
}
