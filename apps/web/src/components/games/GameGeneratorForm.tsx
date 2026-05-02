"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@mindorbit/ui";
import { Loader2, Sparkles } from "lucide-react";
import type { GameMode } from "@prisma/client";
import { GAME_MODE_CATALOG } from "@/features/interactive-games/game-modes";
import { GameModeCard } from "@/components/games/GameModeCard";

const GRADES = ["K-2", "3-5", "6-8", "9-10", "11-12", "College", "Professional"];

export function GameGeneratorForm() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<{ id: string; title: string }[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");
  const [gradeLevel, setGradeLevel] = useState("9-10");
  const [learningGoal, setLearningGoal] = useState("");
  const [gameMode, setGameMode] = useState<GameMode>("ADAPTIVE_QUIZ");
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/subjects");
        const data = (await res.json()) as { subjects?: { id: string; title: string }[] };
        if (!cancelled && data.subjects?.length) {
          setSubjects(data.subjects);
          setSubjectId(data.subjects[0]!.id);
        }
      } catch {
        if (!cancelled) setError("Could not load subjects.");
      } finally {
        if (!cancelled) setLoadingSubjects(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onGenerate() {
    setError(null);
    if (!subjectId || !topic.trim() || !learningGoal.trim()) {
      setError("Pick a subject, topic, and learning goal.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/games/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          topic: topic.trim(),
          gradeLevel,
          learningGoal: learningGoal.trim(),
          gameMode,
        }),
      });
      const data = (await res.json()) as { gameId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Generate failed");
      if (data.gameId) router.push(`/games/${data.gameId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">Cognitive OS</p>
        <h1 className="text-4xl font-black text-zinc-50 md:text-5xl">Mission Control</h1>
        <p className="mx-auto max-w-2xl text-sm text-zinc-400 md:text-base">
          Forge a playable learning game from any subject. Each mode trains a different way of thinking — not
          school-like drills, but orbit-grade interaction.
        </p>
      </motion.div>

      <Card className="border-zinc-800 bg-zinc-950/70 shadow-2xl backdrop-blur">
        <CardHeader>
          <CardTitle className="text-zinc-50">Configure your run</CardTitle>
          <CardDescription className="text-zinc-400">
            The generator respects your subject graph and spins up structured JSON for the runner.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loadingSubjects ? (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading subjects…
            </div>
          ) : subjects.length === 0 ? (
            <p className="text-sm text-amber-300">No subjects available. Add a subject to your library first.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="font-semibold text-zinc-300">Subject</span>
                <select
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-semibold text-zinc-300">Grade band</span>
                <select
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-semibold text-zinc-300">Topic</span>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Cellular respiration, supply & demand, recursion…"
                  className="border-zinc-700 bg-zinc-900 text-zinc-100"
                />
              </label>
              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-semibold text-zinc-300">Learning goal</span>
                <textarea
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  rows={3}
                  placeholder="What should feel different in the learner's head after this session?"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
                />
              </label>
            </div>
          )}

          <div>
            <p className="mb-3 text-sm font-semibold text-zinc-300">Game mode</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {GAME_MODE_CATALOG.map((m) => (
                <GameModeCard
                  key={m.id}
                  meta={m}
                  selected={gameMode === m.id}
                  onSelect={() => setGameMode(m.id as GameMode)}
                />
              ))}
            </div>
          </div>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              disabled={submitting || !subjectId}
              onClick={() => void onGenerate()}
              className="rounded-2xl bg-gradient-to-r from-cyan-600 to-violet-600 px-8 py-6 text-base font-bold shadow-lg hover:from-cyan-500 hover:to-violet-500"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" /> Generate game
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
