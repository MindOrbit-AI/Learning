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
  await prisma.resourceSave.upsert({
    where: {
      resourceId_userId: { resourceId: id, userId: session.user.id },
    },
    create: { resourceId: id, userId: session.user.id },
    update: {},
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.resourceSave.deleteMany({
    where: {
      resourceId: id,
      userId: session.user.id,
    },
  });
  return NextResponse.json({ ok: true });
}
