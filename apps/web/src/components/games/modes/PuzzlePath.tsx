"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mindorbit/ui";
import { cn } from "@mindorbit/ui";
import { Check, ChevronRight, GitBranch, Lock, Sparkles } from "lucide-react";
import type { InteractiveModeBaseProps } from "@/features/interactive-games/runner-types";
import { getGameConfig } from "@/features/interactive-games/runner-types";
import { FeedbackToast } from "@/components/games/shared/FeedbackToast";

type PathNode = {
  id: string;
  title: string;
  challenge: string;
  choices: string[];
  correctAnswer: string;
  unlockAfter: string[];
  concept?: string;
};

function normalizeChoices(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c) => {
    if (typeof c === "string") return c;
    const o = c as Record<string, unknown>;
    return String(o.label ?? o.text ?? o.value ?? o.id ?? "");
  }).filter(Boolean);
}

function parseNodes(raw: unknown): PathNode[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x, i) => {
      const o = x as Record<string, unknown>;
      const unlockRaw = o.unlockAfter ?? o.requires ?? [];
      const unlockAfter = Array.isArray(unlockRaw) ? unlockRaw.map(String) : [];
      return {
        id: String(o.id ?? `n${i}`),
        title: String(o.title ?? `Checkpoint ${i + 1}`),
        challenge: String(o.challenge ?? o.question ?? o.prompt ?? "Choose the best answer."),
        choices: normalizeChoices(o.choices),
        correctAnswer: String(o.correctAnswer ?? "").trim(),
        unlockAfter,
        concept: o.concept != null ? String(o.concept) : undefined,
      };
    })
    .filter((n) => n.id && n.choices.length > 0 && n.correctAnswer);
}

function isUnlocked(node: PathNode, cleared: Set<string>): boolean {
  if (node.unlockAfter.length === 0) return true;
  return node.unlockAfter.every((id) => cleared.has(id));
}

