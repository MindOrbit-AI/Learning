"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mindorbit/ui";
import { cn } from "@mindorbit/ui";
import { Check, DoorOpen, LayoutGrid, Lock, Sparkles, Timer } from "lucide-react";
import type { InteractiveModeBaseProps } from "@/features/interactive-games/runner-types";
import { getGameConfig } from "@/features/interactive-games/runner-types";
import { FeedbackToast } from "@/components/games/shared/FeedbackToast";
import { TimerBar } from "@/components/games/shared/TimerBar";

type EscapeRoom = {
  id: string;
  title: string;
  clue: string;
  puzzle: string;
  choices: string[];
  correctAnswer: string;
  unlockCode: string;
  concept?: string;
};

function normalizeChoices(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c) => {
      if (typeof c === "string") return c;
      const o = c as Record<string, unknown>;
      return String(o.label ?? o.text ?? o.value ?? o.id ?? "");
    })
    .filter(Boolean);
}

function parseRooms(raw: unknown): EscapeRoom[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x, i) => {
      const o = x as Record<string, unknown>;
      return {
        id: String(o.id ?? `room-${i + 1}`),
        title: String(o.title ?? `Room ${i + 1}`),
        clue: String(o.clue ?? o.hint ?? "Search the details — the lab never wastes words."),
        puzzle: String(o.puzzle ?? o.question ?? o.prompt ?? "Solve to advance."),
        choices: normalizeChoices(o.choices),
        correctAnswer: String(o.correctAnswer ?? "").trim(),
        unlockCode: String(o.unlockCode ?? o.code ?? `KEY-${i + 1}`).trim() || `KEY-${i + 1}`,
        concept: o.concept != null ? String(o.concept) : undefined,
      };
    })
    .filter((r) => r.id && r.choices.length > 0 && r.correctAnswer);
}

function answersMatch(a: string, b: string) {
  const x = a.trim();
  const y = b.trim();
  return x === y || x.toLowerCase() === y.toLowerCase();
}

