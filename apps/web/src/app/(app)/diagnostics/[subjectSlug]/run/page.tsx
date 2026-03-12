"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@mindorbit/ui";
export default function DiagnosticRunPage() {
  const router = useRouter();
  const params = useParams();
  const subjectSlug = params.subjectSlug as string;
  const [questions, setQuestions] = useState<
    Array<{
      id: string;
      prompt: string;
      type: string;
      optionsJson: string | null;
      correctAnswer: string;
    }>
  >([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const res = await fetch(`/api/diagnostics/${subjectSlug}/start`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        router.push(`/subjects/${subjectSlug}`);
        return;
      }
      setQuestions(data.questions);
      setAttemptId(data.attemptId);
      setLoading(false);
    }
    init();
  }, [subjectSlug, router]);

  async function handleSubmit() {
    if (!attemptId) return;
    const res = await fetch(`/api/diagnostics/${subjectSlug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attemptId,
        responses: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })),
      }),
    });
    if (!res.ok) {
      alert("Submission failed");
      return;
    }
    const data = await res.json();
    router.push(`/diagnostics/${subjectSlug}/results?attemptId=${data.attemptId}`);
  }

  if (loading || questions.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading diagnostic...</p>
      </div>
    );
  }

  const q = questions[currentIndex];
  if (!q) return null;
  const options = q.optionsJson ? (JSON.parse(q.optionsJson) as string[]) : null;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="mb-6 text-lg">{q.prompt}</p>
          {q.type === "multiple_choice" && options ? (
            <div className="space-y-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                  }
                  className={`block w-full rounded-xl border p-4 text-left transition-colors ${
                    answers[q.id] === opt
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : q.type === "true_false" ? (
            <div className="flex gap-4">
              {["true", "false"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                  }
                  className={`flex-1 rounded-xl border p-4 capitalize ${
                    answers[q.id] === opt
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted"
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
              value={answers[q.id] ?? ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
              className="w-full rounded-xl border p-4"
            />
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="text-primary disabled:opacity-50"
            >
              Back
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < questions.length}
                className="rounded-xl bg-primary px-6 py-2 text-primary-foreground disabled:opacity-50"
              >
                Submit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="rounded-xl bg-primary px-6 py-2 text-primary-foreground"
              >
                Next
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
