import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";
import { writeAuditLog } from "@/lib/audit";

const updateSubjectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  gradeBand: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  orderIndex: z.number().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      clusters: { orderBy: { orderIndex: "asc" } },
      _count: {
        select: {
          conceptNodes: true,
          conceptEdges: true,
          diagnosticQuestions: true,
          resources: true,
        },
      },
    },
  });
  if (!subject) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(subject);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.subject.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = updateSubjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const subject = await prisma.subject.update({
    where: { id },
    data: {
      ...parsed.data,
      updatedById: session.user.id,
      ...(parsed.data.status === "published" && { version: { increment: 1 } }),
    },
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    entityType: "Subject",
    entityId: id,
    action: "update",
    before: existing,
    after: subject,
  });

  return NextResponse.json(subject);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.subject.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.subject.update({
    where: { id },
    data: { status: "archived", updatedById: session.user.id },
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    entityType: "Subject",
    entityId: id,
    action: "archive",
    before: existing,
  });

  return NextResponse.json({ success: true });
}