export function PuzzlePath({
  envelope,
  runtime,
  setRuntime,
  setScoreXp,
  postEvent,
  onCompleteSession,
}: InteractiveModeBaseProps) {
  const gc = getGameConfig(envelope);
  const topic = String(envelope.topic ?? "path");
  const nodes = useMemo(() => parseNodes(gc.nodes), [gc.nodes]);

  const idx = runtime.currentQuestionIndex ?? 0;
  const clearedIds = useMemo(() => new Set(nodes.slice(0, idx).map((n) => n.id)), [nodes, idx]);
  const current = idx < nodes.length ? nodes[idx] : null;
  const pathComplete = idx >= nodes.length;

  const [toast, setToast] = useState<{ text: string; variant: "success" | "error" | "info" } | null>(null);
  const [shake, setShake] = useState(0);
  const t0 = useRef(Date.now());

  const lockedReason = useMemo(() => {
    if (!current) return null;
    if (!isUnlocked(current, clearedIds)) {
      return `Locked — clear: ${current.unlockAfter.join(", ")}`;
    }
    return null;
  }, [current, clearedIds]);

  const onPick = useCallback(
    async (choice: string) => {
      if (!current || lockedReason) return;
      const ms = Date.now() - t0.current;
      const ok =
        choice.trim() === current.correctAnswer.trim() ||
        choice.trim().toLowerCase() === current.correctAnswer.trim().toLowerCase();
      const nextIndex = ok ? idx + 1 : idx;
      const r = await postEvent({
        eventType: "puzzle_path_node",
        payload: {
          concept: current.concept ?? topic,
          difficulty: "medium",
          nodeId: current.id,
          questionIndex: ok ? nextIndex : idx,
        },
        isCorrect: ok,
        responseTimeMs: ms,
      });
      setRuntime(r.state);
      setScoreXp(r.score, r.xp);
      if (ok) {
        setToast({ text: "Checkpoint cleared — path extends.", variant: "success" });
        t0.current = Date.now();
        window.setTimeout(() => setToast(null), 900);
      } else {
        setShake((s) => s + 1);
        setToast({ text: "Not quite — try another branch.", variant: "error" });
        window.setTimeout(() => setToast(null), 1200);
      }
    },
    [current, lockedReason, idx, topic, postEvent, setRuntime, setScoreXp]
  );

  if (nodes.length === 0) {
    return (
      <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-6 text-center text-sm text-violet-100">
        This puzzle path is missing <code className="font-mono">nodes</code> with challenges and choices in{" "}
        <code className="font-mono">gameConfig</code>. Regenerate the game or pick another topic.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <GitBranch className="h-4 w-4 text-violet-400" />
        <span>
          <strong className="text-zinc-200">Unlock</strong> nodes in order — each checkpoint needs the right answer
          before the path opens further.
        </span>
      </div>

      <FeedbackToast message={toast?.text ?? null} variant={toast?.variant ?? "info"} />

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-min items-center gap-0 px-2">
          {nodes.map((n, i) => {
            const done = clearedIds.has(n.id);
            const active = current?.id === n.id;
            const locked = !isUnlocked(n, clearedIds);
            return (
              <div key={n.id} className="flex items-center">
                <motion.div
                  layout
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 text-xs font-black",
                    done && "border-emerald-500/70 bg-emerald-950/40 text-emerald-200",
                    active && !locked && "border-violet-400 bg-violet-950/50 text-violet-100 shadow-[0_0_20px_rgba(167,139,250,0.35)]",
                    locked && !done && "border-zinc-700 bg-zinc-900/60 text-zinc-600",
                    !done && !active && !locked && "border-zinc-600 bg-zinc-900 text-zinc-400"
                  )}
                  animate={active && !locked ? { scale: [1, 1.05, 1] } : {}}
                  transition={
                    active && !locked ? { repeat: 4, repeatType: "reverse", duration: 0.7 } : { duration: 0.2 }
                  }
                >
                  {done ? <Check className="h-6 w-6" /> : locked ? <Lock className="h-5 w-5" /> : i + 1}
                </motion.div>
                {i < nodes.length - 1 ? (
                  <div
                    className={cn(
                      "mx-1 h-1 w-8 rounded-full",
                      clearedIds.has(n.id) ? "bg-violet-500/60" : "bg-zinc-700"
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {pathComplete ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-500/40 bg-emerald-950/25 p-6 text-center"
          >
            <p className="text-lg font-bold text-emerald-100">Path complete</p>
            <p className="mt-2 text-sm text-emerald-100/80">You cleared every checkpoint on this skill chain.</p>
            <Button
              type="button"
              className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 font-bold"
              onClick={() => void onCompleteSession()}
            >
              <Sparkles className="mr-2 inline h-4 w-4" />
              Complete &amp; view results
            </Button>
          </motion.div>
        ) : current ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={cn(
              "rounded-2xl border border-violet-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-violet-950/30 p-6 shadow-xl",
              shake > 0 && "animate-none"
            )}
          >
            {lockedReason ? (
              <p className="text-center text-sm text-amber-200">{lockedReason}</p>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-2 text-violet-200/90">
                  <ChevronRight className="h-4 w-4" />
                  <p className="text-xs font-bold uppercase tracking-wider">{current.title}</p>
                </div>
                <motion.p
                  key={shake}
                  animate={shake ? { x: [0, -5, 5, -3, 3, 0] } : {}}
                  className="mb-6 text-lg font-semibold leading-snug text-zinc-50"
                >
                  {current.challenge}
                </motion.p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {current.choices.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => void onPick(c)}
                      className={cn(
                        "rounded-2xl border-2 border-zinc-600 bg-zinc-900/80 px-4 py-4 text-left text-sm font-semibold text-zinc-100 transition-all",
                        "hover:border-violet-500/50 hover:bg-violet-950/30 active:scale-[0.99]"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
