"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import { CompletionSummaryCard } from "@/components/mission-engine/CompletionSummaryCard";
import { missionTypeLabel } from "@/lib/mission-display";

interface Task {
  id: string;
  type: string;
  prompt: string;
  optionsJson: string | null;
  correctAnswer: string;
  explanation: string | null;
  orderIndex: number;
}

export function MissionRunner({
  missionId,
  missionTitle,
  nodeTitle,
  missionType,
  tasks,
  status,
  xpReward,
  xpGranted,
  starsGranted,
}: {
  missionId: string;
  missionTitle: string;
  nodeTitle: string;
  missionType: string;
  tasks: Task[];
  status: string;
  xpReward: number;
  xpGranted?: number | null;
  starsGranted?: number | null;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({});
  const [loading, setLoading] = useState(false);
  const checkCountsRef = useRef<Record<string, number>>({});
  const [celebration, setCelebration] = useState<{
    xp: number;
    stars?: number;
    practice?: { correct: number; total: number };
  } | null>(null);

  const previousMissionId = useRef(missionId);
  useEffect(() => {
    if (previousMissionId.current === missionId) return;
    previousMissionId.current = missionId;
    setCelebration(null);
    checkCountsRef.current = {};
    setCurrentIndex(0);
    setAnswers({});
    setFeedback({});
  }, [missionId]);

  const typeLabel = missionTypeLabel(missionType);

  if (tasks.length === 0 && status === "completed") {
    return (
      <CompletionSummaryCard
        xpEarned={xpGranted ?? xpReward}
        stars={starsGranted}
        missionTitle={missionTitle}
        nodeTitle={nodeTitle}
        missionTypeLabel={typeLabel}
        onBack={() => router.push("/missions")}
      />
    );
  }

  if (status === "completed" || celebration) {
    return (
      <CompletionSummaryCard
        xpEarned={celebration?.xp ?? xpGranted ?? xpReward}
        stars={celebration?.stars ?? starsGranted}
        practiceSummary={celebration?.practice}
        missionTitle={missionTitle}
        nodeTitle={nodeTitle}
        missionTypeLabel={typeLabel}
        onBack={() => router.push("/missions")}
      />
    );
  }

  if (tasks.length === 0) return null;

  const task = tasks[currentIndex];
  if (!task) return null;
  const options = task.optionsJson ? (JSON.parse(task.optionsJson) as string[]) : null;
  const isLast = currentIndex === tasks.length - 1;
  const showFeedback = feedback[task.id] !== undefined;

  function handleCheck() {
    const t = tasks[currentIndex];
    const ans = t ? answers[t.id] : undefined;
    if (!t || !ans) return;
    const isCorrect = ans.toLowerCase().trim() === t.correctAnswer.toLowerCase().trim();
    const prev = checkCountsRef.current[t.id] ?? 0;
    checkCountsRef.current = { ...checkCountsRef.current, [t.id]: prev + 1 };
    setFeedback((prev) => ({ ...prev, [t.id]: isCorrect }));
  }

  async function handleComplete() {
    setLoading(true);
    const correct = tasks.filter((t) => feedback[t.id] === true).length;
    const res = await fetch(`/api/missions/${missionId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        responses: Object.entries(answers).map(([taskId, selectedAnswer]) => ({
          taskId,
          selectedAnswer,
        })),
        taskCheckCounts: checkCountsRef.current,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      xpEarned?: number;
      stars?: number;
    };
    setCelebration({
      xp: typeof data.xpEarned === "number" ? data.xpEarned : xpReward,
      stars: typeof data.stars === "number" ? data.stars : undefined,
      practice: { correct, total: tasks.length },
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice</CardTitle>
        <p className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {tasks.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg">{task.prompt}</p>
        {task.type === "multiple_choice" && options ? (
          <div className="space-y-2">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => !showFeedback && setAnswers((prev) => ({ ...prev, [task.id]: opt }))}
                disabled={showFeedback}
                className={`block w-full rounded-xl border p-4 text-left transition-colors ${
                  showFeedback
                    ? opt === task.correctAnswer
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : answers[task.id] === opt
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : ""
                    : answers[task.id] === opt
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : task.type === "true_false" ? (
          <div className="flex gap-4">
            {["true", "false"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => !showFeedback && setAnswers((prev) => ({ ...prev, [task.id]: opt }))}
                disabled={showFeedback}
                className={`flex-1 rounded-xl border p-4 capitalize ${
                  answers[task.id] === opt ? "border-primary bg-primary/10" : "hover:bg-muted"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            placeholder="Your answer"
            value={answers[task.id] ?? ""}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [task.id]: e.target.value }))}
            disabled={showFeedback}
            className="w-full rounded-xl border p-4"
          />
        )}

        {showFeedback && (
          <div
            className={`rounded-xl p-4 ${
              feedback[task.id]
                ? "bg-green-50 dark:bg-green-900/20"
                : "bg-red-50 dark:bg-red-900/20"
            }`}
          >
            <p className="font-medium">{feedback[task.id] ? "Correct!" : "Incorrect"}</p>
            {task.explanation && (
              <p className="mt-2 text-sm text-muted-foreground">{task.explanation}</p>
            )}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            Back
          </Button>
          {!showFeedback ? (
            <Button onClick={handleCheck} disabled={!answers[task.id]}>
              Check Answer
            </Button>
          ) : isLast ? (
            <Button onClick={handleComplete} disabled={loading}>
              {loading ? "Completing..." : "Complete Mission"}
            </Button>
          ) : (
            <Button onClick={() => setCurrentIndex((i) => i + 1)}>Next</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
