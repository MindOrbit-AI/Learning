import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const resources = await prisma.resource.findMany({
    where: status ? { status: status as "pending" | "approved" | "rejected" | "flagged" | "archived" } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      node: { select: { title: true } },
      subject: { select: { title: true } },
    },
  });
  return NextResponse.json(resources);
}
