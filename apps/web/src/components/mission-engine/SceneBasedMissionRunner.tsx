"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@mindorbit/ui";
import type { MissionSceneData } from "@mindorbit/types";
import { MissionProgressBar } from "./MissionProgressBar";
import { MissionSceneRenderer } from "./MissionSceneRenderer";
import { HintDrawer } from "./HintDrawer";
import { FeedbackPanel } from "./FeedbackPanel";
import { CompletionSummaryCard } from "./CompletionSummaryCard";

interface SceneWithResponses extends MissionSceneData {
  responses?: Array<{ isCorrect: boolean }>;
}

interface SceneBasedMissionRunnerProps {
  missionId: string;
  scenes: SceneWithResponses[];
  status: string;
  xpReward: number;
  initialSceneIndex?: number;
  initialAnswers?: Record<string, unknown>;
}

/** Normalize linear equation for flexible comparison (e.g. y=-x+4 ⟷ y=-1x+4) */
function normalizeLinearEquation(s: string): string {
  let t = s.replace(/\s/g, "").toLowerCase();
  t = t.replace(/-x/g, "-1x");
  t = t.replace(/\+x/g, "+1x");
  t = t.replace(/=x/g, "=1x");
  t = t.replace(/(^|[=+\-])x\b/g, "$11x");
  return t;
}

/** Check if two strings are equivalent linear equations (y=mx+b) */
function linearEquationsMatch(user: string, correct: string): boolean {
  return normalizeLinearEquation(user) === normalizeLinearEquation(correct);
}

/** Minimum score (0–1) required to pass a mission */
const PASS_THRESHOLD = 0.6;

/** Extract display label from option (matches PredictionCard toDisplayLabel) */
function extractOptionLabel(o: Record<string, unknown>): string {
  const val = o.label ?? o.text ?? o.value ?? o.expression ?? o.content ?? o.title;
  if (val == null) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    const v = val as Record<string, unknown>;
    const s = v.label ?? v.text ?? v.value ?? v.expression ?? v.content;
    return s != null && typeof s === "string" ? s.trim() : "";
  }
  return "";
}

/** Normalize options same as PredictionCard - handles plain strings and objects */
function getNormalizedOptions(content: Record<string, unknown>): Array<{ id: string; label: string }> {
  const raw = (content.options ?? []) as Array<Record<string, unknown> | string>;
  return raw.map((o, i) => {
    if (typeof o === "string") return { id: `opt-${i}`, label: o };
    const obj = o as Record<string, unknown>;
    const label = extractOptionLabel(obj) || String(obj.id ?? "").trim() || `Option ${i + 1}`;
    return { id: String(obj.id ?? `opt-${i}`), label };
  });
}

/** Resolve option ID to label for micro_quiz/predict (AI may store label or id, we store id) */
function resolveOptionAnswer(scene: MissionSceneData, answer: unknown): string {
  const raw = String(answer).trim();
  try {
    const content = scene.contentJson ? (JSON.parse(scene.contentJson) as Record<string, unknown>) : {};
    const options = getNormalizedOptions(content);
    const opt = options.find((o) => o.id === raw || o.label === raw);
    if (opt) return opt.label;
  } catch {
    // ignore
  }
  return raw;
}

/** Normalize correctAnswer - if it's an option id, resolve to label for comparison */
function resolveCorrectAnswer(scene: MissionSceneData, correct: string): string {
  try {
    const content = scene.contentJson ? (JSON.parse(scene.contentJson) as Record<string, unknown>) : {};
    const options = getNormalizedOptions(content);
    const opt = options.find((o) => o.id === correct || o.label === correct);
    if (opt) return opt.label;
  } catch {
    // ignore
  }
  return correct;
}

