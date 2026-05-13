"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type AIMode =
  | "Sandbox"
  | "Train AI"
  | "Prompt Puzzle"
  | "AI Detective"
  | "Agent Builder"
  | "Neural Network"
  | "AI X-Ray"
  | "Simulation"
  | "Ethics";

export type AILabChallenge = {
  id: string;
  mode: AIMode;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  skill: string;
  xpReward: number;
  xpRequired: number;
  prerequisites: string[];
  prompt: string;
  visualData: Record<string, unknown>;
  correctAnswer?: unknown;
  explanation: string;
  hints: string[];
  unlockMessage: string;
};

const LAB_STORAGE_KEY = "mindorbit.ai-creative-lab.v1";

const MODE_UNLOCK_XP: Record<AIMode, number> = {
  Sandbox: 0,
  "Train AI": 0,
  "AI Detective": 50,
  "Prompt Puzzle": 100,
  Simulation: 200,
  Ethics: 350,
  "Agent Builder": 500,
  "Neural Network": 1200,
  "AI X-Ray": 2500,
};

const MODE_META: Record<
  AIMode,
  { emoji: string; tagline: string; gradient: string; hue: string }
> = {
  Sandbox: { emoji: "🧱", tagline: "Wire layers like blocks", gradient: "from-violet-500/20 to-fuchsia-600/20", hue: "violet" },
  "Train AI": { emoji: "🎯", tagline: "Shape the dataset", gradient: "from-emerald-500/20 to-cyan-600/20", hue: "emerald" },
  "Prompt Puzzle": { emoji: "✍️", tagline: "Tune instructions", gradient: "from-amber-500/20 to-orange-600/20", hue: "amber" },
  "AI Detective": { emoji: "🔍", tagline: "Trace the failure", gradient: "from-sky-500/20 to-blue-700/20", hue: "sky" },
  "Agent Builder": { emoji: "🤖", tagline: "Compose agent graphs", gradient: "from-rose-500/20 to-pink-600/20", hue: "rose" },
  "Neural Network": { emoji: "⚡", tagline: "Feel activations flow", gradient: "from-indigo-500/20 to-purple-700/20", hue: "indigo" },
  "AI X-Ray": { emoji: "🫀", tagline: "See the model think", gradient: "from-teal-500/20 to-emerald-800/20", hue: "teal" },
  Simulation: { emoji: "🌍", tagline: "Steer live worlds", gradient: "from-lime-500/20 to-green-700/20", hue: "lime" },
  Ethics: { emoji: "⚖️", tagline: "Balance tradeoffs", gradient: "from-red-400/15 to-neutral-700/20", hue: "red" },
};

const LAB_CHALLENGES: AILabChallenge[] = [
  {
    id: "sandbox-catdog",
    mode: "Sandbox",
    title: "Cat Signal Lab",
    difficulty: "Easy",
    skill: "Inference & logits",
    xpReward: 40,
    xpRequired: 0,
    prerequisites: [],
    prompt: "Slide the hidden layer weights until the model confidently prefers 🐱 for fuzzy inputs.",
    visualData: { targetClass: "cat", threshold: 0.72 },
    correctAnswer: { minCatConfidence: 0.72 },
    explanation: "Tiny networks map inputs to scores (logits). Nudging weights shifts which patterns activate — that is manual representation learning in miniature.",
    hints: ["Raise the path from Fuzzy → Hidden → 🐱", "Watch the energy pulse — brighter edges mean stronger influence"],
    unlockMessage: "Sandbox is always open — build first, read later.",
  },
  {
    id: "train-bias",
    mode: "Train AI",
    title: "Dataset Bias Repair",
    difficulty: "Medium",
    skill: "Supervised learning",
    xpReward: 55,
    xpRequired: 0,
    prerequisites: [],
    prompt: "Label the rare teal points fairly so accuracy rises without collapsing to the majority color.",
    visualData: { majority: "orange", minority: "teal", goalAccuracy: 0.78 },
    correctAnswer: { labeledTeal: 3, labeledOrange: 2 },
    explanation: "Models imitate whatever you reward. Oversampling or carefully labeling minority regions fights shortcut learning.",
    hints: ["If you only label orange, accuracy looks high but fails on teal", "Try at least three teal confirmations"],
    unlockMessage: "Train AI opens from the start — teach responsibly.",
  },
  {
    id: "prompt-spec",
    mode: "Prompt Puzzle",
    title: "Constraint Stack",
    difficulty: "Easy",
    skill: "Context engineering",
    xpReward: 45,
    xpRequired: 100,
    prerequisites: [],
    prompt: "Add the missing pieces so the assistant must answer with JSON and refuse medical claims.",
    visualData: { tokensNeeded: ["JSON", "Scope", "Refusal"] },
    correctAnswer: ["JSON", "Scope", "Refusal"],
    explanation: "Layer output format, domain scope, and safety rails — classic context engineering beats vague instructions.",
    hints: ["Pin the response shape first", "Explicitly shrink what the model is allowed to advise"],
    unlockMessage: "Reach 100 Lab XP to unlock Prompt Puzzle mode.",
  },
  {
    id: "detective-hallucination",
    mode: "AI Detective",
    title: "Citation Ghost",
    difficulty: "Medium",
    skill: "Evaluation & debugging",
    xpReward: 60,
    xpRequired: 50,
    prerequisites: [],
    prompt: "Three clues explain a confident but false answer. Pick the root cause.",
    visualData: { clues: ["High softmax peak", "No retrieval hits", "Training cutoff before event"], culprit: "retrieval" },
    correctAnswer: "retrieval",
    explanation: "Hallucinations often look like high confidence with missing evidence — always cross-check retrieval or tool traces.",
    hints: ["Confidence alone is not truth", "What evidence path was empty?"],
    unlockMessage: "Earn 50 Lab XP to unlock AI Detective investigations.",
  },
  {
    id: "agent-router",
    mode: "Agent Builder",
    title: "Tool Router",
    difficulty: "Hard",
    skill: "Agents & workflows",
    xpReward: 90,
    xpRequired: 500,
    prerequisites: [],
    prompt: "Order the agent loop: memory refresh must happen before the tool call that needs prior context.",
    visualData: { nodes: ["Input", "Memory", "Tool", "Decision", "Action"] },
    correctAnswer: ["Input", "Memory", "Tool", "Decision", "Action"],
    explanation: "Agents fail when state is stale — refresh memory, then act, then reflect.",
    hints: ["Decision should see tool output", "Memory sits closest to tools that need facts"],
    unlockMessage: "Reach 500 Lab XP to unlock Agent Builder.",
  },
  {
    id: "nn-boss",
    mode: "Neural Network",
    title: "Boss: Activation Storm",
    difficulty: "Hard",
    skill: "Optimization intuition",
    xpReward: 120,
    xpRequired: 1200,
    prerequisites: ["sandbox-catdog"],
    prompt: "Match activation curves — pick ReLU vs Sigmoid vs Tanh for sparse feature firing.",
    visualData: { scenario: "sparse", answer: "relu" },
    correctAnswer: "relu",
    explanation: "ReLU zeros noise dimensions, keeping gradients alive for sparse features — sigmoids saturate early.",
    hints: ["Which curve stays dead flat for negative inputs but passes positive signal cleanly?"],
    unlockMessage: "Reach 1200 Lab XP for the Neural Network builder.",
  },
  {
    id: "xray-boss",
    mode: "AI X-Ray",
    title: "Boss: Attention Trace",
    difficulty: "Hard",
    skill: "Interpretability",
    xpReward: 150,
    xpRequired: 2500,
    prerequisites: [],
    prompt: "During X-Ray playback, which token donated the most attention mass to the final verb?",
    visualData: { focusToken: "not" },
    correctAnswer: "not",
    explanation: "Negation tokens often re-route attention — interpretability is about seeing those pivots, not reading prose.",
    hints: ["Watch the heatmap peak hop", "Small words can dominate semantics"],
    unlockMessage: "Reach 2500 Lab XP to unlock AI X-Ray signature flows.",
  },
  {
    id: "sim-rf",
    mode: "Simulation",
    title: "Reward Shaping",
    difficulty: "Medium",
    skill: "Reinforcement learning",
    xpReward: 70,
    xpRequired: 200,
    prerequisites: [],
    prompt: "Tune reward + hazard weights so the rover reaches the flag without hugging obstacles.",
    visualData: { goal: "flag", hazardBias: 0.35 },
    correctAnswer: { reward: 0.55, hazard: 0.45 },
    explanation: "Sparse rewards need shaping — balance progress signals with penalties or the policy oscillates.",
    hints: ["If it hugs walls, raise hazard awareness", "If it never moves, raise reward gain"],
    unlockMessage: "Earn 200 Lab XP to unlock Simulation worlds.",
  },
  {
    id: "ethics-tradeoff",
    mode: "Ethics",
    title: "Fairness Dial",
    difficulty: "Medium",
    skill: "Responsible AI",
    xpReward: 65,
    xpRequired: 350,
    prerequisites: [],
    prompt: "Slide thresholds until both groups pass the minimum precision bar without tanking recall entirely.",
    visualData: { minPrecision: 0.82, minRecall: 0.55 },
    correctAnswer: { fairness: 0.6 },
    explanation: "Fair ML is constrained optimization — raising one metric often squeezes another; document the tradeoff.",
    hints: ["Watch both group bars simultaneously", "Fairness slider lifts the lagging cohort"],
    unlockMessage: "Earn 350 Lab XP for Ethics scenarios.",
  },
];

