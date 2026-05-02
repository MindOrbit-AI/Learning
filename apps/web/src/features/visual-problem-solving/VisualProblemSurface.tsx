"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@mindorbit/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { RuntimeMicroStep } from "@/features/micro-engine/types";
import { normalizeNodeList } from "@/lib/mission-to-lesson/buildVisualProblemMerged";
import { expandNumberLineBounds, inferNumericTarget } from "./numberLineBounds";
import { TriangleDiagramPair } from "./TriangleDiagramPair";
import { visualPhaseSatisfied } from "./validateVisualProblem";

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

export function VisualProblemSurface({ step, disabled, shakeToken, onCommit }: Props) {
  const ws = (step.interactionConfig.visualWorkspace ?? {}) as Record<string, unknown>;
  const kind = String(ws.kind ?? "part_model");
  const timelineTarget = useMemo(() => {
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: { correctOrder?: string[] } };
      const fromAnswer = o.visual?.correctOrder;
      if (Array.isArray(fromAnswer) && fromAnswer.length > 0) return fromAnswer;
    } catch {
      /* ignore */
    }
    return Array.isArray(ws.correctOrder) ? (ws.correctOrder as string[]) : [];
  }, [step.correctAnswer, ws]);
  const [text, setText] = useState("");
  const [visualPayload, setVisualPayload] = useState<Record<string, unknown>>({});

  const setPartVisual = useCallback((ids: string[]) => {
    setVisualPayload({ kind: "part_model", shadedPartIds: ids });
  }, []);
  const setLineVisual = useCallback((value: number) => {
    setVisualPayload({ kind: "number_line", value });
  }, []);
  const setTimelineVisual = useCallback((order: string[]) => {
    setVisualPayload({ kind: "timeline", order });
  }, []);
  const setLinkVisual = useCallback((patch: Record<string, unknown>) => {
    setVisualPayload({ kind: "node_link", ...patch });
  }, []);

  useEffect(() => {
    setText("");
    setVisualPayload({});
  }, [step.id, shakeToken]);

  const visualOkLocal = useMemo(
    () => visualPhaseSatisfied(step.correctAnswer, visualPayload),
    [step.correctAnswer, visualPayload]
  );

  const numberLineSlider = useMemo(() => {
    if (kind !== "number_line") return null;
    let min = Number(ws.min ?? 0);
    let max = Number(ws.max ?? 10);
    let sliderStep = Number(ws.step ?? 0.5);
    let target = Number(ws.targetValue ?? NaN);
    try {
      const o = JSON.parse(step.correctAnswer) as {
        visual?: Record<string, unknown>;
        answer?: string | null;
      };
      const v = o.visual;
      if (v) {
        if (v.min != null) min = Number(v.min);
        if (v.max != null) max = Number(v.max);
        if (v.step != null) sliderStep = Number(v.step);
        if (v.targetValue != null) target = Number(v.targetValue);
      }
      if (!Number.isFinite(target) && o.answer != null) {
        const fromAnswer = inferNumericTarget(String(o.answer));
        if (fromAnswer != null) target = fromAnswer;
      }
    } catch {
      /* ignore */
    }
    if (!Number.isFinite(target)) target = (min + max) / 2;
    return expandNumberLineBounds({ min, max, step: sliderStep, targetValue: target });
  }, [kind, step.correctAnswer, ws]);

  const partModelTotal = useMemo(() => {
    const isPartKind =
      kind === "part_model" ||
      kind === "fraction_bar" ||
      kind === "pizza_model" ||
      kind === "area_model";
    if (!isPartKind) return 8;
    let t = Number(ws.totalParts ?? 8);
    try {
      const o = JSON.parse(step.correctAnswer) as { visual?: { totalParts?: unknown } };
      const tp = o.visual?.totalParts;
      if (tp != null && Number.isFinite(Number(tp))) t = Number(tp);
    } catch {
      /* ignore */
    }
    return Math.max(1, Math.round(t));
  }, [kind, step.correctAnswer, ws]);

  const showTriangleHint = useMemo(() => {
    const scenario = String(step.interactionConfig.problemScenario ?? "");
    const hasDiagram =
      Array.isArray(ws.diagramTriangles) ||
      (ws.triangleA && typeof ws.triangleA === "object") ||
      (ws.triangleB && typeof ws.triangleB === "object");
    return /\btriangle/i.test(scenario) && !hasDiagram;
  }, [step.interactionConfig.problemScenario, ws]);

  const allowEmptyAnswer = useMemo(() => {
    try {
      const o = JSON.parse(step.correctAnswer) as { answer?: string | null };
      return String(o.answer ?? "").trim() === "";
    } catch {
      return step.interactionConfig.answerOptional === true;
    }
  }, [step.correctAnswer, step.interactionConfig.answerOptional]);

  const submit = useCallback(() => {
    const payload = JSON.stringify({ visual: visualPayload, text });
    onCommit(payload);
  }, [visualPayload, text, onCommit]);

  return (
    <motion.div
      key={shakeToken}
      animate={shakeToken ? { x: [0, -6, 6, 0] } : {}}
      className="touch-manipulation space-y-6"
    >
      <div className="relative z-10 touch-manipulation rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Visual workspace</p>
        <TriangleDiagramPair workspace={ws} />
        {showTriangleHint ? (
          <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-snug text-amber-950 dark:text-amber-50">
            Drawn triangles will show here once this mission includes side lengths for both shapes.{" "}
            <span className="font-semibold">Regenerate the mission</span> to get the latest layout, or use the numbered
            parts below for now.
          </p>
        ) : null}
        {kind === "part_model" || kind === "fraction_bar" || kind === "pizza_model" || kind === "area_model" ? (
          <PartModel
            total={partModelTotal}
            disabled={disabled}
            onChange={setPartVisual}
          />
        ) : null}
        {kind === "number_line" && numberLineSlider ? (
          <NumberLinePicker
            min={numberLineSlider.min}
            max={numberLineSlider.max}
            step={numberLineSlider.step}
            disabled={disabled}
            onChange={setLineVisual}
          />
        ) : null}
        {kind === "timeline" ? (
          <TimelineOrder
            items={(ws.items as Array<{ id: string; label: string }>) ?? []}
            target={timelineTarget}
            disabled={disabled}
            onChange={setTimelineVisual}
          />
        ) : null}
        {(kind === "node_link" || kind === "cause_effect_link") ? (
          <NodeLinkPicker
            nodes={normalizeNodeList(ws.nodes)}
            expectedJson={step.correctAnswer}
            disabled={disabled}
            onChange={setLinkVisual}
          />
        ) : null}
      </div>

      <div
        className={cn(
          "space-y-2 transition-opacity",
          !visualOkLocal && "pointer-events-none opacity-40"
        )}
      >
        <p className="text-xs font-semibold text-muted-foreground">
          {visualOkLocal ? "Now answer using the model you built." : "Finish the visual first — then the question unlocks."}
        </p>
        <input
          type="text"
          value={text}
          disabled={disabled || !visualOkLocal}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            allowEmptyAnswer
              ? String(step.interactionConfig.answerPlaceholder ?? "Optional — add a label if the prompt asks for one")
              : String(step.interactionConfig.answerPlaceholder ?? "Type your answer…")
          }
          className="w-full rounded-2xl border-2 border-muted bg-background px-4 py-3 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="button"
          disabled={disabled || !visualOkLocal || (!allowEmptyAnswer && !text.trim())}
          onClick={submit}
          className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-40"
        >
          Check answer
        </button>
      </div>
    </motion.div>
  );
}

