"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  NodeTypes,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@mindorbit/ui";
import { NODE_STATE_COLORS } from "@mindorbit/lib";
import { GenerateMissionButton } from "./generate-mission-button";
import type { NodeState } from "@mindorbit/types";

const nodeColors: Record<string, string> = {
  mastered: NODE_STATE_COLORS.mastered,
  weak: NODE_STATE_COLORS.weak,
  missing: NODE_STATE_COLORS.missing,
  learning: NODE_STATE_COLORS.learning,
  untouched: NODE_STATE_COLORS.untouched,
};

function MasteryNode({ data }: { data: { label: string; state?: NodeState } }) {
  const state = data.state ?? "untouched";
  const color = nodeColors[state] ?? nodeColors.untouched;
  return (
    <div
      className="flex items-center justify-center rounded-duo border-2 px-5 py-3 font-semibold shadow-lg transition-transform hover:scale-105"
      style={{
        backgroundColor: `${color}15`,
        borderColor: color,
        minWidth: 140,
        minHeight: 48,
        boxShadow: `0 4px 14px ${color}40`,
      }}
    >
      <div className="text-center text-sm">{data.label}</div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  mastery: MasteryNode,
};

async function fetchMapData(subjectId?: string, userId?: string) {
  const params = new URLSearchParams();
  if (subjectId) params.set("subjectId", subjectId);
  if (userId) params.set("userId", userId);
  const res = await fetch(`/api/mastery-map?${params}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function MasteryMapClient() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subject");
  const selectedNodeId = searchParams.get("node");
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeDetails, setNodeDetails] = useState<Record<string, unknown>>({});
  const [selectedNode, setSelectedNode] = useState<string | null>(selectedNodeId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData(subjectId || undefined, undefined)
      .then((data: { nodes: Node[]; edges: Edge[]; nodeDetails: Record<string, unknown> }) => {
        setNodes(data.nodes);
        setEdges(data.edges);
        setNodeDetails(data.nodeDetails ?? {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [subjectId, setNodes, setEdges]);

  useEffect(() => {
    setSelectedNode(selectedNodeId);
  }, [selectedNodeId]);

  const onNodeClick = useCallback((_e: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const details = selectedNode ? nodeDetails[selectedNode] : null;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-full bg-primary/30" />
          <p className="text-muted-foreground font-medium">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Mastery Map</h1>
          <p className="text-muted-foreground mt-1">Track your progress through concepts</p>
        </div>
        <div className="flex rounded-duo bg-muted/80 p-1">
          <button
            type="button"
            onClick={() => setViewMode("graph")}
            className={`rounded-duo px-5 py-2 text-sm font-semibold transition-all ${
              viewMode === "graph"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Path
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-duo px-5 py-2 text-sm font-semibold transition-all ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl border-2 border-primary/20 bg-primary/5 p-4">
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="h-4 w-4 rounded-full shadow-sm" style={{ background: nodeColors.mastered }} />
          Mastered
        </span>
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="h-4 w-4 rounded-full shadow-sm" style={{ background: nodeColors.weak }} />
          Weak
        </span>
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="h-4 w-4 rounded-full shadow-sm" style={{ background: nodeColors.missing }} />
          Missing
        </span>
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="h-4 w-4 rounded-full shadow-sm" style={{ background: nodeColors.learning }} />
          Learning
        </span>
        <span className="flex items-center gap-2 text-sm font-medium">
          <span className="h-4 w-4 rounded-full shadow-sm" style={{ background: nodeColors.untouched }} />
          Untouched
        </span>
      </div>

      <div className="flex gap-6">
        <div className={`flex-1 ${viewMode === "graph" ? "" : "hidden"}`}>
          <div className="h-[600px] overflow-hidden rounded-3xl border-2 border-primary/10 bg-gradient-to-br from-primary/5 via-background to-primary/5 shadow-xl">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
            >
              <Background variant={BackgroundVariant.Dots} />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
        </div>

        {viewMode === "list" && (
          <div className="flex-1 space-y-2">
            {nodes.map((n) => {
              const state = (n.data.state as string) ?? "untouched";
              const color = nodeColors[state];
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedNode(n.id)}
                  className={`w-full rounded-2xl border-2 p-4 text-left font-medium transition-all hover:scale-[1.02] ${
                    selectedNode === n.id
                      ? "border-primary bg-primary/15 shadow-lg"
                      : "border-transparent bg-card shadow-sm hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{n.data.label}</span>
                    <span
                      className="rounded-duo px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: `${color}25`,
                        color: color,
                      }}
                    >
                      {state}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedNode && details ? (
          <div className="w-80 shrink-0">
            <Card className="overflow-hidden rounded-3xl border-2 border-primary/10 shadow-xl">
              <CardHeader className="border-b-2 border-primary/10 bg-primary/5">
                <CardTitle className="text-lg font-bold">
                  {(details as { title?: string }).title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  {(details as { description?: string }).description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">State:</span>
                  <span
                    className="rounded-duo px-3 py-1 text-xs font-bold"
                    style={{
                      backgroundColor: `${nodeColors[(details as { state?: string }).state ?? "untouched"]}30`,
                    }}
                  >
                    {(details as { state?: string }).state ?? "untouched"}
                  </span>
                </div>
                {(details as { mastery?: number }).mastery != null && (
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-xs font-semibold text-muted-foreground">Mastery</p>
                    <p className="text-xl font-extrabold text-primary">{(details as { mastery: number }).mastery}%</p>
                  </div>
                )}
                {(() => {
                  const res = (details as { resources?: Array<{ title: string; id: string }> }).resources ?? [];
                  return res.length > 0 ? (
                    <div>
                      <p className="mb-2 text-sm font-bold">Resources</p>
                      <div className="space-y-2">
                        {res.map((r) => (
                          <a
                            key={r.id}
                            href={`/community/${r.id}`}
                            className="block rounded-xl border-2 border-transparent bg-muted/30 px-3 py-2 text-sm font-medium text-primary transition-colors hover:border-primary/30 hover:bg-primary/10"
                          >
                            {r.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
                {(details as { missionId?: string | null }).missionId ? (
                  <a
                    href={`/missions/${(details as { missionId: string }).missionId}`}
                    className="mt-2 block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90"
                  >
                    View Mission →
                  </a>
                ) : selectedNode ? (
                  <GenerateMissionButton nodeId={selectedNode} />
                ) : null}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
