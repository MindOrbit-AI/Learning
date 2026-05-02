"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair,
  Flame,
  Lightbulb,
  Loader2,
  RotateCcw,
  Shield,
  Skull,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@mindorbit/ui";
import {
  getFallbackPool,
  type ArenaCategory,
} from "@/features/concept-arena/arena-fallback-questions";
import { arenaSounds } from "@/features/concept-arena/concept-arena-sounds";

type ArenaQuestionDTO = {
  id: string;
  subjectId: string | null;
  nodeId: string | null;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

type LeaderRow = {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  wins: number;
  losses: number;
  totalDamageDealt: number;
  bestCombo: number;
  matchesPlayed: number;
};

const ROUND_MS = 12_000;
const MAX_HP = 100;
const BASE_DAMAGE = 11;
const OPPONENT_COUNTER = 10;

const AI_NAMES = [
  "Neural Nemesis",
  "Apex Scholar",
  "Syntax Specter",
  "Quantum Quizzler",
  "Logic Leviathan",
];

const CATEGORIES: { id: ArenaCategory; label: string; accent: string }[] = [
  { id: "math", label: "Math", accent: "from-cyan-500 to-blue-600" },
  { id: "science", label: "Science", accent: "from-emerald-500 to-teal-600" },
  { id: "business", label: "Business", accent: "from-amber-500 to-orange-600" },
  { id: "coding", label: "Coding", accent: "from-fuchsia-500 to-violet-600" },
  { id: "mixed", label: "Mixed", accent: "from-pink-500 to-rose-600" },
];

function damageForCombo(combo: number, double: boolean) {
  const mult = Math.min(5, Math.max(1, combo));
  const raw = BASE_DAMAGE * mult * (double ? 2 : 1);
  return Math.round(raw);
}

function shuffleOptions(opts: string[]): string[] {
  const a = [...opts];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const ai = a[i]!;
    const aj = a[j]!;
    a[i] = aj;
    a[j] = ai;
  }
  return a;
}

