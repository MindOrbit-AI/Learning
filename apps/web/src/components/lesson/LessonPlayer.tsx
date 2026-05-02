"use client";

import { useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { VisualLesson } from "@/types/lesson";
import type { SceneUserInput } from "@/types/scene";
import { mergedScenes } from "@/lib/lesson-helpers";
import { useLessonStore } from "@/store/lesson-store";
import { SceneProgress } from "./SceneProgress";
import { SceneRenderer } from "./SceneRenderer";
import { FeedbackPanel } from "./FeedbackPanel";
import { HintPanel } from "./HintPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Props = {
  lesson: VisualLesson;
  dbLessonId?: string | null;
  userId: string;
};

export function LessonPlayer({ lesson, dbLessonId = null, userId }: Props) {
  const {
    sceneIndex,
    inputsBySceneId,
    feedbackOpen,
    feedbackText,
    lastCorrect,
    hintOpen,
    completed,
    loadLesson,
    setUserInput,
    setFeedback,
    setHintOpen,
    setSceneIndex,
    setCompleted,
  } = useLessonStore();

  useEffect(() => {
    loadLesson(lesson, dbLessonId);
  }, [lesson, dbLessonId, loadLesson]);

  const scenes = useMemo(() => mergedScenes(lesson), [lesson]);
  const active = scenes[sceneIndex];
  const total = scenes.length;

  const userInput = (active ? inputsBySceneId[active.id] : {}) ?? {};

  const initDefaultInput = useCallback(() => {
    if (!active) return;
    if (inputsBySceneId[active.id]) return;
    if (active.type === "drag_drop_sort") {
      const items = (active.data.items as string[]) ?? [];
      setUserInput(active.id, { order: [...items] });
    }
    if (active.type === "number_line") {
      const min = typeof active.data.min === "number" ? active.data.min : 0;
      const max = typeof active.data.max === "number" ? active.data.max : 1;
      setUserInput(active.id, { values: [(min + max) / 2] });
    }
  }, [active, inputsBySceneId, setUserInput]);

  useEffect(() => {
    initDefaultInput();
  }, [initDefaultInput]);

  const onCheck = async () => {
    if (!active) return;
    const res = await fetch("/api/submit-scene", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: dbLessonId ?? lesson.id,
        sceneId: active.id,
        userInput,
      }),
    });
    const data = (await res.json()) as {
      isCorrect: boolean;
      feedback: string;
      misconception?: string;
      completedLesson?: boolean;
    };
    setFeedback(true, data.feedback, data.isCorrect);
  };

  const onNext = () => {
    if (!active) return;
    setFeedback(false, "", null);
    if (sceneIndex >= total - 1) {
      setCompleted(true);
      return;
    }
    setSceneIndex(sceneIndex + 1);
  };

  /** Advance without submitting (no API / mastery for this scene). */
  const onSkipScene = () => {
    if (!active) return;
    setFeedback(false, "", null);
    if (sceneIndex >= total - 1) {
      setCompleted(true);
      return;
    }
    setSceneIndex(sceneIndex + 1);
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="mx-auto max-w-lg text-center"
      >
        <Card className="border-2 border-amber-400/40 bg-gradient-to-b from-amber-500/15 to-violet-600/10">
          <div className="text-5xl">🌟</div>
          <h2 className="mt-4 text-2xl font-bold text-white">Lesson complete</h2>
          <p className="mt-2 text-sm text-zinc-300">
            You finished <span className="font-semibold text-amber-200">{lesson.title}</span>. Mastery updated — keep
            the streak going.
          </p>
          <Button
            type="button"
            className="mt-8 w-full"
            variant="success"
            onClick={() => {
              setCompleted(false);
              setSceneIndex(0);
              setFeedback(false, "", null);
              loadLesson(lesson, dbLessonId);
            }}
          >
            Practice again
          </Button>
        </Card>
      </motion.div>
    );
  }

  if (!active) return null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <SceneProgress
        currentIndex={sceneIndex}
        totalSteps={total}
        topic={lesson.topic}
        level={lesson.level}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
        >
          <Card className="border-white/10 bg-zinc-950/50">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-300/90">{active.title}</p>
            <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">{active.prompt}</h2>
            <p className="mt-1 text-sm text-zinc-400">{active.visualPrompt}</p>

            <div className="mt-8 min-h-[200px] rounded-3xl border border-white/5 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 p-4 sm:p-8">
              <SceneRenderer
                scene={active}
                userInput={userInput}
                onUserInput={(next) => setUserInput(active.id, next)}
              />
            </div>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:items-center">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button type="button" variant="primary" onClick={onCheck}>
                  Check
                </Button>
                {feedbackOpen && lastCorrect ? (
                  <Button type="button" variant="secondary" onClick={onNext}>
                    {sceneIndex >= total - 1 ? "Finish" : "Next"}
                  </Button>
                ) : null}
              </div>
              {!(feedbackOpen && lastCorrect) ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-zinc-200"
                  onClick={onSkipScene}
                  aria-label="Skip this scene without checking your answer"
                >
                  Skip scene
                </Button>
              ) : null}
            </div>

            <HintPanel
              hint={active.feedback.hint}
              open={hintOpen}
              onToggle={() => setHintOpen(!hintOpen)}
            />

            <FeedbackPanel open={feedbackOpen} isCorrect={lastCorrect ?? false} message={feedbackText} />
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
