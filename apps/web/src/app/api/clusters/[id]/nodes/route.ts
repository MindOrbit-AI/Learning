import { NextResponse } from "next/server";
import { prisma } from "@mindorbit/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const nodes = await prisma.conceptNode.findMany({
    where: { clusterId: id },
    select: { id: true, title: true },
    orderBy: { orderIndex: "asc" },
  });
  return NextResponse.json({ nodes });
}