/** Validates answer against correctAnswerJson - returns true if correct */
function validateAnswer(scene: MissionSceneData, answer: unknown): boolean {
  // When correctAnswerJson is missing, we cannot verify - default to incorrect to avoid false positives
  if (!scene.correctAnswerJson?.trim()) return false;
  try {
    const parsed = JSON.parse(scene.correctAnswerJson);
    // Unwrap AI object formats: { value: "x+7" }, { expression: "x+7" }, { selectedIds: [...] }
    const correct =
      parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed.value ?? parsed.expression ?? parsed.correctAnswer ?? parsed.selectedIds ?? parsed
        : parsed;

    // --- Plain number (e.g. 50, 13) ---
    if (typeof correct === "number") {
      const a = resolveOptionAnswer(scene, answer);
      const aNum = parseFloat(String(a));
      if (!Number.isNaN(aNum) && aNum === correct) return true;
      return String(answer).trim() === String(correct);
    }

    // --- Plain string (e.g. "50", "x+7", "opt-0") ---
    if (typeof correct === "string") {
      const cRaw = correct.trim();
      const aRaw = answer != null ? String(answer).trim() : "";
      const a = resolveOptionAnswer(scene, answer);
      const c = resolveCorrectAnswer(scene, cRaw);
      if (a.toLowerCase() === c.toLowerCase()) return true;
      if (aRaw.toLowerCase() === cRaw.toLowerCase()) return true;
      if (/^\d+(\.\d+)?$/.test(a) && /^\d+(\.\d+)?$/.test(c)) {
        return parseFloat(a) === parseFloat(c);
      }
      if (/y\s*=.+x.+/.test(a) && /y\s*=.+x.+/.test(c)) {
        return linearEquationsMatch(a, c);
      }
      return false;
    }

    // --- Array (sort_sequence order, or selectedIds) ---
    if (Array.isArray(correct)) {
      const ans = Array.isArray(answer) ? answer : [answer];
      if (ans.length !== correct.length) return false;
      return ans.every((v, i) => String(v).trim() === String(correct[i]).trim());
    }

    // --- Object (full match) ---
    if (typeof correct === "object" && correct !== null) {
      return JSON.stringify(answer) === JSON.stringify(correct);
    }

    return String(answer).trim() === String(correct);
  } catch {
    return false;
  }
}

