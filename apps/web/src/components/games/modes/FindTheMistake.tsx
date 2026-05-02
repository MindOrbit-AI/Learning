"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mindorbit/ui";
import { cn } from "@mindorbit/ui";
import { AlertTriangle, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import type { InteractiveModeBaseProps } from "@/features/interactive-games/runner-types";
import { getGameConfig } from "@/features/interactive-games/runner-types";
import { FeedbackToast } from "@/components/games/shared/FeedbackToast";

type Mistake = {
  id: string;
  text: string;
  whyWrong: string;
  correction: string;
  concept?: string;
  primary?: boolean;
  isTarget?: boolean;
};

function parseMistakes(raw: unknown): Mistake[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x, i) => {
      const o = x as Record<string, unknown>;
      return {
        id: String(o.id ?? `m-${i}`),
        text: String(o.text ?? o.claim ?? o.label ?? "").trim() || `Claim ${i + 1}`,
        whyWrong: String(o.whyWrong ?? o.reason ?? "This reasoning does not hold."),
        correction: String(o.correction ?? o.fix ?? "See explanation."),
        concept: o.concept != null ? String(o.concept) : undefined,
        primary: Boolean(o.primary ?? o.isPrimary),
        isTarget: Boolean(o.isTarget),
      };
    })
    .filter((m) => m.id);
}

function resolveCorrectId(mistakes: Mistake[], gc: Record<string, unknown>): string {
  const explicit = String(gc.correctMistakeId ?? "").trim();
  if (explicit && mistakes.some((m) => m.id === explicit)) return explicit;
  const flagged = mistakes.find((m) => m.primary || m.isTarget);
  if (flagged) return flagged.id;
  if (mistakes.length === 1) return mistakes[0]!.id;
  return mistakes[0]?.id ?? "";
}

export function FindTheMistake({
  envelope,
  runtime,
  setRuntime,
  setScoreXp,
  postEvent,
  onCompleteSession,
}: InteractiveModeBaseProps) {
  const gc = getGameConfig(envelope);
  const topic = String(envelope.topic ?? "this topic");
  const scenario = String(gc.scenario ?? `A take on ${topic}.`);
  const flawedExplanation = String(
    gc.flawedExplanation ?? "Something here does not quite add up — find the weak link."
  );
  const correctVersion = String(gc.correctVersion ?? "A more accurate version would qualify claims and evidence.");

  const mistakes = useMemo(() => parseMistakes(gc.mistakes), [gc.mistakes]);
  const correctId = useMemo(() => resolveCorrectId(mistakes, gc), [mistakes, gc]);

  const [toast, setToast] = useState<{ text: string; variant: "success" | "error" | "info" } | null>(null);
  const [solved, setSolved] = useState(false);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const t0 = useRef(Date.now());

  const winning = useMemo(() => mistakes.find((m) => m.id === correctId), [mistakes, correctId]);

  const onPick = useCallback(
    async (id: string) => {
      if (solved) return;
      setPickedId(id);
      const ms = Date.now() - t0.current;
      const ok = id === correctId;
      const concept = winning?.concept ?? topic;
      const r = await postEvent({
        eventType: "find_mistake_pick",
        payload: {
          concept,
          difficulty: "medium",
          mistakeId: id,
          questionIndex: 0,
        },
        isCorrect: ok,
        responseTimeMs: ms,
      });
      setRuntime(r.state);
      setScoreXp(r.score, r.xp);
      if (ok) {
        setSolved(true);
        setToast({ text: "You isolated the flaw — here is the repair.", variant: "success" });
      } else {
        setToast({
          text: mistakes.find((m) => m.id === id)?.whyWrong ?? "Not that one — look for the shakiest claim.",
          variant: "error",
        });
        window.setTimeout(() => setPickedId(null), 720);
      }
    },
    [solved, correctId, winning?.concept, topic, mistakes, postEvent, setRuntime, setScoreXp]
  );

  if (mistakes.length === 0 || !correctId) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 text-center text-sm text-amber-100">
        This challenge is missing <code className="font-mono">mistakes</code> or a resolvable correct id in{" "}
        <code className="font-mono">gameConfig</code>. Regenerate the game or pick another topic.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <AlertTriangle className="h-4 w-4 text-amber-400" />
        <span>
          <strong className="text-zinc-200">Read</strong> the setup, then{" "}
          <strong className="text-zinc-200">tap the faulty claim</strong> — not a full quiz, one sharp judgment call.
        </span>
      </div>

      <FeedbackToast message={toast?.text ?? null} variant={toast?.variant ?? "info"} />

      <motion.div
        layout
        className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/30 p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center gap-2 text-amber-200/90">
          <BookOpen className="h-4 w-4" />
          <p className="text-xs font-bold uppercase tracking-wider">Scenario</p>
        </div>
        <p className="text-sm leading-relaxed text-zinc-200">{scenario}</p>
      </motion.div>

      <div className="rounded-2xl border border-zinc-700 bg-zinc-950/80 p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Flawed explanation</p>
        <p className="text-base leading-relaxed text-zinc-100">{flawedExplanation}</p>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-zinc-300">Which claim is the mistake?</p>
        <div className="grid gap-3 sm:grid-cols-1">
          {mistakes.map((m) => {
            const selected = pickedId === m.id;
            const showWrong = selected && !solved && m.id !== correctId;
            const showRight = solved && m.id === correctId;
            return (
              <motion.button
                key={m.id}
                type="button"
                disabled={solved}
                layout
                onClick={() => void onPick(m.id)}
                className={cn(
                  "rounded-2xl border-2 px-4 py-4 text-left text-sm transition-all",
                  "border-zinc-600 bg-zinc-900/80 hover:border-amber-500/50 hover:bg-amber-950/20",
                  showRight && "border-emerald-500/70 bg-emerald-950/30 shadow-[0_0_24px_rgba(16,185,129,0.2)]",
                  showWrong && "border-rose-500/60 bg-rose-950/25",
                  solved && m.id !== correctId && "opacity-40"
                )}
                animate={showWrong ? { x: [0, -6, 6, -4, 4, 0] } : showRight ? { scale: [1, 1.02, 1] } : {}}
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{m.id}</span>
                <p className="mt-1 font-semibold text-zinc-100">{m.text}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {solved && winning ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4 rounded-2xl border border-emerald-500/35 bg-emerald-950/20 p-5"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-bold text-emerald-100">Why it fails</p>
                <p className="mt-1 text-sm text-emerald-100/90">{winning.whyWrong}</p>
                <p className="mt-3 text-sm font-bold text-cyan-100">Better move</p>
                <p className="mt-1 text-sm text-cyan-50/95">{winning.correction}</p>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stronger model</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">{correctVersion}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-emerald-500/20 pt-4">
              <p className="text-xs text-zinc-400">
                Streak {runtime.streak} · Score {runtime.score} XP
              </p>
              <Button
                type="button"
                className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 font-bold hover:from-amber-500 hover:to-orange-500"
                onClick={() => void onCompleteSession()}
              >
                <Sparkles className="mr-2 inline h-4 w-4" />
                Complete &amp; view results
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
