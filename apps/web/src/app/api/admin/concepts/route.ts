import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");
  const clusterId = searchParams.get("clusterId");

  const concepts = await prisma.conceptNode.findMany({
    where: {
      ...(subjectId && { subjectId }),
      ...(clusterId && { clusterId }),
    },
    orderBy: [{ orderIndex: "asc" }, { title: "asc" }],
    include: {
      subject: { select: { title: true } },
      cluster: { select: { title: true } },
      _count: {
        select: { diagnosticQuestions: true, inEdges: true, outEdges: true },
      },
    },
  });
  return NextResponse.json(concepts);
}