export function ConceptArenaClient() {
  const [mode, setMode] = useState<"lobby" | "matchmaking" | "battle" | "result">("lobby");
  const [category, setCategory] = useState<ArenaCategory>("mixed");
  const [opponentName, setOpponentName] = useState("");
  const [questions, setQuestions] = useState<ArenaQuestionDTO[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [playerHp, setPlayerHp] = useState(MAX_HP);
  const [opponentHp, setOpponentHp] = useState(MAX_HP);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [doubleNext, setDoubleNext] = useState(false);
  const [powers, setPowers] = useState({ skip: 1, hint: 1, double: 1 });
  const [hinted, setHinted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lastLine, setLastLine] = useState<string | null>(null);
  const [attackFrom, setAttackFrom] = useState<"player" | "opponent" | null>(null);
  const [roundResults, setRoundResults] = useState<
    { nodeId: string; subjectId: string; correct: boolean }[]
  >([]);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [won, setWon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderRow[]>([]);
  const [lbLoading, setLbLoading] = useState(true);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  type ResultRow = { nodeId: string; subjectId: string; correct: boolean };
  const submitPayloadRef = useRef<{
    maxCombo: number;
    totalDamageDealt: number;
    results: ResultRow[];
  }>({ maxCombo: 1, totalDamageDealt: 0, results: [] });
  const timeoutHandledForQid = useRef<string | null>(null);
  const qRef = useRef<ArenaQuestionDTO | null>(null);
  const qIndexRef = useRef(0);
  const qLenRef = useRef(0);
  const hpRef = useRef({ p: MAX_HP, o: MAX_HP });
  const finishMatchRef = useRef<(didWin: boolean) => Promise<void>>(async () => {});
  const q = questions[qIndex];

  useEffect(() => {
    qRef.current = q ?? null;
  }, [q]);
  useEffect(() => {
    qIndexRef.current = qIndex;
  }, [qIndex]);
  useEffect(() => {
    qLenRef.current = questions.length;
  }, [questions.length]);
  useEffect(() => {
    hpRef.current = { p: playerHp, o: opponentHp };
  }, [playerHp, opponentHp]);

  const remainingMs = useMemo(() => {
    if (!deadline || mode !== "battle") return ROUND_MS;
    return Math.max(0, deadline - tick);
  }, [deadline, mode, tick]);

  const loadLeaderboard = async () => {
    setLbLoading(true);
    try {
      const res = await fetch("/api/concept-arena/leaderboard?limit=12");
      if (!res.ok) return;
      const data = (await res.json()) as { leaderboard: LeaderRow[] };
      setLeaderboard(data.leaderboard ?? []);
    } finally {
      setLbLoading(false);
    }
  };

  useEffect(() => {
    void loadLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  useEffect(() => {
    if (mode !== "battle" || !deadline) return;
    const id = setInterval(() => setTick(Date.now()), 200);
    return () => clearInterval(id);
  }, [mode, deadline]);

  const resetBattleState = () => {
    setQuestions([]);
    setQIndex(0);
    setPlayerHp(MAX_HP);
    setOpponentHp(MAX_HP);
    hpRef.current = { p: MAX_HP, o: MAX_HP };
    setCombo(1);
    setMaxCombo(1);
    setDoubleNext(false);
    setPowers({ skip: 1, hint: 1, double: 1 });
    setHinted(false);
    setLocked(false);
    setLastLine(null);
    setAttackFrom(null);
    setRoundResults([]);
    setTotalDamageDealt(0);
    setDeadline(null);
    submitPayloadRef.current = { maxCombo: 1, totalDamageDealt: 0, results: [] };
    timeoutHandledForQid.current = null;
  };

  const finishMatch = async (didWin: boolean) => {
    const payload = submitPayloadRef.current;
    setMaxCombo(payload.maxCombo);
    setTotalDamageDealt(payload.totalDamageDealt);
    setRoundResults(payload.results);
    setWon(didWin);
    setMode("result");
    if (didWin) arenaSounds.win();
    else arenaSounds.lose();
    setSubmitting(true);
    try {
      await fetch("/api/concept-arena/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          won: didWin,
          maxCombo: payload.maxCombo,
          totalDamageDealt: payload.totalDamageDealt,
          results: payload.results,
        }),
      });
      void loadLeaderboard();
    } catch {
      /* non-blocking */
    } finally {
      setSubmitting(false);
    }
  };

  finishMatchRef.current = finishMatch;

  const checkEnd = (pHp: number, oHp: number, idx: number, len: number) => {
    if (oHp <= 0) {
      void finishMatchRef.current(true);
      return true;
    }
    if (pHp <= 0) {
      void finishMatchRef.current(false);
      return true;
    }
    if (len > 0 && idx + 1 >= len) {
      void finishMatchRef.current(pHp >= oHp);
      return true;
    }
    return false;
  };

  const advanceQuestion = () => {
    timeoutHandledForQid.current = null;
    setHinted(false);
    setLocked(false);
    setLastLine(null);
    setAttackFrom(null);
    setQIndex((i) => i + 1);
    setDeadline(Date.now() + ROUND_MS);
  };

  useEffect(() => {
    if (mode !== "battle" || !deadline || locked || !q) return;
    if (remainingMs > 80) {
      timeoutHandledForQid.current = null;
      return;
    }
    if (remainingMs > 0) return;
    if (timeoutHandledForQid.current === q.id) return;
    timeoutHandledForQid.current = q.id;

    arenaSounds.wrong();
    setLocked(true);
    const dmg = OPPONENT_COUNTER;
    const qc = qRef.current;
    setPlayerHp((hp) => {
      const next = Math.max(0, hp - dmg);
      hpRef.current.p = next;
      const o = hpRef.current.o;
      setLastLine("Time's up — counter hit!");
      setAttackFrom("opponent");
      arenaSounds.attack();
      setCombo(1);
      if (qc?.nodeId && qc.subjectId) {
        const snap = [...submitPayloadRef.current.results];
        snap.push({ nodeId: qc.nodeId, subjectId: qc.subjectId, correct: false });
        submitPayloadRef.current.results = snap;
        setRoundResults(snap);
      }
      setTimeout(() => {
        const idx = qIndexRef.current;
        const len = qLenRef.current;
        if (checkEnd(next, o, idx, len)) return;
        advanceQuestion();
      }, 900);
      return next;
    });
  }, [mode, deadline, locked, remainingMs, q]);

  const startMatchmaking = async () => {
    arenaSounds.resume();
    setMode("matchmaking");
    setOpponentName(AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)] ?? "AI Rival");
    await new Promise((r) => setTimeout(r, 2200));
    let qs: ArenaQuestionDTO[] = [];
    try {
      const res = await fetch(
        `/api/concept-arena/questions?category=${encodeURIComponent(category)}&count=10`
      );
      if (res.ok) {
        const data = (await res.json()) as { questions: ArenaQuestionDTO[] };
        qs = data.questions ?? [];
      }
    } catch {
      qs = [];
    }
    if (qs.length === 0) {
      const fb = getFallbackPool(category);
      qs = fb.map((row, i) => ({
        id: `client-fallback-${category}-${i}-${Date.now()}`,
        subjectId: null,
        nodeId: null,
        prompt: row.prompt,
        options: shuffleOptions([...row.options]),
        correctAnswer: row.correctAnswer,
        explanation: row.explanation,
      }));
    }
    submitPayloadRef.current = { maxCombo: 1, totalDamageDealt: 0, results: [] };
    timeoutHandledForQid.current = null;
    hpRef.current = { p: MAX_HP, o: MAX_HP };
    setQuestions(qs);
    setQIndex(0);
    setPlayerHp(MAX_HP);
    setOpponentHp(MAX_HP);
    setCombo(1);
    setMaxCombo(1);
    setDoubleNext(false);
    setPowers({ skip: 1, hint: 1, double: 1 });
    setHinted(false);
    setLocked(false);
    setLastLine(null);
    setAttackFrom(null);
    setRoundResults([]);
    setTotalDamageDealt(0);
    setMode("battle");
    setDeadline(Date.now() + ROUND_MS);
  };

  const visibleOptions = useMemo(() => {
    if (!q) return [];
    if (!hinted) return q.options;
    const wrong = q.options.filter((o) => o !== q.correctAnswer);
    const drop = wrong.slice(0, Math.min(2, wrong.length));
    return q.options.filter((o) => !drop.includes(o));
  }, [q, hinted]);

  const resolveAnswer = (choice: string, usedSkip = false) => {
    if (!q || locked) return;
    arenaSounds.resume();
    setLocked(true);
    const correct = choice === q.correctAnswer;
    if (!usedSkip) {
      if (correct) arenaSounds.correct();
      else arenaSounds.wrong();
    }

    let nextPlayer = hpRef.current.p;
    let nextOpp = hpRef.current.o;
    let dmgDealt = 0;

    if (!usedSkip && q.nodeId && q.subjectId) {
      const snap = [...submitPayloadRef.current.results];
      snap.push({ nodeId: q.nodeId, subjectId: q.subjectId, correct });
      submitPayloadRef.current.results = snap;
      setRoundResults(snap);
    }

    if (!usedSkip) {
      if (correct) {
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        setMaxCombo((m) => Math.max(m, nextCombo));
        submitPayloadRef.current.maxCombo = Math.max(submitPayloadRef.current.maxCombo, nextCombo);
        dmgDealt = damageForCombo(combo, doubleNext);
        submitPayloadRef.current.totalDamageDealt += dmgDealt;
        setTotalDamageDealt((t) => t + dmgDealt);
        nextOpp = Math.max(0, hpRef.current.o - dmgDealt);
        hpRef.current.o = nextOpp;
        setOpponentHp(nextOpp);
        setLastLine(doubleNext ? `Critical hit! ${dmgDealt} dmg` : `Hit for ${dmgDealt} dmg`);
        setAttackFrom("player");
        arenaSounds.attack();
        if (doubleNext) setDoubleNext(false);
      } else {
        setCombo(1);
        nextPlayer = Math.max(0, hpRef.current.p - OPPONENT_COUNTER);
        hpRef.current.p = nextPlayer;
        setPlayerHp(nextPlayer);
        setLastLine("Wrong — opponent counters!");
        setAttackFrom("opponent");
        arenaSounds.attack();
      }
    }

    const idx = qIndexRef.current;
    const len = qLenRef.current;
    setTimeout(() => {
      if (checkEnd(nextPlayer, nextOpp, idx, len)) return;
      advanceQuestion();
    }, 900);
  };

  const onPick = (opt: string) => {
    if (locked || !q) return;
    arenaSounds.tap();
    resolveAnswer(opt, false);
  };

  const useSkip = () => {
    if (locked || !q || powers.skip <= 0) return;
    arenaSounds.powerUp();
    setPowers((p) => ({ ...p, skip: p.skip - 1 }));
    setLocked(true);
    setLastLine("Skipped — neutral round.");
    setTimeout(() => {
      const { p, o } = hpRef.current;
      if (checkEnd(p, o, qIndexRef.current, qLenRef.current)) return;
      advanceQuestion();
    }, 500);
  };

  const useHint = () => {
    if (!q || powers.hint <= 0 || hinted) return;
    arenaSounds.powerUp();
    setPowers((p) => ({ ...p, hint: p.hint - 1 }));
    setHinted(true);
  };

  const useDouble = () => {
    if (powers.double <= 0 || doubleNext) return;
    arenaSounds.powerUp();
    setPowers((p) => ({ ...p, double: p.double - 1 }));
    setDoubleNext(true);
    setLastLine("Next hit deals double damage.");
  };

  const timerPct = Math.min(100, (remainingMs / ROUND_MS) * 100);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070712] text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.35), transparent 40%), radial-gradient(circle at 80% 10%, rgba(217,70,239,0.3), transparent 35%), radial-gradient(circle at 50% 80%, rgba(34,211,238,0.2), transparent 40%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400/90">
              Live concept duel
            </p>
            <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-violet-300 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
              Concept Battle Arena
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Answer under pressure. Correct answers strike your rival; mistakes open you to counter
              damage. Streaks raise your combo multiplier. Mastery Map updates from real node items
              after each match.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="border-cyan-500/40 bg-cyan-500/5 text-cyan-200">
              <Link href="/mastery-map">Mastery Map</Link>
            </Button>
            <Button asChild variant="outline" className="border-fuchsia-500/40 bg-fuchsia-500/5 text-fuchsia-200">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-cyan-500/20 bg-zinc-950/70 p-6 shadow-[0_0_60px_-12px_rgba(34,211,238,0.35)] backdrop-blur">
            {mode === "lobby" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-fuchsia-300">
                  <Swords className="h-6 w-6" />
                  <span className="text-lg font-bold tracking-wide">Choose subject focus</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        arenaSounds.tap();
                        setCategory(c.id);
                      }}
                      className={`rounded-xl border px-4 py-4 text-left transition ${
                        category === c.id
                          ? "border-cyan-400/80 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.25)]"
                          : "border-zinc-800 bg-zinc-900/50 hover:border-cyan-500/40"
                      }`}
                    >
                      <span
                        className={`inline-block rounded-md bg-gradient-to-r ${c.accent} bg-clip-text text-sm font-bold text-transparent`}
                      >
                        {c.label}
                      </span>
                      <p className="mt-1 text-xs text-zinc-500">
                        {c.id === "mixed"
                          ? "Pulls from multiple published maps"
                          : "Weighted to your mastery gaps when data exists"}
                      </p>
                    </button>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 font-bold text-white shadow-lg shadow-fuchsia-500/25 hover:opacity-95"
                  onClick={() => void startMatchmaking()}
                >
                  <Crosshair className="mr-2 h-5 w-5" />
                  Enter arena
                </Button>
              </div>
            )}

            {mode === "matchmaking" && (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
                <p className="text-center text-lg font-semibold text-cyan-200">Scanning for rivals…</p>
                <p className="text-center text-sm text-zinc-500">
                  Queueing skill-matched opponents (simulated). Priming question deck for{" "}
                  <span className="text-fuchsia-300">{category}</span>.
                </p>
              </div>
            )}

            {mode === "battle" && q && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-zinc-500">Opponent</p>
                    <p className="text-xl font-bold text-fuchsia-200">{opponentName}</p>
                    <p className="text-xs text-zinc-500">PvP queue coming soon — training sim for now</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/5 px-4 py-2">
                    <Flame className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-xs text-zinc-400">Combo</p>
                      <p className="text-lg font-black text-orange-300">{Math.min(5, combo)}×</p>
                    </div>
                    {doubleNext && (
                      <span className="rounded-md bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-200">
                        2× next
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <HealthBar label="You" hp={playerHp} color="cyan" />
                  <HealthBar label={opponentName} hp={opponentHp} color="fuchsia" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6"
                  >
                    {attackFrom && (
                      <motion.div
                        className={`pointer-events-none absolute inset-0 ${
                          attackFrom === "player"
                            ? "bg-gradient-to-r from-cyan-500/25 to-transparent"
                            : "bg-gradient-to-l from-fuchsia-600/25 to-transparent"
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.45 }}
                      />
                    )}
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="rounded-full border border-cyan-500/40 px-3 py-1 text-xs font-semibold text-cyan-200">
                        Round {qIndex + 1} / {questions.length}
                      </span>
                      <span className="font-mono text-sm text-zinc-400">
                        {(remainingMs / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                        animate={{ width: `${timerPct}%` }}
                        transition={{ type: "tween", duration: 0.2 }}
                      />
                    </div>
                    <p className="mt-6 text-lg font-semibold leading-snug text-zinc-100 md:text-xl">
                      {q.prompt}
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {visibleOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          disabled={locked}
                          onClick={() => onPick(opt)}
                          className="rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 py-3 text-left text-sm font-medium text-zinc-200 transition hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] disabled:opacity-40"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {lastLine && (
                      <p className="mt-4 text-center text-sm font-semibold text-cyan-200">{lastLine}</p>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-wrap gap-2">
                  <PowerButton
                    icon={<Zap className="h-4 w-4" />}
                    label="Skip"
                    remaining={powers.skip}
                    onClick={useSkip}
                    disabled={locked}
                  />
                  <PowerButton
                    icon={<Lightbulb className="h-4 w-4" />}
                    label="Hint"
                    remaining={powers.hint}
                    onClick={useHint}
                    disabled={locked || hinted}
                  />
                  <PowerButton
                    icon={<Sparkles className="h-4 w-4" />}
                    label="Double"
                    remaining={powers.double}
                    onClick={useDouble}
                    disabled={locked || doubleNext}
                  />
                </div>
              </div>
            )}

            {mode === "battle" && !q && (
              <p className="py-12 text-center text-zinc-400">Loading arena deck…</p>
            )}

            {mode === "result" && (
              <div className="space-y-6 py-8 text-center">
                {won ? (
                  <Trophy className="mx-auto h-16 w-16 text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
                ) : (
                  <Skull className="mx-auto h-16 w-16 text-fuchsia-400 drop-shadow-[0_0_20px_rgba(232,121,249,0.45)]" />
                )}
                <h2 className="text-3xl font-black text-white">
                  {won ? "Victory" : "Defeat"}
                </h2>
                <p className="text-sm text-zinc-400">
                  Max combo {maxCombo}× · Damage dealt {totalDamageDealt}
                  {submitting ? " · Syncing mastery…" : " · Mastery synced"}
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    className="border-zinc-700"
                    onClick={() => {
                      resetBattleState();
                      setMode("lobby");
                    }}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Lobby
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 font-bold"
                    onClick={() => {
                      void startMatchmaking();
                    }}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Rematch
                  </Button>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-fuchsia-500/20 bg-zinc-950/80 p-4 shadow-[0_0_40px_-10px_rgba(217,70,239,0.35)]">
              <div className="mb-3 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-300" />
                <h3 className="font-bold text-zinc-100">Leaderboard</h3>
              </div>
              {lbLoading ? (
                <p className="text-sm text-zinc-500">Loading…</p>
              ) : leaderboard.length === 0 ? (
                <p className="text-sm text-zinc-500">No matches yet. Be the first to fight.</p>
              ) : (
                <ul className="space-y-2">
                  {leaderboard.map((row) => (
                    <li
                      key={row.userId}
                      className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-3 py-2 text-sm"
                    >
                      <span className="font-mono text-zinc-500">#{row.rank}</span>
                      <span className="flex-1 truncate px-2 text-zinc-200">{row.name}</span>
                      <span className="text-cyan-300">{row.wins}W</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs leading-relaxed text-zinc-500">
              <p className="font-semibold text-zinc-300">Learning layer</p>
              <p className="mt-2">
                Questions prefer nodes where your mastery is lower. After each match, node outcomes
                update your Mastery Map when questions are tied to published diagnostics.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function HealthBar({
  label,
  hp,
  color,
}: {
  label: string;
  hp: number;
  color: "cyan" | "fuchsia";
}) {
  const pct = Math.max(0, Math.min(100, (hp / MAX_HP) * 100));
  const bar =
    color === "cyan"
      ? "from-cyan-400 to-emerald-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
      : "from-fuchsia-500 to-pink-400 shadow-[0_0_20px_rgba(217,70,239,0.4)]";
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span>
          {hp}/{MAX_HP}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          className={`h-full bg-gradient-to-r ${bar}`}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </div>
    </div>
  );
}

function PowerButton({
  icon,
  label,
  remaining,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  remaining: number;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled || remaining <= 0}
      className="border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-violet-400/50 hover:text-white"
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
      <span className="ml-2 rounded bg-zinc-800 px-1.5 font-mono text-[10px] text-zinc-400">
        ×{remaining}
      </span>
    </Button>
  );
}
