import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth";
import { fetchArenaQuestions } from "@/services/concept-arena-service";
import type { ArenaCategory } from "@/features/concept-arena/arena-fallback-questions";

const categorySchema = z.enum(["math", "science", "business", "coding", "mixed"]);

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const categoryRaw = searchParams.get("category") ?? "mixed";
  const countRaw = searchParams.get("count") ?? "8";

  const category = categorySchema.safeParse(categoryRaw);
  if (!category.success) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const count = Math.min(20, Math.max(3, parseInt(countRaw, 10) || 8));

  const questions = await fetchArenaQuestions(
    session.user.id,
    category.data as ArenaCategory,
    count
  );

  return NextResponse.json({ questions });
}
