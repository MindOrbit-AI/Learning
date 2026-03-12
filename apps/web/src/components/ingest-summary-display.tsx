"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@mindorbit/ui";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  List,
  HelpCircle,
} from "lucide-react";

export type IngestSummary = {
  flashcards?: Array<{ front: string; back: string }>;
  shortSummary?: string;
  deepSummary?: string;
  quizzes?: Array<{
    prompt: string;
    type: string;
    options: string[] | null;
    correctAnswer: string;
    explanation: string;
  }>;
};

export function IngestSummaryDisplay({ summary }: { summary: IngestSummary }) {
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizRevealed, setQuizRevealed] = useState<Record<number, boolean>>({});

  const flashcards = summary?.flashcards ?? [];
  const quizzes = summary?.quizzes ?? [];
  const currentFlashcard = flashcards[flashcardIndex];

  if (!summary) return null;

  return (
    <>
      {/* Short Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Summary
          </CardTitle>
          <CardDescription>2–4 sentence overview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-foreground">
            {summary.shortSummary ?? ""}
          </p>
        </CardContent>
      </Card>

      {/* Deep Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Deep Summary
          </CardTitle>
          <CardDescription>Detailed breakdown of main concepts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-foreground">
              {summary.deepSummary ?? ""}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Flashcards */}
      {flashcards.length > 0 && currentFlashcard && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              Flashcards
            </CardTitle>
            <CardDescription>
              {flashcardIndex + 1} of {flashcards.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="min-h-[140px] cursor-pointer rounded-xl border bg-card p-6 shadow-sm transition hover:border-primary/50"
              onClick={() => setFlashcardFlipped(!flashcardFlipped)}
            >
              <p className="text-center font-medium">
                {flashcardFlipped
                  ? currentFlashcard.back
                  : currentFlashcard.front}
              </p>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Click to flip
              </p>
            </div>
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={flashcardIndex === 0}
                onClick={() => {
                  setFlashcardIndex((i) => Math.max(0, i - 1));
                  setFlashcardFlipped(false);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={flashcardIndex >= flashcards.length - 1}
                onClick={() => {
                  setFlashcardIndex((i) =>
                    Math.min(flashcards.length - 1, i + 1)
                  );
                  setFlashcardFlipped(false);
                }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quizzes */}
      {quizzes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Quizzes
            </CardTitle>
            <CardDescription>Test your understanding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {quizzes.map((q, i) => {
              const revealed = quizRevealed[i];
              const userAnswer = quizAnswers[i];
              const isCorrect =
                userAnswer?.trim().toLowerCase() ===
                q.correctAnswer.trim().toLowerCase();

              return (
                <div key={i} className="space-y-3 rounded-xl border p-4">
                  <p className="font-medium">{q.prompt}</p>
                  {q.type === "multiple_choice" && q.options ? (
                    <div className="space-y-2">
                      {q.options.map((opt, j) => (
                        <button
                          key={j}
                          type="button"
                          disabled={revealed}
                          onClick={() => {
                            setQuizAnswers((prev) => ({ ...prev, [i]: opt }));
                            setQuizRevealed((prev) => ({ ...prev, [i]: true }));
                          }}
                          className={`block w-full rounded-lg border px-4 py-2 text-left text-sm transition ${
                            revealed
                              ? opt === q.correctAnswer
                                ? "border-green-500 bg-green-500/10"
                                : userAnswer === opt
                                  ? "border-red-500 bg-red-500/10"
                                  : "border-muted opacity-70"
                              : "hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Your answer"
                        disabled={revealed}
                        value={userAnswer ?? ""}
                        onChange={(e) =>
                          setQuizAnswers((prev) => ({
                            ...prev,
                            [i]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border px-4 py-2"
                      />
                      {!revealed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setQuizRevealed((prev) => ({ ...prev, [i]: true }))
                          }
                        >
                          Check Answer
                        </Button>
                      )}
                    </div>
                  )}
                  {revealed && (
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        isCorrect
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      <p className="font-medium">
                        {isCorrect ? "Correct!" : "Incorrect."} Answer:{" "}
                        {q.correctAnswer}
                      </p>
                      <p className="mt-1">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </>
  );
}
