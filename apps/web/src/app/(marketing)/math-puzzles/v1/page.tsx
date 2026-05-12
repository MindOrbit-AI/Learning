"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

// ============================================================================
// Types
// ============================================================================

type PuzzleType =
  | "weightScale"
  | "fractionPizza"
  | "numberMachine"
  | "patternBlocks"
  | "areaBuilder"
  | "gridPath";

type CheckState = "idle" | "correct" | "wrong";

type ChoiceKind = "number" | "shape" | "fraction" | "path";

interface BasePuzzle {
  type: PuzzleType;
  prompt: string;
  choices: string[];
  choiceKind: ChoiceKind;
  correctIndex: number;
  explanation: string;
}

interface WeightScalePuzzle extends BasePuzzle {
  type: "weightScale";
  payload: {
    circleWeight: number;
    squareWeight: number;
    clue1: { circles: number; squares: number; total: number };
    clue2: { circles: number; squares: number; total: number };
    question: { circles: number; squares: number };
  };
}

interface FractionPizzaPuzzle extends BasePuzzle {
  type: "fractionPizza";
  payload: { slices: number; shaded: number };
}

interface NumberMachinePuzzle extends BasePuzzle {
  type: "numberMachine";
  payload: {
    examples: { input: number; output: number }[];
    queryInput: number;
    ruleLabel: string;
  };
}

interface PatternBlocksPuzzle extends BasePuzzle {
  type: "patternBlocks";
  payload: { sequence: number[] };
}

interface AreaBuilderPuzzle extends BasePuzzle {
  type: "areaBuilder";
  payload: { width: number; height: number; cols: number; rows: number };
}

interface GridPathPuzzle extends BasePuzzle {
  type: "gridPath";
  payload: {
    start: number;
    target: number;
    paths: { op1: string; v1: number; op2: string; v2: number; result: number }[];
  };
}

type Puzzle =
  | WeightScalePuzzle
  | FractionPizzaPuzzle
  | NumberMachinePuzzle
  | PatternBlocksPuzzle
  | AreaBuilderPuzzle
  | GridPathPuzzle;

interface PuzzleMeta {
  id: PuzzleType;
  title: string;
  tagline: string;
  emoji: string;
  gradient: string;
  ring: string;
  glow: string;
}

const PUZZLE_META: PuzzleMeta[] = [
  {
    id: "weightScale",
    title: "Weight Scale",
    tagline: "Solve hidden weights",
    emoji: "⚖️",
    gradient: "from-amber-400 to-orange-500",
    ring: "ring-amber-300/40",
    glow: "shadow-amber-500/30",
  },
  {
    id: "fractionPizza",
    title: "Fraction Pizza",
    tagline: "Count the slices",
    emoji: "🍕",
    gradient: "from-rose-400 to-red-500",
    ring: "ring-rose-300/40",
    glow: "shadow-rose-500/30",
  },
  {
    id: "numberMachine",
    title: "Number Machine",
    tagline: "Find the rule",
    emoji: "⚙️",
    gradient: "from-sky-400 to-blue-600",
    ring: "ring-sky-300/40",
    glow: "shadow-sky-500/30",
  },
  {
    id: "patternBlocks",
    title: "Pattern Blocks",
    tagline: "Continue the pattern",
    emoji: "🧩",
    gradient: "from-violet-400 to-fuchsia-600",
    ring: "ring-violet-300/40",
    glow: "shadow-violet-500/30",
  },
  {
    id: "areaBuilder",
    title: "Area Builder",
    tagline: "Count grid squares",
    emoji: "🟩",
    gradient: "from-emerald-400 to-green-600",
    ring: "ring-emerald-300/40",
    glow: "shadow-emerald-500/30",
  },
  {
    id: "gridPath",
    title: "Grid Path",
    tagline: "Reach the target",
    emoji: "🎯",
    gradient: "from-cyan-400 to-teal-600",
    ring: "ring-cyan-300/40",
    glow: "shadow-cyan-500/30",
  },
];

// ============================================================================
// Random helpers
// ============================================================================

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = tmp;
  }
  return a;
}

