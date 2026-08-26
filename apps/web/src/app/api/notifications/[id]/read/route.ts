import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.notification.updateMany({
    where: { id, userId: session.user.id },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
