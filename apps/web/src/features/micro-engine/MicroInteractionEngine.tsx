"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@mindorbit/ui";
import { cn } from "@mindorbit/ui";
import { ChevronLeft } from "lucide-react";
import { MissionProgressBar } from "@/components/mission-engine/MissionProgressBar";
import type { RuntimeMicroStep, SceneResponsePayload } from "./types";
import { validateMicroAnswer } from "./validateMicroAnswer";
import { diagnoseVisualProblemStep } from "@/features/visual-problem-solving/validateVisualProblem";
import { applyFeedbackTemplate } from "@/features/visual-problem-solving/feedback-templates";
import { MicroStepSurface } from "./MicroStepSurface";
import { MicroVisualLayer } from "./MicroVisualLayer";
import { MicroPromptDisplay } from "./MicroPromptDisplay";
import { sanitizeDragMatchPromptForTapUi } from "./dragMatchPrompt";
import { microEngineSounds } from "./micro-engine-sounds";
import { formatMicroStepCorrectAnswer } from "./formatCorrectAnswerLabel";

const PASS_THRESHOLD = 0.6;
const ADVANCE_MS = 480;
const DEFAULT_MAX_WRONG_BEFORE_REVEAL = 3;
const NODE_LINK_MAX_WRONG_BEFORE_REVEAL = 2;
const REVEAL_THEN_ADVANCE_MS = 2000;

function maxWrongAttemptsBeforeReveal(step: RuntimeMicroStep): number {
  if (String(step.type) !== "visual_problem") return DEFAULT_MAX_WRONG_BEFORE_REVEAL;
  const ws = (step.interactionConfig?.visualWorkspace ?? {}) as Record<string, unknown>;
  const kind = String(ws.kind ?? "");
  if (kind === "node_link" || kind === "cause_effect_link") return NODE_LINK_MAX_WRONG_BEFORE_REVEAL;
  return DEFAULT_MAX_WRONG_BEFORE_REVEAL;
}

export type SessionEndPayload = {
  sceneResponses: SceneResponsePayload[];
  passed: boolean;
};

type Props = {
  missionTitle: string;
  nodeTitle: string;
  steps: RuntimeMicroStep[];
  initialStepIndex?: number;
  onProgress?: (payload: {
    index: number;
    answers: Record<string, unknown>;
    completedIndices: number[];
  }) => void;
  onSessionEnd: (payload: SessionEndPayload) => void;
  onExit?: () => void;
};

type Overlay = { kind: "correct" | "wrong" | "reveal"; text: string } | null;

