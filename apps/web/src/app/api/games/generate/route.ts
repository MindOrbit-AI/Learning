import { NextResponse } from "next/server";
import { z } from "zod";
import { GameMode } from "@prisma/client";
import { getServerSession } from "@/lib/auth";
import { generateGameForUser } from "@/services/interactive-games-service";

const bodySchema = z.object({
  subjectId: z.string().min(1),
  topic: z.string().min(1).max(500),
  gradeLevel: z.string().min(1).max(64),
  learningGoal: z.string().min(1).max(2000),
  gameMode: z.nativeEnum(GameMode),
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
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const gameId = await generateGameForUser({
      userId: session.user.id,
      subjectId: parsed.data.subjectId,
      topic: parsed.data.topic,
      gradeLevel: parsed.data.gradeLevel,
      learningGoal: parsed.data.learningGoal,
      gameMode: parsed.data.gameMode,
    });
    return NextResponse.json({ gameId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
