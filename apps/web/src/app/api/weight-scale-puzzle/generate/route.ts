import { NextResponse } from "next/server";
import { getAIProvider } from "@mindorbit/ai";

/** GET: AI-generated weight-scale puzzle JSON (public demo; uses mock when no API keys). */
export async function GET() {
  try {
    const puzzle = await getAIProvider().generateWeightScalePuzzle();
    return NextResponse.json(puzzle, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("weight-scale-puzzle generate:", e);
    return NextResponse.json({ error: "Failed to generate puzzle" }, { status: 500 });
  }
}
