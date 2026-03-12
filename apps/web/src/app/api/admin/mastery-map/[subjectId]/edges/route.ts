import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";
import { writeAuditLog } from "@/lib/audit";

const createEdgeSchema = z.object({
  sourceNodeId: z.string(),
  targetNodeId: z.string(),
  relationshipType: z.enum(["prerequisite", "related", "extends"]).default("prerequisite"),
  weight: z.number().default(1),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId } = await params;
  const body = await req.json();
  const parsed = createEdgeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { sourceNodeId, targetNodeId } = parsed.data;
  if (sourceNodeId === targetNodeId) {
    return NextResponse.json({ error: "Self-loops are not allowed" }, { status: 400 });
  }

  const [source, target] = await Promise.all([
    prisma.conceptNode.findFirst({ where: { id: sourceNodeId, subjectId } }),
    prisma.conceptNode.findFirst({ where: { id: targetNodeId, subjectId } }),
  ]);
  if (!source || !target) {
    return NextResponse.json({ error: "Source or target node not found" }, { status: 404 });
  }

  const existing = await prisma.conceptEdge.findUnique({
    where: {
      subjectId_sourceNodeId_targetNodeId: { subjectId, sourceNodeId, targetNodeId },
    },
  });
  if (existing) {
    return NextResponse.json({ error: "Edge already exists" }, { status: 409 });
  }

  const edge = await prisma.conceptEdge.create({
    data: {
      subjectId,
      sourceNodeId,
      targetNodeId,
      relationshipType: parsed.data.relationshipType,
      weight: parsed.data.weight,
    },
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    entityType: "ConceptEdge",
    entityId: edge.id,
    action: "create",
    after: edge,
  });

  return NextResponse.json(edge);
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const edgeId = searchParams.get("edgeId");
  if (!edgeId) return NextResponse.json({ error: "edgeId required" }, { status: 400 });

  const edge = await prisma.conceptEdge.findUnique({ where: { id: edgeId } });
  if (!edge) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.conceptEdge.delete({ where: { id: edgeId } });

  await writeAuditLog({
    actorUserId: session.user.id,
    entityType: "ConceptEdge",
    entityId: edgeId,
    action: "delete",
    before: edge,
  });

  return NextResponse.json({ success: true });
}
