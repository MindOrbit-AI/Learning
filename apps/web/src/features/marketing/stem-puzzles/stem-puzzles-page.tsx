"use client";

import { cn } from "@mindorbit/ui";
import { AnimatePresence, motion } from "framer-motion";
import { getSession } from "next-auth/react";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type TouchEvent,
} from "react";
import { METAS } from "./catalog";
import {
  BOSS_CATEGORY_THRESHOLD,
  CATALOG_PAGE_SIZE,
  COLOR_MODE_STORAGE_KEY,
  DIFFICULTY_OPTIONS,
  DOMAIN_OPTIONS,
  ENGINEERING_SUBJECT_OPTIONS,
  GRADE_OPTIONS,
  INTERACTION_OPTIONS,
  LEVEL_XP,
  LOCK_OPTIONS,
  MASTERY_CATEGORY_THRESHOLD,
  MATH_SUBJECTS,
  MAX_ENERGY,
  ENERGY_REGEN_MS,
  SCIENCE_SUBJECT_OPTIONS,
  STORAGE_KEY,
  TECH_SUBJECT_OPTIONS,
  XP_PER_WIN,
} from "./constants";
import {
  aiCompatibleMode,
  canCheck,
  compareMetaDifficulty,
  difficultyFor,
  domainFor,
  initialState,
  isSolved,
  isUnlocked,
  makePuzzle,
  metaFor,
  puzzleFromAiSpec,
  xpRequiredFor,
  xpRewardFor,
} from "./logic";
import { metaInteractionDisplay, subjectLabel } from "./labels";
import type {
  AiPuzzleSpec,
  CatalogView,
  Difficulty,
  DifficultyFilter,
  DomainFilter,
  GradeFilter,
  InteractionFilter,
  LockFilter,
  PlayState,
  Puzzle,
  PuzzleId,
  PuzzleMeta,
  Result,
  SubjectFilter,
} from "./types";
import {
  CategoryCard,
  Confetti,
  FilterPills,
  FilterSelect,
  Interaction,
  ProgressBar,
  SearchInput,
  SkillTree,
  StatCard,
  VisualCard,
} from "./widgets";

