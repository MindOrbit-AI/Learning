"use client";

import { cn } from "@mindorbit/ui";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useMemo, useState, type DragEvent as ReactDragEvent, type ReactNode, type TouchEvent as ReactTouchEvent } from "react";
import { LEVEL_XP } from "./constants";
import { gradeLabel, metaInteractionDisplay, subjectLabel } from "./labels";
import { isUnlocked, shuffle, xpRequiredFor } from "./logic";
import type {
  Difficulty,
  Mode,
  PlayState,
  Puzzle,
  PuzzleId,
  PuzzleMeta,
  Result,
  Visual,
} from "./types";

export function Shape({ kind }: { kind: number }) {
  const base = "block h-11 w-11 shadow-lg ring-1 ring-white/20";
  if (kind === 0) return <span className={`${base} rounded-full bg-gradient-to-br from-rose-300 to-rose-600`} />;
  if (kind === 1) return <span className={`${base} rounded-xl bg-gradient-to-br from-sky-300 to-blue-600`} />;
  if (kind === 2) return <span className={`${base} bg-gradient-to-br from-amber-300 to-orange-600`} style={{ clipPath: "polygon(50% 4%, 96% 94%, 4% 94%)" }} />;
  return <span className={`${base} rotate-45 rounded-lg bg-gradient-to-br from-emerald-300 to-green-600`} />;
}

