import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth";
import {
  applyArenaMasteryAndStats,
  type ArenaMatchResultRow,
} from "@/services/concept-arena-service";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";

const bodySchema = z.object({
  won: z.boolean(),
  maxCombo: z.number().int().min(0),
  totalDamageDealt: z.number().int().min(0),
  results: z.array(
    z.object({
      nodeId: z.string().min(1),
      subjectId: z.string().min(1),
      correct: z.boolean(),
    })
  ),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const results: ArenaMatchResultRow[] = parsed.data.results;

  const { xpAwarded } = await applyArenaMasteryAndStats({
    userId: session.user.id,
    won: parsed.data.won,
    maxCombo: parsed.data.maxCombo,
    totalDamageDealt: parsed.data.totalDamageDealt,
    results,
  });

  await AnalyticsService.track(session.user.id, EVENT_TYPES.concept_arena_match_completed, {
    won: parsed.data.won,
    maxCombo: parsed.data.maxCombo,
    totalDamageDealt: parsed.data.totalDamageDealt,
    nodeResultsCount: results.length,
    xpAwarded,
  });

  return NextResponse.json({ ok: true, xpAwarded });
}
