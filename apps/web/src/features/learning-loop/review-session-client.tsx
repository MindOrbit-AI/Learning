"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@mindorbit/ui";
import type { ReviewSessionQuestion } from "@/services/review-session-service";

interface ReviewSessionClientProps {
  reviewItemId: string;
  nodeTitle: string;
  questions: ReviewSessionQuestion[];
}

export function ReviewSessionClient({
  reviewItemId,
  nodeTitle,
  questions,
}: ReviewSessionClientProps) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const correctCount = results.filter(Boolean).length;

  if (!question) return null;

  async function finishSession(finalCorrect: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/review/${reviewItemId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: true,
          correct: finalCorrect,
          total: questions.length,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { passed?: boolean };
        setPassed(data.passed ?? finalCorrect / questions.length >= 0.6);
        setFinished(true);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCheck() {
    if (!question || !selected || showFeedback) return;
    setShowFeedback(true);
  }

  function handleNext() {
    if (!question || !selected) return;
    const isCorrect = selected === question.correctAnswer;
    const newResults = [...results, isCorrect];
    setResults(newResults);

    if (isLast) {
      void finishSession(newResults.filter(Boolean).length);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setShowFeedback(false);
  }

  if (finished) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              passed ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {passed ? <Check className="h-8 w-8" /> : <X className="h-8 w-8" />}
          </div>
          <h2 className="text-xl font-bold">{passed ? "Review passed" : "Keep practicing"}</h2>
          <p className="mt-2 text-muted-foreground">
            {correctCount}/{questions.length} correct on {nodeTitle}
          </p>
          <Button className="mt-6" onClick={() => router.push("/review")}>
            Back to review queue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
          Retrieval review · {index + 1}/{questions.length}
        </p>
        <CardTitle className="text-lg">{nodeTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium leading-relaxed">{question.prompt}</p>
        {question.sceneType && (
          <p className="text-xs text-muted-foreground">Context: {question.sceneType}</p>
        )}

        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = selected === opt;
            const isCorrectOpt = opt === question.correctAnswer;
            let border = "border-border";
            if (showFeedback && isCorrectOpt) border = "border-green-500 bg-green-500/10";
            else if (showFeedback && isSelected && !isCorrectOpt)
              border = "border-red-500 bg-red-500/10";
            else if (isSelected) border = "border-primary bg-primary/5";

            return (
              <button
                key={opt}
                type="button"
                disabled={showFeedback}
                onClick={() => setSelected(opt)}
                className={`block w-full rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors ${border}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="rounded-xl bg-muted/60 p-3 text-sm">
            <p className="font-semibold">
              {selected === question.correctAnswer ? "Correct" : "Not quite"}
            </p>
            <p className="mt-1 text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {!showFeedback ? (
            <Button onClick={handleCheck} disabled={!selected}>
              Check
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLast ? (
                "Finish review"
              ) : (
                "Next question"
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