function PartModel({
  total,
  disabled,
  onChange,
}: {
  total: number;
  disabled: boolean;
  onChange: (ids: string[]) => void;
}) {
  const n = Math.max(1, Math.round(total));
  const dense = n > 24;
  const extraDense = n > 60;
  const [shaded, setShaded] = useState<Set<string>>(new Set());

  useEffect(() => {
    setShaded(new Set());
  }, [n]);

  useEffect(() => {
    onChange([...shaded]);
  }, [shaded, onChange]);

  const toggle = (id: string) => {
    if (disabled) return;
    setShaded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative z-10 mt-3 space-y-2">
      <p className="text-sm text-muted-foreground">
        Click or tap parts to shade the model (each part toggles on or off).
      </p>
      <div
        className={cn(
          "rounded-lg border border-muted/30 bg-background/40 p-2",
          n > 36 && "max-h-[min(22rem,48vh)] overflow-y-auto overscroll-contain"
        )}
      >
        <div
          className={cn(
            "grid gap-1.5",
            extraDense && "grid-cols-10",
            dense && !extraDense && "grid-cols-6 sm:grid-cols-8",
            !dense && "grid-cols-4 sm:grid-cols-6"
          )}
        >
          {Array.from({ length: n }, (_, i) => {
            const id = String(i);
            const on = shaded.has(id);
            return (
              <button
                key={id}
                type="button"
                disabled={disabled}
                aria-pressed={on}
                aria-label={`Part ${i + 1}, ${on ? "shaded" : "not shaded"}`}
                onClick={() => toggle(id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(id);
                  }
                }}
                className={cn(
                  "cursor-pointer rounded-lg border-2 font-bold transition touch-manipulation select-none active:scale-[0.97]",
                  extraDense && "h-7 min-w-0 px-0 text-[10px]",
                  dense && !extraDense && "h-9 min-w-[2.25rem] text-xs",
                  !dense && "h-12 min-w-[2.75rem] text-sm sm:min-w-[3rem]",
                  on
                    ? "border-amber-500 bg-amber-500/25 text-amber-950 dark:text-amber-50"
                    : "border-muted bg-background hover:border-primary/40"
                )}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {shaded.size} of {n} shaded
      </p>
    </div>
  );
}

function NumberLinePicker({
  min,
  max,
  step,
  disabled,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  const mid = Math.round(((min + max) / 2) / step) * step;
  const [val, setVal] = useState(mid);

  useEffect(() => {
    setVal(mid);
  }, [min, max, step, mid]);

  useEffect(() => {
    onChange(val);
  }, [val, onChange]);

  return (
    <div className="mt-3 space-y-3">
      <p className="text-sm text-muted-foreground">Move the marker to the value you read from the line.</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <p className="text-center font-mono text-lg font-bold tabular-nums">{val}</p>
    </div>
  );
}

function TimelineOrder({
  items,
  target,
  disabled,
  onChange,
}: {
  items: Array<{ id: string; label: string }>;
  target: string[];
  disabled: boolean;
  onChange: (order: string[]) => void;
}) {
  const initialOrder = useMemo(() => {
    const ids = items.map((i) => i.id);
    let shuffled = shuffle(ids);
    let guard = 0;
    while (target.length && shuffled.join(",") === target.join(",") && guard++ < 12) {
      shuffled = shuffle(ids);
    }
    return shuffled;
  }, [items, target]);

  const [order, setOrder] = useState<string[]>(initialOrder);

  useEffect(() => {
    setOrder(initialOrder);
  }, [items, initialOrder]);

  useEffect(() => {
    onChange(order);
  }, [order, onChange]);

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
    <div className="mt-3 space-y-2">
      <p className="text-sm text-muted-foreground">Reorder events into the correct sequence.</p>
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
    </div>
  );
}

function NodeLinkPicker({
  nodes,
  expectedJson,
  disabled,
  onChange,
}: {
  nodes: Array<{ id: string; label: string }>;
  expectedJson: string;
  disabled: boolean;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const expectedEdgeCount = useMemo(() => {
    try {
      const o = JSON.parse(expectedJson) as {
        visual?: { correctEdges?: [string, string][]; correctEdge?: [string, string] };
      };
      const v = o.visual;
      if (!v) return 1;
      if (Array.isArray(v.correctEdges) && v.correctEdges.length > 0) return v.correctEdges.length;
      if (Array.isArray(v.correctEdge) && v.correctEdge.length === 2) return 1;
      return 1;
    } catch {
      return 1;
    }
  }, [expectedJson]);

  const [pickFrom, setPickFrom] = useState<string | null>(null);
  const [edges, setEdges] = useState<[string, string][]>([]);

  useEffect(() => {
    setPickFrom(null);
    setEdges([]);
  }, [expectedJson, nodes]);

  const labelOf = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;

  const pushEdges = (next: [string, string][]) => {
    setEdges(next);
    onChange({ edges: next });
  };

  const handleNodePointer = (nodeId: string) => {
    if (disabled || nodes.length === 0) return;
    if (edges.length >= expectedEdgeCount) {
      pushEdges([]);
      setPickFrom(nodeId);
      return;
    }
    if (!pickFrom) {
      setPickFrom(nodeId);
      return;
    }
    if (pickFrom === nodeId) {
      setPickFrom(null);
      return;
    }
    const pair: [string, string] = [pickFrom, nodeId];
    setPickFrom(null);

    if (expectedEdgeCount <= 1) {
      pushEdges([pair]);
      return;
    }

    const next = [...edges, pair];
    if (next.length >= expectedEdgeCount) {
      pushEdges(next.slice(0, expectedEdgeCount));
    } else {
      pushEdges(next);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <p className="text-sm text-muted-foreground">
        {expectedEdgeCount <= 1
          ? "Click the from-node, then the to-node (direction matters for a linked list)."
          : `Draw ${expectedEdgeCount} arrows in order: click start, then end for each link (${edges.length}/${expectedEdgeCount} done).`}
      </p>
      {edges.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {edges.map(([from, to], i) => (
            <span
              key={`${from}-${to}-${i}`}
              className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-950 dark:text-cyan-100"
            >
              {labelOf(from)} → {labelOf(to)}
            </span>
          ))}
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setPickFrom(null);
              pushEdges([]);
            }}
            className="text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            Clear links
          </button>
        </div>
      ) : null}
      {nodes.length === 0 ? (
        <p className="text-sm text-amber-800 dark:text-amber-200">
          This problem has no nodes to connect yet (generator data issue).
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {nodes.map((n) => (
          <button
            key={n.id}
            type="button"
            disabled={disabled}
            onClick={() => handleNodePointer(n.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNodePointer(n.id);
              }
            }}
            className={cn(
              "flex h-14 min-w-[3.25rem] cursor-pointer select-none items-center justify-center rounded-full border-2 px-4 text-base font-bold transition touch-manipulation",
              pickFrom === n.id
                ? "border-cyan-500 bg-cyan-500/15 ring-2 ring-cyan-500/35"
                : "border-muted bg-background hover:border-primary/40"
            )}
          >
            {n.label}
          </button>
        ))}
      </div>
      {pickFrom ? (
        <p className="text-xs font-medium text-cyan-700 dark:text-cyan-300">
          Selected “{labelOf(pickFrom)}” — click the next node it points to.
        </p>
      ) : null}
    </div>
  );
}
