"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@mindorbit/ui";
import type { InteractiveModeBaseProps } from "@/features/interactive-games/runner-types";
import { getGameConfig } from "@/features/interactive-games/runner-types";
import { AnswerOptions } from "@/components/games/shared/AnswerOptions";
import { FeedbackToast } from "@/components/games/shared/FeedbackToast";
import { ComboMeter } from "@/components/games/shared/ComboMeter";
import { ConceptNodePill } from "@/components/games/shared/ConceptNodePill";

type Q = {
  question: string;
  choices: string[];
  correctAnswer: string;
  feedback: string;
  concept?: string;
  difficulty?: string;
  followUpIfWrong?: string;
};

export function AdaptiveQuizEngine({
  envelope,
  runtime,
  setRuntime,
  setScoreXp,
  postEvent,
  onCompleteSession,
}: InteractiveModeBaseProps) {
  const gc = getGameConfig(envelope);
  const questions = useMemo(() => {
    const raw = gc.questions;
    if (!Array.isArray(raw)) return [] as Q[];
    return raw
      .map((q) => {
        const o = q as Record<string, unknown>;
        const choices = Array.isArray(o.choices) ? (o.choices as string[]).filter(Boolean) : [];
        return {
          question: String(o.question ?? ""),
          choices,
          correctAnswer: String(o.correctAnswer ?? ""),
          feedback: String(o.feedback ?? ""),
          concept: o.concept != null ? String(o.concept) : undefined,
          difficulty: o.difficulty != null ? String(o.difficulty) : "medium",
          followUpIfWrong: o.followUpIfWrong != null ? String(o.followUpIfWrong) : undefined,
        };
      })
      .filter((q) => q.question && q.choices.length > 0 && q.correctAnswer);
  }, [gc.questions]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [reveal, setReveal] = useState(false);
  const [toast, setToast] = useState<{ text: string; variant: "success" | "error" | "info" } | null>(
    null
  );
  const qStart = useRef(Date.now());
  useEffect(() => {
    qStart.current = Date.now();
  }, [idx]);

  const q = questions[idx] ?? null;

  const submit = useCallback(
    async (choice: string) => {
      if (!q || reveal) return;
      setSelected(choice);
      setReveal(true);
      const ok = choice === q.correctAnswer;
      const ms = Date.now() - qStart.current;
      const res = await postEvent({
        eventType: "adaptive_answer",
        payload: {
          questionIndex: idx,
          concept: q.concept,
          difficulty: q.difficulty,
          damageToPlayer: ok ? 0 : 12,
        },
        isCorrect: ok,
        responseTimeMs: ms,
      });
      setRuntime(res.state);
      setScoreXp(res.score, res.xp);
      setToast({
        text: ok ? q.feedback : `${q.followUpIfWrong ?? q.feedback}`,
        variant: ok ? "success" : "error",
      });
    },
    [q, reveal, idx, postEvent, setRuntime, setScoreXp]
  );

  const next = useCallback(async () => {
    setToast(null);
    setSelected(null);
    setReveal(false);
    if (idx + 1 >= questions.length) {
      await onCompleteSession();
      return;
    }
    setIdx((i) => i + 1);
  }, [idx, questions.length, onCompleteSession]);

  if (!q) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8 text-center text-zinc-400">
        No questions in config. Try generating again.
      </div>
    );
  }

  return (
    <motion.div layout className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <ConceptNodePill label={`Adaptive · Q ${idx + 1}/${questions.length}`} tone="violet" />
        {q.concept ? <ConceptNodePill label={q.concept} tone="cyan" /> : null}
        <ComboMeter combo={runtime.combo} />
      </div>
      <FeedbackToast message={toast?.text ?? null} variant={toast?.variant ?? "info"} />
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-violet-950/30 p-6 shadow-2xl">
        <p className="text-lg font-semibold leading-relaxed text-zinc-50">{q.question}</p>
        <div className="mt-6">
          <AnswerOptions
            choices={q.choices}
            selected={selected}
            disabled={reveal}
            correctAnswer={q.correctAnswer}
            reveal={reveal}
            onSelect={(c) => void submit(c)}
          />
        </div>
        {reveal ? (
          <div className="mt-6 flex justify-end">
            <Button type="button" className="rounded-xl bg-violet-600 hover:bg-violet-500" onClick={() => void next()}>
              {idx + 1 >= questions.length ? "View results" : "Continue"}
            </Button>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