type LabPersist = {
  xp: number;
  streak: number;
  lastDay: string;
  completed: string[];
  achievements: string[];
};

const DEFAULT_LAB_PERSIST: LabPersist = { xp: 0, streak: 0, lastDay: "", completed: [], achievements: [] };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadLab(): LabPersist {
  if (typeof window === "undefined") return DEFAULT_LAB_PERSIST;
  try {
    const raw = window.localStorage.getItem(LAB_STORAGE_KEY);
    if (!raw) return DEFAULT_LAB_PERSIST;
    const p = JSON.parse(raw) as Partial<LabPersist>;
    return {
      xp: typeof p.xp === "number" ? p.xp : 0,
      streak: typeof p.streak === "number" ? p.streak : 0,
      lastDay: typeof p.lastDay === "string" ? p.lastDay : "",
      completed: Array.isArray(p.completed) ? p.completed : [],
      achievements: Array.isArray(p.achievements) ? p.achievements : [],
    };
  } catch {
    return DEFAULT_LAB_PERSIST;
  }
}

function saveLab(p: LabPersist) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(p));
}

function modeUnlocked(mode: AIMode, labXp: number): boolean {
  return labXp >= MODE_UNLOCK_XP[mode];
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function GlowOrb({ className }: { className?: string }) {
  return (
    <motion.span
      className={className}
      animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.95, 0.55] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function EnergyEdge({ active }: { active: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
      animate={active ? { opacity: [0.2, 1, 0.2], scaleX: [0.85, 1, 0.85] } : { opacity: 0.15 }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border-2 border-neutral-200 bg-white shadow-[0_6px_0_0_#e5e5e5] dark:border-zinc-600 dark:bg-zinc-900 dark:shadow-[0_6px_0_0_#27272a]">
      <div className="border-b-2 border-neutral-100 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 px-5 py-4 dark:border-zinc-800 dark:from-violet-500/5 dark:to-cyan-500/5">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-600 dark:text-violet-300">Interactive Lab</p>
        <h3 className="mt-1 text-xl font-black tracking-tight text-neutral-900 dark:text-zinc-50">{title}</h3>
        {subtitle ? <p className="mt-1 text-xs text-neutral-600 dark:text-zinc-400">{subtitle}</p> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

function useOnceSolve(solved: boolean, onSolve: () => void) {
  const done = useRef(false);
  useEffect(() => {
    if (!solved || done.current) return;
    done.current = true;
    onSolve();
  }, [solved, onSolve]);
}

function SandboxPlay({ onSolve }: { onSolve: () => void }) {
  const [w1, setW1] = useState(0.45);
  const [w2, setW2] = useState(0.38);
  const fuzzy = 0.82;
  const striped = 0.35;
  const logitCat = w1 * fuzzy + w2 * striped;
  const logitDog = w1 * 0.25 + w2 * 0.9;
  const catP = 1 / (1 + Math.exp(-(logitCat - logitDog)));
  const solved = catP >= 0.72;

  useOnceSolve(solved, onSolve);

  return (
    <div className="relative space-y-6">
      <div className="relative grid gap-4 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/40 p-4 dark:border-violet-800 dark:bg-violet-950/20 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <motion.div layout className="rounded-2xl border-2 border-violet-300 bg-white p-4 text-center dark:border-violet-700 dark:bg-zinc-900">
          <p className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-300">Input</p>
          <p className="mt-2 text-3xl">🐱❓</p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-zinc-400">Fuzzy texture signal</p>
          <p className="mt-2 font-mono text-xs font-bold text-violet-700 dark:text-violet-200">{fuzzy.toFixed(2)}</p>
        </motion.div>
        <div className="relative hidden h-2 sm:block">
          <EnergyEdge active />
        </div>
        <motion.div
          layout
          className="rounded-2xl border-2 border-fuchsia-400 bg-gradient-to-br from-fuchsia-50 to-white p-4 text-center shadow-[0_0_24px_rgba(232,121,249,0.35)] dark:from-fuchsia-950/40 dark:to-zinc-900 dark:shadow-[0_0_28px_rgba(192,38,211,0.25)]"
          animate={{ boxShadow: solved ? "0 0 32px rgba(34,197,94,0.45)" : undefined }}
        >
          <p className="text-[10px] font-black uppercase text-fuchsia-600 dark:text-fuchsia-300">Hidden</p>
          <p className="mt-3 text-sm font-bold text-neutral-800 dark:text-zinc-100">Weights tune the vibe</p>
          <div className="mt-4 space-y-3 text-left">
            <label className="block text-[10px] font-black uppercase text-neutral-500 dark:text-zinc-400">
              w₁ (fuzzy path) <span className="font-mono text-violet-600 dark:text-violet-300">{w1.toFixed(2)}</span>
            </label>
            <input type="range" min={0} max={1} step={0.01} value={w1} onChange={(e) => setW1(Number(e.target.value))} className="w-full accent-violet-600" />
            <label className="block text-[10px] font-black uppercase text-neutral-500 dark:text-zinc-400">
              w₂ (stripe path) <span className="font-mono text-violet-600 dark:text-violet-300">{w2.toFixed(2)}</span>
            </label>
            <input type="range" min={0} max={1} step={0.01} value={w2} onChange={(e) => setW2(Number(e.target.value))} className="w-full accent-fuchsia-600" />
          </div>
        </motion.div>
        <div className="relative hidden h-2 sm:block">
          <EnergyEdge active={catP > 0.5} />
        </div>
        <motion.div
          layout
          className="rounded-2xl border-2 border-cyan-400 bg-white p-4 text-center dark:bg-zinc-900"
          animate={{ scale: catP > 0.65 ? [1, 1.03, 1] : 1 }}
          transition={{ repeat: catP > 0.65 ? Infinity : 0, duration: 1.2 }}
        >
          <p className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-300">Output</p>
          <p className="mt-2 text-3xl">🐱</p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-zinc-400">Cat confidence</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-neutral-200 dark:bg-zinc-700">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" animate={{ width: `${Math.round(catP * 100)}%` }} />
          </div>
          <p className="mt-2 font-mono text-sm font-black text-cyan-700 dark:text-cyan-200">{(catP * 100).toFixed(0)}%</p>
        </motion.div>
      </div>
      {solved ? (
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm font-black text-emerald-600 dark:text-emerald-300">
          Live prediction locked — mini-model prefers 🐱
        </motion.p>
      ) : (
        <p className="text-center text-xs text-neutral-500 dark:text-zinc-400">Push cat confidence ≥ 72% — watch activations glow.</p>
      )}
    </div>
  );
}

function TrainAIPlay({ onSolve }: { onSolve: () => void }) {
  const [labels, setLabels] = useState<Record<string, "orange" | "teal" | null>>({
    p1: null,
    p2: null,
    p3: null,
    p4: null,
    p5: null,
  });
  const points = useMemo(
    () => [
      { id: "p1", x: 18, y: 22, true: "orange" as const },
      { id: "p2", x: 72, y: 28, true: "orange" as const },
      { id: "p3", x: 48, y: 55, true: "teal" as const },
      { id: "p4", x: 30, y: 70, true: "teal" as const },
      { id: "p5", x: 78, y: 68, true: "teal" as const },
    ],
    [],
  );
  const labeledTeal = points.filter((p) => labels[p.id] === "teal").length;
  const labeledOrange = points.filter((p) => labels[p.id] === "orange").length;
  const correct = points.filter((p) => labels[p.id] === p.true).length;
  const accuracy = correct / points.length;
  const fair = labeledTeal >= 3 && labeledOrange >= 2 && accuracy >= 0.78;

  useOnceSolve(fair, onSolve);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:border-emerald-800 dark:from-emerald-950/30 dark:to-cyan-950/20">
        {points.map((p) => (
          <button
            key={p.id}
            type="button"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neutral-800/20 shadow-md transition hover:scale-110 dark:border-white/20"
            onClick={() =>
              setLabels((prev) => {
                const cycle: ("orange" | "teal" | null)[] = [null, "orange", "teal"];
                const idx = cycle.indexOf(prev[p.id] ?? null);
                return { ...prev, [p.id]: cycle[(idx + 1) % cycle.length]! };
              })
            }
          >
            <span
              className={`grid h-full w-full place-items-center rounded-full text-xs font-black ${
                labels[p.id] === "teal"
                  ? "bg-teal-400 text-teal-950"
                  : labels[p.id] === "orange"
                    ? "bg-orange-400 text-orange-950"
                    : "bg-white/80 text-neutral-500 dark:bg-zinc-800/80 dark:text-zinc-400"
              }`}
            >
              {labels[p.id] ? (labels[p.id] === "teal" ? "T" : "O") : "?"}
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-zinc-600 dark:bg-zinc-800/50">
        <div>
          <p className="text-[10px] font-black uppercase text-neutral-500 dark:text-zinc-400">Live accuracy</p>
          <p className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-300">{(accuracy * 100).toFixed(0)}%</p>
        </div>
        <div className="h-10 w-px bg-neutral-200 dark:bg-zinc-600" />
        <div>
          <p className="text-[10px] font-black uppercase text-neutral-500 dark:text-zinc-400">Labels</p>
          <p className="text-sm font-bold text-neutral-800 dark:text-zinc-100">
            Teal {labeledTeal} · Orange {labeledOrange}
          </p>
        </div>
      </div>
      <p className="text-xs text-neutral-600 dark:text-zinc-400">Tap points to cycle labels — aim for balanced supervision + high accuracy.</p>
    </div>
  );
}

function PromptPuzzlePlay({ onSolve }: { onSolve: () => void }) {
  const pieces = ["JSON", "Scope", "Refusal"] as const;
  const [picked, setPicked] = useState<string[]>([]);
  const badOutput = picked.length < 3 ? 38 : picked.join() === "JSONScopeRefusal" ? 92 : 55;
  const goodOutput = picked.length < 3 ? 41 : picked.join() === "JSONScopeRefusal" ? 96 : 68;
  const solved = picked.join() === "JSONScopeRefusal" && picked.length === 3;

  useOnceSolve(solved, onSolve);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {pieces.map((p) => (
          <button
            key={p}
            type="button"
            disabled={picked.includes(p)}
            onClick={() => setPicked((prev) => (prev.includes(p) ? prev : [...prev, p]))}
            className="rounded-full border-2 border-amber-300 bg-amber-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-amber-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100 dark:hover:bg-amber-900/60"
          >
            + {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPicked([])}
          className="rounded-full border-2 border-neutral-300 px-4 py-2 text-xs font-black uppercase text-neutral-700 dark:border-zinc-600 dark:text-zinc-300"
        >
          Reset stack
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-red-200 bg-red-50/60 p-4 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-[10px] font-black uppercase text-red-600 dark:text-red-300">Risky draft</p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-red-900/80 dark:text-red-100/80">“Tell me everything about meds…”</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-red-700 dark:text-red-300">Hallucination radar</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-red-200 dark:bg-red-900/50">
              <motion.div className="h-full bg-red-500" animate={{ width: `${badOutput}%` }} />
            </div>
            <span className="font-mono text-xs font-bold text-red-700">{badOutput}%</span>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
          <p className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-300">Guarded draft</p>
          <p className="mt-2 font-mono text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-100/80">
            {picked.length === 0 ? "…constraints pending…" : `Stack: ${picked.join(" → ")}`}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300">Prompt score</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900/50">
              <motion.div className="h-full bg-emerald-500" animate={{ width: `${goodOutput}%` }} />
            </div>
            <span className="font-mono text-xs font-bold text-emerald-700">{goodOutput}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetectivePlay({ onSolve }: { onSolve: () => void }) {
  const [pick, setPick] = useState<string | null>(null);
  const solved = pick === "retrieval";
  useOnceSolve(solved, onSolve);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { id: "confidence", label: "Overconfident logits", heat: 0.3 },
          { id: "retrieval", label: "Empty retrieval", heat: 0.92 },
          { id: "cutoff", label: "Stale training cutoff", heat: 0.4 },
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setPick(c.id)}
            className={`rounded-2xl border-2 p-4 text-left transition ${
              pick === c.id ? "border-sky-500 bg-sky-50 dark:border-sky-400 dark:bg-sky-950/40" : "border-neutral-200 bg-neutral-50 dark:border-zinc-600 dark:bg-zinc-800/40"
            }`}
          >
            <p className="text-sm font-black text-neutral-900 dark:text-zinc-50">{c.label}</p>
            <div className="mt-3 h-16 rounded-lg bg-neutral-200 dark:bg-zinc-700" style={{ backgroundImage: `linear-gradient(90deg, rgba(14,165,233,0.9) ${c.heat * 100}%, transparent ${c.heat * 100}%)` }} />
            <p className="mt-2 text-[10px] font-bold uppercase text-neutral-500 dark:text-zinc-400">Attention mass</p>
          </button>
        ))}
      </div>
      <p className="text-xs text-neutral-600 dark:text-zinc-400">Clue gameplay: pick the failure mode that best explains confident fiction.</p>
    </div>
  );
}

function AgentBuilderPlay({ onSolve }: { onSolve: () => void }) {
  const order = ["Input", "Memory", "Tool", "Decision", "Action"];
  const [seq, setSeq] = useState<string[]>([]);
  const solved = deepEqual(seq, order);
  useOnceSolve(solved, onSolve);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {order.map((n) => (
          <button
            key={n}
            type="button"
            disabled={seq.includes(n)}
            onClick={() => setSeq((s) => [...s, n])}
            className="rounded-xl border-2 border-rose-300 bg-rose-50 px-3 py-2 text-xs font-black uppercase text-rose-900 disabled:opacity-30 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-100"
          >
            {n}
          </button>
        ))}
        <button type="button" onClick={() => setSeq([])} className="rounded-xl border-2 border-neutral-300 px-3 py-2 text-xs font-black dark:border-zinc-600">
          Clear
        </button>
      </div>
      <div className="flex min-h-[4rem] flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/30 p-4 dark:border-rose-900 dark:bg-rose-950/20">
        {seq.length === 0 ? <span className="text-xs text-neutral-500 dark:text-zinc-500">Tap nodes in execution order…</span> : null}
        {seq.map((n, i) => (
          <FragmentRow key={`${n}-${i}`} label={n} pulse={i === seq.length - 1} />
        ))}
      </div>
    </div>
  );
}

function FragmentRow({ label, pulse }: { label: string; pulse: boolean }) {
  return (
    <motion.span
      layout
      className="rounded-lg border-2 border-rose-400 bg-white px-3 py-1.5 text-xs font-black dark:border-rose-600 dark:bg-zinc-900"
      animate={pulse ? { boxShadow: ["0 0 0px rgba(244,63,94,0)", "0 0 18px rgba(244,63,94,0.45)", "0 0 0px rgba(244,63,94,0)"] } : {}}
      transition={{ duration: 1.2, repeat: pulse ? Infinity : 0 }}
    >
      {label}
    </motion.span>
  );
}

function NeuralBuilderPlay({ onSolve }: { onSolve: () => void }) {
  const [pick, setPick] = useState<string | null>(null);
  const solved = pick === "relu";
  useOnceSolve(solved, onSolve);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        { id: "sigmoid", label: "Sigmoid", desc: "Smooth squish — saturates" },
        { id: "tanh", label: "Tanh", desc: "Zero-centered squish" },
        { id: "relu", label: "ReLU", desc: "Sparse firing — keeps strong signals" },
      ].map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => setPick(a.id)}
          className={`rounded-2xl border-2 p-4 text-left transition ${pick === a.id ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/40" : "border-neutral-200 dark:border-zinc-600"}`}
        >
          <p className="text-lg font-black text-neutral-900 dark:text-zinc-50">{a.label}</p>
          <p className="mt-1 text-xs text-neutral-600 dark:text-zinc-400">{a.desc}</p>
          <div className="mt-4 h-12 overflow-hidden rounded-lg bg-neutral-900/5 dark:bg-white/5">
            <motion.div
              className="h-full w-full origin-left bg-gradient-to-r from-indigo-400 to-purple-500"
              initial={false}
              animate={{ scaleX: a.id === "relu" ? [0.2, 1, 0.4, 1] : [0.1, 0.35, 0.2, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}

function AIXRayPlay({ onSolve }: { onSolve: () => void }) {
  const tokens = ["The", "model", "did", "not", "verify", "sources"];
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setPhase((p) => (p + 1) % 6), 900);
    return () => window.clearInterval(id);
  }, []);
  const [selected, setSelected] = useState<string | null>(null);
  const solved = selected === "not";
  useOnceSolve(solved, onSolve);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2">
        {["Prompt", "Tokens", "Attention", "Reasoning", "Output"].map((step, i) => (
          <motion.div key={step} className="flex w-full max-w-md flex-col items-center gap-2" initial={false} animate={{ opacity: phase >= i ? 1 : 0.35 }}>
            <div className="w-full rounded-2xl border-2 border-teal-300 bg-teal-50/80 px-4 py-3 text-center text-sm font-black text-teal-900 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-100">
              {step}
              {step === "Tokens" ? (
                <div className="mt-3 flex flex-wrap justify-center gap-1">
                  {tokens.map((t, ti) => (
                    <motion.button
                      key={t + ti}
                      type="button"
                      onClick={() => setSelected(t)}
                      className={`rounded-md border px-2 py-1 font-mono text-[11px] font-bold ${
                        phase % tokens.length === ti ? "border-cyan-500 bg-cyan-100 dark:bg-cyan-900/50" : "border-neutral-200 bg-white dark:border-zinc-600 dark:bg-zinc-800"
                      } ${selected === t ? "ring-2 ring-amber-400" : ""}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>
              ) : null}
              {step === "Attention" ? (
                <div className="mt-3 grid h-16 w-full grid-cols-6 gap-1">
                  {tokens.map((_, hi) => (
                    <motion.div
                      key={hi}
                      className="rounded-sm bg-gradient-to-t from-teal-500 to-cyan-300"
                      animate={{ opacity: phase % 6 === hi ? 1 : 0.25, scaleY: phase % 6 === hi ? 1 : 0.35 }}
                      style={{ transformOrigin: "bottom" }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            {i < 4 ? <motion.div className="h-6 w-0.5 bg-gradient-to-b from-teal-400 to-transparent" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} /> : null}
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-neutral-600 dark:text-zinc-400">Signature X-Ray: follow the glowing token into attention, then tap the pivot word.</p>
    </div>
  );
}

function SimulationPlay({ onSolve }: { onSolve: () => void }) {
  const [reward, setReward] = useState(0.45);
  const [hazard, setHazard] = useState(0.45);
  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 120, damping: 18 });
  const x = useTransform(spring, [0, 1], ["8%", "88%"]);
  const solved = reward >= 0.52 && reward <= 0.62 && hazard >= 0.42 && hazard <= 0.52;
  useEffect(() => {
    const target = Math.min(1, reward * 1.1 - hazard * 0.35 + 0.25);
    progress.set(target);
  }, [reward, hazard, progress]);
  useOnceSolve(solved, onSolve);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border-2 border-lime-300 bg-gradient-to-b from-sky-100 to-lime-50 dark:border-lime-800 dark:from-sky-950/40 dark:to-lime-950/20">
        <div className="absolute bottom-[18%] left-[10%] right-[10%] h-3 rounded-full bg-neutral-800/10 dark:bg-white/10" />
        <motion.div style={{ left: x }} className="absolute bottom-[16%] h-8 w-10 -translate-x-1/2 rounded-md border-2 border-lime-600 bg-lime-400 shadow-lg dark:border-lime-300 dark:bg-lime-300" />
        <div className="absolute right-[8%] top-[20%] rounded-lg border-2 border-amber-400 bg-amber-200 px-2 py-1 text-[10px] font-black dark:border-amber-600 dark:bg-amber-900/60 dark:text-amber-100">
          FLAG
        </div>
        <div className="absolute left-[20%] top-[35%] h-16 w-4 rounded-full bg-red-500/60 blur-[2px]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-black uppercase text-neutral-600 dark:text-zinc-400">
          Reward gain
          <input type="range" min={0.2} max={0.9} step={0.01} value={reward} onChange={(e) => setReward(Number(e.target.value))} className="mt-2 w-full accent-lime-600" />
        </label>
        <label className="block text-xs font-black uppercase text-neutral-600 dark:text-zinc-400">
          Hazard avoidance
          <input type="range" min={0.2} max={0.9} step={0.01} value={hazard} onChange={(e) => setHazard(Number(e.target.value))} className="mt-2 w-full accent-red-500" />
        </label>
      </div>
      <p className="text-xs text-neutral-600 dark:text-zinc-400">Simulation speed is implicit — tune rewards until the rover hugs the center line toward the flag.</p>
    </div>
  );
}

function EthicsPlay({ onSolve }: { onSolve: () => void }) {
  const [fair, setFair] = useState(0.5);
  const g1p = 0.82 + (fair - 0.55) * 0.2;
  const g2p = 0.82 + (0.65 - fair) * 0.2;
  const g1r = 0.58 + fair * 0.12;
  const g2r = 0.58 + (1 - fair) * 0.12;
  const solved =
    fair >= 0.55 && fair <= 0.65 && g1p >= 0.82 && g2p >= 0.82 && g1r >= 0.55 && g2r >= 0.55;
  useOnceSolve(solved, onSolve);

  return (
    <div className="space-y-4">
      <label className="block text-xs font-black uppercase text-neutral-600 dark:text-zinc-400">
        Fairness emphasis
        <input type="range" min={0.35} max={0.85} step={0.01} value={fair} onChange={(e) => setFair(Number(e.target.value))} className="mt-2 w-full accent-red-500" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: "Group A", p: g1p, r: g1r },
          { label: "Group B", p: g2p, r: g2r },
        ].map((g) => (
          <div key={g.label} className="rounded-2xl border-2 border-neutral-200 p-4 dark:border-zinc-600">
            <p className="text-sm font-black">{g.label}</p>
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-[10px] font-bold uppercase text-neutral-500">Precision</p>
                <div className="h-2 rounded-full bg-neutral-200 dark:bg-zinc-700">
                  <motion.div className="h-full rounded-full bg-red-500" animate={{ width: `${g.p * 100}%` }} />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-neutral-500">Recall</p>
                <div className="h-2 rounded-full bg-neutral-200 dark:bg-zinc-700">
                  <motion.div className="h-full rounded-full bg-emerald-500" animate={{ width: `${g.r * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DraggableNode({ label, emoji, color }: { label: string; emoji: string; color: string }) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -40, right: 40, top: -24, bottom: 24 }}
      whileDrag={{ scale: 1.06, cursor: "grabbing" }}
      className={`cursor-grab rounded-2xl border-2 ${color} bg-white/90 px-4 py-3 text-center shadow-lg backdrop-blur dark:bg-zinc-900/90`}
    >
      <p className="text-[10px] font-black uppercase text-neutral-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl">{emoji}</p>
    </motion.div>
  );
}

function ModeFreePlay({ mode }: { mode: AIMode }) {
  return (
    <div className="space-y-4">
      {mode === "Sandbox" ? (
        <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/30 p-6 dark:border-violet-800 dark:bg-violet-950/20">
          <DraggableNode label="Input" emoji="📷" color="border-violet-400" />
          <DraggableNode label="Hidden" emoji="🌀" color="border-fuchsia-400" />
          <DraggableNode label="Logits" emoji="📈" color="border-cyan-400" />
        </div>
      ) : null}
      {mode === "Agent Builder" ? (
        <div className="grid gap-3 sm:grid-cols-5">
          {["Input", "Memory", "Tool", "Decision", "Action"].map((n, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border-2 border-rose-300 bg-rose-50/80 p-3 text-center text-xs font-black dark:border-rose-800 dark:bg-rose-950/30"
            >
              {n}
            </motion.div>
          ))}
        </div>
      ) : null}
      {mode === "Neural Network" ? (
        <div className="relative flex justify-between gap-2 overflow-x-auto rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 p-6 dark:border-indigo-900 dark:bg-indigo-950/20">
          {[4, 6, 3, 2].map((count, li) => (
            <div key={li} className="flex flex-col items-center gap-2">
              <p className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-300">L{li + 1}</p>
              {Array.from({ length: count }).map((_, ni) => (
                <motion.div
                  key={ni}
                  className="h-3 w-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shadow-[0_0_12px_rgba(129,140,248,0.8)]"
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 1.3 + ni * 0.05 + li * 0.08, repeat: Infinity }}
                />
              ))}
            </div>
          ))}
          <GlowOrb className="pointer-events-none absolute inset-0 -z-10 bg-purple-500/10 blur-3xl" />
        </div>
      ) : null}
      {mode === "AI X-Ray" ? <AIXRayPlay onSolve={() => {}} /> : null}
      {mode === "Simulation" ? <SimulationPlay onSolve={() => {}} /> : null}
      {mode === "Ethics" ? <EthicsPlay onSolve={() => {}} /> : null}
      {mode === "Train AI" ? <TrainAIPlay onSolve={() => {}} /> : null}
      {mode === "Prompt Puzzle" ? <PromptPuzzlePlay onSolve={() => {}} /> : null}
      {mode === "AI Detective" ? <DetectivePlay onSolve={() => {}} /> : null}
      {["Sandbox", "Agent Builder", "Neural Network", "AI X-Ray", "Simulation", "Ethics", "Train AI", "Prompt Puzzle", "AI Detective"].includes(mode) ? null : (
        <p className="text-sm text-neutral-600 dark:text-zinc-400">Explore challenges from the list — free play mirrors the structured puzzles.</p>
      )}
    </div>
  );
}

export default function AICreativeLab() {
  const [persist, setPersist] = useState<LabPersist>(() => DEFAULT_LAB_PERSIST);
  const [labStorageHydrated, setLabStorageHydrated] = useState(false);
  const [mode, setMode] = useState<AIMode>("Sandbox");
  const [challengeId, setChallengeId] = useState<string | null>(LAB_CHALLENGES[0]!.id);
  const [toast, setToast] = useState<string | null>(null);
  const [solvedFlash, setSolvedFlash] = useState(false);

  const prevCompletedRef = useRef<string[] | null>(null);

  useEffect(() => {
    const loaded = loadLab();
    prevCompletedRef.current = loaded.completed;
    setPersist(loaded);
    setLabStorageHydrated(true);
  }, []);

  useEffect(() => {
    if (!labStorageHydrated) return;
    saveLab(persist);
  }, [persist, labStorageHydrated]);

  const challenge = useMemo(() => LAB_CHALLENGES.find((c) => c.id === challengeId) ?? LAB_CHALLENGES[0]!, [challengeId]);
  const challengesForMode = useMemo(
    () => LAB_CHALLENGES.filter((c) => c.mode === mode && modeUnlocked(c.mode, persist.xp)),
    [mode, persist.xp],
  );

  useEffect(() => {
    const list = LAB_CHALLENGES.filter((c) => c.mode === mode && modeUnlocked(c.mode, persist.xp));
    if (list.length === 0) return;
    if (!challengeId || !list.some((c) => c.id === challengeId)) setChallengeId(list[0]!.id);
  }, [mode, persist.xp, challengeId]);

  useEffect(() => {
    if (!labStorageHydrated) return;
    if (prevCompletedRef.current === null) {
      prevCompletedRef.current = persist.completed;
      return;
    }
    const prev = prevCompletedRef.current;
    const added = persist.completed.filter((id) => !prev.includes(id));
    prevCompletedRef.current = persist.completed;
    if (added.length === 0) return;
    const last = added[added.length - 1]!;
    const meta = LAB_CHALLENGES.find((c) => c.id === last);
    const amt = meta?.xpReward ?? 0;
    setToast(`+${amt} Lab XP`);
    window.setTimeout(() => setToast(null), 2000);
    setSolvedFlash(true);
    window.setTimeout(() => setSolvedFlash(false), 900);
  }, [persist.completed, labStorageHydrated]);

  const completeChallenge = useCallback((id: string, xpReward: number) => {
    setPersist((prev) => {
      if (prev.completed.includes(id)) return prev;
      const day = today();
      let streak = prev.streak;
      if (!prev.lastDay) streak = 1;
      else if (prev.lastDay === day) streak = prev.streak;
      else {
        const prevDate = new Date(`${prev.lastDay}T12:00:00Z`);
        const nextDate = new Date(`${day}T12:00:00Z`);
        const diffDays = Math.round((nextDate.getTime() - prevDate.getTime()) / 86400000);
        streak = diffDays === 1 ? prev.streak + 1 : 1;
      }
      const achId = `challenge:${id}`;
      const achievements = prev.achievements.includes(achId) ? prev.achievements : [...prev.achievements, achId];
      return {
        ...prev,
        xp: prev.xp + xpReward,
        streak,
        lastDay: day,
        completed: [...prev.completed, id],
        achievements,
      };
    });
  }, []);

  const onChallengeSolved = useCallback(() => {
    completeChallenge(challenge.id, challenge.xpReward);
  }, [challenge.id, challenge.xpReward, completeChallenge]);

  const dailyChallenge = useMemo(() => {
    const pool = LAB_CHALLENGES.filter((c) => modeUnlocked(c.mode, persist.xp));
    const list = pool.length > 0 ? pool : LAB_CHALLENGES.filter((c) => c.mode === "Sandbox" || c.mode === "Train AI");
    const seed = today().split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    return list[seed % list.length]!;
  }, [persist.xp]);

  const skillTree = (Object.keys(MODE_UNLOCK_XP) as AIMode[]).map((m) => ({
    mode: m,
    need: MODE_UNLOCK_XP[m],
    open: modeUnlocked(m, persist.xp),
  }));

  return (
    <div className="space-y-8 pb-16">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-24 z-40 mx-auto flex max-w-sm justify-center px-4"
          >
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-900 shadow-lg dark:border-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-100">
              {toast}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section className="overflow-hidden rounded-[2rem] border-2 border-violet-300 border-b-4 border-b-violet-500 bg-gradient-to-br from-violet-600 via-indigo-700 to-cyan-700 p-6 text-white shadow-[0_8px_0_0_rgba(76,29,149,0.45)] sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-violet-200">AI Creative Lab</p>
            <h2 className="text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">Minecraft meets ML — a cognitive playground.</h2>
            <p className="text-sm leading-relaxed text-violet-100/95">
              Build systems, train toy models, x-ray attention, and debug failures. Short prompts, heavy interaction — no wall-of-text tutorials.
            </p>
          </div>
          <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
            <div className="rounded-2xl border-2 border-white/20 bg-white/10 px-3 py-3 backdrop-blur">
              <p className="text-[9px] font-black uppercase text-violet-100">Lab XP</p>
              <p className="mt-1 font-mono text-2xl font-black">{persist.xp}</p>
            </div>
            <div className="rounded-2xl border-2 border-white/20 bg-white/10 px-3 py-3 backdrop-blur">
              <p className="text-[9px] font-black uppercase text-violet-100">Streak</p>
              <p className="mt-1 font-mono text-2xl font-black">🔥 {persist.streak}</p>
            </div>
            <div className="rounded-2xl border-2 border-white/20 bg-white/10 px-3 py-3 backdrop-blur">
              <p className="text-[9px] font-black uppercase text-violet-100">Modes</p>
              <p className="mt-1 font-mono text-2xl font-black">{skillTree.filter((s) => s.open).length}/9</p>
            </div>
            <div className="rounded-2xl border-2 border-white/20 bg-white/10 px-3 py-3 backdrop-blur">
              <p className="text-[9px] font-black uppercase text-violet-100">Boss clears</p>
              <p className="mt-1 font-mono text-2xl font-black">{persist.completed.filter((id) => id === "nn-boss" || id === "xray-boss").length}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 h-3 overflow-hidden rounded-full bg-black/20">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-lime-300 to-cyan-200" animate={{ width: `${Math.min(100, (persist.xp / 2500) * 100)}%` }} />
        </div>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-violet-100/80">Progress to AI X-Ray unlock · {Math.min(persist.xp, 2500)} / 2500</p>
      </section>

      <section className="rounded-[2rem] border-2 border-amber-300 border-b-4 border-b-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 p-5 dark:border-amber-800 dark:border-b-amber-900 dark:from-amber-950/40 dark:to-orange-950/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-800 dark:text-amber-200">Daily AI challenge</p>
            <h3 className="mt-1 text-lg font-black text-neutral-900 dark:text-zinc-50">{dailyChallenge.title}</h3>
            <p className="mt-1 text-xs text-neutral-700 dark:text-zinc-300">{dailyChallenge.prompt}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode(dailyChallenge.mode);
              setChallengeId(dailyChallenge.id);
            }}
            className="shrink-0 rounded-2xl border-2 border-amber-700 bg-[#ffc800] px-5 py-3 text-xs font-black uppercase tracking-wider text-neutral-900 shadow-[0_4px_0_0_#92400e] transition active:translate-y-0.5 active:shadow-none dark:border-amber-500 dark:text-neutral-900"
          >
            Jump in
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-[1.5rem] border-2 border-neutral-200 bg-white p-4 dark:border-zinc-600 dark:bg-zinc-900">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-neutral-500 dark:text-zinc-400">AI skill tree</p>
            <ul className="mt-3 space-y-2">
              {skillTree.map((row) => (
                <li key={row.mode}>
                  <button
                    type="button"
                    disabled={!row.open}
                    onClick={() => {
                      setMode(row.mode);
                      const first = LAB_CHALLENGES.find((c) => c.mode === row.mode && modeUnlocked(c.mode, persist.xp));
                      if (first) setChallengeId(first.id);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border-2 px-3 py-2 text-left text-xs font-black transition ${
                      mode === row.mode ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/40" : "border-neutral-200 bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-800/50"
                    } ${!row.open ? "cursor-not-allowed opacity-40" : "hover:border-violet-300"}`}
                  >
                    <span>
                      {MODE_META[row.mode].emoji} {row.mode}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500">{row.open ? "✓" : `${row.need} XP`}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.5rem] border-2 border-cyan-200 bg-cyan-50/50 p-4 dark:border-cyan-900 dark:bg-cyan-950/30">
            <p className="text-[10px] font-black uppercase text-cyan-800 dark:text-cyan-200">Achievements</p>
            <ul className="mt-2 space-y-1 text-[11px] font-bold text-cyan-900 dark:text-cyan-100">
              {persist.achievements.length === 0 ? <li className="text-cyan-700/80">Complete a challenge to earn badges.</li> : null}
              {persist.achievements.map((a) => (
                <li key={a}>🏅 {a.replace("challenge:", "")}</li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(MODE_META) as AIMode[]).map((m) => {
              const open = modeUnlocked(m, persist.xp);
              return (
                <motion.button
                  key={m}
                  type="button"
                  layout
                  disabled={!open}
                  onClick={() => {
                    setMode(m);
                    const fc = LAB_CHALLENGES.find((c) => c.mode === m && modeUnlocked(c.mode, persist.xp));
                    if (fc) setChallengeId(fc.id);
                  }}
                  className={`relative overflow-hidden rounded-2xl border-2 px-4 py-3 text-left text-xs font-black transition ${
                    mode === m ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/40" : "border-neutral-200 bg-white dark:border-zinc-600 dark:bg-zinc-900"
                  } ${!open ? "opacity-40" : "hover:border-violet-300"}`}
                >
                  <span className={`absolute inset-0 bg-gradient-to-br opacity-40 ${MODE_META[m].gradient}`} />
                  <span className="relative">{MODE_META[m].emoji}</span>
                  <span className="relative ml-2">{m}</span>
                  {!open ? <span className="relative ml-2 font-mono text-[10px] text-neutral-500">{MODE_UNLOCK_XP[m]} XP</span> : null}
                </motion.button>
              );
            })}
          </div>

          <Panel title={MODE_META[mode].emoji + " " + mode} subtitle={MODE_META[mode].tagline}>
            {solvedFlash ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4 rounded-xl border-2 border-emerald-400 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-100">
                Challenge cleared — XP banked locally.
              </motion.div>
            ) : null}

            <div className="mb-6 flex flex-col gap-3 rounded-2xl border-2 border-neutral-100 bg-neutral-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-800/40 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-violet-600 dark:text-violet-300">Active challenge</p>
                <h4 className="mt-1 text-lg font-black text-neutral-900 dark:text-zinc-50">{challenge.title}</h4>
                <p className="mt-2 text-sm text-neutral-700 dark:text-zinc-300">{challenge.prompt}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-black uppercase text-neutral-500">{challenge.difficulty}</p>
                <p className="font-mono text-sm font-black text-amber-600 dark:text-amber-300">+{challenge.xpReward} XP</p>
                {persist.completed.includes(challenge.id) ? <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">Completed</p> : null}
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {challengesForMode.length === 0 ? (
                <p className="text-sm font-bold text-neutral-500 dark:text-zinc-400">Earn more Lab XP to unlock challenges in this lane.</p>
              ) : null}
              {challengesForMode.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChallengeId(c.id)}
                  className={`rounded-full border-2 px-3 py-1.5 text-[11px] font-black uppercase ${
                    challengeId === c.id ? "border-violet-500 bg-violet-100 dark:border-violet-400 dark:bg-violet-950/50" : "border-neutral-200 dark:border-zinc-600"
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>

            {challenge.mode === "Sandbox" && challenge.id === "sandbox-catdog" ? <SandboxPlay key={challenge.id} onSolve={onChallengeSolved} /> : null}
            {challenge.mode === "Train AI" && challenge.id === "train-bias" ? <TrainAIPlay key={challenge.id} onSolve={onChallengeSolved} /> : null}
            {challenge.mode === "Prompt Puzzle" && challenge.id === "prompt-spec" ? <PromptPuzzlePlay key={challenge.id} onSolve={onChallengeSolved} /> : null}
            {challenge.mode === "AI Detective" && challenge.id === "detective-hallucination" ? <DetectivePlay key={challenge.id} onSolve={onChallengeSolved} /> : null}
            {challenge.mode === "Agent Builder" && challenge.id === "agent-router" ? <AgentBuilderPlay key={challenge.id} onSolve={onChallengeSolved} /> : null}
            {challenge.mode === "Neural Network" && challenge.id === "nn-boss" ? <NeuralBuilderPlay key={challenge.id} onSolve={onChallengeSolved} /> : null}
            {challenge.mode === "AI X-Ray" && challenge.id === "xray-boss" ? <AIXRayPlay key={challenge.id} onSolve={onChallengeSolved} /> : null}
            {challenge.mode === "Simulation" && challenge.id === "sim-rf" ? <SimulationPlay key={challenge.id} onSolve={onChallengeSolved} /> : null}
            {challenge.mode === "Ethics" && challenge.id === "ethics-tradeoff" ? <EthicsPlay key={challenge.id} onSolve={onChallengeSolved} /> : null}

            <details className="mt-6 rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 dark:border-zinc-600 dark:bg-zinc-900">
              <summary className="cursor-pointer text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-zinc-400">Field notes (short)</summary>
              <p className="mt-2 text-sm text-neutral-700 dark:text-zinc-300">{challenge.explanation}</p>
            </details>
          </Panel>

          <Panel title="Free lab bench" subtitle="Experiment without XP pressure — same tools, looser goals.">
            <ModeFreePlay mode={mode} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