export function StemPuzzlesPage() {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState(0);
  const [active, setActive] = useState<PuzzleId | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [state, setRawState] = useState<PlayState>(() => initialState(null));
  const [result, setResult] = useState<Result>("idle");
  const [hint, setHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [daily, setDaily] = useState<PuzzleId>("weightScale");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("All");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("All");
  const [interactionFilter, setInteractionFilter] = useState<InteractionFilter>("All");
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("All");
  const [lockFilter, setLockFilter] = useState<LockFilter>("All");
  const [catalogView, setCatalogView] = useState<CatalogView>("grid");
  const [catalogPage, setCatalogPage] = useState(1);
  const [lockedToast, setLockedToast] = useState<{ title: string; message: string } | null>(null);
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [lastEnergyAt, setLastEnergyAt] = useState<number>(() => Date.now());
  const [categoryCompletions, setCategoryCompletions] = useState<Record<string, number>>({});
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState<"ai" | "mock" | "fallback" | "procedural" | null>(null);
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  const activeMeta = active ? metaFor(active) : null;
  const setState = (next: Partial<PlayState>) => setRawState((prev) => ({ ...prev, ...next }));

  const resolveDifficulty = useCallback(
    (override?: number): Difficulty => {
      if (difficultyFilter !== "All") return difficultyFilter;
      return difficultyFor(typeof override === "number" ? override : solved);
    },
    [difficultyFilter, solved],
  );

  const effectiveDifficulty: Difficulty = resolveDifficulty();

  const visibleMetas = useMemo(
    () =>
      METAS.map((meta, index) => ({ meta, index }))
        .filter(({ meta }) => {
          if (gradeFilter !== "All" && meta.grade !== gradeFilter) return false;
          if (subjectFilter !== "All" && meta.subject !== subjectFilter) return false;
          if (domainFilter !== "All" && domainFor(meta.subject) !== domainFilter) return false;
          if (interactionFilter !== "All" && metaInteractionDisplay(meta) !== interactionFilter) return false;
          if (lockFilter === "Unlocked" && !isUnlocked(meta, xp, categoryCompletions)) return false;
          if (lockFilter === "Locked" && isUnlocked(meta, xp, categoryCompletions)) return false;
          if (search.trim().length > 0) {
            const haystack = `${meta.title} ${meta.short} ${meta.skill} ${meta.subject}`.toLowerCase();
            if (!haystack.includes(search.trim().toLowerCase())) return false;
          }
          return true;
        })
        .sort((a, b) => compareMetaDifficulty(a.meta, b.meta) || a.index - b.index)
        .map(({ meta }) => meta),
    [gradeFilter, subjectFilter, interactionFilter, search, domainFilter, lockFilter, xp, categoryCompletions],
  );

  const catalogTotalPages = Math.max(1, Math.ceil(visibleMetas.length / CATALOG_PAGE_SIZE));
  const pagedGridMetas = useMemo(() => {
    const start = (catalogPage - 1) * CATALOG_PAGE_SIZE;
    return visibleMetas.slice(start, start + CATALOG_PAGE_SIZE);
  }, [visibleMetas, catalogPage]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(visibleMetas.length / CATALOG_PAGE_SIZE));
    setCatalogPage((p) => Math.min(p, maxPage));
  }, [visibleMetas]);

  const subjectOptions = useMemo<readonly SubjectFilter[]>(() => {
    if (domainFilter === "Science") return SCIENCE_SUBJECT_OPTIONS;
    if (domainFilter === "Math") return MATH_SUBJECTS;
    if (domainFilter === "Technology") return TECH_SUBJECT_OPTIONS;
    if (domainFilter === "Engineering") return ENGINEERING_SUBJECT_OPTIONS;
    return [
      "All",
      ...MATH_SUBJECTS.filter((s) => s !== "All"),
      ...SCIENCE_SUBJECT_OPTIONS.filter((s) => s !== "All"),
      ...TECH_SUBJECT_OPTIONS.filter((s) => s !== "All"),
      ...ENGINEERING_SUBJECT_OPTIONS.filter((s) => s !== "All"),
    ];
  }, [domainFilter]);

  const nextUnlock = useMemo(() => {
    const locked = METAS.filter((meta) => !isUnlocked(meta, xp, categoryCompletions));
    if (locked.length === 0) return null;
    locked.sort((a, b) => xpRequiredFor(a) - xpRequiredFor(b));
    return locked[0];
  }, [xp, categoryCompletions]);

  const unlockedCount = useMemo(() => METAS.filter((meta) => isUnlocked(meta, xp, categoryCompletions)).length, [xp, categoryCompletions]);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const progress = JSON.parse(saved) as {
        xp?: number;
        streak?: number;
        solved?: number;
        energy?: number;
        lastEnergyAt?: number;
        completions?: Record<string, number>;
      };
      setXp(progress.xp ?? 0);
      setStreak(progress.streak ?? 0);
      setSolved(progress.solved ?? 0);
      setCategoryCompletions(progress.completions ?? {});
      if (typeof progress.energy === "number" && typeof progress.lastEnergyAt === "number") {
        const elapsed = Date.now() - progress.lastEnergyAt;
        const regen = Math.floor(elapsed / ENERGY_REGEN_MS);
        const restored = Math.min(MAX_ENERGY, (progress.energy ?? MAX_ENERGY) + regen);
        setEnergy(restored);
        setLastEnergyAt(restored === MAX_ENERGY ? Date.now() : progress.lastEnergyAt + regen * ENERGY_REGEN_MS);
      }
    }
    const daySeed = new Date().toISOString().slice(0, 10).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    setDaily(METAS[daySeed % METAS.length]!.id);
  }, []);

  useEffect(() => {
    const mode = window.localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (mode === "dark" || mode === "light") setColorMode(mode);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, colorMode);
  }, [colorMode]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ xp, streak, solved, energy, lastEnergyAt, completions: categoryCompletions }),
    );
  }, [xp, streak, solved, energy, lastEnergyAt, categoryCompletions]);

  useEffect(() => {
    if (energy >= MAX_ENERGY) return;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - lastEnergyAt;
      if (elapsed >= ENERGY_REGEN_MS) {
        const ticks = Math.floor(elapsed / ENERGY_REGEN_MS);
        setEnergy((value) => Math.min(MAX_ENERGY, value + ticks));
        setLastEnergyAt(Date.now());
      }
    }, 15000);
    return () => window.clearInterval(id);
  }, [energy, lastEnergyAt]);

  useEffect(() => {
    if (subjectFilter === "All") return;
    if (!subjectOptions.includes(subjectFilter)) setSubjectFilter("All");
  }, [domainFilter, subjectFilter, subjectOptions]);

  useEffect(() => {
    if (!lockedToast) return;
    const id = window.setTimeout(() => setLockedToast(null), 2400);
    return () => window.clearTimeout(id);
  }, [lockedToast]);

  useEffect(() => {
    if (!confetti) return;
    const timer = window.setTimeout(() => setConfetti(false), 1300);
    return () => window.clearTimeout(timer);
  }, [confetti]);

  const start = useCallback(
    async (type: PuzzleId) => {
      const session = await getSession();
      if (!session?.user) {
        const returnTo = `${window.location.pathname}${window.location.search}`;
        window.location.assign(`/auth/signin?callbackUrl=${encodeURIComponent(returnTo)}`);
        return;
      }
      const meta = metaFor(type);
      if (meta && !isUnlocked(meta, xp, categoryCompletions)) {
        const subjectCount = categoryCompletions[meta.subject] ?? 0;
        let message = meta.unlockMessage ?? `Reach ${xpRequiredFor(meta)} XP to unlock ${meta.title}.`;
        if (meta.isBoss && subjectCount < BOSS_CATEGORY_THRESHOLD) {
          message = `Boss locked — finish ${BOSS_CATEGORY_THRESHOLD - subjectCount} more ${subjectLabel(meta.subject)} puzzles.`;
        } else if (meta.isMasteryTest && subjectCount < MASTERY_CATEGORY_THRESHOLD) {
          message = `Mastery test locked — finish ${MASTERY_CATEGORY_THRESHOLD - subjectCount} more ${subjectLabel(meta.subject)} puzzles.`;
        }
        setLockedToast({ title: meta.title, message });
        return;
      }
      if (energy <= 0) {
        setLockedToast({ title: "Out of energy", message: "Wait for energy to regen, or come back later." });
        return;
      }
      const useDifficulty: Difficulty = difficultyFilter !== "All" ? difficultyFilter : difficultyFor(solved);
      setActive(type);
      setHint(false);
      setHintIndex(0);

      let next: Puzzle | null = null;
      if (aiEnabled && meta) {
        const aiMode = aiCompatibleMode(meta);
        if (aiMode) {
          setAiLoading(true);
          setPuzzle(null);
          try {
            const response = await fetch("/api/stem-puzzle/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: meta.id,
                title: meta.title,
                domain: domainFor(meta.subject),
                subject: meta.subject,
                skill: meta.skill,
                grade: meta.grade,
                difficulty: useDifficulty,
                mode: aiMode,
              }),
            });
            if (response.ok) {
              const data = (await response.json()) as { spec?: unknown; source?: string };
              if (data.spec) {
                next = puzzleFromAiSpec(meta, data.spec as AiPuzzleSpec, useDifficulty, aiMode);
                setAiSource((data.source as "ai" | "mock" | "fallback") ?? "ai");
              }
            }
          } catch (err) {
            console.error("AI puzzle fetch failed", err);
          } finally {
            setAiLoading(false);
          }
        }
      }
      if (!next) {
        next = makePuzzle(type, useDifficulty);
        setAiSource(aiEnabled ? "fallback" : "procedural");
      }
      setPuzzle(next);
      setRawState(initialState(next));
      setResult("idle");
    },
    [difficultyFilter, solved, xp, categoryCompletions, energy, aiEnabled],
  );

  const nextPuzzle = useCallback(() => {
    if (!active) return;
    if (aiEnabled) {
      void start(active);
      return;
    }
    const useDifficulty: Difficulty = resolveDifficulty(solved + 1);
    const next = makePuzzle(active, useDifficulty);
    setPuzzle(next);
    setRawState(initialState(next));
    setResult("idle");
    setHint(false);
    setHintIndex(0);
    setAiSource("procedural");
  }, [active, aiEnabled, resolveDifficulty, solved, start]);

  const exitRun = () => {
    setActive(null);
    setPuzzle(null);
  };

  const check = () => {
    if (!puzzle) return;
    if (result === "correct") {
      nextPuzzle();
      return;
    }
    if (result === "wrong") {
      setRawState(initialState(puzzle));
      setResult("idle");
      return;
    }
    const correct = isSolved(puzzle, state);
    setResult(correct ? "correct" : "wrong");
    if (puzzle.mode === "coloring") {
      const regs = puzzle.regions ?? [];
      if (regs.length > 0) {
        setState({
          coloringFeedback: Object.fromEntries(
            regs.map((r) => [r.id, state.coloringFill[r.id] === r.correctColorId ? ("correct" as const) : ("wrong" as const)]),
          ),
        });
      }
    }
    if (correct) {
      const reward = puzzle.xpReward ?? xpRewardFor(puzzle.difficulty);
      setXp((value) => value + reward);
      setStreak((value) => value + 1);
      setSolved((value) => value + 1);
      setConfetti(true);
      const meta = metaFor(puzzle.type);
      if (meta) {
        setCategoryCompletions((prev) => ({
          ...prev,
          [meta.subject]: (prev[meta.subject] ?? 0) + 1,
          [`puzzle:${meta.id}`]: (prev[`puzzle:${meta.id}`] ?? 0) + 1,
        }));
      }
    } else {
      setStreak(0);
      setEnergy((value) => Math.max(0, value - 1));
      setLastEnergyAt(Date.now());
    }
  };

  const currentHint = (() => {
    if (!puzzle) return "";
    if (puzzle.hints && puzzle.hints.length > 0) {
      return puzzle.hints[Math.min(hintIndex, puzzle.hints.length - 1)] ?? puzzle.hint;
    }
    return puzzle.hint;
  })();

  const featuredMeta = visibleMetas[0] ?? metaFor(daily);
  const randomStart = () => {
    const visibleUnlocked = visibleMetas.filter((meta) => isUnlocked(meta, xp, categoryCompletions));
    const pool = visibleUnlocked.length > 0
      ? visibleUnlocked
      : METAS.filter((meta) => isUnlocked(meta, xp, categoryCompletions));
    if (pool.length === 0) return;
    start(pool[Math.floor(Math.random() * pool.length)]!.id);
  };

  return (
    <div className={cn(colorMode === "dark" && "dark")}>
      <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#f0f0f0] text-neutral-800 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#58cc02]/15 blur-3xl dark:bg-[#58cc02]/10" />
        <div className="absolute -left-20 bottom-32 h-64 w-64 rounded-full bg-[#1cb0f6]/12 blur-3xl dark:bg-[#1cb0f6]/8" />
      </div>
      <Confetti show={confetti} />

      <AnimatePresence>
        {lockedToast ? (
          <motion.div
            key="lock-toast"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-50 mx-auto flex max-w-sm justify-center px-4"
          >
            <div className="flex items-start gap-3 rounded-2xl border-2 border-[#e5a000] bg-[#fff4d4] px-4 py-3 text-neutral-900 shadow-[0_4px_0_0_#e5a000] dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-50 dark:shadow-[0_4px_0_0_#92400e]">
              <span className="text-xl">🔒</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-black">{lockedToast.title}</p>
                <p className="text-[11px] leading-snug text-neutral-700 dark:text-amber-100/90">{lockedToast.message}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header className="sticky top-0 z-30 border-b-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-[0_2px_0_0_#e5e5e5] dark:shadow-[0_2px_0_0_#27272a]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {active ? (
                <button
                  type="button"
                  onClick={exitRun}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 text-xl font-black text-neutral-700 dark:text-zinc-300 transition active:border-b-2 active:translate-y-0.5"
                >
                  ‹
                </button>
              ) : (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-[#84d8ff] dark:border-sky-600 bg-[#ddf4ff] dark:bg-sky-950/50 text-xl">🧠</span>
              )}
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-black tracking-tight text-neutral-900 dark:text-zinc-50 sm:text-xl">{activeMeta?.title ?? "MindOrbit Puzzles"}</h1>
                <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500 dark:text-zinc-400 sm:truncate sm:line-clamp-none">{activeMeta?.short ?? `${METAS.length} puzzles · Math · Science · Tech · Engineering`}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end sm:gap-2.5">
              <button
                type="button"
                onClick={() => setColorMode((m) => (m === "light" ? "dark" : "light"))}
                className="rounded-full border-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-2 text-base leading-none text-neutral-700 dark:text-zinc-300 transition hover:bg-neutral-100 dark:hover:bg-zinc-700"
                aria-label={colorMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={colorMode === "dark" ? "Light mode" : "Dark mode"}
              >
                {colorMode === "dark" ? "☀️" : "🌙"}
              </button>
              <span className="hidden rounded-full border-2 border-[#84d8ff] dark:border-sky-600 bg-[#ddf4ff] dark:bg-sky-950/50 px-3 py-1.5 text-sm font-black text-[#1899d6] dark:text-sky-300 sm:inline-flex">Lv {Math.floor(xp / LEVEL_XP) + 1}</span>
              <span className="hidden rounded-full border-2 border-orange-200 bg-orange-100 px-3 py-1.5 text-sm font-black text-orange-800 sm:inline-flex dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-200">🔥 {streak}</span>
              {/* <button
                type="button"
                onClick={() => setAiEnabled((value) => !value)}
                aria-pressed={aiEnabled}
                title={aiEnabled ? "AI puzzle generation: ON" : "AI puzzle generation: OFF"}
                className={`hidden items-center gap-1 rounded-full border-2 px-3 py-1.5 text-sm font-black transition sm:inline-flex ${
                  aiEnabled
                    ? "border-purple-300 bg-purple-100 text-purple-800 dark:border-purple-700 dark:bg-purple-950/50 dark:text-purple-200"
                    : "border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 text-neutral-600 dark:text-zinc-400"
                }`}
              >
                <span>✨</span>
                <span>AI {aiEnabled ? "ON" : "OFF"}</span>
              </button> */}
              <span
                className={`rounded-full border-2 px-3 py-1.5 text-sm font-black ${
                  energy === 0 ? "border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 text-neutral-400 dark:text-zinc-500" : "border-[#84d8ff] dark:border-sky-600 bg-[#ddf4ff] dark:bg-sky-950/50 text-[#1899d6] dark:text-sky-300"
                }`}
              >
                🔋 {energy}/{MAX_ENERGY}
              </span>
              <span className="rounded-full border-2 border-amber-300 bg-amber-100 px-3 py-1.5 text-sm font-black text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200">⚡ {xp}</span>
            </div>
          </div>
          <div className="mt-4 border-t-2 border-neutral-100 pt-4 dark:border-zinc-800">
            <ProgressBar xp={xp} />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-36 pt-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.section key="selector" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-8 sm:space-y-10">
              <section className="overflow-hidden rounded-[2rem] border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 shadow-[0_6px_0_0_#e5e5e5] dark:shadow-[0_6px_0_0_#27272a]">
                <div className="relative grid gap-8 p-6 sm:p-7 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10 lg:p-10">
                  <div className={`absolute inset-0 bg-gradient-to-br ${featuredMeta.gradient} opacity-[0.08]`} />
                  <div className="relative">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1899d6] dark:text-sky-400">Visual Learning</p>
                    <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[1.02] tracking-tight text-neutral-900 dark:text-zinc-50 sm:text-5xl">
                      Play your way through STEM.
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 dark:text-zinc-400 sm:text-base">
                      {METAS.length} interactive puzzles across math, science, technology &amp; engineering.
                    </p>
                    <div className="mt-6 -mx-1 flex gap-2 overflow-x-auto rounded-2xl bg-neutral-200 dark:bg-zinc-700 p-1 sm:flex-wrap sm:overflow-visible">
                      {DOMAIN_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setDomainFilter(option)}
                          className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${
                            domainFilter === option ? "bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50 shadow-sm" : "text-neutral-600 dark:text-zinc-400 hover:bg-neutral-300/70 dark:hover:bg-zinc-600/80"
                          }`}
                        >
                          {option === "All" ? "All" : option === "Math" ? "🧮 Math" : option === "Science" ? "🔬 Science" : option === "Technology" ? "💻 Tech" : "🛠️ Eng"}
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 max-w-2xl">
                      <SearchInput value={search} onChange={setSearch} />
                    </div>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
                      <button
                        type="button"
                        onClick={randomStart}
                        className="rounded-2xl border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-neutral-800 dark:text-zinc-100 shadow-sm transition active:border-b-2 active:translate-y-0.5"
                      >
                        Shuffle Puzzle
                      </button>
                      <button
                        type="button"
                        onClick={() => start(daily)}
                        className="rounded-2xl border-2 border-[#e5a000] border-b-4 border-b-[#e5a000] bg-[#ffc800] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-neutral-900 dark:text-zinc-50 transition active:border-b-2 active:translate-y-0.5 dark:border-amber-700 dark:border-b-amber-800 dark:bg-amber-600"
                      >
                        Daily: {metaFor(daily).title}
                      </button>
                    </div>
                  </div>
                  <div className="relative grid grid-cols-2 gap-4 self-end">
                    <StatCard label="Visible" value={String(visibleMetas.length)} tone="cyan" />
                    <StatCard label="Solved" value={String(solved)} tone="emerald" />
                    <StatCard label="Streak" value={String(streak)} tone="amber" />
                    <StatCard label="XP" value={String(xp)} tone="violet" />
                  </div>
                </div>
              </section>

              <div className="grid gap-7 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-10">
                <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                  <div className="rounded-[2rem] border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 p-5 shadow-[0_4px_0_0_#e5e5e5] dark:shadow-[0_4px_0_0_#27272a]">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-black uppercase tracking-[0.18em] text-neutral-700 dark:text-zinc-300">Filters</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setGradeFilter("All");
                          setSubjectFilter("All");
                          setDifficultyFilter("All");
                          setInteractionFilter("All");
                          setDomainFilter("All");
                          setLockFilter("All");
                          setSearch("");
                        }}
                        className="rounded-full border-2 border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-600 dark:text-zinc-400 transition hover:bg-neutral-200 dark:hover:bg-zinc-700"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="puzzle-filter-grade" className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-zinc-400">
                          Grade
                        </label>
                        <FilterSelect
                          id="puzzle-filter-grade"
                          options={GRADE_OPTIONS}
                          value={gradeFilter}
                          onChange={setGradeFilter}
                          render={(option) => (option === "All" ? "All grades" : option === "K-8" ? "K–8" : `Grade ${option}`)}
                        />
                      </div>
                      <div>
                        <label htmlFor="puzzle-filter-subject" className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-zinc-400">
                          Subject
                        </label>
                        <FilterSelect
                          id="puzzle-filter-subject"
                          options={subjectOptions}
                          value={subjectFilter}
                          onChange={setSubjectFilter}
                          render={(o) => (o === "All" ? "All subjects" : subjectLabel(o))}
                        />
                      </div>
                      <div>
                        <label htmlFor="puzzle-filter-difficulty" className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-zinc-400">
                          Difficulty
                        </label>
                        <FilterSelect
                          id="puzzle-filter-difficulty"
                          options={DIFFICULTY_OPTIONS}
                          value={difficultyFilter}
                          onChange={setDifficultyFilter}
                          render={(option) =>
                            option === "All" ? "Adaptive" : option.charAt(0).toUpperCase() + option.slice(1)
                          }
                        />
                      </div>
                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-zinc-400">Status</p>
                        <FilterPills options={LOCK_OPTIONS} value={lockFilter} onChange={setLockFilter} />
                      </div>
                      <div>
                        <label htmlFor="puzzle-filter-interaction" className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-zinc-400">
                          Interaction
                        </label>
                        <FilterSelect
                          id="puzzle-filter-interaction"
                          options={INTERACTION_OPTIONS}
                          value={interactionFilter}
                          onChange={setInteractionFilter}
                          render={(o) => (o === "All" ? "All interaction types" : o)}
                        />
                      </div>
                    </div>
                  </div>

                  {nextUnlock ? (
                    <div className="rounded-[2rem] border-2 border-amber-300 border-b-4 border-b-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-[0_4px_0_0_#fcd34d] dark:border-amber-700 dark:border-b-amber-800 dark:from-amber-950/40 dark:to-orange-950/30 dark:shadow-[0_4px_0_0_#92400e]">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-800 dark:text-amber-300">Next Unlock</p>
                      <h3 className="mt-1 text-base font-black text-neutral-900 dark:text-zinc-50">{nextUnlock.title}</h3>
                      <p className="mt-1 text-xs text-neutral-600 dark:text-zinc-400">{nextUnlock.unlockMessage ?? `Hit ${xpRequiredFor(nextUnlock)} XP to open this puzzle.`}</p>
                      <div className="mt-3 h-2 rounded-full bg-amber-100 dark:bg-amber-950/50">
                        <div
                          className="h-2 rounded-full bg-[#ffc800]"
                          style={{ width: `${Math.min(100, (xp / Math.max(1, xpRequiredFor(nextUnlock))) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-900 dark:text-amber-200">{xp} / {xpRequiredFor(nextUnlock)} XP</p>
                    </div>
                  ) : null}

                  <div className="rounded-[2rem] border-2 border-[#84d8ff] dark:border-sky-600 border-b-4 border-b-[#1899d6] dark:border-b-sky-500 bg-[#ddf4ff] dark:bg-sky-950/40 p-5 shadow-[0_4px_0_0_#84d8ff] dark:shadow-[0_4px_0_0_#0369a1]">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1899d6] dark:text-sky-300">Progress</p>
                    <p className="mt-1 text-base font-black text-neutral-900 dark:text-zinc-50">{unlockedCount} / {METAS.length} unlocked</p>
                    <div className="mt-3 h-2 rounded-full bg-white/80 dark:bg-zinc-700/80">
                      <div className="h-2 rounded-full bg-[#58cc02]" style={{ width: `${(unlockedCount / METAS.length) * 100}%` }} />
                    </div>
                  </div>
                </aside>

                <section className="min-w-0 space-y-6">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1899d6] dark:text-sky-400">Puzzle Catalog</p>
                      <h2 className="mt-1 text-2xl font-black tracking-tight text-neutral-900 dark:text-zinc-50">Choose your next challenge</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="inline-flex rounded-xl border-2 border-neutral-200 dark:border-zinc-600 bg-neutral-200 dark:bg-zinc-700 p-1">
                        <button
                          type="button"
                          onClick={() => setCatalogView("grid")}
                          className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider transition ${catalogView === "grid" ? "bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50 shadow-sm" : "text-neutral-600 dark:text-zinc-400"}`}
                        >
                          ▦ Grid
                        </button>
                        <button
                          type="button"
                          onClick={() => setCatalogView("tree")}
                          className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider transition ${catalogView === "tree" ? "bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-50 shadow-sm" : "text-neutral-600 dark:text-zinc-400"}`}
                        >
                          🌳 Skill Tree
                        </button>
                      </div>
                      <span className="rounded-full border-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-1 text-xs font-bold text-neutral-600 dark:text-zinc-400">{visibleMetas.length} / {METAS.length}</span>
                    </div>
                  </div>

                  {visibleMetas.length === 0 ? (
                    <div className="rounded-[2rem] border-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-8 text-center text-sm text-neutral-600 dark:text-zinc-400 shadow-[0_4px_0_0_#e5e5e5] dark:shadow-[0_4px_0_0_#27272a]">
                      No puzzles match these filters yet. Try widening the grade, subject, or interaction.
                    </div>
                  ) : catalogView === "grid" ? (
                    <>
                      <div className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
                        {pagedGridMetas.map((meta, i) => (
                          <motion.div
                            key={meta.id}
                            className="flex h-full min-h-0 w-full"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(i * 0.008, 0.25) }}
                          >
                            <CategoryCard
                              meta={meta}
                              onClick={() => start(meta.id)}
                              unlocked={isUnlocked(meta, xp, categoryCompletions)}
                            />
                          </motion.div>
                        ))}
                      </div>
                      {catalogTotalPages > 1 ? (
                        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-4 shadow-[0_4px_0_0_#e5e5e5] dark:shadow-[0_4px_0_0_#27272a] sm:flex-row sm:px-5">
                          <p className="text-center text-xs font-bold text-neutral-600 dark:text-zinc-400 sm:text-left">
                            Showing{" "}
                            <span className="font-black text-neutral-900 dark:text-zinc-100">
                              {(catalogPage - 1) * CATALOG_PAGE_SIZE + 1}–{Math.min(catalogPage * CATALOG_PAGE_SIZE, visibleMetas.length)}
                            </span>{" "}
                            of {visibleMetas.length}
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                              type="button"
                              disabled={catalogPage <= 1}
                              onClick={() => setCatalogPage((p) => Math.max(1, p - 1))}
                              className="rounded-xl border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-zinc-100 shadow-[0_2px_0_0_#e5e5e5] dark:shadow-[0_2px_0_0_#27272a] transition enabled:active:border-b-2 enabled:active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Previous
                            </button>
                            <span className="min-w-[7rem] text-center text-xs font-black text-neutral-700 dark:text-zinc-300">
                              Page {catalogPage} / {catalogTotalPages}
                            </span>
                            <button
                              type="button"
                              disabled={catalogPage >= catalogTotalPages}
                              onClick={() => setCatalogPage((p) => Math.min(catalogTotalPages, p + 1))}
                              className="rounded-xl border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-zinc-100 shadow-[0_2px_0_0_#e5e5e5] dark:shadow-[0_2px_0_0_#27272a] transition enabled:active:border-b-2 enabled:active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <SkillTree
                      metas={visibleMetas}
                      xp={xp}
                      onPick={(id) => start(id)}
                      completions={categoryCompletions}
                    />
                  )}
                </section>
              </div>
            </motion.section>
          ) : aiLoading ? (
            <motion.section key="ai-loading" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="grid place-items-center py-24">
              <div className="flex flex-col items-center gap-4 rounded-[2rem] border-2 border-purple-200 border-b-4 border-b-purple-300 bg-gradient-to-br from-purple-50 to-white px-8 py-12 text-center shadow-[0_6px_0_0_#e9d5ff] dark:border-purple-800 dark:border-b-purple-900 dark:from-purple-950 dark:to-zinc-900 dark:shadow-[0_6px_0_0_#581c87]">
                <motion.span
                  className="text-5xl"
                  animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨
                </motion.span>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-700 dark:text-purple-300">AI Author Working</p>
                <h2 className="max-w-md text-2xl font-black leading-tight text-neutral-900 dark:text-zinc-50">
                  Generating a fresh {activeMeta?.subject ? subjectLabel(activeMeta.subject) : "STEM"} puzzle…
                </h2>
                <p className="max-w-sm text-sm text-neutral-600 dark:text-zinc-400">
                  {activeMeta?.title ? `Hand-crafting "${activeMeta.title}"` : "Hand-crafting a custom challenge"} with hints, choices, and an explanation.
                </p>
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-2 w-2 rounded-full bg-[#58cc02]"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          ) : puzzle ? (
            <motion.section key={puzzle.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-start lg:gap-8">
              <section className="overflow-hidden rounded-[2rem] border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 shadow-[0_6px_0_0_#e5e5e5] dark:shadow-[0_6px_0_0_#27272a]">
                <div className="h-3 bg-[#58cc02]" />
                <div className="space-y-6 p-5 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={`inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 px-3 py-1 text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-zinc-100`}>
                      {puzzle.emoji} {puzzle.difficulty}
                    </span>
                    <span className="rounded-full border-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-1 text-xs font-black uppercase tracking-wider text-neutral-600 dark:text-zinc-400">
                      {activeMeta?.subject} · {metaInteractionDisplay(activeMeta ?? metaFor(puzzle.type))}
                    </span>
                    {aiSource === "ai" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border-2 border-purple-200 bg-purple-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-purple-800 dark:border-purple-700 dark:bg-purple-950/50 dark:text-purple-200">
                        ✨ AI generated
                      </span>
                    ) : aiSource === "mock" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border-2 border-purple-200 bg-purple-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-purple-800 dark:border-purple-700 dark:bg-purple-950/50 dark:text-purple-200">
                        ✨ AI mock
                      </span>
                    ) : aiSource === "fallback" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border-2 border-amber-200 bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200">
                        🛟 procedural fallback
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[#1899d6] dark:text-sky-400">Current Challenge</p>
                    <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight text-neutral-900 dark:text-zinc-50 sm:text-5xl">{puzzle.prompt}</h2>
                  </div>
                  <div
                    className={cn(
                      "rounded-[1.25rem] border-2 border-neutral-200 dark:border-zinc-600 bg-neutral-100 dark:bg-zinc-800/80 p-4 text-neutral-900 dark:text-zinc-100 sm:p-5",
                      puzzle.mode === "coloring" &&
                        "border-violet-200/90 bg-gradient-to-b from-violet-50/90 via-neutral-50 to-neutral-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-violet-800/45 dark:from-violet-950/35 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
                    )}
                  >
                    <VisualCard
                      visual={puzzle.visual}
                      rotation={state.rotation}
                      puzzle={puzzle}
                      playState={state}
                      setPlayState={setState}
                      locked={result === "correct"}
                      result={result}
                    />
                  </div>
                </div>
              </section>

              <aside className="space-y-5 lg:sticky lg:top-28">
                <div className="rounded-[2rem] border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 p-5 shadow-[0_4px_0_0_#e5e5e5] dark:shadow-[0_4px_0_0_#27272a]">
                  <div className="mb-3 flex items-center justify-between gap-3 border-b border-neutral-200 pb-3 dark:border-zinc-700">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1899d6] dark:text-sky-400">Your Move</p>
                      <p className="mt-0.5 text-[11px] font-semibold leading-snug text-neutral-500 dark:text-zinc-400">Use the panel below to answer.</p>
                    </div>
                    <span className="shrink-0 rounded-full border-2 border-[#46a302] bg-[#d7ffb8] px-2.5 py-1 text-[10px] font-mono font-bold text-[#2b6e0f] shadow-[0_2px_0_0_#46a302] dark:border-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-200 dark:shadow-[0_2px_0_0_#059669]">
                      +{puzzle.xpReward ?? XP_PER_WIN} XP
                    </span>
                  </div>
                  <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/90 p-3.5 dark:border-zinc-700 dark:bg-zinc-800/40 sm:p-4">
                    <Interaction puzzle={puzzle} state={state} setState={setState} locked={result === "correct"} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHint((open) => !open);
                    }}
                    className="flex-1 rounded-2xl border-2 border-neutral-200 dark:border-zinc-600 border-b-4 border-b-neutral-300 dark:border-b-zinc-600 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-bold text-neutral-700 dark:text-zinc-300 transition active:border-b-2 active:translate-y-0.5"
                  >
                    {hint ? "Hide hint" : "Need a hint?"}
                  </button>
                  {hint && puzzle.hints && puzzle.hints.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setHintIndex((value) => (value + 1) % (puzzle.hints?.length ?? 1))}
                      className="rounded-2xl border-2 border-[#1899d6] border-b-4 border-b-[#1899d6] bg-[#ddf4ff] dark:bg-sky-950/50 px-4 py-3 text-sm font-bold text-[#1899d6] dark:text-sky-400 transition active:border-b-2 active:translate-y-0.5"
                    >
                      Next hint
                    </button>
                  ) : null}
                </div>

                <AnimatePresence>
                  {hint ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="rounded-2xl border-2 border-[#84d8ff] dark:border-sky-600 bg-[#ddf4ff] dark:bg-sky-950/50 p-4 text-sm text-neutral-800 dark:text-zinc-100"
                    >
                      <p>{currentHint}</p>
                      {puzzle.hints && puzzle.hints.length > 1 ? (
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#1899d6] dark:text-sky-400">Hint {hintIndex + 1} / {puzzle.hints.length}</p>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {result !== "idle" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className={`rounded-3xl border-2 border-b-4 p-4 text-sm leading-relaxed ${
                        result === "correct"
                          ? "border-[#46a302] border-b-[#46a302] bg-[#d7ffb8] dark:bg-emerald-950/35 text-neutral-900 dark:text-zinc-50 shadow-[0_4px_0_0_#46a302]"
                          : "border-[#ff4b4b] border-b-[#d33528] bg-[#ffecec] dark:bg-rose-950/35 text-neutral-900 dark:text-zinc-50 shadow-[0_4px_0_0_#d33528]"
                      }`}
                    >
                      <p className="text-base font-black">{result === "correct" ? "Beautiful solve." : "Almost. Try a different move."}</p>
                      <p className="mt-1.5 text-neutral-700 dark:text-zinc-300">{puzzle.explanation}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

              </aside>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {active && puzzle && !aiLoading ? (
          <motion.div
            key="bottom-action"
            initial={{ y: 96 }}
            animate={{ y: 0 }}
            exit={{ y: 96 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-neutral-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-4px_0_0_#e5e5e5] dark:shadow-[0_-4px_0_0_#27272a]"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-3">
              <div className="hidden min-w-0 flex-1 lg:block">
                <p className="truncate text-xs font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-zinc-400">{puzzle.title}</p>
                <p className="truncate text-sm text-neutral-600 dark:text-zinc-400">{result === "idle" ? "Solve the interaction panel, then check your answer." : puzzle.explanation}</p>
              </div>
              <button
                type="button"
                disabled={!canCheck(puzzle, state)}
                onClick={check}
                className={`w-full rounded-2xl border-2 py-4 text-base font-black uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0 lg:max-w-sm ${
                  result === "correct"
                    ? "border-[#46a302] border-b-4 border-b-[#46a302] bg-[#58cc02] text-white active:border-b-2 active:translate-y-0.5"
                    : result === "wrong"
                    ? "border-[#d33528] border-b-4 border-b-[#d33528] bg-[#ff4b4b] text-white active:border-b-2 active:translate-y-0.5"
                    : "border-[#1899d6] border-b-4 border-b-[#1899d6] bg-[#1cb0f6] text-white active:border-b-2 active:translate-y-0.5"
                }`}
              >
                {result === "correct" ? "Next Puzzle" : result === "wrong" ? "Try Again" : "Check"}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      </div>
    </div>
  );
}

export default StemPuzzlesPage;
