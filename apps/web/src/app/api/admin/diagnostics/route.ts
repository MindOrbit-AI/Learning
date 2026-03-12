import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");
  const nodeId = searchParams.get("nodeId");
  const status = searchParams.get("status");

  const questions = await prisma.diagnosticQuestion.findMany({
    where: {
      ...(subjectId && { subjectId }),
      ...(nodeId && { nodeId }),
      ...(status && { status: status as "draft" | "published" | "archived" }),
    },
    orderBy: { prompt: "asc" },
    include: {
      node: { select: { title: true, slug: true } },
      subject: { select: { title: true } },
    },
  });
  return NextResponse.json(questions);
}
