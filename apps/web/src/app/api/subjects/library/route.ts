import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";

const bodySchema = z.object({
  subjectId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const subject = await prisma.subject.findUnique({
    where: { id: parsed.data.subjectId },
    select: { id: true, createdById: true, status: true },
  });
  if (!subject || subject.status !== "published" || subject.createdById == null) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });
  }
  if (subject.createdById === session.user.id) {
    return NextResponse.json({ error: "You already own this subject" }, { status: 400 });
  }

  await prisma.userSubjectAdd.upsert({
    where: {
      userId_subjectId: { userId: session.user.id, subjectId: subject.id },
    },
    create: { userId: session.user.id, subjectId: subject.id },
    update: {},
  });

  return NextResponse.json({ ok: true });
}