export function LabEscapeRoom({
  envelope,
  runtime,
  setRuntime,
  setScoreXp,
  postEvent,
  onCompleteSession,
}: InteractiveModeBaseProps) {
  const gc = getGameConfig(envelope);
  const topic = String(envelope.topic ?? "lab");
  const rooms = useMemo(() => parseRooms(gc.rooms), [gc.rooms]);
  const timeLimitSeconds = Math.max(30, Math.min(3600, Number(gc.timeLimitSeconds) || 300));

  const idx = runtime.currentQuestionIndex ?? 0;
  const current = idx < rooms.length ? rooms[idx]! : null;
  const escaped = idx >= rooms.length;

  const [toast, setToast] = useState<{ text: string; variant: "success" | "error" | "info" } | null>(null);
  const [shake, setShake] = useState(0);
  const [busy, setBusy] = useState(false);
  const [showUnlock, setShowUnlock] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  /** Extra delay from wrong answers (client-side pressure). */
  const [penaltyMs, setPenaltyMs] = useState(0);
  const [tick, setTick] = useState(0);
  const t0 = useRef(Date.now());

  const startedAtMs = useMemo(() => {
    const iso = runtime.startedAt;
    if (typeof iso === "string" && iso) {
      const t = Date.parse(iso);
      if (Number.isFinite(t)) return t;
    }
    return Date.now();
  }, [runtime.startedAt]);

  const budgetMs = timeLimitSeconds * 1000;
  /** Wrong answers burn extra time without extending the wall-clock budget. */
  const remainingMs = Math.max(0, startedAtMs + budgetMs - Date.now() - penaltyMs);
  const remainingRatio = budgetMs > 0 ? Math.min(1, remainingMs / budgetMs) : 0;

  useEffect(() => {
    if (escaped || timedOut) return;
    const id = window.setInterval(() => setTick((n) => n + 1), 500);
    return () => window.clearInterval(id);
  }, [escaped, timedOut]);

  useEffect(() => {
    if (escaped || timedOut) return;
    if (remainingMs <= 0) {
      setTimedOut(true);
      setToast({ text: "Time's up — the lab sealed. You can still exit and review results.", variant: "error" });
    }
  }, [escaped, timedOut, remainingMs, tick]);

  const onPick = useCallback(
    async (choice: string) => {
      if (!current || busy || escaped || timedOut) return;
      setBusy(true);
      const ms = Date.now() - t0.current;
      const ok = answersMatch(choice, current.correctAnswer);
      const nextIndex = ok ? idx + 1 : idx;
      try {
        const r = await postEvent({
          eventType: "lab_escape_room",
          payload: {
            concept: current.concept ?? topic,
            difficulty: "medium",
            roomId: current.id,
            questionIndex: nextIndex,
          },
          isCorrect: ok,
          responseTimeMs: ms,
        });
        setRuntime(r.state);
        setScoreXp(r.score, r.xp);
        if (ok) {
          setShowUnlock(current.unlockCode);
          setToast({ text: "Door unlocked — advance to the next chamber.", variant: "success" });
          window.setTimeout(() => {
            setShowUnlock(null);
            setToast(null);
          }, 1600);
          t0.current = Date.now();
        } else {
          setPenaltyMs((p) => p + 12_000);
          setShake((s) => s + 1);
          setToast({ text: "Access denied — wrong answer costs precious seconds.", variant: "error" });
          window.setTimeout(() => setToast(null), 1400);
        }
      } finally {
        setBusy(false);
      }
    },
    [current, busy, escaped, timedOut, idx, topic, postEvent, setRuntime, setScoreXp]
  );

  if (rooms.length === 0) {
    return (
      <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-950/20 p-6 text-center text-sm text-fuchsia-100">
        This escape run is missing <code className="font-mono">rooms</code> in <code className="font-mono">gameConfig</code>.
        Regenerate the game or pick another topic.
      </div>
    );
  }

  const clearedIds = new Set(rooms.slice(0, idx).map((r) => r.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <LayoutGrid className="h-4 w-4 text-fuchsia-400" />
        <span>
          <strong className="text-zinc-200">Escape the lab</strong> — each room hides a clue. Beat the timer before the
          facility locks down.
        </span>
      </div>

      <div className="rounded-2xl border border-fuchsia-500/25 bg-zinc-950/80 p-4 shadow-inner">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-fuchsia-200/90">
            <Timer className="h-3.5 w-3.5" />
            Facility timer
          </span>
          <span className="font-mono tabular-nums text-fuchsia-100">
            {Math.ceil(remainingMs / 1000)}s / {timeLimitSeconds}s
          </span>
        </div>
        <TimerBar remainingRatio={timedOut ? 0 : remainingRatio} className="h-2.5" />
      </div>

      <FeedbackToast message={toast?.text ?? null} variant={toast?.variant ?? "info"} />

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-min items-center gap-0 px-2">
          {rooms.map((r, i) => {
            const done = clearedIds.has(r.id);
            const active = current?.id === r.id;
            return (
              <div key={r.id} className="flex items-center">
                <motion.div
                  layout
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 text-xs font-black",
                    done && "border-emerald-500/70 bg-emerald-950/40 text-emerald-200",
                    active && !done && "border-fuchsia-400 bg-fuchsia-950/40 text-fuchsia-100 shadow-[0_0_18px_rgba(232,121,249,0.35)]",
                    !done && !active && "border-zinc-700 bg-zinc-900/60 text-zinc-500"
                  )}
                  animate={active && !done ? { scale: [1, 1.04, 1] } : {}}
                  transition={active && !done ? { repeat: 3, repeatType: "reverse", duration: 0.8 } : { duration: 0.2 }}
                >
                  {done ? <Check className="h-6 w-6" /> : active ? <DoorOpen className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </motion.div>
                {i < rooms.length - 1 ? (
                  <div className={cn("mx-1 h-1 w-8 rounded-full", done ? "bg-fuchsia-500/50" : "bg-zinc-700")} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {escaped ? (
          <motion.div
            key="escaped"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-500/40 bg-emerald-950/25 p-6 text-center"
          >
            <p className="text-lg font-bold text-emerald-100">You made it out</p>
            <p className="mt-2 text-sm text-emerald-100/80">Every chamber cleared — the lab&apos;s puzzles could not hold you.</p>
            <Button
              type="button"
              className="mt-6 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-8 font-bold"
              onClick={() => void onCompleteSession()}
            >
              <Sparkles className="mr-2 inline h-4 w-4" />
              Complete &amp; view results
            </Button>
          </motion.div>
        ) : timedOut ? (
          <motion.div
            key="timeout"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-rose-500/35 bg-rose-950/25 p-6 text-center"
          >
            <p className="text-lg font-bold text-rose-100">Lab sealed</p>
            <p className="mt-2 text-sm text-rose-100/75">
              The timer hit zero. Exit now to save your progress and review results.
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-6 rounded-xl px-8 font-bold"
              onClick={() => void onCompleteSession()}
            >
              Exit &amp; view results
            </Button>
          </motion.div>
        ) : current ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className={cn(
              "rounded-2xl border border-fuchsia-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-fuchsia-950/35 p-6 shadow-xl",
              shake > 0 && "animate-none"
            )}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-200/90">{current.title}</p>
              <span className="rounded-full border border-fuchsia-500/30 bg-fuchsia-950/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-fuchsia-200">
                Room {idx + 1} / {rooms.length}
              </span>
            </div>

            <div className="mb-5 rounded-xl border border-fuchsia-500/20 bg-black/40 p-4 font-mono text-xs leading-relaxed text-fuchsia-100/90">
              <span className="text-fuchsia-500/80"># clue.log</span>
              <p className="mt-2 text-fuchsia-50/95">{current.clue}</p>
            </div>

            {showUnlock === current.unlockCode ? (
              <motion.p
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 text-center text-sm font-bold tracking-[0.2em] text-emerald-300"
              >
                UNLOCK · {current.unlockCode}
              </motion.p>
            ) : null}

            <motion.p
              key={shake}
              animate={shake ? { x: [0, -4, 4, -3, 3, 0] } : {}}
              className="mb-6 text-lg font-semibold leading-snug text-zinc-50"
            >
              {current.puzzle}
            </motion.p>

            <div className="grid gap-3 sm:grid-cols-2">
              {current.choices.map((c) => (
                <button
                  key={c}
                  type="button"
                  disabled={busy || timedOut}
                  onClick={() => void onPick(c)}
                  className={cn(
                    "rounded-2xl border-2 border-zinc-600 bg-zinc-900/80 px-4 py-4 text-left text-sm font-semibold text-zinc-100 transition-all",
                    "hover:border-fuchsia-500/50 hover:bg-fuchsia-950/25 active:scale-[0.99]",
                    (busy || timedOut) && "pointer-events-none opacity-60"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