export function SceneBasedMissionRunner({
  missionId,
  scenes,
  status,
  xpReward,
  initialSceneIndex = 0,
  initialAnswers = {},
}: SceneBasedMissionRunnerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(initialSceneIndex);
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers);
  const [feedback, setFeedback] = useState<Record<string, { isCorrect: boolean }>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [completedIndices, setCompletedIndices] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(status === "completed");
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);

  const total = scenes.length;
  const scene = scenes[currentIndex];
  const sceneAnswer = scene ? answers[scene.id] : undefined;
  const sceneFeedback = scene ? feedback[scene.id] : undefined;
  const sceneAttempts = scene ? (attempts[scene.id] ?? 0) : 0;

  const saveProgress = useCallback(
    async (updates: {
      currentSceneIndex?: number;
      completedIndices?: number[];
      answers?: Record<string, unknown>;
    }) => {
      try {
        await fetch(`/api/missions/${missionId}/partial`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentSceneIndex: updates.currentSceneIndex ?? currentIndex,
            completedIndices: updates.completedIndices ?? Array.from(completedIndices),
            answers: updates.answers ?? answers,
          }),
        });
      } catch {
        // ignore
      }
    },
    [missionId, currentIndex, completedIndices, answers]
  );

  useEffect(() => {
    const timer = setTimeout(
      () => saveProgress({}),
      2000
    );
    return () => clearTimeout(timer);
  }, [currentIndex, answers, completedIndices, saveProgress]);

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
    const correctCount = scenes.reduce((acc, s) => {
      const fb = feedback[s.id]?.isCorrect;
      return acc + (fb ? 1 : 0);
    }, 0);
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const required = Math.ceil(total * PASS_THRESHOLD);
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-500">Not quite yet</h2>
            <p className="mt-2 text-muted-foreground">
              You need {Math.round(PASS_THRESHOLD * 100)}% to pass ({required} of {total} correct).
            </p>
            <p className="mt-1 font-medium">
              Your score: {correctCount}/{total} ({pct}%)
            </p>
            <button
              type="button"
              onClick={() => {
                setShowTryAgain(false);
                setFeedback({});
                setAnswers({});
                setAttempts({});
                setCompletedIndices(new Set());
                setCurrentIndex(0);
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
    const correctCount = scenes.reduce((acc, s) => {
      const fb = feedback[s.id]?.isCorrect;
      const resp = s.responses?.some((r) => r.isCorrect);
      return acc + (fb || resp ? 1 : 0);
    }, 0);
    return (
      <CompletionSummaryCard
        xpEarned={xpReward}
        correctCount={correctCount}
        totalCount={total}
        onBack={() => router.push("/missions")}
      />
    );
  }

  if (!scene) return null;

  const isPassiveScene = ["observe", "reveal", "reflect"].includes(scene.sceneType);
  const needsValidation = !isPassiveScene;
  const showFeedback = sceneFeedback !== undefined;
  const isLast = currentIndex === total - 1;

  async function markAndAdvance() {
    if (!scene) return;
    setFeedback((prev) => ({ ...prev, [scene.id]: { isCorrect: true } }));
    const nextCompleted = new Set(completedIndices).add(currentIndex);
    setCompletedIndices(nextCompleted);

    if (isLast) {
      const sceneResponses = scenes.map((s, i) => ({
        sceneId: s.id,
        isCorrect: nextCompleted.has(i) || feedback[s.id]?.isCorrect,
        attempts: attempts[s.id] ?? 1,
      }));
      const correctCount = sceneResponses.filter((r) => r.isCorrect).length;
      const passed = correctCount / total >= PASS_THRESHOLD;

      if (!passed) {
        setShowTryAgain(true);
        return;
      }

      setLoading(true);
      setCompleteError(null);
      const res = await fetch(`/api/missions/${missionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sceneResponses }),
      });
      setLoading(false);
      if (!res.ok) {
        setCompleteError("Failed to save completion. Please try again.");
        return;
      }
      router.refresh();
      setShowSummary(true);
    } else {
      setCurrentIndex((i) => i + 1);
      saveProgress({ currentSceneIndex: currentIndex + 1 });
    }
  }

  async function handleCheck() {
    if (!scene || showFeedback) return;

    const ans = sceneAnswer;
    if (needsValidation && ans === undefined && ans !== "") return;
    const isCorrect = !needsValidation || validateAnswer(scene, ans);
    setFeedback((prev) => ({ ...prev, [scene.id]: { isCorrect } }));
    setAttempts((prev) => ({ ...prev, [scene.id]: (prev[scene.id] ?? 0) + 1 }));
    setCompletedIndices((prev) => new Set(prev).add(currentIndex));
  }

  async function handleComplete() {
    const sceneResponses = scenes.map((s) => ({
      sceneId: s.id,
      isCorrect: feedback[s.id]?.isCorrect ?? (s.responses?.[0]?.isCorrect ?? false),
      attempts: attempts[s.id] ?? 1,
    }));
    const correctCount = sceneResponses.filter((r) => r.isCorrect).length;
    const passed = correctCount / total >= PASS_THRESHOLD;

    if (!passed) {
      setShowTryAgain(true);
      return;
    }

    setLoading(true);
    setCompleteError(null);
    const res = await fetch(`/api/missions/${missionId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sceneResponses }),
    });
    setLoading(false);
    if (!res.ok) {
      setCompleteError("Failed to save completion. Please try again.");
      return;
    }
    router.refresh();
    setShowSummary(true);
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      saveProgress({ currentSceneIndex: currentIndex + 1 });
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      saveProgress({ currentSceneIndex: currentIndex - 1 });
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <MissionProgressBar
          current={currentIndex}
          total={total}
          completedIndices={completedIndices}
        />
        <CardTitle className="text-lg">{scene.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{scene.prompt}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <MissionSceneRenderer
          scene={scene}
          answer={sceneAnswer}
          onAnswer={(a) => setAnswers((prev) => ({ ...prev, [scene.id]: a }))}
          disabled={showFeedback}
        />

        {!showFeedback && (scene.hintLevel1 || scene.hintLevel2 || scene.hintLevel3) && (
          <HintDrawer
            hintLevel1={scene.hintLevel1}
            hintLevel2={scene.hintLevel2}
            hintLevel3={scene.hintLevel3}
          />
        )}

        {showFeedback && (
          <FeedbackPanel
            isCorrect={sceneFeedback.isCorrect}
            explanation={scene.explanation}
            showRetry={!sceneFeedback.isCorrect && needsValidation}
            onRetry={() => setFeedback((prev) => {
              const next = { ...prev };
              delete next[scene.id];
              return next;
            })}
          />
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Back
          </button>
          {!showFeedback ? (
            isPassiveScene ? (
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
                disabled={sceneAnswer === undefined}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
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
