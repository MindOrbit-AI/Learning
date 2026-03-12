"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  BackgroundVariant,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button, cn } from "@mindorbit/ui";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";

function AdminNode({ data }: { data: { label: string; cluster?: string; difficulty?: string; status?: string } }) {
  return (
    <div className="min-w-[140px] rounded-xl border-2 border-slate-300 bg-white px-4 py-3 shadow-md dark:border-slate-600 dark:bg-slate-900">
      <div className="font-medium text-slate-900 dark:text-slate-100">{data.label}</div>
      {data.cluster && (
        <div className="mt-1 text-xs text-slate-500">{data.cluster}</div>
      )}
      <div className="mt-2 flex items-center gap-2">
        {data.status && <PublishStatusBadge status={data.status} />}
        {data.difficulty && (
          <span className="text-xs text-slate-400">{data.difficulty}</span>
        )}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = { admin: AdminNode };

export function MasteryMapBuilder({ subjectId, subjectTitle }: { subjectId: string; subjectTitle: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/admin/mastery-map/${subjectId}`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    setNodes(data.nodes);
    setEdges(data.edges);
  }, [subjectId, setNodes, setEdges]);

  useEffect(() => {
    fetchData()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchData]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      fetch(`/api/admin/mastery-map/${subjectId}/edges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceNodeId: params.source,
          targetNodeId: params.target,
        }),
      }).then(() => fetchData());
    },
    [subjectId, setEdges, fetchData]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const positions = { [node.id]: { x: node.position.x, y: node.position.y } };
      fetch(`/api/admin/mastery-map/${subjectId}/layout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positions }),
      });
    },
    [subjectId]
  );

  const handleSaveLayout = async () => {
    setSaving(true);
    const positions = Object.fromEntries(
      nodes.map((n) => [n.id, { x: n.position.x, y: n.position.y }])
    );
    await fetch(`/api/admin/mastery-map/${subjectId}/layout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ positions }),
    });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <p className="text-slate-500">Loading mastery map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{subjectTitle}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode((v) => (v === "graph" ? "list" : "graph"))}
          >
            {viewMode === "graph" ? "List View" : "Graph View"}
          </Button>
          <Button size="sm" onClick={handleSaveLayout} disabled={saving}>
            {saving ? "Saving..." : "Save Layout"}
          </Button>
        </div>
      </div>

      <div className={cn("h-[600px] rounded-xl border bg-white dark:bg-slate-950", viewMode === "list" && "hidden")}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          connectOnClick
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
          <Panel position="top-left" className="rounded-lg bg-white/90 p-2 dark:bg-slate-900/90">
            <p className="text-xs text-slate-500">
              Drag nodes to reposition. Click and drag from a node to another to create an edge.
            </p>
          </Panel>
        </ReactFlow>
      </div>

      {viewMode === "list" && (
        <div className="space-y-2">
          {nodes.map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800"
            >
              <span className="font-medium">{(n.data as { label?: string }).label}</span>
              <PublishStatusBadge status={(n.data as { status?: string }).status ?? "draft"} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