function uniqueNumericDistractors(answer: number, count = 3, span = 4): number[] {
  const set = new Set<number>();
  let attempts = 0;
  while (set.size < count && attempts < 60) {
    attempts++;
    const d = answer + randInt(-span, span);
    if (d > 0 && d !== answer) set.add(d);
  }
  let k = 1;
  while (set.size < count) {
    if (answer + k > 0 && answer + k !== answer) set.add(answer + k);
    if (set.size < count && answer - k > 0) set.add(answer - k);
    k++;
  }
  return Array.from(set);
}

function buildNumericChoices(answer: number): { choices: string[]; correctIndex: number } {
  const all = shuffle([answer, ...uniqueNumericDistractors(answer)]);
  return { choices: all.map(String), correctIndex: all.indexOf(answer) };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function fractionLabel(num: number, den: number): string {
  const g = gcd(num, den);
  return `${num / g}/${den / g}`;
}

// ============================================================================
// Puzzle generators
// ============================================================================

function generateWeightScale(): WeightScalePuzzle {
  const circleWeight = randInt(2, 6);
  const squareWeight = randInt(2, 6);

  const clue1 = {
    circles: randInt(2, 3),
    squares: 0,
    total: 0,
  };
  clue1.total = clue1.circles * circleWeight;

  const clue2 = {
    circles: randInt(1, 2),
    squares: randInt(1, 2),
    total: 0,
  };
  clue2.total = clue2.circles * circleWeight + clue2.squares * squareWeight;

  const question = { circles: randInt(1, 2), squares: randInt(1, 2) };
  const answer = question.circles * circleWeight + question.squares * squareWeight;
  const { choices, correctIndex } = buildNumericChoices(answer);

  return {
    type: "weightScale",
    prompt: "What does the mystery scale weigh?",
    choices,
    choiceKind: "number",
    correctIndex,
    explanation: `Clue 1 shows ${clue1.circles} circles weigh ${clue1.total}, so each circle = ${circleWeight}. Clue 2 gives ${clue2.circles}·${circleWeight} + ${clue2.squares}·□ = ${clue2.total}, so each square = ${squareWeight}. The mystery scale is ${question.circles}·${circleWeight} + ${question.squares}·${squareWeight} = ${answer}.`,
    payload: { circleWeight, squareWeight, clue1, clue2, question },
  };
}

function generateFractionPizza(): FractionPizzaPuzzle {
  const slices = randChoice([4, 6, 8] as const);
  const shaded = randInt(1, slices - 1);
  const answerLabel = fractionLabel(shaded, slices);

  const candidates = new Set<string>([answerLabel]);
  while (candidates.size < 4) {
    const denom = randChoice([4, 6, 8] as const);
    const numer = randInt(1, denom - 1);
    candidates.add(fractionLabel(numer, denom));
  }
  const all = shuffle(Array.from(candidates));
  const correctIndex = all.indexOf(answerLabel);

  return {
    type: "fractionPizza",
    prompt: "What fraction of the pizza has pepperoni?",
    choices: all,
    choiceKind: "fraction",
    correctIndex,
    explanation: `${shaded} of ${slices} slices are topped, which simplifies to ${answerLabel}.`,
    payload: { slices, shaded },
  };
}

function generateNumberMachine(): NumberMachinePuzzle {
  // Rule y = m * x + b
  const m = randChoice([2, 3, 4] as const);
  const b = randInt(-2, 5);
  const inputs = shuffle([randInt(1, 4), randInt(5, 8), randInt(9, 12)]).slice(0, 3);
  const examples = inputs.map((x) => ({ input: x, output: m * x + b }));
  let queryInput = randInt(2, 14);
  while (inputs.includes(queryInput)) queryInput = randInt(2, 14);
  const answer = m * queryInput + b;
  const { choices, correctIndex } = buildNumericChoices(answer);

  const ruleLabel = b === 0 ? `×${m}` : b > 0 ? `×${m} + ${b}` : `×${m} − ${Math.abs(b)}`;

  return {
    type: "numberMachine",
    prompt: `What does the machine output for ${queryInput}?`,
    choices,
    choiceKind: "number",
    correctIndex,
    explanation: `The pattern is output = input ${ruleLabel}. So ${queryInput} → ${answer}.`,
    payload: { examples, queryInput, ruleLabel },
  };
}

function generatePatternBlocks(): PatternBlocksPuzzle {
  const pool = shuffle([0, 1, 2, 3]);
  const patternKind = randInt(0, 2);
  let sequence: number[];
  let next: number;

  if (patternKind === 0) {
    const [a, b] = pool as [number, number, number, number];
    sequence = [a, b, a, b, a, b];
    next = a;
  } else if (patternKind === 1) {
    const [a, b] = pool as [number, number, number, number];
    sequence = [a, a, b, b, a, a];
    next = b;
  } else {
    const [a, b, c] = pool as [number, number, number, number];
    sequence = [a, b, c, a, b];
    next = c;
  }

  const distractors = shuffle([0, 1, 2, 3].filter((x) => x !== next)).slice(0, 3);
  const options = shuffle([next, ...distractors]);
  const correctIndex = options.indexOf(next);

  return {
    type: "patternBlocks",
    prompt: "Which shape comes next?",
    choices: options.map(String),
    choiceKind: "shape",
    correctIndex,
    explanation: "Look at how the shapes repeat — the missing block continues the cycle.",
    payload: { sequence: [...sequence, -1] },
  };
}

function generateAreaBuilder(): AreaBuilderPuzzle {
  const width = randInt(2, 5);
  const height = randInt(2, 4);
  const cols = Math.min(6, width + randInt(1, 2));
  const rows = Math.min(5, height + randInt(1, 2));
  const area = width * height;
  const { choices, correctIndex } = buildNumericChoices(area);

  return {
    type: "areaBuilder",
    prompt: "How many squares does the green shape cover?",
    choices,
    choiceKind: "number",
    correctIndex,
    explanation: `The rectangle is ${width} wide and ${height} tall, so its area is ${width} × ${height} = ${area}.`,
    payload: { width, height, cols, rows },
  };
}

function applyOp(value: number, op: string, v: number): number {
  if (op === "+") return value + v;
  if (op === "−") return value - v;
  if (op === "×") return value * v;
  return value;
}

function generateGridPath(): GridPathPuzzle {
  const start = randInt(2, 6);
  const ops = ["+", "−", "×"] as const;

  function rollPath() {
    const op1 = randChoice(ops);
    const v1 = op1 === "×" ? randInt(2, 3) : randInt(1, 5);
    const mid = applyOp(start, op1, v1);
    if (mid <= 0) return null;
    const op2 = randChoice(ops);
    const v2 = op2 === "×" ? randInt(2, 3) : randInt(1, 5);
    const result = applyOp(mid, op2, v2);
    if (result <= 0 || result > 60) return null;
    return { op1, v1, op2, v2, result };
  }

  let correct = rollPath();
  while (!correct) correct = rollPath();
  const target = correct.result;

  const paths = [correct];
  let attempts = 0;
  while (paths.length < 4 && attempts < 300) {
    attempts++;
    const p = rollPath();
    if (!p) continue;
    if (p.result === target) continue;
    const dup = paths.some(
      (x) => x.op1 === p.op1 && x.v1 === p.v1 && x.op2 === p.op2 && x.v2 === p.v2,
    );
    if (!dup) paths.push(p);
  }
  while (paths.length < 4) {
    const p = rollPath();
    if (p) paths.push(p);
  }

  const shuffled = shuffle(paths);
  const correctIndex = shuffled.indexOf(correct);

  return {
    type: "gridPath",
    prompt: `Pick the path from ${start} that lands on ${target}.`,
    choices: shuffled.map((p) => `${p.op1}${p.v1} ${p.op2}${p.v2}`),
    choiceKind: "path",
    correctIndex,
    explanation: `${start} ${correct.op1} ${correct.v1} = ${applyOp(start, correct.op1, correct.v1)}, then ${correct.op2} ${correct.v2} = ${target}.`,
    payload: { start, target, paths: shuffled },
  };
}

function generatePuzzle(type: PuzzleType): Puzzle {
  switch (type) {
    case "weightScale":
      return generateWeightScale();
    case "fractionPizza":
      return generateFractionPizza();
    case "numberMachine":
      return generateNumberMachine();
    case "patternBlocks":
      return generatePatternBlocks();
    case "areaBuilder":
      return generateAreaBuilder();
    case "gridPath":
      return generateGridPath();
  }
}

// ============================================================================
// Tiny visual primitives
// ============================================================================

function Shape({ kind, sizePx = 48 }: { kind: number; sizePx?: number }) {
  const style: CSSProperties = { width: sizePx, height: sizePx };
  if (kind === 0) {
    return (
      <div
        style={style}
        className="rounded-full bg-gradient-to-br from-rose-300 to-rose-600 shadow-lg shadow-rose-500/30 ring-1 ring-white/20"
      />
    );
  }
  if (kind === 1) {
    return (
      <div
        style={style}
        className="rounded-2xl bg-gradient-to-br from-sky-300 to-sky-600 shadow-lg shadow-sky-500/30 ring-1 ring-white/20"
      />
    );
  }
  if (kind === 2) {
    return (
      <div
        style={{
          ...style,
          clipPath: "polygon(50% 4%, 96% 96%, 4% 96%)",
        }}
        className="bg-gradient-to-br from-amber-300 to-amber-600"
      />
    );
  }
  return (
    <div
      style={style}
      className="rotate-45 rounded-md bg-gradient-to-br from-emerald-300 to-emerald-600 shadow-lg shadow-emerald-500/30 ring-1 ring-white/20"
    />
  );
}

function YellowDisc({ sizePx = 32 }: { sizePx?: number }) {
  const style: CSSProperties = { width: sizePx, height: sizePx };
  return (
    <div
      style={style}
      className="rounded-full bg-gradient-to-br from-amber-200 to-amber-500 shadow-md ring-1 ring-amber-100/40"
      aria-hidden
    />
  );
}

function PurpleSquare({ sizePx = 32 }: { sizePx?: number }) {
  const style: CSSProperties = { width: sizePx, height: sizePx };
  return (
    <div
      style={style}
      className="rounded-md bg-gradient-to-br from-fuchsia-300 to-fuchsia-600 shadow-md ring-1 ring-fuchsia-100/40"
      aria-hidden
    />
  );
}

// ============================================================================
// Per-puzzle visuals
// ============================================================================

function ScaleRow({
  circles,
  squares,
  totalLabel,
}: {
  circles: number;
  squares: number;
  totalLabel: string;
}) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex flex-1 flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-zinc-800/80 px-3 py-3 ring-1 ring-white/10">
        {Array.from({ length: circles }).map((_, i) => (
          <YellowDisc key={`c-${i}`} sizePx={28} />
        ))}
        {circles > 0 && squares > 0 ? (
          <span className="mx-1 text-zinc-500" aria-hidden>
            +
          </span>
        ) : null}
        {Array.from({ length: squares }).map((_, i) => (
          <PurpleSquare key={`s-${i}`} sizePx={28} />
        ))}
      </div>
      <span className="text-zinc-500" aria-hidden>
        =
      </span>
      <div className="min-w-[3.5rem] rounded-xl bg-zinc-950 px-3 py-2 text-center font-mono text-xl font-bold tabular-nums text-emerald-300 ring-1 ring-emerald-500/30 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
        {totalLabel}
      </div>
    </div>
  );
}

