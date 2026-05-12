import { NextResponse } from "next/server";
import { getAIProvider, mockStemPuzzle, type StemPuzzleGenParams, type StemPuzzleMode } from "@mindorbit/ai";

const ALLOWED_MODES: StemPuzzleMode[] = ["choice", "match", "sort", "reorder", "numpad"];
const ALLOWED_DOMAINS = ["Math", "Science", "Technology", "Engineering"] as const;
const ALLOWED_DIFFICULTIES = ["easy", "medium", "hard"] as const;
const ALLOWED_GRADES = ["K-8", "9", "10", "11", "12"] as const;

function parseParams(body: unknown): StemPuzzleGenParams | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const id = typeof b.id === "string" ? b.id.trim() : "";
  const title = typeof b.title === "string" ? b.title.trim() : "";
  const domain = b.domain;
  const subject = typeof b.subject === "string" ? b.subject.trim() : "";
  const skill = typeof b.skill === "string" ? b.skill.trim() : "";
  const grade = b.grade;
  const difficulty = b.difficulty;
  const mode = b.mode;
  if (!id || !title || !subject || !skill) return null;
  if (typeof domain !== "string" || !(ALLOWED_DOMAINS as readonly string[]).includes(domain)) return null;
  if (typeof grade !== "string" || !(ALLOWED_GRADES as readonly string[]).includes(grade)) return null;
  if (typeof difficulty !== "string" || !(ALLOWED_DIFFICULTIES as readonly string[]).includes(difficulty)) return null;
  if (typeof mode !== "string" || !(ALLOWED_MODES as readonly string[]).includes(mode)) return null;
  return {
    id,
    title,
    domain: domain as StemPuzzleGenParams["domain"],
    subject,
    skill,
    grade: grade as StemPuzzleGenParams["grade"],
    difficulty: difficulty as StemPuzzleGenParams["difficulty"],
    mode: mode as StemPuzzleMode,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const params = parseParams(body);
  if (!params) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }
  try {
    const provider = getAIProvider();
    const spec = provider.generateStemPuzzle
      ? await provider.generateStemPuzzle(params)
      : mockStemPuzzle(params);
    return NextResponse.json({ spec, source: provider.generateStemPuzzle ? "ai" : "mock" }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("stem-puzzle route:", e);
    return NextResponse.json({ spec: mockStemPuzzle(params), source: "fallback" }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
