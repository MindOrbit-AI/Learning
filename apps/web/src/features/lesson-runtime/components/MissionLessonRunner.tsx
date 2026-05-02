"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@mindorbit/ui";
import type { MissionSceneData } from "@mindorbit/types";
import { scenesToMicroSteps } from "@/lib/mission-to-lesson/scenesToMicroSteps";
import { MicroInteractionEngine } from "@/features/micro-engine/MicroInteractionEngine";
import type { SceneResponsePayload } from "@/features/micro-engine/types";
import { CompletionSummaryCard } from "@/components/mission-engine/CompletionSummaryCard";
import { missionTypeLabel } from "@/lib/mission-display";

const PASS_THRESHOLD = 0.6;

interface SceneWithResponses extends MissionSceneData {
  responses?: Array<{ isCorrect: boolean }>;
}

interface MissionLessonRunnerProps {
  missionId: string;
  missionTitle: string;
  nodeTitle: string;
  missionType: string;
  scenes: SceneWithResponses[];
  status: string;
  xpReward: number;
  xpGranted?: number | null;
  starsGranted?: number | null;
  initialSceneIndex?: number;
  initialAnswers?: Record<string, unknown>;
}

export function MissionLessonRunner({
  missionId,
  missionTitle,
  nodeTitle,
  missionType,
  scenes,
  status,
  xpReward,
  xpGranted,
  starsGranted,
  initialSceneIndex = 0,
}: MissionLessonRunnerProps) {
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(status === "completed");
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionXpEarned, setSessionXpEarned] = useState<number | null>(null);
  const [sessionStarsEarned, setSessionStarsEarned] = useState<number | null>(null);
  const [engineSession, setEngineSession] = useState(0);
  const hintDepthByStepIdRef = useRef<Record<string, number>>({});
  const lastFailResponsesRef = useRef<SceneResponsePayload[] | null>(null);

  const displayXp = sessionXpEarned ?? xpGranted ?? xpReward;
  const displayStars = sessionStarsEarned ?? starsGranted;
  const typeLabel = missionTypeLabel(missionType);

  const steps = useMemo(() => scenesToMicroSteps(scenes as MissionSceneData[]), [scenes]);

  const attachHintLevels = useCallback(
    (rows: Array<{ sceneId: string; isCorrect: boolean; attempts: number }>) =>
      rows.map((r) => ({
        ...r,
        maxHintLevel: hintDepthByStepIdRef.current[r.sceneId] ?? 0,
      })),
    []
  );

  const saveProgress = useCallback(
    async (payload: { index: number; answers: Record<string, unknown>; completedIndices: number[] }) => {
      try {
        await fetch(`/api/missions/${missionId}/partial`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentSceneIndex: payload.index,
            completedIndices: payload.completedIndices,
            answers: payload.answers,
          }),
        });
      } catch {
        // ignore
      }
    },
    [missionId]
  );

  const handleSessionEnd = useCallback(
    ({ sceneResponses, passed }: { sceneResponses: SceneResponsePayload[]; passed: boolean }) => {
      if (!passed) {
        lastFailResponsesRef.current = sceneResponses;
        setShowTryAgain(true);
        return;
      }
      lastFailResponsesRef.current = null;
      setLoading(true);
      fetch(`/api/missions/${missionId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sceneResponses: attachHintLevels(
            sceneResponses.map((r) => ({
              sceneId: r.sceneId,
              isCorrect: r.isCorrect,
              attempts: r.attempts,
            }))
          ),
        }),
      })
        .then(async (res) => {
          const data = (await res.json().catch(() => ({}))) as { xpEarned?: number; stars?: number };
          if (!res.ok) setCompleteError("Failed to save completion.");
          else {
            if (typeof data.xpEarned === "number") setSessionXpEarned(data.xpEarned);
            if (typeof data.stars === "number") setSessionStarsEarned(data.stars);
            router.refresh();
          }
          setShowSummary(true);
        })
        .finally(() => setLoading(false));
    },
    [missionId, attachHintLevels, router]
  );

  const total = steps.length;

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
    const correctCount = lastFailResponsesRef.current
      ? lastFailResponsesRef.current.filter((r) => r.isCorrect).length
      : scenes.filter((s) => s.responses?.some((r) => r.isCorrect)).length;
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
            {completeError ? <p className="mt-2 text-sm text-destructive">{completeError}</p> : null}
            <button
              type="button"
              onClick={() => {
                setShowTryAgain(false);
                setEngineSession((k) => k + 1);
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
    const correctCountFromResponses = scenes.reduce(
      (acc, s) => acc + (s.responses?.some((r) => r.isCorrect) ? 1 : 0),
      0
    );
    const correctCount = correctCountFromResponses;
    return (
      <CompletionSummaryCard
        xpEarned={displayXp}
        stars={displayStars}
        practiceSummary={{ correct: correctCount, total }}
        missionTitle={missionTitle}
        nodeTitle={nodeTitle}
        missionTypeLabel={typeLabel}
        onBack={() => router.push("/missions")}
      />
    );
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-center text-sm text-muted-foreground">Saving mission…</p>
      ) : null}
      <MicroInteractionEngine
        key={`${missionId}-${engineSession}`}
        missionTitle={missionTitle}
        nodeTitle={nodeTitle}
        steps={steps}
        initialStepIndex={initialSceneIndex}
        onProgress={(p) => void saveProgress(p)}
        onSessionEnd={handleSessionEnd}
        onExit={() => router.push("/missions")}
      />
    </div>
  );
}
