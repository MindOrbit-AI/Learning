import { NextResponse } from "next/server";
import { prisma } from "@mindorbit/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clusters = await prisma.cluster.findMany({
    where: { subjectId: id },
    select: { id: true, title: true },
    orderBy: { orderIndex: "asc" },
  });
  return NextResponse.json({ clusters });
}