function WeightScaleVisual({ puzzle }: { puzzle: WeightScalePuzzle }) {
  const { clue1, clue2, question } = puzzle.payload;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
        Clues
      </p>
      <ScaleRow circles={clue1.circles} squares={clue1.squares} totalLabel={String(clue1.total)} />
      <ScaleRow circles={clue2.circles} squares={clue2.squares} totalLabel={String(clue2.total)} />
      <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-widest text-sky-400/90">
        Mystery
      </p>
      <ScaleRow circles={question.circles} squares={question.squares} totalLabel="?" />
    </div>
  );
}

function PizzaVisual({ puzzle }: { puzzle: FractionPizzaPuzzle }) {
  const { slices, shaded } = puzzle.payload;
  const size = 220;
  const r = size / 2;
  const cx = r;
  const cy = r;
  const arcs = useMemo(() => {
    const items: { d: string; shaded: boolean; tipX: number; tipY: number }[] = [];
    for (let i = 0; i < slices; i++) {
      const start = (i / slices) * Math.PI * 2 - Math.PI / 2;
      const end = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const large = end - start > Math.PI ? 1 : 0;
      const mid = (start + end) / 2;
      const tipX = cx + r * 0.55 * Math.cos(mid);
      const tipY = cy + r * 0.55 * Math.sin(mid);
      items.push({
        d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`,
        shaded: i < shaded,
        tipX,
        tipY,
      });
    }
    return items;
  }, [slices, shaded, cx, cy, r]);

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Pizza fraction">
        <defs>
          <radialGradient id="crust" cx="50%" cy="50%" r="60%">
            <stop offset="80%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
          <radialGradient id="cheese" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="url(#crust)" />
        {arcs.map((a, i) => (
          <g key={i}>
            <path
              d={a.d}
              fill={a.shaded ? "url(#cheese)" : "rgba(244, 232, 200, 0.35)"}
              stroke="#7c2d12"
              strokeWidth={2}
            />
            {a.shaded ? (
              <>
                <circle cx={a.tipX} cy={a.tipY} r={6} fill="#dc2626" stroke="#7f1d1d" strokeWidth={1.5} />
                <circle
                  cx={a.tipX + 10}
                  cy={a.tipY - 6}
                  r={4}
                  fill="#dc2626"
                  stroke="#7f1d1d"
                  strokeWidth={1.2}
                />
              </>
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}

function NumberMachineVisual({ puzzle }: { puzzle: NumberMachinePuzzle }) {
  const { examples, queryInput } = puzzle.payload;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
        {examples.map((ex, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 rounded-xl bg-zinc-800/70 px-3 py-2 ring-1 ring-white/10"
          >
            <span className="font-mono text-lg font-bold tabular-nums text-amber-300">{ex.input}</span>
            <span className="text-zinc-500">→</span>
            <span className="font-mono text-lg font-bold tabular-nums text-emerald-300">{ex.output}</span>
          </div>
        ))}
      </div>
      <div className="flex w-full items-center justify-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-2xl font-bold text-orange-950 shadow-lg shadow-amber-500/30 ring-1 ring-white/30">
          {queryInput}
        </div>
        <div className="text-2xl text-zinc-500">→</div>
        <div className="relative flex h-20 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 shadow-lg shadow-sky-500/30 ring-1 ring-white/20">
          <div className="absolute inset-x-3 top-2 h-1.5 rounded-full bg-white/30" />
          <span className="text-3xl">⚙️</span>
          <div className="absolute inset-x-3 bottom-2 h-1.5 rounded-full bg-white/30" />
        </div>
        <div className="text-2xl text-zinc-500">→</div>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-400/70 bg-emerald-500/10 text-2xl font-bold text-emerald-200">
          ?
        </div>
      </div>
    </div>
  );
}

function PatternBlocksVisual({ puzzle }: { puzzle: PatternBlocksPuzzle }) {
  const { sequence } = puzzle.payload;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-zinc-800/40 px-3 py-5 ring-1 ring-white/5">
      {sequence.map((kind, i) =>
        kind === -1 ? (
          <div
            key={`q-${i}`}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-dashed border-violet-400/70 text-2xl font-bold text-violet-200"
          >
            ?
          </div>
        ) : (
          <Shape key={`s-${i}`} kind={kind} sizePx={48} />
        ),
      )}
    </div>
  );
}

function AreaBuilderVisual({ puzzle }: { puzzle: AreaBuilderPuzzle }) {
  const { width, height, cols, rows } = puzzle.payload;
  const cell = 40;
  const w = cols * cell;
  const h = rows * cell;
  const startX = Math.floor((cols - width) / 2);
  const startY = Math.floor((rows - height) / 2);

  return (
    <div className="flex justify-center">
      <div
        className="rounded-2xl bg-zinc-800/60 p-3 ring-1 ring-white/10"
        style={{ width: w + 24, height: h + 24 }}
      >
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Grid area">
          {Array.from({ length: rows }).map((_, ry) =>
            Array.from({ length: cols }).map((_, cx) => {
              const inside = cx >= startX && cx < startX + width && ry >= startY && ry < startY + height;
              return (
                <rect
                  key={`${cx}-${ry}`}
                  x={cx * cell}
                  y={ry * cell}
                  width={cell}
                  height={cell}
                  fill={inside ? "rgba(16, 185, 129, 0.75)" : "rgba(63, 63, 70, 0.35)"}
                  stroke={inside ? "rgba(167, 243, 208, 0.65)" : "rgba(82, 82, 91, 0.6)"}
                  strokeWidth={1.5}
                  rx={4}
                />
              );
            }),
          )}
        </svg>
      </div>
    </div>
  );
}

function PathChip({ op, v }: { op: string; v: number }) {
  const tone =
    op === "+"
      ? "from-emerald-400 to-emerald-600 shadow-emerald-500/30"
      : op === "−"
        ? "from-rose-400 to-rose-600 shadow-rose-500/30"
        : "from-violet-400 to-violet-600 shadow-violet-500/30";
  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-gradient-to-br ${tone} px-3 py-1.5 font-mono text-sm font-bold text-white shadow-md ring-1 ring-white/20`}
    >
      {op}
      {v}
    </div>
  );
}

function GridPathVisual({ puzzle }: { puzzle: GridPathPuzzle }) {
  const { start, target } = puzzle.payload;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 text-zinc-200">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-2xl font-bold tabular-nums ring-1 ring-white/10">
          {start}
        </div>
        <div className="text-sm uppercase tracking-widest text-zinc-500">to</div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 text-2xl font-bold tabular-nums text-white shadow-lg shadow-cyan-500/30 ring-1 ring-white/20">
          {target}
        </div>
      </div>
      <p className="text-center text-xs text-zinc-400">Pick the two-step path that lands exactly on the target.</p>
    </div>
  );
}

// ============================================================================
// Answer choices
// ============================================================================

interface ChoiceButtonProps {
  active: boolean;
  outcome: "none" | "correct" | "wrong";
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
}

function ChoiceButton({ active, outcome, onClick, disabled, children }: ChoiceButtonProps) {
  let stateClasses =
    "border-white/10 bg-zinc-800/70 text-zinc-100 hover:border-white/25 hover:bg-zinc-700/80";
  if (active) {
    stateClasses =
      "border-sky-400/60 bg-sky-500/20 text-white shadow-[0_0_18px_rgba(56,189,248,0.25)]";
  }
  if (outcome === "correct") {
    stateClasses = "border-emerald-400/70 bg-emerald-500/20 text-emerald-50 shadow-emerald-500/30";
  } else if (outcome === "wrong") {
    stateClasses = "border-rose-400/70 bg-rose-500/20 text-rose-50 shadow-rose-500/30";
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[3.75rem] items-center justify-center rounded-2xl border-2 px-3 py-3 text-lg font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${stateClasses}`}
    >
      {children}
    </motion.button>
  );
}

function ShapeChoiceContent({ kindIndex }: { kindIndex: number }) {
  return <Shape kind={kindIndex} sizePx={36} />;
}

function PathChoiceContent({ path }: { path: GridPathPuzzle["payload"]["paths"][number] }) {
  return (
    <div className="flex items-center gap-1.5">
      <PathChip op={path.op1} v={path.v1} />
      <span className="text-zinc-500">·</span>
      <PathChip op={path.op2} v={path.v2} />
    </div>
  );
}

// ============================================================================
// Celebration
// ============================================================================

function Celebration({ active }: { active: boolean }) {
  const items = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        emoji: ["⭐", "✨", "🎉", "💫", "🌟"][i % 5] as string,
        x: (Math.random() - 0.5) * 90,
        y: -(30 + Math.random() * 40),
        delay: i * 0.04,
        rot: Math.random() * 240 - 120,
      })),
    [],
  );
  return (
    <AnimatePresence>
      {active ? (
        <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
          {items.map((it, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 text-3xl"
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
              animate={{ opacity: 0, x: `${it.x}vw`, y: `${it.y}vh`, scale: 1.4, rotate: it.rot }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, delay: it.delay, ease: "easeOut" }}
            >
              {it.emoji}
            </motion.span>
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  );
}

// ============================================================================
// Icons
// ============================================================================

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1-3s-1 5 2 5 3-2 3-4-1-4-1-8Z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
    </svg>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

// ============================================================================
// Main component
// ============================================================================

const XP_PER_LEVEL = 100;
const XP_PER_CORRECT = 12;

export default function MathPuzzlesPage() {
  const [activeType, setActiveType] = useState<PuzzleType | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const selectType = useCallback((type: PuzzleType) => {
    setActiveType(type);
    setPuzzle(generatePuzzle(type));
    setSelected(null);
    setCheckState("idle");
  }, []);

  const nextPuzzle = useCallback(() => {
    if (!activeType) return;
    setPuzzle(generatePuzzle(activeType));
    setSelected(null);
    setCheckState("idle");
  }, [activeType]);

  const goHome = useCallback(() => {
    setActiveType(null);
    setPuzzle(null);
    setSelected(null);
    setCheckState("idle");
  }, []);

  const handleCheck = useCallback(() => {
    if (!puzzle) return;
    if (checkState === "correct") {
      nextPuzzle();
      return;
    }
    if (checkState === "wrong") {
      setCheckState("idle");
      setSelected(null);
      return;
    }
    if (selected === null) return;
    const isCorrect = selected === puzzle.correctIndex;
    setCheckState(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setXp((p) => p + XP_PER_CORRECT);
      setStreak((s) => s + 1);
      setCelebrating(true);
    } else {
      setStreak(0);
    }
  }, [checkState, puzzle, selected, nextPuzzle]);

  useEffect(() => {
    if (!celebrating) return;
    const t = setTimeout(() => setCelebrating(false), 1300);
    return () => clearTimeout(t);
  }, [celebrating]);

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const levelXp = xp % XP_PER_LEVEL;
  const levelProgress = (levelXp / XP_PER_LEVEL) * 100;

  const activeMeta = activeType ? PUZZLE_META.find((p) => p.id === activeType) ?? null : null;

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -right-16 top-40 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <Celebration active={celebrating} />

      <header className="sticky top-0 z-20 border-b border-white/5 bg-zinc-950/85 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-lg items-center gap-3">
          {activeType ? (
            <motion.button
              key="back"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              type="button"
              onClick={goHome}
              className="flex size-10 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/5 hover:text-white active:scale-95"
              aria-label="Back to puzzle list"
            >
              <BackIcon className="size-5" />
            </motion.button>
          ) : (
            <div className="flex size-10 items-center justify-center text-2xl">🧠</div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold tracking-tight text-zinc-50 sm:text-lg">
              {activeMeta ? activeMeta.title : "Math Puzzles"}
            </h1>
            <p className="truncate text-xs text-zinc-400">
              {activeMeta ? activeMeta.tagline : "Visual brain teasers"}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-1.5 ring-1 ring-rose-400/30">
            <FlameIcon className="size-4 text-rose-300" />
            <span className="text-sm font-bold tabular-nums text-rose-100">{streak}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1.5 ring-1 ring-amber-400/30">
            <BoltIcon className="size-4 text-amber-300" />
            <span className="text-sm font-bold tabular-nums text-amber-100">{xp}</span>
          </div>
        </div>

        <div className="mx-auto mt-3 flex w-full max-w-lg items-center gap-2">
          <span className="rounded-md bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-200 ring-1 ring-violet-400/30">
            Lv {level}
          </span>
          <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-800 ring-1 ring-white/5">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.6)]"
              animate={{ width: `${levelProgress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-zinc-500">
            {levelXp}/{XP_PER_LEVEL}
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-40 pt-5 sm:px-6">
        <AnimatePresence mode="wait">
          {!activeType ? (
            <motion.section
              key="selector"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-5 flex flex-col items-center gap-2 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-200 ring-1 ring-violet-400/30">
                  <span className="size-1.5 rounded-full bg-violet-400" />
                  Pick a puzzle
                </span>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Train your brain</h2>
                <p className="max-w-xs text-sm text-zinc-400">
                  Bite-sized visual puzzles. Tap a card to start.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PUZZLE_META.map((meta, i) => (
                  <motion.button
                    key={meta.id}
                    type="button"
                    onClick={() => selectType(meta.id)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    whileTap={{ scale: 0.97 }}
                    className={`group relative flex aspect-square flex-col items-start justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/70 p-4 text-left shadow-lg ring-1 ${meta.ring} transition-all hover:border-white/20 hover:shadow-2xl ${meta.glow}`}
                  >
                    <div
                      className={`pointer-events-none absolute -right-6 -top-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${meta.gradient} text-4xl opacity-90 blur-[0.5px] transition-transform group-hover:scale-110`}
                    >
                      <span className="drop-shadow-md">{meta.emoji}</span>
                    </div>
                    <div className="z-10 mt-auto">
                      <h3 className="text-base font-bold leading-tight tracking-tight text-zinc-50">
                        {meta.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-400">{meta.tagline}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key={`play-${activeType}-${puzzle?.prompt ?? ""}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-1 flex-col"
            >
              <div className="mb-4 flex items-center justify-center">
                {activeMeta ? (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${activeMeta.gradient} px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md`}
                  >
                    <span>{activeMeta.emoji}</span>
                    {activeMeta.title}
                  </span>
                ) : null}
              </div>
              <h2 className="text-center text-xl font-bold leading-tight tracking-tight text-zinc-50 sm:text-2xl">
                {puzzle?.prompt ?? "Loading…"}
              </h2>

              <div className="mt-6 rounded-3xl border border-white/5 bg-zinc-900/40 p-4 ring-1 ring-white/5">
                {puzzle?.type === "weightScale" && <WeightScaleVisual puzzle={puzzle} />}
                {puzzle?.type === "fractionPizza" && <PizzaVisual puzzle={puzzle} />}
                {puzzle?.type === "numberMachine" && <NumberMachineVisual puzzle={puzzle} />}
                {puzzle?.type === "patternBlocks" && <PatternBlocksVisual puzzle={puzzle} />}
                {puzzle?.type === "areaBuilder" && <AreaBuilderVisual puzzle={puzzle} />}
                {puzzle?.type === "gridPath" && <GridPathVisual puzzle={puzzle} />}
              </div>

              <div className="mt-6">
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Choose your answer
                </p>
                <div
                  className={
                    puzzle?.choiceKind === "path"
                      ? "grid grid-cols-1 gap-2"
                      : puzzle?.choiceKind === "fraction"
                        ? "grid grid-cols-2 gap-2"
                        : puzzle?.choiceKind === "shape"
                          ? "grid grid-cols-4 gap-2"
                          : "grid grid-cols-4 gap-2"
                  }
                  role="group"
                  aria-label="Answer choices"
                >
                  {puzzle?.choices.map((choice, i) => {
                    const isSelected = selected === i;
                    let outcome: "none" | "correct" | "wrong" = "none";
                    if (checkState !== "idle") {
                      if (i === puzzle.correctIndex) outcome = "correct";
                      else if (isSelected) outcome = "wrong";
                    }
                    let content: ReactNode = choice;
                    if (puzzle.choiceKind === "shape") {
                      content = <ShapeChoiceContent kindIndex={Number(choice)} />;
                    } else if (puzzle.choiceKind === "path" && puzzle.type === "gridPath") {
                      content = <PathChoiceContent path={puzzle.payload.paths[i]!} />;
                    } else if (puzzle.choiceKind === "fraction") {
                      const [n, d] = choice.split("/");
                      content = (
                        <div className="flex flex-col items-center leading-none">
                          <span className="text-xl">{n}</span>
                          <span className="my-0.5 h-px w-6 bg-current opacity-60" />
                          <span className="text-xl">{d}</span>
                        </div>
                      );
                    }
                    return (
                      <ChoiceButton
                        key={`${i}-${choice}`}
                        active={isSelected && checkState === "idle"}
                        outcome={outcome}
                        onClick={() => {
                          if (checkState !== "idle") return;
                          setSelected(i);
                        }}
                        disabled={checkState === "correct"}
                      >
                        {content}
                      </ChoiceButton>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {puzzle && checkState !== "idle" ? (
                  <motion.div
                    key={`feedback-${checkState}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className={`mt-5 rounded-2xl border px-4 py-4 text-sm leading-relaxed sm:text-base ${
                      checkState === "correct"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-50"
                        : "border-rose-500/40 bg-rose-500/10 text-rose-50"
                    }`}
                    role="status"
                  >
                    <p className="font-bold">
                      {checkState === "correct" ? "Nailed it! 🎯" : "Not quite — give it another go."}
                    </p>
                    <p className="mt-1.5 text-zinc-200/95">{puzzle.explanation}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {activeType ? (
          <motion.div
            key="checkbar"
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-zinc-950/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md"
          >
            <div className="mx-auto w-full max-w-lg">
              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                disabled={!puzzle || (checkState === "idle" && selected === null)}
                onClick={handleCheck}
                className={`w-full rounded-2xl py-4 text-base font-bold uppercase tracking-wider shadow-xl transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  checkState === "correct"
                    ? "bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-400"
                    : checkState === "wrong"
                      ? "bg-rose-500 text-white shadow-rose-500/30 hover:bg-rose-400"
                      : "bg-sky-500 text-white shadow-sky-500/30 hover:bg-sky-400"
                }`}
              >
                {checkState === "idle" ? "Check" : checkState === "correct" ? "Next puzzle" : "Try again"}
              </motion.button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