export function ColoringDiagram({
  puzzle,
  state,
  setState,
  locked,
  result,
}: {
  puzzle: Puzzle;
  state: PlayState;
  setState: (u: Partial<PlayState>) => void;
  locked: boolean;
  result: Result;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const palette = puzzle.colorPalette ?? [];
  const regions = puzzle.regions ?? [];
  const byId = useMemo(() => Object.fromEntries(palette.map((p) => [p.id, p])), [palette]);
  const activeSwatch = state.coloringTool ? byId[state.coloringTool] : undefined;

  const paint = (regionId: string) => {
    if (locked || !state.coloringTool) return;
    const prev = state.coloringFill[regionId];
    if (prev === state.coloringTool) return;
    setState({
      coloringUndo: [...state.coloringUndo, { regionId, prev }],
      coloringFill: { ...state.coloringFill, [regionId]: state.coloringTool },
      coloringFeedback: null,
    });
  };

  const subtitle = puzzle.visual.subtitle ? String(puzzle.visual.subtitle) : null;
  const title = puzzle.visual.title ? String(puzzle.visual.title) : null;

  return (
    <div className="w-full space-y-3">
      {(title || subtitle) && (
        <div className="flex flex-col gap-0.5 text-center sm:text-left">
          {title ? <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">{title}</p> : null}
          {subtitle ? <p className="text-xs font-bold text-neutral-600 dark:text-zinc-400">{subtitle}</p> : null}
        </div>
      )}
      <motion.div
        className="w-full"
        animate={result === "correct" ? { scale: [1, 1.025, 1] } : { scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={cn(
            "relative mx-auto aspect-[5/4] w-full max-w-lg overflow-hidden rounded-[1.75rem] border-2 border-neutral-200/90 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-zinc-600 dark:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.04)]",
            "bg-zinc-100 dark:bg-zinc-900",
            "bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] [background-size:18px_18px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]",
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-white/[0.04] dark:to-transparent" />
          {regions.map((region) => {
            const assigned = state.coloringFill[region.id];
            const entry = assigned ? byId[assigned] : undefined;
            const isEmpty = !assigned;
            const fill = entry?.color ?? undefined;
            const fb = state.coloringFeedback?.[region.id];
            const showCorrectGlow = fb === "correct" || (result === "correct" && assigned === region.correctColorId);
            const showWrong = fb === "wrong";
            const radius =
              region.shape === "circle" || region.shape === "ellipse"
                ? "9999px"
                : region.shape === "polygon"
                  ? "6px"
                  : "14px";

            return (
              <motion.div
                key={region.id}
                className="absolute"
                style={{ left: `${region.box.x}%`, top: `${region.box.y}%`, width: `${region.box.w}%`, height: `${region.box.h}%` }}
                animate={showWrong ? { x: [0, -6, 6, -5, 5, 0] } : { x: 0 }}
                transition={{ duration: 0.48, ease: "easeInOut" }}
                whileHover={locked ? undefined : { scale: 1.02 }}
                whileTap={locked ? undefined : { scale: 0.98 }}
              >
                <button
                  type="button"
                  disabled={locked}
                  aria-label={`Paint ${region.label}`}
                  onClick={() => paint(region.id)}
                  onMouseEnter={() => setHover(region.id)}
                  onMouseLeave={() => setHover(null)}
                  className={cn(
                    "relative flex h-full w-full items-center justify-center overflow-hidden text-center shadow-sm transition-[box-shadow,transform,border-color] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 focus-visible:ring-offset-zinc-100 disabled:cursor-not-allowed dark:focus-visible:ring-offset-zinc-900",
                    isEmpty && "border-2 border-dashed border-zinc-400/70 bg-zinc-200/35 dark:border-zinc-500/80 dark:bg-zinc-800/50",
                    !isEmpty && "border-2 border-solid",
                    hover === region.id && !locked && !isEmpty && "ring-2 ring-white/80 ring-offset-2 ring-offset-transparent dark:ring-sky-300/50",
                    hover === region.id && !locked && isEmpty && "border-violet-400/90 bg-violet-100/30 dark:border-violet-400 dark:bg-violet-950/25",
                    showWrong && "border-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.35)] dark:border-rose-400",
                    !showWrong && !isEmpty && "border-zinc-800/25 dark:border-zinc-950/40",
                    showCorrectGlow &&
                      "z-10 border-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.45),0_12px_28px_-8px_rgba(16,185,129,0.55)] dark:border-emerald-300",
                  )}
                  style={{
                    backgroundColor: fill,
                    borderRadius: radius,
                    clipPath: region.clipPath,
                  }}
                >
                  <span
                    className={cn(
                      "pointer-events-none max-w-[95%] rounded-lg px-2 py-1 text-[10px] font-black leading-tight shadow-sm backdrop-blur-[2px] sm:text-[11px]",
                      isEmpty
                        ? "bg-white/80 text-zinc-700 dark:bg-zinc-950/55 dark:text-zinc-200"
                        : "bg-black/35 text-white dark:bg-black/45",
                    )}
                  >
                    {region.label}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      {!locked && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200/80 bg-white/70 px-3 py-2 text-center dark:border-zinc-600/80 dark:bg-zinc-900/60">
          <span className="text-lg" aria-hidden>
            {activeSwatch ? "🖌️" : "👆"}
          </span>
          <p className="text-[11px] font-bold leading-snug text-neutral-600 dark:text-zinc-300">
            {activeSwatch ? (
              <>
                Painting with <span className="font-black text-neutral-900 dark:text-white">{activeSwatch.label}</span>
                <span className="mx-1.5 inline-block h-3 w-3 align-middle rounded-full ring-2 ring-black/10 dark:ring-white/25" style={{ backgroundColor: activeSwatch.color }} />
                — tap any region.
              </>
            ) : (
              "Pick a color from the palette first."
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export function VisualCard({
  visual,
  rotation,
  puzzle,
  playState,
  setPlayState,
  locked,
  result,
}: {
  visual: Visual;
  rotation: number;
  puzzle?: Puzzle | null;
  playState?: PlayState;
  setPlayState?: (u: Partial<PlayState>) => void;
  locked?: boolean;
  result?: Result;
}) {
  if (puzzle?.mode === "coloring" && playState && setPlayState) {
    return <ColoringDiagram puzzle={puzzle} state={playState} setState={setPlayState} locked={!!locked} result={result ?? "idle"} />;
  }
  if (visual.kind === "pizza") return <Pizza slices={visual.slices ?? 6} filled={visual.filled ?? 1} />;
  if (visual.kind === "machine") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {(visual.examples ?? []).map((ex) => (
            <span key={ex.input} className="rounded-xl bg-zinc-800 px-2 py-2 text-center font-mono text-sm text-zinc-100 ring-1 ring-white/10">
              {ex.input} → <b className="text-emerald-300">{ex.output}</b>
            </span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 text-2xl font-black">
          <span className="rounded-2xl bg-amber-400 px-4 py-3 text-amber-950">{visual.query}</span>
          <span className="text-zinc-500">→</span>
          <span className="rounded-2xl bg-sky-500 px-4 py-3">⚙️</span>
          <span className="text-zinc-500">→</span>
          <span className="rounded-2xl border-2 border-dashed border-emerald-300 px-4 py-3 text-emerald-200">?</span>
        </div>
      </div>
    );
  }
  if (visual.kind === "pattern") {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {(visual.sequence ?? []).map((item, i) =>
          item === -1 ? (
            <span key={i} className="grid h-11 w-11 place-items-center rounded-xl border-2 border-dashed border-violet-300 text-xl font-black">?</span>
          ) : (
            <Shape key={i} kind={item} />
          ),
        )}
      </div>
    );
  }
  if (visual.kind === "area") return <Area width={visual.width ?? 3} height={visual.height ?? 3} cols={visual.cols ?? 5} rows={visual.rows ?? 5} />;
  if (visual.kind === "water") return <Water jugs={visual.jugs ?? []} />;
  if (visual.kind === "clock") return <Clock hour={visual.hour ?? 12} minute={visual.minute ?? 0} />;
  if (visual.kind === "beam") return <Beam left={String(visual.left)} right={String(visual.right)} tilt={visual.tilt ?? 0} />;
  if (visual.kind === "coordinate") return <Coordinate x={visual.targetX ?? 0} y={visual.targetY ?? 0} />;
  if (visual.kind === "fold") return <Fold rotation={rotation} />;
  if (visual.kind === "laser") return <Laser rotation={rotation} />;
  if (visual.kind === "pyramid") return <SmallGrid grid={visual.grid ?? []} pyramid />;
  if (visual.kind === "array") return <Dots rows={visual.rows ?? 3} cols={visual.cols ?? 4} />;
  if (visual.kind === "smallGrid") return <SmallGrid grid={visual.grid ?? []} footer={visual.target ? `Rows target ${visual.target}` : undefined} />;
  if (visual.kind === "bars") return <Bars left={(visual.left as [number, number]) ?? [1, 2]} right={(visual.right as [number, number]) ?? [1, 3]} />;
  if (visual.kind === "molecule") return <Molecule atoms={visual.atoms ?? []} title={visual.title} />;
  if (visual.kind === "equation") return <EquationCard equation={visual.equation} title={visual.title} subtitle={visual.subtitle} />;
  if (visual.kind === "vectors") return <VectorBoard vectors={visual.vectors ?? []} title={visual.title} subtitle={visual.subtitle} />;
  if (visual.kind === "rockCycle") return <RockCycleDiagram stages={visual.stages ?? []} />;
  if (visual.kind === "cell") return <CellDiagram organelles={visual.organelles ?? []} title={visual.title} />;
  if (visual.kind === "binary") return <BinaryStrip bits={visual.bits ?? []} title={visual.title} subtitle={visual.subtitle} />;
  if (visual.kind === "truthTable") return <TruthTable table={visual.truthTable} subtitle={visual.subtitle} />;
  if (visual.kind === "gears") return <Gears gears={visual.gears ?? []} title={visual.title} subtitle={visual.subtitle} />;
  if (visual.kind === "code") return <CodeBlock lines={visual.code?.lines ?? []} highlight={visual.code?.highlight} title={visual.title} />;
  if (visual.kind === "circuit") return <CircuitBoard nodes={visual.circuit?.nodes ?? []} closed={visual.circuit?.closed} title={visual.title} />;
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl bg-zinc-800/60 p-5 text-center ring-1 ring-white/10">
      <span className="text-6xl drop-shadow-lg">{visual.icon ?? "✨"}</span>
      <p className="text-xl font-black text-white">{visual.title}</p>
      <p className="text-sm text-zinc-400">{visual.subtitle}</p>
    </div>
  );
}

export function Pizza({ slices, filled }: { slices: number; filled: number }) {
  const size = 208;
  const r = size / 2;
  return (
    <svg className="mx-auto drop-shadow-2xl" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: slices }, (_, i) => {
        const a = (i / slices) * Math.PI * 2 - Math.PI / 2;
        const b = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2;
        const d = `M ${r} ${r} L ${r + r * Math.cos(a)} ${r + r * Math.sin(a)} A ${r} ${r} 0 0 1 ${r + r * Math.cos(b)} ${r + r * Math.sin(b)} Z`;
        return <path key={i} d={d} fill={i < filled ? "#f59e0b" : "#78350f"} stroke="#431407" strokeWidth="2" />;
      })}
    </svg>
  );
}

export function Area({ width, height, cols, rows }: { width: number; height: number; cols: number; rows: number }) {
  return (
    <div className="mx-auto grid w-max gap-1 rounded-3xl bg-zinc-800/70 p-3" style={{ gridTemplateColumns: `repeat(${cols}, 2rem)` }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = i % cols;
        const y = Math.floor(i / cols);
        const inside = x > 0 && x <= width && y > 0 && y <= height;
        return <span key={i} className={`h-8 w-8 rounded-lg ${inside ? "bg-emerald-400 shadow-lg shadow-emerald-500/30" : "bg-zinc-700/70"}`} />;
      })}
    </div>
  );
}

export function Water({ jugs }: { jugs: { label: string; fill: number; cap: number }[] }) {
  return (
    <div className="flex items-end justify-center gap-4">
      {jugs.map((jug) => (
        <div key={jug.label} className="flex flex-col items-center gap-2">
          <div className="relative h-28 w-16 overflow-hidden rounded-b-3xl rounded-t-lg border-2 border-sky-200/40 bg-sky-950/40">
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-500 to-cyan-300" style={{ height: `${(jug.fill / jug.cap) * 100}%` }} />
          </div>
          <span className="font-mono text-sm text-sky-100">{jug.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Clock({ hour, minute }: { hour: number; minute: number }) {
  const minuteDeg = minute * 6;
  const hourDeg = (hour % 12) * 30 + minute * 0.5;
  return (
    <div className="relative mx-auto h-56 w-56 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-300 shadow-2xl ring-8 ring-zinc-700">
      <span className="absolute left-1/2 top-1/2 h-16 w-1.5 origin-bottom rounded-full bg-zinc-950" style={{ transform: `translate(-50%, -100%) rotate(${hourDeg}deg)` }} />
      <span className="absolute left-1/2 top-1/2 h-24 w-1 origin-bottom rounded-full bg-rose-500" style={{ transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)` }} />
      <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-950" />
    </div>
  );
}

export function Beam({ left, right, tilt }: { left: string; right: string; tilt: -1 | 0 | 1 }) {
  return (
    <div className="flex h-36 items-center justify-center">
      <div className="relative h-4 w-64 rounded-full bg-amber-700 shadow-xl" style={{ transform: `rotate(${tilt * 8}deg)` }}>
        <span className="absolute -top-14 left-3 rounded-2xl bg-zinc-800 px-4 py-3 font-black text-zinc-100 ring-1 ring-white/10">{left}</span>
        <span className="absolute -top-14 right-3 rounded-2xl bg-zinc-800 px-4 py-3 font-black text-zinc-100 ring-1 ring-white/10">{right}</span>
      </div>
      <div className="absolute mt-24 h-16 w-6 rounded-t-full bg-zinc-700" />
    </div>
  );
}

export function Coordinate({ x, y }: { x: number; y: number }) {
  return (
    <div className="mx-auto grid w-max grid-cols-7 gap-1 rounded-3xl bg-zinc-800/70 p-3">
      {Array.from({ length: 49 }, (_, i) => {
        const gx = (i % 7) - 3;
        const gy = 3 - Math.floor(i / 7);
        return <span key={i} className={`grid h-8 w-8 place-items-center rounded-lg text-xs ${gx === x && gy === y ? "bg-amber-400 text-amber-950" : "bg-zinc-700/70 text-zinc-500"}`}>{gx === x && gy === y ? "💎" : ""}</span>;
      })}
    </div>
  );
}

export function Fold({ rotation }: { rotation: number }) {
  return (
    <motion.div animate={{ rotate: rotation }} className="mx-auto grid w-max grid-cols-2 gap-2 rounded-3xl bg-zinc-800/70 p-4">
      {["★", "●", "▲", "■"].map((face) => <span key={face} className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-violet-700 text-3xl shadow-lg">{face}</span>)}
    </motion.div>
  );
}

export function Laser({ rotation }: { rotation: number }) {
  return (
    <div className="relative mx-auto h-40 w-72 rounded-3xl bg-zinc-900 ring-1 ring-white/10">
      <span className="absolute left-5 top-1/2 h-1 w-28 -translate-y-1/2 rounded-full bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.8)]" />
      <motion.span animate={{ rotate: rotation }} className="absolute left-36 top-16 h-3 w-16 rounded-full bg-sky-200 shadow-lg shadow-sky-300/40" />
      <span className="absolute right-7 top-10 text-4xl">💎</span>
    </div>
  );
}

export function SmallGrid({ grid, footer, pyramid }: { grid: (number | null)[][]; footer?: string; pyramid?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={pyramid ? "space-y-2" : "grid grid-cols-3 gap-1 rounded-2xl bg-zinc-700 p-1"}>
        {pyramid
          ? grid.map((row, ri) => <div key={ri} className="flex justify-center gap-2">{row.map((n, i) => <Cell key={i} n={n} wide />)}</div>)
          : grid.flat().map((n, i) => <Cell key={i} n={n} />)}
      </div>
      {footer ? <p className="text-xs text-zinc-400">{footer}</p> : null}
    </div>
  );
}

export function Cell({ n, wide }: { n: number | null; wide?: boolean }) {
  return <span className={`grid h-14 ${wide ? "w-16" : "w-14"} place-items-center rounded-xl text-xl font-black ${n === null ? "border-2 border-dashed border-violet-300 text-violet-100" : "bg-zinc-900 text-zinc-100"}`}>{n ?? "?"}</span>;
}

export function Dots({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div className="mx-auto grid w-max gap-2 rounded-3xl bg-zinc-800/70 p-4" style={{ gridTemplateColumns: `repeat(${cols}, 1.25rem)` }}>
      {Array.from({ length: rows * cols }, (_, i) => <span key={i} className="h-5 w-5 rounded-full bg-emerald-300 shadow-md shadow-emerald-500/30" />)}
    </div>
  );
}

export function Molecule({ atoms, title }: { atoms: { symbol: string; count: number; color: string }[]; title?: string }) {
  const expanded = atoms.flatMap((atom) =>
    Array.from({ length: atom.count }, (_, i) => ({ symbol: atom.symbol, color: atom.color, key: `${atom.symbol}-${i}` })),
  );
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black tracking-wide text-white/85">{title}</p> : null}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {expanded.map((atom, idx) => (
          <motion.span
            key={atom.key}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.05, type: "spring", stiffness: 280, damping: 18 }}
            className="grid h-12 w-12 place-items-center rounded-full text-base font-black text-zinc-900 shadow-lg ring-2 ring-white/40"
            style={{ background: atom.color }}
          >
            {atom.symbol}
          </motion.span>
        ))}
      </div>
      <p className="text-center text-[11px] uppercase tracking-[0.3em] text-zinc-400">
        {atoms.map((a) => `${a.count}${a.symbol}`).join(" + ")}
      </p>
    </div>
  );
}

export function EquationCard({ equation, title, subtitle }: { equation?: Visual["equation"]; title?: string; subtitle?: string }) {
  return (
    <div className="space-y-3 text-center">
      {title ? <p className="text-lg font-black text-white">{title}</p> : null}
      {equation ? (
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-200">
          <span className="rounded-2xl bg-emerald-500/20 px-3 py-2 text-emerald-100 ring-1 ring-emerald-300/30">{equation.reactants.join("  +  ")}</span>
          <span className="text-base text-zinc-400">→</span>
          <span className="rounded-2xl bg-cyan-500/20 px-3 py-2 text-cyan-100 ring-1 ring-cyan-300/30">{equation.products.join("  +  ")}</span>
        </div>
      ) : null}
      {subtitle ? <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

export function VectorBoard({ vectors, title, subtitle }: { vectors: { label: string; magnitude: number; direction: "left" | "right" | "up" | "down" }[]; title?: string; subtitle?: string }) {
  const max = Math.max(1, ...vectors.map((v) => v.magnitude));
  const arrow = (dir: string) => (dir === "left" ? "←" : dir === "right" ? "→" : dir === "up" ? "↑" : "↓");
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black text-white/85">{title}</p> : null}
      <div className="space-y-2">
        {vectors.map((vec, idx) => (
          <div key={`${vec.label}-${idx}`} className="flex items-center gap-3">
            <span className="w-16 text-xs font-black uppercase tracking-wider text-zinc-400">{vec.label}</span>
            <div className="relative flex h-6 flex-1 items-center">
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(vec.magnitude / max) * 45}%` }}
                transition={{ duration: 0.45 }}
                className={`h-2 rounded-full ${vec.direction === "right" ? "ml-1/2 bg-emerald-400" : "mr-auto bg-rose-400"}`}
                style={vec.direction === "right" ? { marginLeft: "50%" } : { marginRight: "50%", marginLeft: "auto" }}
              />
            </div>
            <span className="w-10 text-right text-base text-white">{arrow(vec.direction)}</span>
          </div>
        ))}
      </div>
      {subtitle ? <p className="text-center text-[11px] uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

export function RockCycleDiagram({ stages }: { stages: string[] }) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-black tracking-wide text-white/85">Rock Cycle</p>
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-200">
        {stages.map((stage, idx) => (
          <span key={`${stage}-${idx}`} className="flex items-center gap-2">
            <span className="rounded-2xl bg-amber-500/20 px-3 py-1 ring-1 ring-amber-300/30">{stage}</span>
            {idx < stages.length - 1 ? <span className="text-zinc-500">↻</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

export function BinaryStrip({ bits, title, subtitle }: { bits: number[]; title?: string; subtitle?: string }) {
  return (
    <div className="space-y-3 text-center">
      {title ? <p className="text-base font-black text-white">{title}</p> : null}
      <div className="flex items-center justify-center gap-1">
        {bits.map((b, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className={`grid h-10 w-10 place-items-center rounded-xl text-base font-black ${
              b === 1 ? "bg-cyan-400 text-zinc-950 shadow-lg shadow-cyan-500/30" : "bg-zinc-800 text-zinc-400"
            } ring-1 ring-white/15`}
          >
            {b}
          </motion.span>
        ))}
      </div>
      {subtitle ? <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

export function TruthTable({ table, subtitle }: { table?: Visual["truthTable"]; subtitle?: string }) {
  if (!table) return null;
  const cols = table.rows[0] && table.rows[0].b !== undefined ? 3 : 2;
  return (
    <div className="space-y-3">
      <p className="text-center text-base font-black text-white">{table.gate}</p>
      <div className="mx-auto inline-grid gap-1 rounded-2xl bg-zinc-900/70 p-2 ring-1 ring-white/10" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        <span className="px-3 py-1 text-center text-[11px] font-black uppercase tracking-wider text-zinc-400">A</span>
        {cols === 3 ? <span className="px-3 py-1 text-center text-[11px] font-black uppercase tracking-wider text-zinc-400">B</span> : null}
        <span className="px-3 py-1 text-center text-[11px] font-black uppercase tracking-wider text-zinc-400">Out</span>
        {table.rows.map((row, idx) => (
          <Fragment key={idx}>
            <span className="rounded-lg bg-zinc-800/60 px-3 py-1 text-center text-sm text-zinc-100">{row.a}</span>
            {cols === 3 ? <span className="rounded-lg bg-zinc-800/60 px-3 py-1 text-center text-sm text-zinc-100">{row.b}</span> : null}
            <span className={`rounded-lg px-3 py-1 text-center text-sm font-black ${row.out === 1 ? "bg-emerald-500/30 text-emerald-100" : "bg-zinc-800/60 text-zinc-300"}`}>{row.out}</span>
          </Fragment>
        ))}
      </div>
      {subtitle ? <p className="text-center text-[11px] uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

export function Gears({ gears, title, subtitle }: { gears: { teeth: number; label?: string }[]; title?: string; subtitle?: string }) {
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black text-white/85">{title}</p> : null}
      <div className="flex items-center justify-center gap-6">
        {gears.map((g, idx) => {
          const size = 60 + Math.min(60, g.teeth * 1.4);
          return (
            <motion.div
              key={idx}
              animate={{ rotate: idx % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 6 + idx * 2, repeat: Infinity, ease: "linear" }}
              className="relative"
              style={{ width: size, height: size }}
            >
              <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-zinc-300 to-zinc-600 shadow-xl ring-2 ring-white/20">
                <span className="text-xs font-black text-zinc-900">{g.teeth}T</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
        {gears.map((g, idx) => (<span key={idx}>{g.label ?? `Gear ${idx + 1}`}</span>))}
      </div>
      {subtitle ? <p className="text-center text-[11px] uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p> : null}
    </div>
  );
}

export function CodeBlock({ lines, highlight, title }: { lines: string[]; highlight?: number; title?: string }) {
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black text-white/85">{title}</p> : null}
      <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-950/80 p-3 text-left text-xs leading-6 text-zinc-100 ring-1 ring-white/5">
        {lines.map((line, idx) => (
          <div key={idx} className={`flex gap-2 ${highlight === idx ? "bg-violet-500/15 -mx-3 px-3" : ""}`}>
            <span className="select-none text-zinc-500">{String(idx + 1).padStart(2, "0")}</span>
            <code className="text-zinc-200">{line}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}

export function CircuitBoard({ nodes, closed, title }: { nodes: string[]; closed?: boolean; title?: string }) {
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black text-white/85">{title}</p> : null}
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-200">
        {nodes.map((node, idx) => (
          <span key={idx} className="flex items-center gap-2">
            <span className={`rounded-2xl px-3 py-1 ring-1 ${closed ? "bg-emerald-500/20 ring-emerald-300/30 text-emerald-100" : "bg-amber-500/20 ring-amber-300/30 text-amber-100"}`}>{node}</span>
            {idx < nodes.length - 1 ? <span className="text-zinc-500">━</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CellDiagram({ organelles, title }: { organelles: { name: string; emoji: string }[]; title?: string }) {
  return (
    <div className="space-y-3">
      {title ? <p className="text-center text-sm font-black tracking-wide text-white/85">{title}</p> : null}
      <div className="relative mx-auto h-44 w-44 rounded-full bg-gradient-to-br from-emerald-500/40 via-cyan-500/30 to-violet-500/40 ring-2 ring-white/15">
        {organelles.map((org, idx) => {
          const angle = (idx / Math.max(1, organelles.length)) * Math.PI * 2;
          const radius = 56;
          const x = 88 + Math.cos(angle) * radius;
          const y = 88 + Math.sin(angle) * radius;
          return (
            <span
              key={org.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 px-2 py-1 text-[11px] font-black text-white shadow ring-1 ring-white/20"
              style={{ left: `${x}px`, top: `${y}px` }}
              title={org.name}
            >
              {org.emoji}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function Bars({ left, right }: { left: [number, number]; right: [number, number] }) {
  return (
    <div className="space-y-4">
      {[
        ["Left", left],
        ["Right", right],
      ].map(([label, pair]) => {
        const [n, d] = pair as [number, number];
        return (
          <div key={String(label)} className="space-y-1">
            <div className="flex justify-between text-sm text-zinc-400"><span>{String(label)}</span><span>{n}/{d}</span></div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${d}, 1fr)` }}>
              {Array.from({ length: d }, (_, i) => <span key={i} className={`h-8 rounded-lg ${i < n ? "bg-orange-400" : "bg-zinc-700"}`} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Interaction({ puzzle, state, setState, locked }: { puzzle: Puzzle; state: PlayState; setState: (s: Partial<PlayState>) => void; locked: boolean }) {
  if (puzzle.mode === "choice") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {(puzzle.choices ?? []).map((choice) => (
          <motion.button
            key={choice}
            type="button"
            whileTap={{ scale: 0.96 }}
            disabled={locked}
            onClick={() => setState({ choice })}
            className={`min-h-16 rounded-2xl border-2 px-3 py-3 text-lg font-black transition ${state.choice === choice ? "border-[#84d8ff] dark:border-sky-600 bg-[#ddf4ff] dark:bg-sky-950/50 text-[#1899d6] dark:text-sky-400 shadow-[0_3px_0_0_#84d8ff] dark:shadow-[0_3px_0_0_#0369a1]" : "border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 text-neutral-800 dark:text-zinc-100 shadow-[0_3px_0_0_#e5e5e5] dark:shadow-[0_3px_0_0_#27272a] active:border-b-2 active:translate-y-0.5"}`}
          >
            {puzzle.type === "patternBlocks" ? <span className="flex justify-center"><Shape kind={Number(choice)} /></span> : choice}
          </motion.button>
        ))}
      </div>
    );
  }

  if (puzzle.mode === "slider" && puzzle.slider) {
    return (
      <div className="rounded-3xl border-2 border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 p-5">
        <div className="mb-4 text-center font-mono text-4xl font-black text-[#1899d6] dark:text-sky-400">{state.slider.toFixed(1)}</div>
        <input disabled={locked} type="range" min={puzzle.slider.min} max={puzzle.slider.max} step={puzzle.slider.step} value={state.slider} onChange={(e) => setState({ slider: Number(e.target.value) })} className="h-3 w-full accent-[#1cb0f6]" />
      </div>
    );
  }

  if (puzzle.mode === "drag") {
    const onDrop = (event: ReactDragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!locked) setState({ dropped: event.dataTransfer.getData("text/plain") });
    };
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {(puzzle.dragItems ?? []).map((item) => (
            <button key={item} type="button" draggable={!locked} disabled={locked} onDragStart={(e) => e.dataTransfer.setData("text/plain", item)} onClick={() => setState({ dropped: item })} className="rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 px-3 py-4 text-lg font-black text-white shadow-lg shadow-sky-500/20">
              {item}
            </button>
          ))}
        </div>
        <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="grid min-h-24 place-items-center rounded-3xl border-2 border-dashed border-[#84d8ff] dark:border-sky-600 bg-[#ddf4ff] dark:bg-sky-950/50 p-4 text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-[#1899d6] dark:text-sky-400">{state.dropped ?? puzzle.dropLabel}</span>
        </div>
      </div>
    );
  }

  if (puzzle.mode === "match") {
    const rights = shuffle((puzzle.pairs ?? []).map((p) => p.right));
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {(puzzle.pairs ?? []).map((pair) => (
            <button key={pair.left} type="button" disabled={locked || state.matches[pair.left] !== undefined} onClick={() => setState({ pendingLeft: pair.left })} className={`w-full rounded-2xl border-2 px-3 py-4 text-left font-black ${state.pendingLeft === pair.left ? "border-purple-400 bg-purple-100 text-neutral-900 dark:border-purple-500 dark:bg-purple-950/70 dark:text-purple-100" : state.matches[pair.left] ? "border-[#46a302] bg-[#d7ffb8] text-neutral-900 dark:border-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-100" : "border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-neutral-800 dark:text-zinc-100"}`}>
              {pair.left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rights.map((right: string) => (
            <button key={right} type="button" disabled={locked || Object.values(state.matches).includes(right)} onClick={() => state.pendingLeft && setState({ matches: { ...state.matches, [state.pendingLeft]: right }, pendingLeft: null })} className={`w-full rounded-2xl border-2 px-3 py-4 text-left font-black text-neutral-800 dark:text-zinc-100 ${Object.values(state.matches).includes(right) ? "border-[#46a302] bg-[#d7ffb8] dark:bg-emerald-950/35" : "border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900"}`}>
              {right}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (puzzle.mode === "path") {
    return (
      <div className="space-y-3">
        <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-2xl border-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-2">
          {state.path.length === 0 ? <span className="px-2 text-sm text-neutral-500 dark:text-zinc-400">Tap tiles to draw a path</span> : state.path.map((idx, i) => <span key={`${idx}-${i}`} className="rounded-xl border-2 border-[#1899d6] bg-[#1cb0f6] px-3 py-2 font-mono font-black text-white">{puzzle.pathTiles?.[idx]}</span>)}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {(puzzle.pathTiles ?? []).map((tile, i) => <button key={`${tile}-${i}`} type="button" disabled={locked} onClick={() => setState({ path: [...state.path, i] })} className="rounded-2xl border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 px-3 py-4 font-mono text-lg font-black text-neutral-800 dark:text-zinc-100 transition active:border-b-2 active:translate-y-0.5">{tile}</button>)}
        </div>
        <button type="button" disabled={locked} onClick={() => setState({ path: [] })} className="w-full rounded-xl border-2 border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 py-2 text-sm font-bold text-neutral-600 dark:text-zinc-400">Clear path</button>
      </div>
    );
  }

  if (puzzle.mode === "rotate") {
    return <button type="button" disabled={locked} onClick={() => setState({ rotation: (state.rotation + (puzzle.rotationStep ?? 90)) % 360 })} className="w-full rounded-2xl border-2 border-[#46a302] border-b-4 border-b-[#46a302] bg-[#58cc02] px-4 py-4 text-lg font-black text-white transition active:border-b-2 active:translate-y-0.5">Rotate {puzzle.rotationStep ?? 90}°</button>;
  }

  if (puzzle.mode === "reorder") {
    return <Reorder state={state} setState={setState} locked={locked} />;
  }

  if (puzzle.mode === "numpad") {
    return <Numpad puzzle={puzzle} state={state} setState={setState} locked={locked} />;
  }

  if (puzzle.mode === "sort") {
    return <SortCategories puzzle={puzzle} state={state} setState={setState} locked={locked} />;
  }

  if (puzzle.mode === "coloring") {
    const palette = puzzle.colorPalette ?? [];
    const regions = puzzle.regions ?? [];
    const total = regions.length;
    const colored = regions.filter((r) => state.coloringFill[r.id]).length;
    const pct = total > 0 ? Math.round((colored / total) * 100) : 0;
    const undo = () => {
      if (locked) return;
      const stack = state.coloringUndo;
      if (stack.length === 0) return;
      const last = stack[stack.length - 1]!;
      const nextStack = stack.slice(0, -1);
      const nextFill = { ...state.coloringFill };
      if (last.prev === undefined) delete nextFill[last.regionId];
      else nextFill[last.regionId] = last.prev;
      setState({ coloringUndo: nextStack, coloringFill: nextFill, coloringFeedback: null });
    };
    const reset = () => {
      if (locked) return;
      setState({ coloringFill: {}, coloringUndo: [], coloringFeedback: null });
    };
    return (
      <div className="space-y-4 rounded-3xl border-2 border-neutral-200 bg-gradient-to-b from-neutral-50 to-neutral-100/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-zinc-600 dark:from-zinc-900/90 dark:to-zinc-950/90 dark:shadow-none">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">Progress</span>
            <span className="tabular-nums text-xs font-black text-neutral-800 dark:text-zinc-100">
              {colored}
              <span className="font-bold text-neutral-400 dark:text-zinc-500"> / </span>
              {total}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-neutral-200/90 ring-1 ring-black/[0.04] dark:bg-zinc-800 dark:ring-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-500"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
          </div>
          <p className="text-[11px] font-semibold leading-snug text-neutral-600 dark:text-zinc-400">
            Choose a brush, then tap regions on the big diagram. Undo reverts one stroke; Reset clears the canvas.
          </p>
        </div>
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-zinc-400">Palette</p>
          <div className={cn("grid gap-2", palette.length <= 2 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
            {palette.map((sw) => {
              const selected = state.coloringTool === sw.id;
              return (
                <button
                  key={sw.id}
                  type="button"
                  disabled={locked}
                  aria-pressed={selected}
                  onClick={() => setState({ coloringTool: sw.id })}
                  className={cn(
                    "group relative flex min-h-[3.25rem] flex-col justify-center gap-0.5 rounded-2xl border-2 px-3 py-2.5 text-left transition",
                    selected
                      ? "border-violet-500 bg-gradient-to-br from-violet-50 to-fuchsia-50 shadow-[0_3px_0_0_#7c3aed] dark:border-violet-400 dark:from-violet-950/60 dark:to-fuchsia-950/40 dark:shadow-[0_3px_0_0_#6d28d9]"
                      : "border-neutral-200 border-b-4 border-b-neutral-300 bg-white hover:border-violet-300/80 hover:bg-violet-50/40 active:border-b-2 active:translate-y-0.5 dark:border-zinc-600 dark:border-b-zinc-700 dark:bg-zinc-900 dark:hover:border-violet-500/50 dark:hover:bg-violet-950/20",
                  )}
                >
                  {selected ? (
                    <span
                      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-[11px] font-black text-white shadow-md dark:bg-violet-500"
                      aria-hidden
                    >
                      ✓
                    </span>
                  ) : null}
                  <span className={cn("flex items-center gap-2.5", selected && "pr-7")}>
                    <span
                      className={cn(
                        "h-9 w-9 shrink-0 rounded-xl shadow-inner ring-2 transition",
                        selected ? "ring-violet-400/80 dark:ring-violet-400" : "ring-black/[0.06] dark:ring-white/15",
                      )}
                      style={{ backgroundColor: sw.color }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black text-neutral-900 dark:text-zinc-50">{sw.label}</span>
                      <span className="mt-0.5 block text-[11px] font-medium leading-snug text-neutral-600 dark:text-zinc-400">{sw.meaning}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={locked || state.coloringUndo.length === 0}
            onClick={undo}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-neutral-200 border-b-4 border-b-neutral-300 bg-white py-3 text-sm font-black text-neutral-800 transition active:border-b-2 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:border-b-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <span className="text-base" aria-hidden>
              ↩
            </span>
            Undo
          </button>
          <button
            type="button"
            disabled={locked}
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-rose-200 border-b-4 border-b-rose-300 bg-gradient-to-b from-rose-50 to-rose-100/90 py-3 text-sm font-black text-rose-900 transition active:border-b-2 active:translate-y-0.5 disabled:opacity-40 dark:border-rose-800 dark:border-b-rose-900 dark:from-rose-950/50 dark:to-rose-950/30 dark:text-rose-100"
          >
            <span className="text-base" aria-hidden>
              ↻
            </span>
            Reset
          </button>
        </div>
      </div>
    );
  }

  return <Swipe labels={puzzle.swipeLabels ?? []} state={state} setState={setState} locked={locked} />;
}

export function Numpad({ puzzle, state, setState, locked }: { puzzle: Puzzle; state: PlayState; setState: (s: Partial<PlayState>) => void; locked: boolean }) {
  const keys: string[] = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    puzzle.numpadAllowMinus ? "−" : "",
    "0",
    puzzle.numpadAllowDecimal ? "." : "",
  ];
  const press = (key: string) => {
    if (locked || !key) return;
    if (key === "−") {
      setState({ numpad: state.numpad.startsWith("-") ? state.numpad.slice(1) : `-${state.numpad}` });
      return;
    }
    if (key === "." && state.numpad.includes(".")) return;
    setState({ numpad: state.numpad + key });
  };
  return (
    <div className="rounded-3xl border-2 border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 p-4">
      <div className="mb-3 grid min-h-16 place-items-center rounded-2xl border-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 text-center font-mono text-3xl font-black tracking-wider text-[#1899d6] dark:text-sky-400">
        {state.numpad.length > 0 ? state.numpad.replace(/-/g, "−") : <span className="text-neutral-400 dark:text-zinc-500">type a number</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key, i) => (
          <motion.button
            key={`${key}-${i}`}
            type="button"
            whileTap={{ scale: 0.94 }}
            disabled={locked || !key}
            onClick={() => press(key)}
            className={`min-h-14 rounded-2xl border-2 border-b-4 text-xl font-black transition active:border-b-2 active:translate-y-0.5 ${
              key === ""
                ? "invisible"
                : key === "−" || key === "."
                ? "border-amber-300 border-b-amber-400 bg-amber-100 text-amber-900 dark:border-amber-600 dark:border-b-amber-700 dark:bg-amber-950/50 dark:text-amber-100"
                : "border-neutral-200 dark:border-zinc-600 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50"
            }`}
          >
            {key}
          </motion.button>
        ))}
      </div>
      <button
        type="button"
        disabled={locked || state.numpad.length === 0}
        onClick={() => setState({ numpad: state.numpad.slice(0, -1) })}
        className="mt-2 w-full rounded-2xl border-2 border-rose-300 bg-rose-50 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-100 disabled:opacity-40 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-950/60"
      >
        ⌫ Backspace
      </button>
    </div>
  );
}

export function SortCategories({ puzzle, state, setState, locked }: { puzzle: Puzzle; state: PlayState; setState: (s: Partial<PlayState>) => void; locked: boolean }) {
  const items = puzzle.sortItems ?? [];
  const categories = puzzle.sortCategories ?? [];
  const placedLabels = Object.keys(state.sort);
  const unplaced = items.filter((item) => !placedLabels.includes(item.label));
  const assign = (cat: string) => {
    if (!state.pendingItem || locked) return;
    setState({ sort: { ...state.sort, [state.pendingItem]: cat }, pendingItem: null });
  };
  const unassign = (label: string) => {
    if (locked) return;
    const next = { ...state.sort };
    delete next[label];
    setState({ sort: next, pendingItem: null });
  };
  return (
    <div className="space-y-3">
      <div className="rounded-3xl border-2 border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 p-3">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-zinc-400">
          Cards{unplaced.length > 0 ? "" : " · all placed"}
        </p>
        <div className="flex flex-wrap gap-2">
          {unplaced.length === 0 ? (
            <span className="text-xs text-neutral-500 dark:text-zinc-400">Tap a bucket card to reassign.</span>
          ) : (
            unplaced.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={locked}
                onClick={() => setState({ pendingItem: state.pendingItem === item.label ? null : item.label })}
                className={`rounded-2xl border-2 px-3 py-2 text-sm font-black transition ${
                  state.pendingItem === item.label
                    ? "border-[#e5a000] bg-[#ffc800] text-neutral-900 dark:text-zinc-50"
                    : "border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-neutral-800 dark:text-zinc-100"
                }`}
              >
                {item.label}
              </button>
            ))
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => {
          const inside = items.filter((item) => state.sort[item.label] === category);
          return (
            <button
              key={category}
              type="button"
              disabled={locked || !state.pendingItem}
              onClick={() => assign(category)}
              className={`min-h-32 rounded-3xl border-2 border-dashed p-3 text-left transition ${
                state.pendingItem ? "border-[#84d8ff] dark:border-sky-600 bg-[#ddf4ff] dark:bg-sky-950/50 text-neutral-900 dark:text-zinc-100" : "border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-600 dark:text-zinc-400">{category}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {inside.length === 0 ? (
                  <span className="text-[11px] text-neutral-400 dark:text-zinc-500">empty</span>
                ) : (
                  inside.map((item) => (
                    <span
                      key={item.label}
                      onClick={(event) => {
                        event.stopPropagation();
                        unassign(item.label);
                      }}
                      className="rounded-full border border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 px-2 py-0.5 text-xs font-bold text-neutral-700 dark:text-zinc-300"
                    >
                      {item.label} ×
                    </span>
                  ))
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Reorder({ state, setState, locked }: { state: PlayState; setState: (s: Partial<PlayState>) => void; locked: boolean }) {
  const [held, setHeld] = useState<number | null>(null);
  return (
    <div className="space-y-2.5">
      <p className="text-center text-[11px] font-semibold leading-snug text-neutral-500 dark:text-zinc-400">
        Tap one tile, then another to <span className="text-neutral-700 dark:text-zinc-300">swap</span> them.
      </p>
      <div className="flex flex-col gap-2">
        {state.order.map((tile, i) => (
          <button
            key={`${tile}-${i}`}
            type="button"
            disabled={locked}
            onClick={() => {
              if (held === null) {
                setHeld(i);
                return;
              }
              const next = [...state.order];
              [next[held], next[i]] = [next[i]!, next[held]!];
              setHeld(null);
              setState({ order: next });
            }}
            className={cn(
              "flex w-full min-h-[3.25rem] items-center gap-3 rounded-2xl border-2 border-b-4 px-3 py-2.5 text-left shadow-sm transition active:border-b-2 active:translate-y-0.5 sm:min-h-[3.5rem] sm:px-4 sm:py-3",
              held === i
                ? "border-[#e5a000] border-b-[#e5a000] bg-[#fff4d4] text-neutral-900 shadow-[0_3px_0_0_#e5a000] dark:border-amber-500 dark:border-b-amber-600 dark:bg-amber-950/45 dark:text-amber-50 dark:shadow-[0_3px_0_0_#d97706]"
                : "border-neutral-200 border-b-neutral-300 bg-white text-neutral-900 dark:border-zinc-600 dark:border-b-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:shadow-none",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black tabular-nums",
                held === i
                  ? "bg-amber-200/90 text-amber-950 dark:bg-amber-800/80 dark:text-amber-50"
                  : "bg-neutral-100 text-neutral-500 dark:bg-zinc-800 dark:text-zinc-400",
              )}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 text-pretty text-center text-sm font-bold leading-snug sm:text-[0.95rem]">{tile}</span>
            <span className="flex w-8 shrink-0 flex-col items-center gap-0.5 text-neutral-300 dark:text-zinc-600" aria-hidden>
              <span className="h-1 w-4 rounded-full bg-current" />
              <span className="h-1 w-4 rounded-full bg-current" />
              <span className="h-1 w-4 rounded-full bg-current" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Swipe({ labels, state, setState, locked }: { labels: string[]; state: PlayState; setState: (s: Partial<PlayState>) => void; locked: boolean }) {
  const detect = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
  };
  const finishTouch = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (!state.touchStart || locked) return;
    setState({ swipe: detect(state.touchStart, { x: event.changedTouches[0]?.clientX ?? 0, y: event.changedTouches[0]?.clientY ?? 0 }), touchStart: null });
  };
  return (
    <div
      onTouchStart={(e) => setState({ touchStart: { x: e.touches[0]?.clientX ?? 0, y: e.touches[0]?.clientY ?? 0 } })}
      onTouchEnd={finishTouch}
      className="grid min-h-36 place-items-center rounded-3xl border-2 border-dashed border-[#84d8ff] dark:border-sky-600 bg-[#ddf4ff] dark:bg-sky-950/50 p-5 text-center"
    >
      <div>
        <p className="text-4xl">↕️</p>
        <p className="mt-2 font-black text-[#1899d6] dark:text-sky-400">{state.swipe ? `Swiped ${state.swipe}` : "Swipe toward a door"}</p>
        <p className="mt-2 text-xs text-neutral-500 dark:text-zinc-400">{labels.join(" · ")}</p>
      </div>
    </div>
  );
}

export function Confetti({ show }: { show: boolean }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i: number) => ({
        icon: ["⭐", "✨", "🎉", "💫"][i % 4]!,
        x: (Math.random() - 0.5) * 95,
        y: -25 - Math.random() * 45,
        delay: i * 0.03,
      })),
    [],
  );
  return (
    <AnimatePresence>
      {show ? (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {bits.map((bit: { icon: string; x: number; y: number; delay: number }, i: number) => (
            <motion.span key={i} className="absolute left-1/2 top-1/2 text-3xl" initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }} animate={{ opacity: 0, x: `${bit.x}vw`, y: `${bit.y}vh`, scale: 1.5, rotate: 180 }} transition={{ duration: 1.1, delay: bit.delay, ease: "easeOut" }}>
              {bit.icon}
            </motion.span>
          ))}
        </div>
      ) : null}
    </AnimatePresence>
  );
}
export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  render,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  render?: (option: T) => string;
}) {
  return (
    <div className="-mx-1 flex flex-wrap gap-2 overflow-x-auto px-1 pb-1 sm:overflow-visible">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`shrink-0 rounded-full border-2 px-3 py-2 text-[11px] font-black uppercase tracking-wider transition sm:py-1.5 ${
              selected
                ? "border-[#46a302] bg-[#58cc02] text-white shadow-[0_3px_0_0_#46a302]"
                : "border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-neutral-600 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-zinc-800"
            }`}
          >
            {render ? render(option) : option}
          </button>
        );
      })}
    </div>
  );
}

export function FilterSelect<T extends string>({
  id,
  options,
  value,
  onChange,
  render,
}: {
  id: string;
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  render?: (option: T) => string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full cursor-pointer appearance-none rounded-2xl border-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 py-3 pl-4 pr-10 text-sm font-bold text-neutral-800 dark:text-zinc-100 shadow-[0_2px_0_0_#e5e5e5] dark:shadow-[0_2px_0_0_#27272a] focus:border-[#84d8ff] focus:outline-none focus:ring-2 focus:ring-[#ddf4ff] dark:focus:border-sky-500 dark:focus:ring-sky-900/40"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-white dark:bg-zinc-900 text-neutral-800 dark:text-zinc-100">
            {render ? render(option) : option}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 dark:text-zinc-500" aria-hidden>
        ▾
      </span>
    </div>
  );
}

export function Badge({ tone, children }: { tone: "violet" | "sky" | "amber" | "emerald"; children: ReactNode }) {
  const colors: Record<string, string> = {
    violet: "bg-purple-100 text-purple-900 ring-1 ring-purple-200 dark:bg-purple-950/50 dark:text-purple-100 dark:ring-purple-800",
    sky: "bg-sky-100 text-sky-900 ring-1 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-100 dark:ring-sky-800",
    amber: "bg-amber-100 text-amber-950 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-800",
    emerald: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-800",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${colors[tone]}`}>
      {children}
    </span>
  );
}

export function CategoryCard({ meta, onClick, unlocked }: { meta: PuzzleMeta; onClick: () => void; unlocked: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`group relative flex h-full min-h-[15.5rem] w-full flex-col overflow-hidden rounded-[2rem] border-2 border-b-4 p-5 text-left transition active:translate-y-0.5 sm:min-h-[16.5rem] ${
        unlocked
          ? "border-neutral-200 dark:border-zinc-600 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 shadow-[0_4px_0_0_#e5e5e5] dark:shadow-[0_4px_0_0_#27272a] hover:bg-neutral-50 dark:hover:bg-zinc-800/90"
          : "border-neutral-200 dark:border-zinc-600 border-b-neutral-300 dark:border-b-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 hover:border-amber-300"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${meta.gradient} transition ${
          unlocked ? "opacity-10 group-hover:opacity-20" : "opacity-5"
        }`}
      />
      <div className="flex items-start gap-4">
        <div
          className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${meta.gradient} text-3xl shadow-lg ${
            unlocked ? "" : "saturate-50"
          }`}
        >
          <span className={unlocked ? "" : "opacity-60"}>{meta.emoji}</span>
          {!unlocked ? (
            <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-amber-400 bg-white dark:bg-zinc-900 text-base shadow-sm">🔒</span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`line-clamp-2 text-sm font-black leading-tight ${unlocked ? "text-neutral-900 dark:text-zinc-50" : "text-neutral-500 dark:text-zinc-400"}`}>{meta.title}</h3>
          <p className="mt-0.5 truncate text-[11px] text-neutral-500 dark:text-zinc-400">{meta.short}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Badge tone="violet">{gradeLabel(meta.grade)}</Badge>
            <Badge tone="sky">{subjectLabel(meta.subject)}</Badge>
            {meta.isBoss ? <Badge tone="amber">BOSS</Badge> : null}
            {meta.isMasteryTest ? <Badge tone="violet">Mastery</Badge> : null}
          </div>
        </div>
      </div>
      <div className="mt-4 min-h-0 flex-1">
        <p className={`line-clamp-2 text-xs leading-relaxed ${unlocked ? "text-neutral-600 dark:text-zinc-400" : "text-neutral-500 dark:text-zinc-400"}`}>{meta.skill}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-[11px] text-neutral-500 dark:text-zinc-400">
        <span className="inline-flex max-w-[65%] items-center gap-1 truncate rounded-full border border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 px-2 py-0.5 font-bold uppercase tracking-wider text-neutral-700 dark:text-zinc-300">
          {metaInteractionDisplay(meta)}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1">⏱ ~{meta.estMin} min</span>
      </div>
    </motion.button>
  );
}

export function SkillTree({
  metas,
  xp,
  onPick,
  completions,
}: {
  metas: PuzzleMeta[];
  xp: number;
  onPick: (id: PuzzleId) => void;
  completions: Record<string, number>;
}) {
  const tierFor = (meta: PuzzleMeta) => {
    const req = xpRequiredFor(meta);
    if (req === 0) return "Tier 1 · Grade 9 Easy";
    if (req <= 250) return "Tier 2 · Grade 9 Med/Hard";
    if (req <= 500) return "Tier 3 · Grade 10";
    if (req <= 1200) return "Tier 4 · Grade 11";
    return "Tier 5 · Grade 12 · Boss · Mastery";
  };
  const tiers = ["Tier 1 · Grade 9 Easy", "Tier 2 · Grade 9 Med/Hard", "Tier 3 · Grade 10", "Tier 4 · Grade 11", "Tier 5 · Grade 12 · Boss · Mastery"];
  const grouped: Record<string, PuzzleMeta[]> = {};
  for (const tier of tiers) grouped[tier] = [];
  for (const meta of metas) {
    const tier = tierFor(meta);
    grouped[tier]!.push(meta);
  }
  return (
    <div className="space-y-6">
      {tiers.map((tier) => {
        const inTier = grouped[tier]!;
        if (inTier.length === 0) return null;
        const unlockedInTier = inTier.filter((m) => isUnlocked(m, xp, completions)).length;
        return (
          <div key={tier} className="rounded-[2rem] border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 p-5 shadow-[0_4px_0_0_#e5e5e5] dark:shadow-[0_4px_0_0_#27272a]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1899d6] dark:text-sky-400">{tier}</p>
                <p className="mt-1 text-base font-black text-neutral-900 dark:text-zinc-50">{inTier.length} puzzles · {unlockedInTier} unlocked</p>
              </div>
              <div className="h-2 w-32 rounded-full bg-neutral-200 dark:bg-zinc-700">
                <div className="h-2 rounded-full bg-[#58cc02]" style={{ width: `${(unlockedInTier / inTier.length) * 100}%` }} />
              </div>
            </div>
            <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
              {inTier.map((meta) => (
                <div key={meta.id} className="flex h-full min-h-0 w-full">
                  <CategoryCard
                    meta={meta}
                    onClick={() => onPick(meta.id)}
                    unlocked={isUnlocked(meta, xp, completions)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StatCard({ label, value, tone }: { label: string; value: string; tone: "violet" | "cyan" | "amber" | "emerald" }) {
  const colors: Record<typeof tone, string> = {
    violet: "from-purple-100 to-fuchsia-50 dark:from-purple-950/50 dark:to-fuchsia-950/20",
    cyan: "from-sky-100 to-blue-50 dark:from-sky-950/50 dark:to-blue-950/20",
    amber: "from-amber-100 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20",
    emerald: "from-emerald-100 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20",
  };
  return (
    <div className={`rounded-3xl border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-gradient-to-br ${colors[tone]} p-4 shadow-[0_3px_0_0_#e5e5e5] dark:shadow-[0_3px_0_0_#27272a]`}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1.5 text-2xl font-black tracking-tight text-neutral-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}

export function SearchInput({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-zinc-500">🔎</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search puzzles, skills, or topics…"
        className="w-full rounded-2xl border-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 py-3.5 pl-9 pr-9 text-sm font-bold text-neutral-800 dark:text-zinc-100 shadow-[0_2px_0_0_#e5e5e5] dark:shadow-[0_2px_0_0_#27272a] placeholder:text-neutral-400 dark:placeholder:text-zinc-500 focus:border-[#84d8ff] focus:outline-none focus:ring-2 focus:ring-[#ddf4ff] dark:focus:border-sky-500 dark:focus:ring-sky-900/40"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 text-xs text-neutral-600 dark:text-zinc-400"
          aria-label="Clear search"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

export function ProgressBar({ xp }: { xp: number }) {
  const level = Math.floor(xp / LEVEL_XP) + 1;
  const inLevel = xp % LEVEL_XP;
  return (
    <div className="flex items-center gap-2.5">
      <span className="rounded-lg border-2 border-[#84d8ff] dark:border-sky-600 bg-[#ddf4ff] dark:bg-sky-950/50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#1899d6] dark:text-sky-300">Lv {level}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-neutral-200 dark:border-zinc-600 bg-neutral-200 dark:bg-zinc-700">
        <motion.div className="h-full rounded-full bg-[#58cc02]" animate={{ width: `${inLevel}%` }} />
      </div>
      <span className="font-mono text-xs font-bold text-neutral-500 dark:text-zinc-400">{inLevel}/{LEVEL_XP}</span>
    </div>
  );
}
