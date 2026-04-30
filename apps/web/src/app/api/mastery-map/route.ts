import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { featureGateService } from "@/features/billing/feature-gate.service";
import { MASTERY_MAP_FREE_NODE_THRESHOLD } from "@mindorbit/lib";
import { subjectVisibilityWhere } from "@/lib/subject-visibility";
import {
  algebraEdges,
  biologyEdges,
  chemistryEdges,
  computerScienceEdges,
  physicsEdges,
  satMathEdges,
} from "@mindorbit/content";
import type { Node, Edge } from "reactflow";

const CONTENT_EDGES: Record<string, Array<{ source: string; target: string }>> = {
  algebra: algebraEdges,
  biology: biologyEdges,
  chemistry: chemistryEdges,
  "computer-science": computerScienceEdges,
  physics: physicsEdges,
  "sat-math": satMathEdges,
};

export async function GET(req: Request) {
  const session = await getServerSession();
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");

  const visibilityWhere = subjectVisibilityWhere(session?.user?.id as string | undefined);
  let subjects = await prisma.subject.findMany({
    where: subjectId
      ? { id: subjectId, ...visibilityWhere }
      : visibilityWhere,
    include: {
      conceptNodes: {
        include: { cluster: true },
        orderBy: { orderIndex: "asc" },
      },
      conceptEdges: true,
    },
  });

  if (subjects.length === 0) {
    return NextResponse.json({
      nodes: [],
      edges: [],
      nodeDetails: {},
      masteryMapAccess: "full" as const,
      lockedNodeIds: [] as string[],
    });
  }

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { planTier: true, bonusProUntil: true },
      })
    : null;
  const accessLevel = featureGateService.getMasteryMapAccessLevel(user);
  const lockedNodeIds: string[] = [];

  const userNodeStates = session?.user?.id
    ? await prisma.userNodeState.findMany({
        where: {
          userId: session.user.id,
          subjectId: { in: subjects.map((s) => s.id) },
        },
      })
    : [];
  const stateMap = new Map(userNodeStates.map((s) => [s.nodeId, s]));

  const missions =
    session?.user?.id
      ? await prisma.mission.findMany({
          where: {
            userId: session.user.id,
            nodeId: { in: subjects.flatMap((s) => s.conceptNodes.map((n) => n.id)) },
            status: { in: ["not_started", "in_progress"] },
          },
          select: { nodeId: true, id: true },
        })
      : [];
  const missionByNode = new Map(missions.map((m) => [m.nodeId, m.id]));

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodeDetails: Record<string, unknown> = {};
  const positions = new Map<string, { x: number; y: number }>();
  const clusterRows = new Map<string, number[]>();

  let yOffset = 0;
  const edgeIdCounter = { count: 0 };
  const makeEdgeId = () => `fallback-${edgeIdCounter.count++}`;

  for (const subject of subjects) {
    const clusters = [...new Set(subject.conceptNodes.map((n) => n.clusterId))];
    const clusterOrder = subject.conceptNodes
      .reduce((acc: string[], n) => {
        if (!acc.includes(n.clusterId)) acc.push(n.clusterId);
        return acc;
      }, [])
      .filter(Boolean);

    const nodeWidth = 160;
    const nodeHeight = 56;
    const horizontalGap = 100;
    const levelGap = 120;
    const labelHeight = 40;
    const clusterNodeIds = new Map<string, string[]>();

    const subjectLabelId = `subject-label-${subject.id}`;
    nodes.push({
      id: subjectLabelId,
      type: "subjectLabel",
      position: { x: 0, y: yOffset },
      data: { label: subject.title, color: subject.color, icon: subject.icon },
      selectable: false,
      draggable: false,
    });
    positions.set(subjectLabelId, { x: 0, y: yOffset });
    yOffset += labelHeight;

    for (const clusterIdx of clusterOrder.keys()) {
      const clusterId = clusterOrder[clusterIdx];
      if (!clusterId) continue;
      const clusterNodes = subject.conceptNodes
        .filter((n) => n.clusterId === clusterId)
        .sort((a, b) => a.orderIndex - b.orderIndex);
      clusterNodeIds.set(clusterId, clusterNodes.map((n) => n.id));

      const levelY = yOffset + clusterIdx * (levelGap + nodeHeight);
      const startX = 0;

      for (let i = 0; i < clusterNodes.length; i++) {
        const n = clusterNodes[i];
        if (!n) continue;
        const state = stateMap.get(n.id);
        const nodeX = startX + i * (nodeWidth + horizontalGap);
        const pos = { x: nodeX, y: levelY };
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
          difficulty: n.difficulty,
          state: state?.state ?? "untouched",
          mastery: state?.mastery,
          resources,
          missionId: missionByNode.get(n.id) ?? null,
          subjectTitle: subject.title,
          subjectIcon: subject.icon ?? undefined,
        };

      }
    }
    yOffset += clusterOrder.length * (levelGap + nodeHeight) + levelGap;

    const getHandles = (sx: number, sy: number, tx: number, ty: number) => {
      const dx = tx - sx;
      const dy = ty - sy;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (absDy > absDx) {
        if (dy > 0) return { sourceHandle: "bottom-src" as const, targetHandle: "top" as const };
        return { sourceHandle: "top-src" as const, targetHandle: "bottom" as const };
      } else {
        if (dx > 0) return { sourceHandle: "right-src" as const, targetHandle: "left" as const };
        return { sourceHandle: "left-src" as const, targetHandle: "right" as const };
      }
    };

    const pushEdge = (id: string, sourceId: string, targetId: string) => {
      const sp = positions.get(sourceId);
      const tp = positions.get(targetId);
      if (!sp || !tp) return;
      const handles = getHandles(sp.x, sp.y, tp.x, tp.y);
      edges.push({
        id,
        source: sourceId,
        target: targetId,
        type: "smoothstep",
        ...handles,
      });
    };

    for (const e of subject.conceptEdges) {
      pushEdge(e.id, e.sourceNodeId, e.targetNodeId);
    }

    // Fallback: when no edges in DB, use content-defined edges or sequential within clusters
    if (subject.conceptEdges.length === 0) {
      const slugToId = new Map(subject.conceptNodes.map((n) => [n.slug, n.id]));
      const contentEdges = CONTENT_EDGES[subject.slug];

      if (contentEdges?.length) {
        for (const e of contentEdges) {
          const sourceId = slugToId.get(e.source);
          const targetId = slugToId.get(e.target);
          if (sourceId && targetId) pushEdge(makeEdgeId(), sourceId, targetId);
        }
      } else {
        for (const [, nodeIds] of clusterNodeIds) {
          for (let i = 0; i < nodeIds.length - 1; i++) {
            const source = nodeIds[i];
            const target = nodeIds[i + 1];
            if (source && target) pushEdge(makeEdgeId(), source, target);
          }
        }
      }
    }
  }

  if (accessLevel === "limited") {
    const masteryNodeIds = nodes
      .filter((n) => n.type !== "subjectLabel")
      .map((n) => n.id);
    const unlocked = masteryNodeIds.slice(0, MASTERY_MAP_FREE_NODE_THRESHOLD);
    masteryNodeIds.forEach((id) => {
      if (!unlocked.includes(id)) lockedNodeIds.push(id);
    });
  }

  const lockedSet = new Set(lockedNodeIds);
  const adjacency = new Map<string, Set<string>>();
  for (const e of edges) {
    if (e.source === e.target) continue;
    if (!adjacency.has(e.source)) adjacency.set(e.source, new Set());
    if (!adjacency.has(e.target)) adjacency.set(e.target, new Set());
    adjacency.get(e.source)!.add(e.target);
    adjacency.get(e.target)!.add(e.source);
  }

  const suggestStates = new Set(["weak", "missing", "learning"]);
  const stateOrder: Record<string, number> = { missing: 0, weak: 1, learning: 2 };

  for (const nodeId of Object.keys(nodeDetails)) {
    const neighborIds = [...(adjacency.get(nodeId) ?? [])].filter((id) => !lockedSet.has(id));
    const picks = neighborIds
      .map((nid) => {
        const d = nodeDetails[nid] as { title?: string; state?: string } | undefined;
        if (!d?.state || !suggestStates.has(d.state)) return null;
        return { nodeId: nid, title: d.title ?? "Concept", state: d.state };
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
      .sort((a, b) => (stateOrder[a.state] ?? 9) - (stateOrder[b.state] ?? 9))
      .slice(0, 4);
    (nodeDetails[nodeId] as { chainSuggestions?: typeof picks }).chainSuggestions = picks;
  }

  return NextResponse.json({
    nodes,
    edges,
    nodeDetails,
    masteryMapAccess: accessLevel,
    lockedNodeIds,
  });
}
