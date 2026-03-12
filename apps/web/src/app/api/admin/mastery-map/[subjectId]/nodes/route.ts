import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";
import { writeAuditLog } from "@/lib/audit";

const createNodeSchema = z.object({
  clusterId: z.string(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().default(""),
  difficulty: z.string().default("medium"),
  orderIndex: z.number().default(0),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId } = await params;
  const body = await req.json();
  const parsed = createNodeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const clusterExists = await prisma.cluster.findFirst({
    where: { id: parsed.data.clusterId, subjectId },
  });
  if (!clusterExists) {
    return NextResponse.json({ error: "Cluster not found" }, { status: 404 });
  }

  const existing = await prisma.conceptNode.findUnique({
    where: { subjectId_slug: { subjectId, slug: parsed.data.slug } },
  });
  if (existing) {
    return NextResponse.json({ error: "Concept with this slug already exists in subject" }, { status: 409 });
  }

  const node = await prisma.conceptNode.create({
    data: {
      subjectId,
      clusterId: parsed.data.clusterId,
      slug: parsed.data.slug,
      title: parsed.data.title,
      description: parsed.data.description,
      difficulty: parsed.data.difficulty,
      orderIndex: parsed.data.orderIndex,
    },
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    entityType: "ConceptNode",
    entityId: node.id,
    action: "create",
    after: node,
  });

  return NextResponse.json(node);
}
