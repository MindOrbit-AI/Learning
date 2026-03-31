"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, Button } from "@mindorbit/ui";
import { Lock, Sparkles } from "lucide-react";

export default function DiagnosticRunPage() {
  const router = useRouter();
  const params = useParams();
  const subjectSlug = params.subjectSlug as string;
  const [limitError, setLimitError] = useState<string | null>(null);
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
  const [unavailableError, setUnavailableError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const res = await fetch(`/api/diagnostics/${subjectSlug}/start`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403 && data.upgradeRequired) {
          setLimitError(data.error ?? "Diagnostic limit reached");
        } else if (res.status === 422 && data.code === "NO_DIAGNOSTIC_QUESTIONS") {
          setUnavailableError(data.error ?? "No diagnostic questions available for this subject.");
        } else {
          router.push(`/subjects/${subjectSlug}`);
        }
        setLoading(false);
        return;
      }
      const qs = Array.isArray(data.questions) ? data.questions : [];
      if (qs.length === 0) {
        setUnavailableError(
          "No questions were returned for this diagnostic. Try again later or contact support."
        );
        setLoading(false);
        return;
      }
      setQuestions(qs);
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

  if (unavailableError) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-muted p-8 text-center">
        <p className="font-semibold">Diagnostic not available</p>
        <p className="text-sm text-muted-foreground">{unavailableError}</p>
        <Button variant="outline" asChild>
          <Link href={`/subjects/${subjectSlug}`}>Back to subject</Link>
        </Button>
      </div>
    );
  }

  if (limitError) {
    return (
      <div className="mx-auto max-w-md space-y-6 rounded-2xl border-2 border-dashed border-muted p-8 text-center">
        <div className="rounded-full bg-muted p-4 mx-auto w-fit">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-semibold">{limitError}</p>
        <p className="text-sm text-muted-foreground">
          Upgrade to Pro for unlimited diagnostics
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href={`/subjects/${subjectSlug}`}>Back to subject</Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/pricing">
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
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
                disabled={!answers[q.id]}
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
