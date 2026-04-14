"use client";

import { motion } from "framer-motion";

const NODES: { x: number; y: number }[] = [
  { x: 18, y: 38 },
  { x: 38, y: 22 },
  { x: 58, y: 18 },
  { x: 82, y: 32 },
  { x: 72, y: 52 },
  { x: 50, y: 48 },
  { x: 28, y: 58 },
  { x: 48, y: 72 },
  { x: 68, y: 78 },
  { x: 88, y: 62 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [1, 5],
  [2, 5],
  [4, 5],
  [5, 6],
  [5, 7],
  [4, 9],
  [7, 8],
  [3, 4],
  [0, 6],
];

export function MasteryMapVisual() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_-24px_rgba(0,0,0,0.8)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(163,230,53,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4))]" />

      <div className="relative flex h-full flex-col">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            Mastery map
          </span>
          <motion.span
            className="font-mono text-[10px] text-zinc-400"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            Live
          </motion.span>
        </div>

        <svg
          viewBox="0 0 100 100"
          className="h-auto w-full flex-1"
          aria-hidden
        >
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(163,230,53,0.15)" />
              <stop offset="100%" stopColor="rgba(163,230,53,0.45)" />
            </linearGradient>
          </defs>

          {EDGES.map(([a, b], i) => {
            const A = NODES[a]!;
            const B = NODES[b]!;
            return (
              <motion.line
                key={`${a}-${b}-${i}`}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="url(#edgeGrad)"
                strokeWidth={0.35}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.04, ease: "easeOut" }}
              />
            );
          })}

          {NODES.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={2.4}
              initial={{ scale: 0.6, opacity: 0.35, fill: "rgb(82, 82, 91)" }}
              animate={{
                scale: [0.6, 1, 1],
                opacity: [0.35, 1, 1],
                fill: [
                  "rgb(82, 82, 91)",
                  "rgb(163, 230, 53)",
                  "rgb(163, 230, 53)",
                ],
              }}
              transition={{
                duration: 2.4,
                delay: 0.4 + i * 0.12,
                repeat: Infinity,
                repeatDelay: 5,
                times: [0, 0.25, 1],
                ease: "easeOut",
              }}
            />
          ))}

          {NODES.map((n, i) => (
            <motion.circle
              key={`glow-${i}`}
              cx={n.x}
              cy={n.y}
              r={4.5}
              fill="none"
              stroke="rgba(163,230,53,0.35)"
              strokeWidth={0.2}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0.5, 1.4, 1.6],
              }}
              transition={{
                duration: 2.4,
                delay: 0.4 + i * 0.12,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeOut",
              }}
            />
          ))}
        </svg>

        <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[10px]">
          <motion.span
            className="text-zinc-500"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            Confused
          </motion.span>
          <span className="text-zinc-600">→</span>
          <motion.span
            className="text-primary"
            initial={{ opacity: 0.25 }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            Structured
          </motion.span>
        </div>
      </div>
    </div>
  );
}
