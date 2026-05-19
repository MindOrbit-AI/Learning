"use client";

import { motion } from "framer-motion";

const NODES: { x: number; y: number; label?: string }[] = [
  { x: 18, y: 38, label: "Fractions" },
  { x: 38, y: 22, label: "Ratios" },
  { x: 58, y: 18, label: "Linear" },
  { x: 82, y: 32, label: "Systems" },
  { x: 72, y: 52, label: "Quadratics" },
  { x: 50, y: 48, label: "Expressions" },
  { x: 28, y: 58, label: "Integers" },
  { x: 48, y: 72, label: "Algebra" },
  { x: 68, y: 78, label: "Functions" },
  { x: 88, y: 62, label: "Proofs" },
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

/** Foundation gaps that ripple upward */
const WEAK_NODES = new Set([0, 6]);

/** Recommended mastery path after diagnosis */
const PROGRESSION_PATH: [number, number][] = [
  [0, 1],
  [1, 5],
  [5, 7],
  [7, 8],
];

type MasteryMapVisualProps = {
  /** Hero variant: glowing weak nodes + animated progression path */
  variant?: "default" | "hero";
};

export function MasteryMapVisual({ variant = "default" }: MasteryMapVisualProps) {
  const isHero = variant === "hero";
  const progressionEdgeKeys = new Set(
    PROGRESSION_PATH.map(([a, b]) => `${a}-${b}`)
  );

  return (
    <motion.div
      className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_-24px_rgba(0,0,0,0.8)]"
      initial={isHero ? { opacity: 0, y: 12 } : undefined}
      animate={isHero ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(163,230,53,0.12),transparent_55%)]"
        animate={
          isHero
            ? { opacity: [0.7, 1, 0.7] }
            : undefined
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {isHero && (
        <motion.div
          className="pointer-events-none absolute left-[12%] top-[28%] h-24 w-24 rounded-full bg-red-500/20 blur-2xl"
          animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4))]"
        animate={
          isHero
            ? { opacity: [0.85, 1, 0.85] }
            : undefined
        }
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

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

        <svg viewBox="0 0 100 100" className="h-auto w-full flex-1" aria-hidden>
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(163,230,53,0.15)" />
              <stop offset="100%" stopColor="rgba(163,230,53,0.45)" />
            </linearGradient>
            <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(163,230,53,0.2)" />
              <stop offset="50%" stopColor="rgba(163,230,53,0.9)" />
              <stop offset="100%" stopColor="rgba(163,230,53,0.35)" />
            </linearGradient>
            <linearGradient id="weakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(248,113,113,0.2)" />
              <stop offset="100%" stopColor="rgba(251,146,60,0.55)" />
            </linearGradient>
          </defs>

          {EDGES.map(([a, b], i) => {
            const A = NODES[a]!;
            const B = NODES[b]!;
            const key = `${a}-${b}`;
            const reverseKey = `${b}-${a}`;
            const onPath =
              progressionEdgeKeys.has(key) || progressionEdgeKeys.has(reverseKey);
            const touchesWeak = WEAK_NODES.has(a) || WEAK_NODES.has(b);

            return (
              <motion.line
                key={`${a}-${b}-${i}`}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={
                  isHero && onPath
                    ? "url(#pathGrad)"
                    : isHero && touchesWeak
                      ? "url(#weakGrad)"
                      : "url(#edgeGrad)"
                }
                strokeWidth={isHero && onPath ? 0.55 : 0.35}
                strokeDasharray={isHero && onPath ? "2 1.2" : undefined}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{
                  opacity: isHero && onPath ? [0.5, 1, 0.5] : 1,
                  pathLength: 1,
                }}
                transition={{
                  opacity: isHero && onPath
                    ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                    : undefined,
                  pathLength: { duration: 0.8, delay: 0.1 + i * 0.04, ease: "easeOut" },
                }}
              />
            );
          })}

          {isHero &&
            PROGRESSION_PATH.map(([a, b], i) => {
              const A = NODES[a]!;
              const B = NODES[b]!;
              return (
                <motion.circle
                  key={`pulse-${a}-${b}`}
                  r={1.1}
                  fill="rgb(163, 230, 53)"
                  initial={{ opacity: 0 }}
                  animate={{
                    cx: [A.x, B.x],
                    cy: [A.y, B.y],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2.4,
                    delay: 1.2 + i * 0.55,
                    repeat: Infinity,
                    repeatDelay: 2.8,
                    ease: "easeInOut",
                  }}
                />
              );
            })}

          {NODES.map((n, i) => {
            const weak = WEAK_NODES.has(i);
            const mastered = !weak && i >= 5;

            return (
              <g key={i}>
                {weak && isHero && (
                  <>
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r={5.5}
                      fill="none"
                      stroke="rgba(248,113,113,0.5)"
                      strokeWidth={0.25}
                      animate={{ opacity: [0.2, 0.85, 0.2], scale: [0.85, 1.35, 1.45] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r={3.8}
                      fill="rgba(248,113,113,0.12)"
                      animate={{ opacity: [0.15, 0.45, 0.15] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </>
                )}

                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={weak ? 2.8 : 2.4}
                  initial={{
                    scale: 0.6,
                    opacity: 0.35,
                    fill: weak ? "rgb(248, 113, 113)" : "rgb(82, 82, 91)",
                  }}
                  animate={
                    weak
                      ? {
                          scale: [0.9, 1.15, 0.9],
                          opacity: [0.7, 1, 0.7],
                          fill: [
                            "rgb(248, 113, 113)",
                            "rgb(251, 146, 60)",
                            "rgb(248, 113, 113)",
                          ],
                        }
                      : mastered
                        ? {
                            scale: [0.6, 1, 1],
                            opacity: [0.35, 1, 1],
                            fill: [
                              "rgb(82, 82, 91)",
                              "rgb(163, 230, 53)",
                              "rgb(163, 230, 53)",
                            ],
                          }
                        : {
                            scale: 1,
                            opacity: 0.55,
                            fill: "rgb(113, 113, 122)",
                          }
                  }
                  transition={
                    weak
                      ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                      : mastered
                        ? {
                            duration: 2.4,
                            delay: 0.4 + i * 0.1,
                            repeat: Infinity,
                            repeatDelay: 5,
                            times: [0, 0.25, 1],
                            ease: "easeOut",
                          }
                        : { duration: 0.5 }
                  }
                />

                {!weak && mastered && (
                  <motion.circle
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
                )}
              </g>
            );
          })}
        </svg>

        <motion.div
          className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[10px]"
          animate={isHero ? { opacity: [0.85, 1, 0.85] } : undefined}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            className={isHero ? "text-red-400/90" : "text-zinc-500"}
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {isHero ? "Weak nodes" : "Confused"}
          </motion.span>
          <span className="text-zinc-600">→</span>
          <motion.span
            className="text-primary"
            initial={{ opacity: 0.25 }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {isHero ? "Fastest path" : "Structured"}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
