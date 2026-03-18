import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";
import { writeAuditLog } from "@/lib/audit";

const structureClusterSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string(),
  orderIndex: z.number().default(0),
});

const structureConceptSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string(),
  clusterSlug: z.string(),
  orderIndex: z.number().default(0),
  difficulty: z.string().default("medium"),
});

const structureEdgeSchema = z.object({
  sourceSlug: z.string(),
  targetSlug: z.string(),
  relationshipType: z.enum(["prerequisite", "related", "extends"]).default("prerequisite"),
});

const createSubjectSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string(),
  icon: z.string().default("📚"),
  color: z.string().default("#3B82F6"),
  gradeBand: z.string().optional(),
  structure: z
    .object({
      clusters: z.array(structureClusterSchema),
      concepts: z.array(structureConceptSchema),
      edges: z.array(structureEdgeSchema),
    })
    .optional(),
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
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSubjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.subject.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "Subject with this slug already exists" }, { status: 409 });
  }

  const { structure, ...subjectData } = parsed.data;
  const subject = await prisma.$transaction(async (tx) => {
    const subj = await tx.subject.create({
      data: {
        ...subjectData,
        status: "published",
        createdById: session.user.id,
        updatedById: session.user.id,
      },
    });

    if (structure && structure.clusters.length > 0) {
      const clusterMap: Record<string, string> = {};
      for (const c of structure.clusters) {
        const cluster = await tx.cluster.create({
          data: {
            subjectId: subj.id,
            slug: c.slug,
            title: c.title,
            description: c.description,
            orderIndex: c.orderIndex,
          },
        });
        clusterMap[c.slug] = cluster.id;
      }

      const nodeMap: Record<string, string> = {};
      for (const n of structure.concepts) {
        const clusterId = clusterMap[n.clusterSlug];
        if (!clusterId) continue;
        const node = await tx.conceptNode.create({
          data: {
            subjectId: subj.id,
            clusterId,
            slug: n.slug,
            title: n.title,
            description: n.description,
            difficulty: n.difficulty,
            orderIndex: n.orderIndex,
          },
        });
        nodeMap[n.slug] = node.id;
      }

      for (const e of structure.edges) {
        const sourceId = nodeMap[e.sourceSlug];
        const targetId = nodeMap[e.targetSlug];
        if (!sourceId || !targetId || sourceId === targetId) continue;
        try {
          await tx.conceptEdge.create({
            data: {
              subjectId: subj.id,
              sourceNodeId: sourceId,
              targetNodeId: targetId,
              relationshipType: e.relationshipType,
            },
          });
        } catch {
          // Skip duplicate edges
        }
      }
    }

    return subj;
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    entityType: "Subject",
    entityId: subject.id,
    action: "create",
    after: subject,
  });

  const result = await prisma.subject.findUnique({
    where: { id: subject.id },
    include: {
      _count: { select: { clusters: true, conceptNodes: true, conceptEdges: true } },
    },
  });
  return NextResponse.json(result ?? subject);
}
