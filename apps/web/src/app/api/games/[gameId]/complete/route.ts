import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth";
import { completeAttempt } from "@/services/interactive-games-service";

const bodySchema = z.object({
  attemptId: z.string().min(1),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { gameId } = await params;
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const summary = await completeAttempt(gameId, session.user.id, parsed.data.attemptId);
    return NextResponse.json(summary);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Complete failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
