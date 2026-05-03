"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@mindorbit/ui";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { stripMathTeachingLabel } from "@/features/visual-problem-solving/mathLabelDisplay";
import { seededShuffle } from "@/lib/deterministicShuffle";
import type { RuntimeMicroStep } from "./types";
import { tapChoiceCorrectOptionId } from "./formatCorrectAnswerLabel";
import { VisualProblemSurface } from "@/features/visual-problem-solving/VisualProblemSurface";

type Props = {
  step: RuntimeMicroStep;
  disabled: boolean;
  shakeToken: number;
  onCommit: (payload: unknown) => void;
  revealCorrect?: boolean;
};

export function MicroStepSurface({
  step,
  disabled,
  shakeToken,
  onCommit,
  revealCorrect = false,
}: Props) {
  switch (step.type) {
    case "tap_choice":
      return (
        <TapChoice
          step={step}
          disabled={disabled}
          shakeToken={shakeToken}
          revealCorrect={revealCorrect}
          onCommit={onCommit}
        />
      );
    case "fill_blank":
      return (
        <FillBlank
          step={step}
          disabled={disabled}
          shakeToken={shakeToken}
          revealCorrect={revealCorrect}
          onCommit={onCommit}
        />
      );
    case "sequence_order":
      return <SequenceOrder step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    case "drag_match":
      return (
        <DragMatch
          step={step}
          disabled={disabled}
          shakeToken={shakeToken}
          revealCorrect={revealCorrect}
          onCommit={onCommit}
        />
      );
    case "slider_adjust":
      return (
        <SliderAdjust
          step={step}
          disabled={disabled}
          shakeToken={shakeToken}
          revealCorrect={revealCorrect}
          onCommit={onCommit}
        />
      );
    case "reveal_step":
      return <RevealStep step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    case "visual_toggle":
      return <VisualToggle step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    case "connect_nodes":
      return (
        <ConnectNodes
          step={step}
          disabled={disabled}
          shakeToken={shakeToken}
          revealCorrect={revealCorrect}
          onCommit={onCommit}
        />
      );
    case "visual_problem":
      return (
        <VisualProblemSurface
          step={step}
          disabled={disabled}
          shakeToken={shakeToken}
          revealCorrect={revealCorrect}
          onCommit={onCommit}
        />
      );
    default:
      return (
        <FillBlank
          step={step}
          disabled={disabled}
          shakeToken={shakeToken}
          revealCorrect={revealCorrect}
          onCommit={onCommit}
        />
      );
  }
}

