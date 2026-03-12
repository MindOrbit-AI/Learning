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
      className="rounded-xl border-2 px-4 py-2 shadow-sm"
      style={{
        backgroundColor: `${color}20`,
        borderColor: color,
        minWidth: 120,
      }}
    >
      <div className="text-center text-sm font-medium">{data.label}</div>
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
        <p className="text-muted-foreground">Loading mastery map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mastery Map</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode("graph")}
            className={`rounded-lg px-3 py-1 text-sm ${
              viewMode === "graph" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Graph
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-lg px-3 py-1 text-sm ${
              viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <span className="flex items-center gap-1 text-xs">
          <span className="h-3 w-3 rounded-full" style={{ background: nodeColors.mastered }} />
          Mastered
        </span>
        <span className="flex items-center gap-1 text-xs">
          <span className="h-3 w-3 rounded-full" style={{ background: nodeColors.weak }} />
          Weak
        </span>
        <span className="flex items-center gap-1 text-xs">
          <span className="h-3 w-3 rounded-full" style={{ background: nodeColors.missing }} />
          Missing
        </span>
        <span className="flex items-center gap-1 text-xs">
          <span className="h-3 w-3 rounded-full" style={{ background: nodeColors.learning }} />
          Learning
        </span>
        <span className="flex items-center gap-1 text-xs">
          <span className="h-3 w-3 rounded-full" style={{ background: nodeColors.untouched }} />
          Untouched
        </span>
      </div>

      <div className="flex gap-6">
        <div className={`flex-1 ${viewMode === "graph" ? "" : "hidden"}`}>
          <div className="h-[600px] rounded-2xl border bg-card">
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
            {nodes.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedNode(n.id)}
                className={`w-full rounded-xl border p-4 text-left ${
                  selectedNode === n.id ? "border-primary bg-primary/10" : ""
                }`}
              >
                <span className="font-medium">{n.data.label}</span>
                <span
                  className="ml-2 rounded-full px-2 py-0.5 text-xs"
                  style={{
                    backgroundColor: `${nodeColors[(n.data.state as string) ?? "untouched"]}30`,
                  }}
                >
                  {(n.data.state as string) ?? "untouched"}
                </span>
              </button>
            ))}
          </div>
        )}

        {selectedNode && details ? (
          <div className="w-80 shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {(details as { title?: string }).title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {(details as { description?: string }).description}
                </p>
                <p className="text-xs">
                  State:{" "}
                  <span
                    className="rounded-full px-2 py-0.5"
                    style={{
                      backgroundColor: `${nodeColors[(details as { state?: string }).state ?? "untouched"]}30`,
                    }}
                  >
                    {(details as { state?: string }).state ?? "untouched"}
                  </span>
                </p>
                {(details as { mastery?: number }).mastery != null && (
                  <p className="text-sm">Mastery: {(details as { mastery: number }).mastery}%</p>
                )}
                {(() => {
                  const res = (details as { resources?: Array<{ title: string; id: string }> }).resources ?? [];
                  return res.length > 0 ? (
                    <div>
                      <p className="mb-2 text-sm font-medium">Resources</p>
                      <div className="space-y-1">
                        {res.map((r) => (
                          <a
                            key={r.id}
                            href={`/community/${r.id}`}
                            className="block text-sm text-primary hover:underline"
                          >
                            {r.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
