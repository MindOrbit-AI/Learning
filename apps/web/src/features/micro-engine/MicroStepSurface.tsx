"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@mindorbit/ui";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { RuntimeMicroStep } from "./types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i] as T;
    a[i] = a[j] as T;
    a[j] = t;
  }
  return a;
}

type Props = {
  step: RuntimeMicroStep;
  disabled: boolean;
  shakeToken: number;
  onCommit: (payload: unknown) => void;
};

export function MicroStepSurface({ step, disabled, shakeToken, onCommit }: Props) {
  switch (step.type) {
    case "tap_choice":
      return <TapChoice step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    case "fill_blank":
      return <FillBlank step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    case "sequence_order":
      return <SequenceOrder step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    case "drag_match":
      return <DragMatch step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    case "slider_adjust":
      return <SliderAdjust step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    case "reveal_step":
      return <RevealStep step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    case "visual_toggle":
      return <VisualToggle step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    case "connect_nodes":
      return <ConnectNodes step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
    default:
      return <FillBlank step={step} disabled={disabled} shakeToken={shakeToken} onCommit={onCommit} />;
  }
}

function TapChoice({ step, disabled, shakeToken, onCommit }: Props) {
  const options = (step.interactionConfig.options ?? []) as Array<{ id: string; label: string }>;
  const layout = (step.interactionConfig.layout as string) ?? "grid";
  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.45 }}
      className={cn("grid gap-3", layout === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          disabled={disabled}
          onClick={() => onCommit(o.id)}
          className={cn(
            "min-h-[52px] rounded-2xl border-2 border-muted bg-background px-4 py-4 text-left text-base font-semibold shadow-sm transition-all",
            "hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]",
            "disabled:pointer-events-none disabled:opacity-60"
          )}
        >
          {o.label}
        </button>
      ))}
    </motion.div>
  );
}

function FillBlank({ step, disabled, shakeToken, onCommit }: Props) {
  const acceptAny = step.interactionConfig.acceptAny === true;
  const [v, setV] = useState("");
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
      <p className="text-xs text-muted-foreground">
        {acceptAny ? "Enter or click away when ready." : "Press Enter to lock in."}
      </p>
    </motion.div>
  );
}

function SequenceOrder({ step, disabled, shakeToken, onCommit }: Props) {
  const items = (step.interactionConfig.items ?? []) as Array<{ id: string; label: string }>;
  const target = useMemo(() => JSON.parse(step.correctAnswer) as string[], [step.correctAnswer]);
  const committed = useRef(false);
  const initialOrder = useMemo(() => {
    const ids = items.map((i) => i.id);
    let shuffled = shuffle(ids);
    let guard = 0;
    while (shuffled.join(",") === target.join(",") && guard++ < 12) {
      shuffled = shuffle(ids);
    }
    return shuffled;
  }, [items, target]);

  const [order, setOrder] = useState<string[]>(initialOrder);

  useEffect(() => {
    setOrder(initialOrder);
    committed.current = false;
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

  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="space-y-2"
    >
      {order.map((id, idx) => {
        const it = items.find((x) => x.id === id);
        return (
          <div
            key={`${id}-${idx}`}
            className="flex items-center gap-2 rounded-2xl border border-muted bg-card px-3 py-2"
          >
            <span className="flex-1 text-sm font-medium">{it?.label ?? id}</span>
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
        );
      })}
      <p className="text-xs text-muted-foreground">Reorder until it feels right — we detect the match.</p>
    </motion.div>
  );
}

function DragMatch({ step, disabled, shakeToken, onCommit }: Props) {
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
  }, [step.id]);

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

  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Pick</p>
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            disabled={disabled}
            onClick={() => setPick(it.id)}
            className={cn(
              "w-full rounded-xl border px-3 py-2 text-left text-sm",
              pick === it.id ? "border-primary bg-primary/10" : "border-muted"
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Drop zone</p>
        {slots.map((s) => (
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
        ))}
      </div>
    </motion.div>
  );
}

function SliderAdjust({ step, disabled, shakeToken, onCommit }: Props) {
  const min = Number(step.interactionConfig.min) ?? 0;
  const max = Number(step.interactionConfig.max) ?? 100;
  const st = Number(step.interactionConfig.step) ?? 1;
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

function ConnectNodes({ step, disabled, shakeToken, onCommit }: Props) {
  const nodes = (step.interactionConfig.nodes ?? []) as Array<{ id: string; label: string }>;
  const [a, setA] = useState<string | null>(null);
  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="flex flex-wrap gap-2"
    >
      {nodes.map((n) => (
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
            a === n.id ? "border-cyan-500 ring-2 ring-cyan-500/30" : "border-muted"
          )}
        >
          {n.label}
        </button>
      ))}
      <p className="w-full text-xs text-muted-foreground">Tap start, then end, to draw one link.</p>
    </motion.div>
  );
}
