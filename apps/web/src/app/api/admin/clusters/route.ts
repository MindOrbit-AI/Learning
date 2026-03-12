import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");

  const clusters = await prisma.cluster.findMany({
    where: subjectId ? { subjectId } : undefined,
    orderBy: [{ orderIndex: "asc" }, { title: "asc" }],
    include: {
      subject: { select: { title: true, slug: true } },
      _count: { select: { conceptNodes: true } },
    },
  });
  return NextResponse.json(clusters);
}
