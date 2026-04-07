import { NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@mindorbit/ai";

const bodySchema = z.object({
  topic: z.string().min(1).max(240).optional(),
  gradeLevel: z.string().min(1).max(60).optional(),
  sectionCount: z.number().int().min(2).max(8).optional(),
});

const DEFAULT_TOPIC = "Latitude, longitude, and how we map Earth and the sky";
const DEFAULT_GRADE = "Grade 10";

function parseSectionCount(raw: string | null): number | undefined {
  if (raw == null || raw === "") return undefined;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) return undefined;
  return Math.min(8, Math.max(2, n));
}

/** GET: same lesson generation using query params (`topic` required). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic")?.trim().slice(0, 240);
  if (!topic) {
    return NextResponse.json(
      { error: "Query parameter `topic` is required (non-empty)." },
      { status: 400 }
    );
  }
  const gradeLevel =
    searchParams.get("grade")?.trim().slice(0, 60) ||
    searchParams.get("gradeLevel")?.trim().slice(0, 60) ||
    DEFAULT_GRADE;
  const sectionCount = parseSectionCount(searchParams.get("sections"));

  try {
    const lesson = await getAIProvider().generateImmersiveLessonContent({
      topic,
      gradeLevel,
      ...(sectionCount != null ? { sectionCount } : {}),
    });
    return NextResponse.json(lesson);
  } catch (err) {
    console.error("Immersive lesson generation failed:", err);
    return NextResponse.json({ error: "Failed to generate lesson" }, { status: 500 });
  }
}

/** POST: AI-generated immersive lesson (sections, objectives, reader blocks). */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const topic = parsed.data.topic?.trim() || DEFAULT_TOPIC;
  const gradeLevel = parsed.data.gradeLevel?.trim() || DEFAULT_GRADE;

  try {
    const lesson = await getAIProvider().generateImmersiveLessonContent({
      topic,
      gradeLevel,
      sectionCount: parsed.data.sectionCount,
    });
    return NextResponse.json(lesson);
  } catch (err) {
    console.error("Immersive lesson generation failed:", err);
    return NextResponse.json({ error: "Failed to generate lesson" }, { status: 500 });
  }
}