function TapChoice({ step, disabled, shakeToken, onCommit, revealCorrect = false }: Props) {
  const options = (step.interactionConfig.options ?? []) as Array<{ id: string; label: string }>;
  const layout = (step.interactionConfig.layout as string) ?? "grid";
  const correctId = tapChoiceCorrectOptionId(step);
  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.45 }}
      className={cn(
        "touch-manipulation grid gap-3",
        layout === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
      )}
    >
      {options.map((o) => {
        const isAnswer = revealCorrect && correctId != null && o.id === correctId;
        return (
          <button
            key={o.id}
            type="button"
            disabled={disabled}
            onClick={() => onCommit(o.id)}
            className={cn(
              "min-h-[52px] cursor-pointer rounded-2xl border-2 border-muted bg-background px-4 py-4 text-left text-base font-semibold shadow-sm transition-all select-none",
              "hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]",
              "disabled:pointer-events-none disabled:opacity-60",
              isAnswer &&
                "pointer-events-none !border-emerald-500 !bg-emerald-500/15 !text-emerald-950 !opacity-100 shadow-[0_0_20px_rgba(34,197,94,0.35)] dark:!text-emerald-50"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </motion.div>
  );
}

function FillBlank({ step, disabled, shakeToken, onCommit, revealCorrect = false }: Props) {
  const acceptAny = step.interactionConfig.acceptAny === true;
  const [v, setV] = useState("");
  const expected = String(step.correctAnswer ?? "");
  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="flex flex-col gap-2"
    >
      <input
        type="text"
        value={v}
        disabled={disabled}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => {
          if (!disabled && acceptAny && v.trim().length >= 2) onCommit(v);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && v.trim() && !disabled) onCommit(v);
        }}
        placeholder={String(step.interactionConfig.placeholder ?? "…")}
        className="w-full rounded-2xl border-2 border-muted bg-background px-4 py-3 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      {revealCorrect && expected ? (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-center text-sm font-semibold text-emerald-900 dark:text-emerald-100">
          Correct answer: <span className="font-mono">{expected}</span>
        </p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {acceptAny ? "Enter or click away when ready." : "Press Enter to lock in."}
      </p>
    </motion.div>
  );
}

const SEQ_DRAG_MIME = "application/x-mindorbit-seq-id";

function SequenceOrder({ step, disabled, shakeToken, onCommit }: Props) {
  const items = (step.interactionConfig.items ?? []) as Array<{ id: string; label: string }>;
  const itemsKey = JSON.stringify(items.map((i) => ({ id: i.id, label: i.label })));
  const target = useMemo(() => JSON.parse(step.correctAnswer) as string[], [step.correctAnswer]);
  const committed = useRef(false);
  const dragIdRef = useRef<string | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const initialOrder = useMemo(() => {
    const ids = (JSON.parse(itemsKey) as Array<{ id: string }>).map((i) => i.id);
    const baseSeed = `${step.sourceSceneId}::${step.id}::${itemsKey}::${shakeToken}`;
    let shuffled = seededShuffle(ids, baseSeed);
    let guard = 0;
    while (shuffled.join(",") === target.join(",") && guard++ < 24) {
      shuffled = seededShuffle(ids, `${baseSeed}#${guard}`);
    }
    return shuffled;
  }, [itemsKey, target, step.sourceSceneId, step.id, shakeToken]);

  const [order, setOrder] = useState<string[]>(initialOrder);

  useEffect(() => {
    setOrder(initialOrder);
    committed.current = false;
    dragIdRef.current = null;
    setDragOverIdx(null);
    setDraggingId(null);
  }, [step.id, shakeToken, initialOrder]);

  useEffect(() => {
    if (disabled || committed.current) return;
    if (order.length === target.length && order.every((id, i) => id === target[i])) {
      committed.current = true;
      onCommit(JSON.stringify(order));
    }
  }, [order, target, disabled, onCommit]);

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      const t = next[idx] as string;
      next[idx] = next[j] as string;
      next[j] = t;
      return next;
    });
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    dragIdRef.current = id;
    setDraggingId(id);
    try {
      e.dataTransfer.setData(SEQ_DRAG_MIME, id);
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "move";
    } catch {
      /* ignore */
    }
  };

  const onDragOverRow = (e: React.DragEvent, idx: number) => {
    if (disabled) return;
    if (!dragIdRef.current) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(idx);
  };

  const onDragLeaveRow = (e: React.DragEvent) => {
    const related = e.relatedTarget as Node | null;
    if (related && e.currentTarget.contains(related)) return;
    setDragOverIdx(null);
  };

  const onDropRow = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    let id = "";
    try {
      id = e.dataTransfer.getData(SEQ_DRAG_MIME) || e.dataTransfer.getData("text/plain");
    } catch {
      /* ignore */
    }
    if (!id) id = dragIdRef.current ?? "";
    dragIdRef.current = null;
    setDraggingId(null);
    setDragOverIdx(null);
    if (!id) return;
    setOrder((prev) => {
      const fromIdx = prev.indexOf(id);
      if (fromIdx < 0 || fromIdx === toIdx) return prev;
      const next = [...prev];
      const removed = next.splice(fromIdx, 1)[0];
      if (removed === undefined) return prev;
      next.splice(toIdx, 0, removed);
      return next;
    });
  };

  const onDragEnd = () => {
    dragIdRef.current = null;
    setDraggingId(null);
    setDragOverIdx(null);
  };

  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="space-y-2"
    >
      <p className="text-xs text-muted-foreground">
        Drag a step by the handle (or the card) to reorder. Arrows nudge one row if drag is awkward on your device.
      </p>
      {order.map((id, idx) => {
        const it = items.find((x) => x.id === id);
        const shown = stripMathTeachingLabel(it?.label ?? id);
        return (
          <div
            key={`${idx}-${id}`}
            draggable={!disabled}
            role="listitem"
            onDragStart={(e) => onDragStart(e, id)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => onDragOverRow(e, idx)}
            onDragLeave={onDragLeaveRow}
            onDrop={(e) => onDropRow(e, idx)}
            className={cn(
              "flex items-center gap-2 rounded-2xl border border-muted bg-card px-3 py-2.5 transition",
              !disabled && "cursor-grab active:cursor-grabbing",
              draggingId === id && "opacity-55",
              dragOverIdx === idx && draggingId && draggingId !== id && "ring-2 ring-emerald-500/70"
            )}
          >
            <span className="text-muted-foreground select-none" aria-hidden>
              <GripVertical className="h-5 w-5 shrink-0" />
            </span>
            <span className="flex-1 font-mono text-sm font-medium leading-snug text-foreground">{shown}</span>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                disabled={disabled}
                className="rounded-lg p-1 hover:bg-muted"
                aria-label="Move up"
                onClick={() => move(idx, -1)}
              >
                <ChevronUp className="h-5 w-5" />
              </button>
              <button
                type="button"
                disabled={disabled}
                className="rounded-lg p-1 hover:bg-muted"
                aria-label="Move down"
                onClick={() => move(idx, 1)}
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        );
      })}
      <p className="text-xs text-muted-foreground">Order is correct when it matches the solution — we check automatically.</p>
    </motion.div>
  );
}

