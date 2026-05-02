"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mindorbit/ui";
import { cn } from "@mindorbit/ui";
import { Link2, Trash2, CheckCircle2, XCircle, MousePointer2 } from "lucide-react";
import type { InteractiveModeBaseProps } from "@/features/interactive-games/runner-types";
import { getGameConfig } from "@/features/interactive-games/runner-types";
import { DragDropCanvas } from "@/components/games/shared/DragDropCanvas";
import { FeedbackToast } from "@/components/games/shared/FeedbackToast";

type Edge = { from: string; to: string };
type Conn = { from: string; to: string; relationship?: string };

function edgeMultiset(edges: Edge[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of edges) {
    const k = `${e.from}→${e.to}`;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

function multisetsEqual(a: Map<string, number>, b: Map<string, number>): boolean {
  if (a.size !== b.size) return false;
  for (const [k, v] of a) {
    if (b.get(k) !== v) return false;
  }
  return true;
}

function labelFor(components: { id: string; label: string }[], id: string): string {
  return components.find((c) => c.id === id)?.label ?? id;
}

export function BuildTheSystem({ envelope, runtime, setRuntime, setScoreXp, postEvent, onCompleteSession }: InteractiveModeBaseProps) {
  const gc = getGameConfig(envelope);
  const topic = String(envelope.topic ?? "system");

  const components = useMemo(() => {
    const raw = gc.components;
    if (!Array.isArray(raw)) return [] as { id: string; label: string; description?: string }[];
    return raw
      .map((x) => {
        const o = x as Record<string, unknown>;
        return {
          id: String(o.id ?? ""),
          label: String(o.label ?? o.id ?? "Node"),
          description: o.description != null ? String(o.description) : undefined,
        };
      })
      .filter((c) => c.id);
  }, [gc.components]);

  const correctConnections = useMemo(() => {
    const raw = gc.correctConnections;
    if (!Array.isArray(raw)) return [] as Conn[];
    return raw
      .map((x) => {
        const o = x as Record<string, unknown>;
        return {
          from: String(o.from ?? ""),
          to: String(o.to ?? ""),
          relationship: o.relationship != null ? String(o.relationship) : undefined,
        };
      })
      .filter((c) => c.from && c.to);
  }, [gc.correctConnections]);

  const [edges, setEdges] = useState<Edge[]>([]);
  const [linkSource, setLinkSource] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; variant: "success" | "error" | "info" } | null>(null);
  const [validatedOk, setValidatedOk] = useState(false);
  const dragId = useRef<string | null>(null);
  const t0 = useRef(Date.now());

  const expected = useMemo(() => edgeMultiset(correctConnections.map((c) => ({ from: c.from, to: c.to }))), [correctConnections]);

  const addEdge = useCallback((from: string, to: string) => {
    if (from === to) return;
    setEdges((prev) => {
      const k = `${from}→${to}`;
      if (prev.some((e) => `${e.from}→${e.to}` === k)) return prev;
      return [...prev, { from, to }];
    });
  }, []);

  const onDragStart = (id: string) => (e: React.DragEvent) => {
    dragId.current = id;
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "link";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "link";
  };

  const onDropOn = (targetId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = e.dataTransfer.getData("text/plain") || dragId.current;
    dragId.current = null;
    if (!from) return;
    addEdge(from, targetId);
  };

  const onChipClick = (id: string) => {
    if (!linkSource) {
      setLinkSource(id);
      setToast({ text: `Selected “${labelFor(components, id)}”. Tap another node to connect.`, variant: "info" });
      return;
    }
    if (linkSource === id) {
      setLinkSource(null);
      setToast(null);
      return;
    }
    addEdge(linkSource, id);
    setLinkSource(null);
    setToast(null);
  };

  const removeEdge = (idx: number) => {
    setEdges((e) => e.filter((_, i) => i !== idx));
    setValidatedOk(false);
  };

  const clearAll = () => {
    setEdges([]);
    setLinkSource(null);
    setValidatedOk(false);
    setToast(null);
  };

  const validate = useCallback(async () => {
    const act = edgeMultiset(edges);
    const ok = multisetsEqual(act, expected);
    const ms = Date.now() - t0.current;
    setValidatedOk(ok);
    const r = await postEvent({
      eventType: "build_system_validate",
      payload: {
        concept: topic,
        difficulty: "medium",
        edgeCount: edges.length,
        expectedCount: correctConnections.length,
      },
      isCorrect: ok,
      responseTimeMs: ms,
    });
    setRuntime(r.state);
    setScoreXp(r.score, r.xp);
    if (ok) {
      setToast({ text: "Structure locked in — that matches the target graph.", variant: "success" });
    } else {
      setToast({
        text: "Not quite — compare your links to the goal (direction matters).",
        variant: "error",
      });
    }
  }, [edges, expected, correctConnections.length, postEvent, setRuntime, setScoreXp, topic]);

  const finish = useCallback(async () => {
    if (!validatedOk) {
      setToast({ text: "Validate successfully first.", variant: "info" });
      return;
    }
    await onCompleteSession();
  }, [validatedOk, onCompleteSession]);

  if (components.length === 0 || correctConnections.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 text-center text-sm text-amber-100">
        This build challenge is missing `components` or `correctConnections` in the generated config. Regenerate the
        game or pick another topic.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <MousePointer2 className="h-4 w-4 text-emerald-400" />
        <span>
          <strong className="text-zinc-200">Drag</strong> from one node onto another, or{" "}
          <strong className="text-zinc-200">tap</strong> two nodes in sequence to draw a directed link.
        </span>
      </div>

      <FeedbackToast message={toast?.text ?? null} variant={toast?.variant ?? "info"} />

      <DragDropCanvas className="border-emerald-500/20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/20">
        <p className="mb-4 text-sm font-semibold text-emerald-100/90">Component nodes</p>
        <div className="flex flex-wrap gap-3">
          {components.map((c) => {
            const active = linkSource === c.id;
            return (
              <div
                key={c.id}
                draggable
                onDragStart={onDragStart(c.id)}
                onDragOver={onDragOver}
                onDrop={onDropOn(c.id)}
                onClick={() => onChipClick(c.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChipClick(c.id);
                  }
                }}
                className={cn(
                  "cursor-grab rounded-2xl border px-4 py-3 text-left shadow-md transition-colors active:cursor-grabbing",
                  "border-zinc-600 bg-zinc-900/90 hover:border-emerald-500/50",
                  active && "border-cyan-400 ring-2 ring-cyan-500/40"
                )}
              >
                <p className="text-sm font-bold text-zinc-50">{c.label}</p>
                {c.description ? <p className="mt-1 max-w-[200px] text-xs text-zinc-500">{c.description}</p> : null}
              </div>
            );
          })}
        </div>
      </DragDropCanvas>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-200">
            <Link2 className="h-4 w-4 text-cyan-400" />
            Your connections ({edges.length})
          </h3>
          <Button type="button" variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200" onClick={clearAll}>
            Clear
          </Button>
        </div>
        {edges.length === 0 ? (
          <p className="text-sm text-zinc-500">No links yet — wire the system.</p>
        ) : (
          <ul className="space-y-2">
            {edges.map((e, i) => (
              <li
                key={`${e.from}-${e.to}-${i}`}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm"
              >
                <span className="text-zinc-200">
                  <span className="font-semibold text-emerald-300">{labelFor(components, e.from)}</span>
                  <span className="mx-2 text-zinc-500">→</span>
                  <span className="font-semibold text-cyan-300">{labelFor(components, e.to)}</span>
                </span>
                <button
                  type="button"
                  className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-rose-400"
                  aria-label="Remove connection"
                  onClick={() => removeEdge(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Target graph</p>
        <ul className="mt-2 space-y-1 text-sm text-zinc-400">
          {correctConnections.map((c, i) => (
            <li key={`${c.from}-${c.to}-${i}`}>
              {labelFor(components, c.from)} → {labelFor(components, c.to)}
              {c.relationship ? <span className="text-zinc-600"> ({c.relationship})</span> : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          className="rounded-xl bg-emerald-600 px-6 font-bold hover:bg-emerald-500"
          onClick={() => void validate()}
        >
          Validate structure
        </Button>
        <AnimatePresence>
          {validatedOk ? (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <Button
                type="button"
                className="rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 px-6 font-bold"
                onClick={() => void finish()}
              >
                Complete &amp; view results
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {validatedOk ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            Graph matches. Streak: {runtime.streak} — finish to bank XP and update your mastery map.
          </motion.div>
        ) : edges.length > 0 && !multisetsEqual(edgeMultiset(edges), expected) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-zinc-500"
          >
            <XCircle className="h-4 w-4 text-rose-400" />
            Tip: count and direction of arrows must match the target list exactly.
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
