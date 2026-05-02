"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@mindorbit/ui";
import type { InteractiveModeBaseProps } from "@/features/interactive-games/runner-types";
import { getGameConfig } from "@/features/interactive-games/runner-types";
import { AnswerOptions } from "@/components/games/shared/AnswerOptions";
import { TimerBar } from "@/components/games/shared/TimerBar";
import { FeedbackToast } from "@/components/games/shared/FeedbackToast";
import { ComboMeter } from "@/components/games/shared/ComboMeter";

type Q = {
  question: string;
  choices: string[];
  correctAnswer: string;
  feedback: string;
  concept?: string;
  difficulty?: string;
};

export function SpeedRunMastery({
  envelope,
  runtime,
  setRuntime,
  setScoreXp,
  postEvent,
  onCompleteSession,
}: InteractiveModeBaseProps) {
  const gc = getGameConfig(envelope);
  const duration = Number(gc.durationSeconds) || 60;
  const questions = useMemo(() => {
    const raw = gc.questions;
    if (!Array.isArray(raw)) return [] as Q[];
    return raw
      .map((item) => {
        const o = item as Record<string, unknown>;
        const choices = Array.isArray(o.choices) ? (o.choices as string[]).filter(Boolean) : [];
        return {
          question: String(o.question ?? ""),
          choices,
          correctAnswer: String(o.correctAnswer ?? ""),
          feedback: String(o.feedback ?? ""),
          concept: o.concept != null ? String(o.concept) : undefined,
          difficulty: o.difficulty != null ? String(o.difficulty) : "medium",
        };
      })
      .filter((q) => q.question && q.choices.length > 0);
  }, [gc.questions]);

  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(duration);
  const [selected, setSelected] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "error" | "info">("info");
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);
  const qRef = useRef(0);
  const ended = useRef(false);
  qRef.current = Date.now();

  useEffect(() => {
    qRef.current = Date.now();
  }, [idx]);

  useEffect(() => {
    tick.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          if (tick.current) clearInterval(tick.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, []);

  useEffect(() => {
    if (left === 0 && !ended.current) {
      ended.current = true;
      void onCompleteSession();
    }
  }, [left, onCompleteSession]);

  const q = questions[idx] ?? null;

  const answer = useCallback(
    async (choice: string) => {
      if (!q || reveal || left <= 0) return;
      setSelected(choice);
      setReveal(true);
      const ok = choice === q.correctAnswer;
      const ms = Date.now() - qRef.current;
      const res = await postEvent({
        eventType: "speed_answer",
        payload: {
          questionIndex: idx,
          concept: q.concept,
          difficulty: q.difficulty,
        },
        isCorrect: ok,
        responseTimeMs: ms,
      });
      setRuntime(res.state);
      setScoreXp(res.score, res.xp);
      setToast(ok ? "Nice — keep the streak!" : q.feedback);
      setToastVariant(ok ? "success" : "error");
      qRef.current = Date.now();
    },
    [q, reveal, left, idx, postEvent, setRuntime, setScoreXp]
  );

  const advance = useCallback(() => {
    setToast(null);
    setToastVariant("info");
    setSelected(null);
    setReveal(false);
    if (idx + 1 >= questions.length) {
      ended.current = true;
      void onCompleteSession();
      return;
    }
    setIdx((i) => i + 1);
  }, [idx, questions.length, onCompleteSession]);

  if (!q) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8 text-center text-zinc-400">
        No speed questions configured.
      </div>
    );
  }

  return (
    <motion.div layout className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Time</span>
            <span className="font-mono text-cyan-300">{left}s</span>
          </div>
          <TimerBar remainingRatio={left / duration} />
        </div>
        <ComboMeter combo={runtime.combo} />
      </div>
      <FeedbackToast message={toast} variant={toastVariant} />
      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-cyan-950/25 p-6">
        <p className="text-lg font-semibold text-zinc-50">{q.question}</p>
        <div className="mt-5">
          <AnswerOptions
            choices={q.choices}
            selected={selected}
            disabled={reveal || left <= 0}
            correctAnswer={q.correctAnswer}
            reveal={reveal}
            onSelect={(c) => void answer(c)}
          />
        </div>
        {reveal ? (
          <div className="mt-5 flex justify-end">
            <Button type="button" className="rounded-xl bg-cyan-600 hover:bg-cyan-500" onClick={advance}>
              {idx + 1 >= questions.length ? "Finish run" : "Next"}
            </Button>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
