"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import { Sparkles } from "lucide-react";

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
  tasks,
  status,
  xpReward,
}: {
  missionId: string;
  tasks: Task[];
  status: string;
  xpReward: number;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({});
  const [loading, setLoading] = useState(false);

  if (tasks.length === 0 && status === "completed") {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-primary" />
          <p className="font-medium">Mission completed!</p>
          <p className="text-sm text-muted-foreground">+{xpReward} XP earned</p>
          <Button className="mt-4" onClick={() => router.push("/missions")}>
            Back to Missions
          </Button>
        </CardContent>
      </Card>
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
    setFeedback((prev) => ({ ...prev, [t.id]: isCorrect }));
  }

  async function handleComplete() {
    setLoading(true);
    await fetch(`/api/missions/${missionId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        responses: Object.entries(answers).map(([taskId, selectedAnswer]) => ({
          taskId,
          selectedAnswer,
        })),
      }),
    });
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
