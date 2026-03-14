"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@mindorbit/ui";
import type { MissionSceneData } from "@mindorbit/types";
import { missionScenesToLesson } from "@/lib/mission-to-lesson/missionScenesToLesson";
import { useLessonRuntimeStore } from "../store/lessonRuntimeStore";
import { validateAnswer, isPassiveBlock } from "../engine/answer-engine";
import { getBlockComponent } from "@/features/lesson-blocks/registry/blockRegistry";
import { MissionProgressBar } from "@/components/mission-engine/MissionProgressBar";
import { HintDrawer } from "@/components/mission-engine/HintDrawer";
import { FeedbackPanel } from "@/components/mission-engine/FeedbackPanel";
import { CompletionSummaryCard } from "@/components/mission-engine/CompletionSummaryCard";
import { cn } from "@mindorbit/ui";

const PASS_THRESHOLD = 0.6;

interface MissionLessonRunnerProps {
  missionId: string;
  missionTitle: string;
  scenes: MissionSceneData[];
  status: string;
  xpReward: number;
  initialSceneIndex?: number;
  initialAnswers?: Record<string, unknown>;
}

export function MissionLessonRunner({
  missionId,
  missionTitle,
  scenes,
  status,
  xpReward,
  initialSceneIndex = 0,
  initialAnswers = {},
}: MissionLessonRunnerProps) {
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(status === "completed");
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const lesson = missionScenesToLesson(missionId, missionTitle, scenes);
  const {
    setLesson,
    setCurrentStepIndex,
    currentStepIndex,
    setAnswer,
    setValidation,
    incrementAttempt,
    markStepCompleted,
    clearValidation,
    goNext,
    goPrev,
    completeLesson,
    answersByStepId,
    validationByStepId,
    attemptsByStepId,
    completedStepIds,
    isLessonComplete,
  } = useLessonRuntimeStore();

  const initializedForMission = useRef<string | null>(null);
  useEffect(() => {
    if (initializedForMission.current === missionId) return;
    initializedForMission.current = missionId;
    setLesson(lesson);
    setCurrentStepIndex(initialSceneIndex);
    if (Object.keys(initialAnswers).length > 0) {
      Object.entries(initialAnswers).forEach(([stepId, answer]) => {
        useLessonRuntimeStore.getState().setAnswer(stepId, answer);
      });
    }
  }, [missionId, initialSceneIndex, initialAnswers, setLesson, setCurrentStepIndex]);

  const total = lesson.steps.length;
  const currentStep = lesson.steps[currentStepIndex];
  const sceneAnswer = currentStep ? answersByStepId[currentStep.id] : undefined;
  const sceneFeedback = currentStep ? validationByStepId[currentStep.id] : undefined;
  const sceneAttempts = currentStep ? (attemptsByStepId[currentStep.id] ?? 0) : 0;
  const hasSubmitted = sceneFeedback != null;
  const isPassive = currentStep ? isPassiveBlock(currentStep.block) : false;
  const isLast = currentStepIndex >= total - 1;

  const completedIndices = new Set(
    lesson.steps
      .map((s, i) => (completedStepIds.has(s.id) ? i : -1))
      .filter((i) => i >= 0)
  );

  const saveProgress = useCallback(
    async (updates?: {
      currentSceneIndex?: number;
      completedIndices?: number[];
      answers?: Record<string, unknown>;
    }) => {
      try {
        const state = useLessonRuntimeStore.getState();
        await fetch(`/api/missions/${missionId}/partial`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentSceneIndex: updates?.currentSceneIndex ?? state.currentStepIndex,
            completedIndices: updates?.completedIndices ?? Array.from(
              new Set(
                lesson.steps
                  .map((s, i) => (state.completedStepIds.has(s.id) ? i : -1))
                  .filter((i) => i >= 0)
              )
            ),
            answers: updates?.answers ?? state.answersByStepId,
          }),
        });
      } catch {
        // ignore
      }
    },
    [missionId, lesson.steps]
  );

  useEffect(() => {
    const timer = setTimeout(() => saveProgress(), 2000);
    return () => clearTimeout(timer);
  }, [currentStepIndex, answersByStepId, completedStepIds, saveProgress]);

  const handleAnswerChange = useCallback(
    (answer: unknown) => {
      if (currentStep) setAnswer(currentStep.id, answer);
    },
    [currentStep?.id, setAnswer]
  );

  const handleCheck = useCallback(() => {
    if (!currentStep) return;
    const result = validateAnswer(currentStep.block, sceneAnswer);
    incrementAttempt(currentStep.id);
    setValidation(currentStep.id, result);
    setAnswer(currentStep.id, sceneAnswer);
    if (result.isCorrect) {
      markStepCompleted(currentStep.id);
      if (isLast) {
        completeLesson();
        const sceneResponses = lesson.steps.map((s, i) => ({
          sceneId: s.id,
          isCorrect: validationByStepId[s.id]?.isCorrect ?? (i === currentStepIndex && result.isCorrect),
          attempts: attemptsByStepId[s.id] ?? 1,
        }));
        const nextCorrect = lesson.steps
          .map((s) => validationByStepId[s.id]?.isCorrect || s.id === currentStep.id)
          .filter(Boolean).length;
        if (nextCorrect / total >= PASS_THRESHOLD) {
          setLoading(true);
          fetch(`/api/missions/${missionId}/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sceneResponses: lesson.steps.map((s) => ({
                sceneId: s.id,
                isCorrect: s.id === currentStep.id ? result.isCorrect : validationByStepId[s.id]?.isCorrect,
                attempts: s.id === currentStep.id ? sceneAttempts + 1 : attemptsByStepId[s.id] ?? 1,
              })),
            }),
          })
            .then((res) => {
              if (!res.ok) setCompleteError("Failed to save completion.");
              else router.refresh();
              setShowSummary(true);
            })
            .finally(() => setLoading(false));
        } else {
          setShowTryAgain(true);
        }
      }
    }
  }, [
    currentStep,
    sceneAnswer,
    isLast,
    incrementAttempt,
    setValidation,
    setAnswer,
    markStepCompleted,
    completeLesson,
    lesson,
    validationByStepId,
    attemptsByStepId,
    currentStepIndex,
    sceneAttempts,
    total,
    missionId,
  ]);

  const markAndAdvance = useCallback(() => {
    if (!currentStep) return;
    setValidation(currentStep.id, {
      isCorrect: true,
      status: "correct",
      score: 1,
    });
    markStepCompleted(currentStep.id);

    if (isLast) {
      const sceneResponses = lesson.steps.map((s) => ({
        sceneId: s.id,
        isCorrect: s.id === currentStep.id || validationByStepId[s.id]?.isCorrect,
        attempts: s.id === currentStep.id ? 1 : attemptsByStepId[s.id] ?? 1,
      }));
      const correctCount = sceneResponses.filter((r) => r.isCorrect).length;
      if (correctCount / total >= PASS_THRESHOLD) {
        setLoading(true);
        fetch(`/api/missions/${missionId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sceneResponses }),
        })
          .then((res) => {
            if (!res.ok) setCompleteError("Failed to save completion.");
            else router.refresh();
            setShowSummary(true);
          })
          .finally(() => setLoading(false));
      } else {
        setShowTryAgain(true);
      }
    } else {
      goNext();
      saveProgress({ currentSceneIndex: currentStepIndex + 1 });
    }
  }, [
    currentStep,
    isLast,
    markStepCompleted,
    setValidation,
    lesson,
    validationByStepId,
    attemptsByStepId,
    total,
    missionId,
    goNext,
    currentStepIndex,
    saveProgress,
  ]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < total - 1) {
      goNext();
      saveProgress({ currentSceneIndex: currentStepIndex + 1 });
    }
  }, [currentStepIndex, total, goNext, saveProgress]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      goPrev();
      saveProgress({ currentSceneIndex: currentStepIndex - 1 });
    }
  }, [currentStepIndex, goPrev, saveProgress]);

  const handleComplete = useCallback(async () => {
    const sceneResponses = lesson.steps.map((s) => ({
      sceneId: s.id,
      isCorrect: validationByStepId[s.id]?.isCorrect ?? false,
      attempts: attemptsByStepId[s.id] ?? 1,
    }));
    const correctCount = sceneResponses.filter((r) => r.isCorrect).length;
    if (correctCount / total < PASS_THRESHOLD) {
      setShowTryAgain(true);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/missions/${missionId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sceneResponses }),
    });
    setLoading(false);
    if (!res.ok) setCompleteError("Failed to save completion.");
    else router.refresh();
    setShowSummary(true);
  }, [lesson, validationByStepId, attemptsByStepId, total, missionId]);

  const handleRetry = useCallback(() => {
    if (currentStep) clearValidation(currentStep.id);
  }, [currentStep?.id, clearValidation]);

  const canSubmit = !isPassive && sceneAnswer !== undefined;

  if (total === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No scenes in this mission yet.</p>
        </CardContent>
      </Card>
    );
  }

  if (showTryAgain) {
    const correctCount = lesson.steps.filter((s) =>
      validationByStepId[s.id]?.isCorrect
    ).length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const required = Math.ceil(total * PASS_THRESHOLD);
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-500">
              Not quite yet
            </h2>
            <p className="mt-2 text-muted-foreground">
              You need {Math.round(PASS_THRESHOLD * 100)}% to pass ({required} of{" "}
              {total} correct).
            </p>
            <p className="mt-1 font-medium">
              Your score: {correctCount}/{total} ({pct}%)
            </p>
            <button
              type="button"
              onClick={() => {
                setShowTryAgain(false);
                useLessonRuntimeStore.getState().resetLesson();
                setLesson(lesson);
              }}
              className="mt-6 rounded-xl bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showSummary || status === "completed") {
    const correctCount = lesson.steps.filter((s) =>
      validationByStepId[s.id]?.isCorrect
    ).length;
    return (
      <CompletionSummaryCard
        xpEarned={xpReward}
        correctCount={correctCount}
        totalCount={total}
        onBack={() => router.push("/missions")}
      />
    );
  }

  if (!currentStep) return null;

  const BlockComponent = getBlockComponent(currentStep.block.type);

  return (
    <Card>
      <CardHeader className="pb-4">
        <MissionProgressBar
          current={currentStepIndex}
          total={total}
          completedIndices={completedIndices}
        />
        <CardTitle className="text-lg">{currentStep.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{currentStep.instruction}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {BlockComponent ? (
          <BlockComponent
            key={currentStep.id}
            config={currentStep.block}
            onAnswerChange={handleAnswerChange}
            submittedAnswer={sceneAnswer}
            validationResult={sceneFeedback ?? null}
            disabled={hasSubmitted}
          />
        ) : (
          <div className="rounded-xl border bg-muted/30 p-6 text-center text-muted-foreground">
            Unknown block type: {currentStep.block.type}
          </div>
        )}

        {!hasSubmitted &&
          (currentStep.hints?.length ?? 0) > 0 && (
            <HintDrawer
              hintLevel1={currentStep.hints?.[0]?.text}
              hintLevel2={currentStep.hints?.[1]?.text}
              hintLevel3={currentStep.hints?.[2]?.text}
            />
          )}

        {hasSubmitted && sceneFeedback && (
          <FeedbackPanel
            isCorrect={sceneFeedback.isCorrect}
            explanation={currentStep.explanation}
            showRetry={!sceneFeedback.isCorrect && !isPassive}
            onRetry={handleRetry}
          />
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-50",
              "hover:bg-muted"
            )}
          >
            Back
          </button>
          {!hasSubmitted ? (
            isPassive ? (
              <button
                type="button"
                onClick={markAndAdvance}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {isLast ? "Complete" : "Next"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheck}
                disabled={!canSubmit}
                className={cn(
                  "rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                )}
              >
                Check
              </button>
            )
          ) : isLast ? (
            <div className="flex flex-col items-end gap-2">
              {completeError && (
                <p className="text-sm text-destructive">{completeError}</p>
              )}
              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Completing..." : "Complete Mission"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Next
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
