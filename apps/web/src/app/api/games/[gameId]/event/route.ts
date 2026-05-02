import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth";
import { recordGameEvent } from "@/services/interactive-games-service";

const bodySchema = z.object({
  attemptId: z.string().min(1),
  eventType: z.string().min(1).max(120),
  payload: z.record(z.unknown()).optional(),
  isCorrect: z.boolean().nullable().optional(),
  responseTimeMs: z.number().int().nonnegative().nullable().optional(),
  conceptNodeId: z.string().nullable().optional(),
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
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const out = await recordGameEvent({
      gameId,
      userId: session.user.id,
      attemptId: parsed.data.attemptId,
      eventType: parsed.data.eventType,
      payload: parsed.data.payload ?? {},
      isCorrect: parsed.data.isCorrect ?? null,
      responseTimeMs: parsed.data.responseTimeMs ?? null,
      conceptNodeId: parsed.data.conceptNodeId ?? null,
    });
    return NextResponse.json(out);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Event failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