export function MicroInteractionEngine({
  missionTitle,
  nodeTitle,
  steps,
  initialStepIndex = 0,
  onProgress,
  onSessionEnd,
  onExit,
}: Props) {
  const [index, setIndex] = useState(initialStepIndex);
  const [tick, setTick] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [shake, setShake] = useState(0);
  const [visualPhase, setVisualPhase] = useState<"idle" | "correct" | "wrong">("idle");
  const [floatingXp, setFloatingXp] = useState<{ id: string; n: number }[]>([]);
  const [locked, setLocked] = useState(false);
  const [revealCorrect, setRevealCorrect] = useState(false);
  const resultsRef = useRef<Record<string, { isCorrect: boolean; attempts: number }>>({});
  const answersRef = useRef<Record<string, unknown>>({});
  const revealAdvanceTimeoutRef = useRef<number | null>(null);

  const total = steps.length;
  const step = steps[index];
  const isLast = index >= total - 1;

  useEffect(() => {
    microEngineSounds.resume();
  }, []);

  useEffect(() => {
    return () => {
      if (revealAdvanceTimeoutRef.current != null) {
        window.clearTimeout(revealAdvanceTimeoutRef.current);
        revealAdvanceTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setRevealCorrect(false);
  }, [index, step?.id]);

  const emitProgress = useCallback(() => {
    const completedIndices = steps
      .map((st, i) => (resultsRef.current[st.sourceSceneId]?.isCorrect ? i : -1))
      .filter((i) => i >= 0);
    onProgress?.({ index, answers: { ...answersRef.current }, completedIndices });
  }, [index, onProgress, steps]);

  useEffect(() => {
    if (!step) return;
    const t = setTimeout(() => emitProgress(), 400);
    return () => clearTimeout(t);
  }, [index, emitProgress, step]);

  const completedIndices = useMemo(() => {
    const s = new Set<number>();
    steps.forEach((st, i) => {
      const r = resultsRef.current[st.sourceSceneId];
      if (r?.isCorrect) s.add(i);
    });
    return s;
  }, [index, sessionXp, steps, tick]);

  const buildResponses = useCallback((): SceneResponsePayload[] => {
    return steps.map((s) => {
      const r = resultsRef.current[s.sourceSceneId];
      return {
        sceneId: s.sourceSceneId,
        isCorrect: r?.isCorrect ?? false,
        attempts: Math.max(1, r?.attempts ?? 1),
        masterySkill: s.masterySkill,
      };
    });
  }, [steps]);

  const handleCommit = useCallback(
    (raw: unknown) => {
      if (!step || locked) return;
      const sceneId = step.sourceSceneId;
      const prev = resultsRef.current[sceneId] ?? { isCorrect: false, attempts: 0 };
      const nextAttempts = prev.attempts + 1;
      answersRef.current[sceneId] = raw;
      const ok = validateMicroAnswer(step, raw);

      let wrongText = step.feedbackWrong || "Try again.";
      let correctText = step.feedbackCorrect || "Yes!";
      if (String(step.type) === "visual_problem") {
        const d = diagnoseVisualProblemStep(step, raw);
        if (ok && d.ok) {
          correctText = applyFeedbackTemplate(
            String(step.interactionConfig.feedbackCorrect ?? step.feedbackCorrect),
            d.vars
          );
        } else if (!ok && !d.ok) {
          wrongText = applyFeedbackTemplate(
            d.failed === "visual"
              ? String(step.interactionConfig.feedbackWrongVisual ?? wrongText)
              : String(step.interactionConfig.feedbackWrongAnswer ?? wrongText),
            d.vars
          );
        }
      }

      if (!ok) {
        microEngineSounds.wrong();
        resultsRef.current[sceneId] = { isCorrect: false, attempts: nextAttempts };
        setStreak(0);
        setShake((s) => s + 1);
        setVisualPhase("wrong");
        setTick((t) => t + 1);
        emitProgress();

        if (nextAttempts >= maxWrongAttemptsBeforeReveal(step)) {
          if (revealAdvanceTimeoutRef.current != null) {
            window.clearTimeout(revealAdvanceTimeoutRef.current);
          }
          const answerLabel = formatMicroStepCorrectAnswer(step);
          setLocked(true);
          setRevealCorrect(true);
          setOverlay({
            kind: "reveal",
            text: `Here's the correct answer: ${answerLabel}`,
          });
          revealAdvanceTimeoutRef.current = window.setTimeout(() => {
            revealAdvanceTimeoutRef.current = null;
            setOverlay(null);
            setVisualPhase("idle");
            setRevealCorrect(false);
            if (isLast) {
              const sceneResponses = buildResponses();
              const correct = sceneResponses.filter((r) => r.isCorrect).length;
              const passed = total > 0 && correct / total >= PASS_THRESHOLD;
              if (passed) microEngineSounds.complete();
              onSessionEnd({ sceneResponses, passed });
              setLocked(false);
              emitProgress();
              return;
            }
            setIndex((i) => i + 1);
            setLocked(false);
            emitProgress();
          }, REVEAL_THEN_ADVANCE_MS);
          return;
        }

        setOverlay({ kind: "wrong", text: wrongText });
        window.setTimeout(() => {
          setOverlay(null);
          setVisualPhase("idle");
        }, 720);
        return;
      }

      microEngineSounds.correct();
      const mult = 1 + Math.min(streak, 10) * 0.1;
      const add = Math.round(10 * mult);
      setSessionXp((x) => x + add);
      setStreak((s) => s + 1);
      const fid = `xp-${Date.now()}-${Math.random()}`;
      setFloatingXp((xs) => [...xs, { id: fid, n: add }]);
      window.setTimeout(() => setFloatingXp((xs) => xs.filter((x) => x.id !== fid)), 900);

      resultsRef.current[sceneId] = { isCorrect: true, attempts: nextAttempts };
      setTick((t) => t + 1);
      setLocked(true);
      setVisualPhase("correct");
      setOverlay({ kind: "correct", text: correctText });

        window.setTimeout(() => {
        setOverlay(null);
        setVisualPhase("idle");
        if (isLast) {
          const sceneResponses = buildResponses();
          const correct = sceneResponses.filter((r) => r.isCorrect).length;
          const passed = total > 0 && correct / total >= PASS_THRESHOLD;
          if (passed) microEngineSounds.complete();
          onSessionEnd({ sceneResponses, passed });
          setLocked(false);
          emitProgress();
          return;
        }
        setIndex((i) => i + 1);
        setLocked(false);
        emitProgress();
      }, ADVANCE_MS);
    },
    [step, locked, streak, isLast, buildResponses, onSessionEnd, total, emitProgress]
  );

  const handleBack = useCallback(() => {
    if (locked) return;
    if (index <= 0) return;
    setIndex((i) => i - 1);
    setOverlay(null);
    setVisualPhase("idle");
  }, [index, locked]);

  if (!step || total === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">No micro-steps yet.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-primary/15 shadow-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-violet-500/[0.06]" />
      <CardHeader className="relative z-10 space-y-3 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/80">Micro orbit</p>
            <h2 className="text-lg font-bold leading-tight">{missionTitle}</h2>
            <p className="text-xs text-muted-foreground">{nodeTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Session XP</p>
            <p className="text-2xl font-black tabular-nums text-primary">+{sessionXp}</p>
          </div>
        </div>
        <MissionProgressBar current={index} total={total} completedIndices={completedIndices} fluid />
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
              initial={false}
              animate={{ width: `${Math.min(streak, 10) * 10}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            />
          </div>
          <span className="text-xs font-bold tabular-nums text-amber-600 dark:text-amber-400">
            ×{Math.min(streak, 10)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 space-y-5 overflow-x-hidden overflow-y-visible pb-8 pt-2">
        {onExit ? (
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Missions
          </button>
        ) : null}

        {String(step.type) === "visual_problem" && step.interactionConfig.problemScenario ? (
          <div className="pointer-events-none relative z-0 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700/90 dark:text-amber-300/90">
              Problem scenario
            </p>
            <p className="mt-1 font-medium">{String(step.interactionConfig.problemScenario)}</p>
          </div>
        ) : null}

        <MicroVisualLayer step={step} phase={visualPhase === "idle" ? "idle" : visualPhase} />

        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: visualPhase === "correct" ? 1.02 : 1,
            x: visualPhase === "wrong" ? [0, -5, 5, -3, 3, 0] : 0,
          }}
          transition={{ duration: visualPhase === "wrong" ? 0.4 : 0.35 }}
          className={cn(
            "relative z-10 touch-manipulation rounded-2xl border bg-card/80 p-5 shadow-sm",
            visualPhase === "correct" && "border-emerald-500/50 shadow-[0_0_28px_rgba(34,197,94,0.25)]"
          )}
        >
          <MicroPromptDisplay
            text={step.type === "drag_match" ? sanitizeDragMatchPromptForTapUi(step.prompt) : step.prompt}
            className="text-center text-base font-bold leading-snug md:text-lg"
          />
          <div className="relative z-10 mt-5">
            <MicroStepSurface
              step={step}
              disabled={locked}
              shakeToken={shake}
              revealCorrect={revealCorrect}
              onCommit={handleCommit}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {floatingXp.map((f) => (
            <motion.span
              key={f.id}
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: -32, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="pointer-events-none absolute right-10 top-1/3 text-xl font-black text-emerald-500 drop-shadow"
            >
              +{f.n}
            </motion.span>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {overlay ? (
            <motion.div
              key={overlay.kind}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "pointer-events-none fixed inset-x-4 top-28 z-50 mx-auto max-w-md rounded-2xl border px-5 py-4 text-center text-sm font-semibold shadow-2xl md:inset-x-auto",
                overlay.kind === "correct" || overlay.kind === "reveal"
                  ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-50"
                  : "border-rose-500/40 bg-rose-950/90 text-rose-50"
              )}
            >
              {overlay.text}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={handleBack}
            disabled={index === 0 || locked}
            className="rounded-xl border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-40"
          >
            Back
          </button>
          <span className="text-[10px] text-muted-foreground">
            Step {index + 1}/{total}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
