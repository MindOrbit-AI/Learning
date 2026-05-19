"use client";

import { motion } from "framer-motion";

type ChainNode = { id: string; label: string; x: number; y: number; weak?: boolean; collapsed?: boolean };

type Chain = {
  title: string;
  nodes: ChainNode[];
  edges: [string, string][];
};

const CHAINS: Chain[] = [
  {
    title: "Math",
    nodes: [
      { id: "f", label: "Fractions", x: 14, y: 50, weak: true },
      { id: "r", label: "Ratios", x: 38, y: 32 },
      { id: "e", label: "Expressions", x: 58, y: 42 },
      { id: "a", label: "Algebra", x: 78, y: 28, collapsed: true },
    ],
    edges: [
      ["f", "r"],
      ["r", "e"],
      ["e", "a"],
    ],
  },
  {
    title: "Reading → Science",
    nodes: [
      { id: "rc", label: "Reading comp.", x: 14, y: 50, weak: true },
      { id: "v", label: "Vocabulary", x: 38, y: 34 },
      { id: "i", label: "Inference", x: 58, y: 44 },
      { id: "s", label: "Science confidence", x: 78, y: 30, collapsed: true },
    ],
    edges: [
      ["rc", "v"],
      ["v", "i"],
      ["i", "s"],
    ],
  },
];

function ChainGraph({ chain }: { chain: Chain }) {
  const nodeById = Object.fromEntries(chain.nodes.map((n) => [n.id, n]));
  const gradId = `collapseGrad-${chain.title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
        {chain.title}
      </p>
      <svg viewBox="0 0 100 70" className="mt-2 h-auto w-full" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(248,113,113,0.55)" />
            <stop offset="100%" stopColor="rgba(248,113,113,0.15)" />
          </linearGradient>
        </defs>

        {chain.edges.map(([from, to], i) => {
          const A = nodeById[from]!;
          const B = nodeById[to]!;
          const weakLink = A.weak;

          return (
            <motion.line
              key={`${from}-${to}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke={weakLink ? `url(#${gradId})` : "rgba(113,113,122,0.45)"}
              strokeWidth={weakLink ? 0.5 : 0.35}
              strokeDasharray={weakLink ? "1.5 1" : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: weakLink ? [0.45, 1, 0.45] : 0.7 }}
              transition={{
                duration: 2.4,
                delay: 0.15 + i * 0.12,
                repeat: weakLink ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {chain.nodes.map((n, i) => (
          <g key={n.id}>
            {n.weak && (
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={6}
                fill="none"
                stroke="rgba(248,113,113,0.45)"
                strokeWidth={0.2}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.9, 1.25, 1.3] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={n.collapsed ? 2.2 : 2.6}
              fill={
                n.weak
                  ? "rgb(248, 113, 113)"
                  : n.collapsed
                    ? "rgb(82, 82, 91)"
                    : "rgb(113, 113, 122)"
              }
              initial={{ opacity: 0.4 }}
              animate={{
                opacity: n.collapsed ? [0.35, 0.2, 0.35] : 1,
                scale: n.weak ? [0.95, 1.1, 0.95] : 1,
              }}
              transition={{
                duration: n.weak ? 2.2 : 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.08,
              }}
            />
            <text
              x={n.x}
              y={n.y + (n.collapsed ? 11 : 10)}
              textAnchor="middle"
              className="fill-zinc-400 text-[4.5px] font-medium"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function DependencyCollapseVisual() {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {CHAINS.map((chain) => (
        <ChainGraph key={chain.title} chain={chain} />
      ))}
    </motion.div>
  );
}
