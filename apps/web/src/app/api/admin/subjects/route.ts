import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";
import { writeAuditLog } from "@/lib/audit";

const createSubjectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string(),
  icon: z.string().default("📚"),
  color: z.string().default("#3B82F6"),
  gradeBand: z.string().optional(),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subjects = await prisma.subject.findMany({
    orderBy: [{ orderIndex: "asc" }, { title: "asc" }],
    include: {
      _count: {
        select: {
          clusters: true,
          conceptNodes: true,
          conceptEdges: true,
          diagnosticQuestions: true,
        },
      },
    },
  });
  return NextResponse.json(subjects);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSubjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.subject.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "Subject with this slug already exists" }, { status: 409 });
  }

  const subject = await prisma.subject.create({
    data: {
      ...parsed.data,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    entityType: "Subject",
    entityId: subject.id,
    action: "create",
    after: subject,
  });

  return NextResponse.json(subject);
}
