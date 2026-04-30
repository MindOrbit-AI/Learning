import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth";

const bodySchema = z.object({
  conceptId: z.string().min(1),
  title: z.string().min(1),
  explanation: z.string().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.MUSIC_ENGINE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Music engine is not configured (MUSIC_ENGINE_URL)" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const res = await fetch(`${baseUrl}/generate-song`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const text = await res.text();
    let json: unknown;
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      return NextResponse.json(
        { error: "Music engine returned non-JSON", status: res.status },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status >= 400 ? res.status : 502 });
    }

    return NextResponse.json(json);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upstream request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
