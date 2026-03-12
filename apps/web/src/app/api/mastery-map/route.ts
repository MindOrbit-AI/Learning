import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import type { Node, Edge } from "reactflow";

export async function GET(req: Request) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");

  let subjects = await prisma.subject.findMany({
    where: subjectId ? { id: subjectId } : undefined,
    include: {
      conceptNodes: {
        include: { cluster: true },
        orderBy: { orderIndex: "asc" },
      },
      conceptEdges: true,
    },
  });

  if (subjects.length === 0) {
    return NextResponse.json({ nodes: [], edges: [], nodeDetails: {} });
  }

  const userNodeStates = session?.user?.id
    ? await prisma.userNodeState.findMany({
        where: {
          userId: session.user.id,
          subjectId: { in: subjects.map((s) => s.id) },
        },
      })
    : [];
  const stateMap = new Map(userNodeStates.map((s) => [s.nodeId, s]));

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodeDetails: Record<string, unknown> = {};
  const positions = new Map<string, { x: number; y: number }>();
  const clusterRows = new Map<string, number[]>();

  let yOffset = 0;
  for (const subject of subjects) {
    const clusters = [...new Set(subject.conceptNodes.map((n) => n.clusterId))];
    const clusterOrder = subject.conceptNodes
      .reduce((acc: string[], n) => {
        if (!acc.includes(n.clusterId)) acc.push(n.clusterId);
        return acc;
      }, [])
      .filter(Boolean);

    let x = 0;
    let y = 0;
    const padding = 180;
    const rowHeight = 80;

    for (const clusterId of clusterOrder) {
      const clusterNodes = subject.conceptNodes.filter((n) => n.clusterId === clusterId);
      for (let i = 0; i < clusterNodes.length; i++) {
        const n = clusterNodes[i];
        if (!n) continue;
        const state = stateMap.get(n.id);
        const pos = { x: x * padding, y: yOffset + y * rowHeight };
        positions.set(n.id, pos);
        nodes.push({
          id: n.id,
          type: "mastery",
          position: pos,
          data: {
            label: n.title,
            state: state?.state ?? "untouched",
          },
        });

        const resources = await prisma.resource.findMany({
          where: { nodeId: n.id },
          select: { id: true, title: true },
          take: 3,
        });

        nodeDetails[n.id] = {
          title: n.title,
          description: n.description,
          state: state?.state ?? "untouched",
          mastery: state?.mastery,
          resources,
        };

        x += 1;
        if (x > 4) {
          x = 0;
          y += 1;
        }
      }
      y += 1;
    }
    yOffset += (clusterOrder.length + 1) * rowHeight;

    for (const e of subject.conceptEdges) {
      const sp = positions.get(e.sourceNodeId);
      const tp = positions.get(e.targetNodeId);
      if (sp && tp) {
        edges.push({
          id: e.id,
          source: e.sourceNodeId,
          target: e.targetNodeId,
        });
      }
    }
  }

  return NextResponse.json({ nodes, edges, nodeDetails });
}
