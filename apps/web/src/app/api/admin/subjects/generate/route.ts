import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth";
import { getAIProvider } from "@mindorbit/ai";

const generateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

/** POST: Generate subject structure (clusters, concepts, edges) via AI. Preview only, no DB write. */
export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const provider = getAIProvider();
    const structure = await provider.generateSubjectStructure(
      parsed.data.title,
      parsed.data.description
    );
    return NextResponse.json(structure);
  } catch (err) {
    console.error("Subject generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate subject structure" },
      { status: 500 }
    );
  }
}