function DragMatch({ step, disabled, shakeToken, onCommit, revealCorrect = false }: Props) {
  const items = (step.interactionConfig.items ?? []) as Array<{ id: string; label: string }>;
  const slots = (step.interactionConfig.slots ?? []) as Array<{ id: string; label?: string }>;
  const want = useMemo(() => JSON.parse(step.correctAnswer) as Record<string, string>, [step.correctAnswer]);
  const [pick, setPick] = useState<string | null>(null);
  const [map, setMap] = useState<Record<string, string>>({});
  const committed = useRef(false);

  useEffect(() => {
    committed.current = false;
    setMap({});
    setPick(null);
  }, [step.id, shakeToken]);

  useEffect(() => {
    if (disabled || committed.current) return;
    const keys = Object.keys(want);
    if (keys.length === 0) return;
    const filled = keys.every((k) => map[k]);
    if (filled) {
      committed.current = true;
      onCommit(JSON.stringify(map));
    }
  }, [map, want, disabled, onCommit]);

  const itemLine = items.map((i) => i.label || i.id).join(" · ");
  const targetLine = slots.map((s) => s.label ?? s.id).join(" · ");

  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="space-y-3"
    >
      {revealCorrect && Object.keys(want).length > 0 ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-xs font-medium text-emerald-950 dark:text-emerald-50">
          <p className="font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">Solution</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            {Object.entries(want).map(([slotId, itemId]) => {
              const it = items.find((i) => i.id === itemId)?.label ?? itemId;
              const sl = slots.find((s) => s.id === slotId)?.label ?? slotId;
              return (
                <li key={slotId}>
                  {it} → {sl}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {itemLine || targetLine ? (
        <div className="rounded-xl border border-muted bg-muted/25 px-3 py-2.5 text-xs leading-relaxed text-foreground">
          {itemLine ? (
            <p>
              <span className="font-bold uppercase tracking-wide text-muted-foreground">Cards — </span>
              <span className="font-mono text-[13px] font-semibold sm:text-sm">{itemLine}</span>
            </p>
          ) : null}
          {targetLine ? (
            <p className={itemLine ? "mt-2" : ""}>
              <span className="font-bold uppercase tracking-wide text-muted-foreground">Match targets — </span>
              <span className="font-mono text-[13px] font-semibold sm:text-sm">{targetLine}</span>
            </p>
          ) : null}
        </div>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Tap a card under <span className="font-semibold text-foreground">Cards</span>, then tap a row under{" "}
        <span className="font-semibold text-foreground">Targets</span> (tap-to-match, not drag).
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Cards</p>
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              disabled={disabled}
              onClick={() => setPick(it.id)}
              className={cn(
                "w-full rounded-xl border px-3 py-2 text-left font-mono text-sm font-semibold text-foreground",
                pick === it.id ? "border-primary bg-primary/10" : "border-muted"
              )}
            >
              {it.label || it.id}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Targets</p>
          {slots.length === 0 ? (
            <p className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs leading-snug text-amber-950 dark:text-amber-50">
              This step is missing drop targets in the mission data. Regenerate the mission, or ask support to fix
              scene JSON (<span className="font-mono">slots</span> / <span className="font-mono">correctAnswerJson</span>
              ).
            </p>
          ) : (
            slots.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={disabled || !pick}
                onClick={() => {
                  if (!pick) return;
                  setMap((m) => ({ ...m, [s.id]: pick }));
                  setPick(null);
                }}
                className="w-full rounded-xl border border-dashed border-muted-foreground/40 px-3 py-3 text-left text-sm"
              >
                {map[s.id] ? items.find((i) => i.id === map[s.id])?.label : s.label ?? "Tap after picking an item"}
              </button>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SliderAdjust({ step, disabled, shakeToken, onCommit, revealCorrect = false }: Props) {
  const min = Number(step.interactionConfig.min) ?? 0;
  const max = Number(step.interactionConfig.max) ?? 100;
  const st = Number(step.interactionConfig.step) ?? 1;
  const target = Number(step.correctAnswer);
  const [val, setVal] = useState(() => Math.round((min + max) / 2 / st) * st);
  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="space-y-3"
    >
      <input
        type="range"
        min={min}
        max={max}
        step={st}
        disabled={disabled}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        onPointerUp={() => !disabled && onCommit(String(val))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-sm font-mono text-muted-foreground">
        <span>{min}</span>
        <span className="font-bold text-foreground">{val}</span>
        <span>{max}</span>
      </div>
      {revealCorrect && Number.isFinite(target) ? (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-center text-sm font-semibold text-emerald-900 dark:text-emerald-100">
          Target value: <span className="font-mono tabular-nums">{target}</span>
        </p>
      ) : null}
      <p className="text-xs text-muted-foreground">Release to check — nudge until it feels right.</p>
    </motion.div>
  );
}

function RevealStep({ step, disabled, onCommit }: Props) {
  const mode = String(step.interactionConfig.mode ?? "reveal");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (mode !== "observe" && mode !== "reveal") return;
    if (step.correctAnswer === "__timer__") {
      const ms = Number(step.interactionConfig.autoAdvanceMs ?? 2200);
      const t = window.setTimeout(() => onCommit("__timer__"), ms);
      return () => window.clearTimeout(t);
    }
  }, [mode, step.correctAnswer, step.interactionConfig.autoAdvanceMs, onCommit]);

  if (mode === "observe") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onCommit("__tap__")}
        className="w-full rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 text-left transition hover:border-primary/60"
      >
        <p className="text-lg font-bold">{String(step.interactionConfig.headline ?? "")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{String(step.interactionConfig.detail ?? "")}</p>
        <p className="mt-4 text-xs text-primary">Tap anywhere to continue sooner —</p>
      </button>
    );
  }

  const full = String(step.interactionConfig.full ?? "");
  const teaser = String(step.interactionConfig.teaser ?? "Tap");
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!open) {
          setOpen(true);
          return;
        }
        onCommit("__tap__");
      }}
      className="w-full rounded-2xl border border-muted bg-muted/30 p-6 text-left"
    >
      {!open ? (
        <p className="text-lg font-semibold text-muted-foreground">{teaser}…</p>
      ) : (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-base leading-relaxed">
          {full}
        </motion.p>
      )}
      <p className="mt-4 text-xs text-primary">{open ? "Tap again to continue" : "Tap to reveal"}</p>
    </button>
  );
}

function VisualToggle({ step, disabled, shakeToken, onCommit }: Props) {
  const targets = (step.interactionConfig.targets ?? []) as Array<{ id: string; label: string }>;
  const wantSorted = useMemo(() => {
    const w = JSON.parse(step.correctAnswer) as string[];
    return [...w].sort().join(",");
  }, [step.correctAnswer]);
  const wantLen = useMemo(() => (JSON.parse(step.correctAnswer) as string[]).length, [step.correctAnswer]);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const committed = useRef(false);

  useEffect(() => {
    committed.current = false;
    setSel(new Set());
  }, [step.id, shakeToken]);

  useEffect(() => {
    if (disabled || committed.current) return;
    const arr = [...sel].sort().join(",");
    if (sel.size === wantLen && arr === wantSorted) {
      committed.current = true;
      onCommit(JSON.stringify([...sel].sort()));
    }
  }, [sel, wantSorted, wantLen, disabled, onCommit]);

  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="flex flex-wrap gap-2"
    >
      {targets.map((t) => {
        const on = sel.has(t.id);
        return (
          <button
            key={t.id}
            type="button"
            disabled={disabled}
            onClick={() => {
              setSel((prev) => {
                const next = new Set(prev);
                if (next.has(t.id)) next.delete(t.id);
                else next.add(t.id);
                return next;
              });
            }}
            className={cn(
              "rounded-full border-2 px-4 py-2 text-sm font-semibold transition",
              on ? "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-100" : "border-muted"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </motion.div>
  );
}

function ConnectNodes({ step, disabled, shakeToken, onCommit, revealCorrect = false }: Props) {
  const nodes = (step.interactionConfig.nodes ?? []) as Array<{ id: string; label: string }>;
  const [a, setA] = useState<string | null>(null);
  let correctPair: [string, string] | null = null;
  try {
    const p = JSON.parse(step.correctAnswer) as string[];
    if (Array.isArray(p) && p.length >= 2) correctPair = [String(p[0]), String(p[1])];
  } catch {
    /* ignore */
  }
  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="flex flex-wrap gap-2"
    >
      {nodes.map((n) => {
        const inReveal =
          revealCorrect &&
          correctPair &&
          (n.id === correctPair[0] || n.id === correctPair[1]);
        return (
          <button
            key={n.id}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!a) {
                setA(n.id);
                return;
              }
              if (a === n.id) {
                setA(null);
                return;
              }
              onCommit(JSON.stringify([a, n.id]));
              setA(null);
            }}
            className={cn(
              "rounded-2xl border-2 px-4 py-3 text-sm font-bold",
              inReveal && "!border-emerald-500 !bg-emerald-500/15 !text-emerald-950 ring-2 !ring-emerald-500/40 dark:!text-emerald-50",
              !inReveal && a === n.id ? "border-cyan-500 ring-2 ring-cyan-500/30" : !inReveal && "border-muted"
            )}
          >
            {n.label}
          </button>
        );
      })}
      <p className="w-full text-xs text-muted-foreground">Tap start, then end, to draw one link.</p>
    </motion.div>
  );
}
