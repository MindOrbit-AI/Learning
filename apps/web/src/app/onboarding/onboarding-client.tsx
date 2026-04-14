"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { SUBJECTS, subjectKeysForGradeLevel, subjectSlugForKey, type SubjectKey } from "@mindorbit/lib";
import { Brain, ChevronRight } from "lucide-react";

const gradeLevels = ["9", "10", "11", "12", "College", "Other"];
const studyGoals = [
  "Improve grades",
  "SAT/ACT prep",
  "AP exam prep",
  "General mastery",
  "Catch up",
];
const targetExams = ["SAT", "ACT", "AP Chemistry", "AP Biology", "AP Calculus", "Other"];

export function OnboardingClient() {
  const [step, setStep] = useState(1);
  const [gradeLevel, setGradeLevel] = useState("");
  const [studyGoal, setStudyGoal] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [targetExamsSelected, setTargetExamsSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subjectKeysForStep = subjectKeysForGradeLevel(gradeLevel);

  useEffect(() => {
    const allowed = new Set<string>(subjectKeysForGradeLevel(gradeLevel));
    setSubjects((prev) => prev.filter((k) => allowed.has(k)));
  }, [gradeLevel]);

  async function handleComplete() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          gradeLevel,
          studyGoal,
          favoriteSubjects: subjects,
          targetExams: targetExamsSelected,
        }),
      });
      if (res.status === 401) {
        setError("Your session expired. Sign in again to continue.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not save onboarding. Try again.");
        setLoading(false);
        return;
      }
      const firstKey = subjects[0] as SubjectKey | undefined;
      if (firstKey) {
        const slug = subjectSlugForKey(firstKey);
        window.location.assign(`/diagnostics/${slug}/run`);
      } else {
        window.location.assign("/dashboard");
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <header className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">MindOrbit Learn</span>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <div className="mb-2 flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Step {step} of 4</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "What grade are you in?"}
              {step === 2 && "What's your main study goal?"}
              {step === 3 && "Which subjects interest you?"}
              {step === 4 && "Any target exams?"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "We'll personalize your experience"}
              {step === 2 && "This helps us prioritize content"}
              {step === 3 && "Select all that apply"}
              {step === 4 && "Optional—we'll tailor practice"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error ? (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
            ) : null}

            {step === 1 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {gradeLevels.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGradeLevel(g)}
                    className={`rounded-xl border p-4 text-left transition-colors ${
                      gradeLevel === g
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                {studyGoals.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setStudyGoal(g)}
                    className={`block w-full rounded-xl border p-4 text-left transition-colors ${
                      studyGoal === g
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {subjectKeysForStep.map((key) => {
                  const s = SUBJECTS[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSubjects((prev) =>
                          prev.includes(key)
                            ? prev.filter((x) => x !== key)
                            : [...prev, key]
                        );
                      }}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                        subjects.includes(key)
                          ? "border-primary bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span className="text-2xl">{s.icon}</span>
                      <span>{s.title}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-2">
                {targetExams.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => {
                      setTargetExamsSelected((prev) =>
                        prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
                      );
                    }}
                    className={`block w-full rounded-xl border p-4 text-left transition-colors ${
                      targetExamsSelected.includes(e)
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              ) : (
                <span />
              )}
              {step < 4 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={
                    (step === 1 && !gradeLevel) ||
                    (step === 2 && !studyGoal) ||
                    (step === 3 && subjects.length === 0)
                  }
                >
                  Continue <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={loading}>
                  {loading ? "Setting up..." : "Complete"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
