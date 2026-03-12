import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@mindorbit/db";
import type { Node, Edge } from "reactflow";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId } = await params;
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      conceptNodes: {
        include: { cluster: true },
        orderBy: { orderIndex: "asc" },
      },
      conceptEdges: true,
    },
  });

  if (!subject) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const nodes: Node[] = subject.conceptNodes.map((n) => ({
    id: n.id,
    type: "admin",
    position: n.positionX != null && n.positionY != null
      ? { x: n.positionX, y: n.positionY }
      : { x: 0, y: 0 },
    data: {
      label: n.title,
      cluster: n.cluster.title,
      difficulty: n.difficulty,
      status: n.status,
    },
  }));

  const positions = new Map(nodes.map((n) => [n.id, n.position]));
  const padding = 180;
  const rowHeight = 80;
  const clustersOrdered = [...new Map(
    subject.conceptNodes
      .sort((a, b) => a.cluster.orderIndex - b.cluster.orderIndex)
      .map((n) => [n.clusterId, n.clusterId] as const)
  ).values()];
  const clusterOrderIndex = new Map(clustersOrdered.map((id, i) => [id, i]));

  subject.conceptNodes.forEach((n) => {
    const node = nodes.find((x) => x.id === n.id);
    if (!node || (node.position.x !== 0 || node.position.y !== 0)) return;
    const clusterIdx = clusterOrderIndex.get(n.clusterId) ?? 0;
    const clusterOffset = clusterIdx * (rowHeight * 3);
    const idxInCluster = subject.conceptNodes
      .filter((x) => x.clusterId === n.clusterId)
      .findIndex((x) => x.id === n.id);
    const x = idxInCluster % 5;
    const y = Math.floor(idxInCluster / 5);
    node.position = {
      x: x * padding,
      y: clusterOffset + y * rowHeight,
    };
    positions.set(n.id, node.position);
  });

  const edges: Edge[] = subject.conceptEdges
    .filter((e) => e.status !== "archived")
    .map((e) => ({
      id: e.id,
      source: e.sourceNodeId,
      target: e.targetNodeId,
      data: { relationshipType: e.relationshipType, weight: e.weight },
    }));

  return NextResponse.json({
    nodes,
    edges,
    clusters: subject.conceptNodes.reduce((acc, n) => {
      if (!acc[n.cluster.title]) acc[n.cluster.title] = n.clusterId;
      return acc;
    }, {} as Record<string, string>),
  });
}
