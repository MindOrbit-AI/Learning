"use client";

import { useMemo, useState } from "react";
import { cn } from "@mindorbit/lib";

export type ConceptNode = { id: string; label: string; x: number; y: number };

export type ConceptEdge = { from: string; to: string };

export type ConceptMapProps = {
  nodes: ConceptNode[];
  edges?: ConceptEdge[];
  userEdges: ConceptEdge[];
  onChange: (edges: ConceptEdge[]) => void;
  className?: string;
};

function edgeKey(e: ConceptEdge) {
  return `${e.from}->${e.to}`;
}

export function ConceptMap({ nodes, edges = [], userEdges, onChange, className }: ConceptMapProps) {
  const [pending, setPending] = useState<string | null>(null);

  const byId = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const userSet = useMemo(() => new Set(userEdges.map(edgeKey)), [userEdges]);

  const addEdge = (a: string, b: string) => {
    if (a === b) return;
    const forward = edgeKey({ from: a, to: b });
    const backward = edgeKey({ from: b, to: a });
    if (userSet.has(forward) || userSet.has(backward)) return;
    onChange([...userEdges, { from: a, to: b }]);
  };

  return (
    <div className={cn("relative mx-auto w-full max-w-lg rounded-2xl bg-zinc-900/70 p-4 ring-1 ring-white/10", className)}>
      <p className="mb-3 text-center text-xs text-zinc-400">
        Tap two nodes in order to connect them.
        {pending ? <span className="mt-1 block text-violet-200">Selected: {byId[pending]?.label}</span> : null}
      </p>
      <svg viewBox="0 0 400 260" className="h-64 w-full">
        {edges.map((e, i) => {
          const A = byId[e.from];
          const B = byId[e.to];
          if (!A || !B) return null;
          return (
            <line
              key={`t-${edgeKey(e)}-${i}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={2}
            />
          );
        })}
        {userEdges.map((e, i) => {
          const A = byId[e.from];
          const B = byId[e.to];
          if (!A || !B) return null;
          return (
            <line
              key={`u-${edgeKey(e)}-${i}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="#c084fc"
              strokeWidth={3}
            />
          );
        })}
        {nodes.map((n) => (
          <foreignObject key={n.id} x={n.x - 52} y={n.y - 22} width={104} height={44}>
            <button
              type="button"
              onClick={() => {
                if (!pending) setPending(n.id);
                else {
                  addEdge(pending, n.id);
                  setPending(null);
                }
              }}
              className={cn(
                "w-full rounded-xl border px-2 py-2 text-center text-xs font-semibold transition",
                pending === n.id
                  ? "border-violet-300 bg-violet-500/30 text-white"
                  : "border-white/15 bg-zinc-800/90 text-zinc-100 hover:border-violet-400/50",
              )}
            >
              {n.label}
            </button>
          </foreignObject>
        ))}
      </svg>
    </div>
  );
}
