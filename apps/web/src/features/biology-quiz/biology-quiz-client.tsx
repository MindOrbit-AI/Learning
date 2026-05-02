"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DIFFICULTY_META,
  getPlantStage,
  type DifficultyId,
  QUESTIONS,
  topicEmoji,
  type QuizQuestion,
} from "./biology-quiz-data";

type Phase = "intro" | "quiz" | "complete";

const BG_DEPTHS = 12;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = out[i] as T;
    const b = out[j] as T;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

function MicroscopicFloaters() {
  const items = useMemo(() => {
    return Array.from({ length: BG_DEPTHS }, (_, i) => ({
      id: i,
      left: `${(i * 7 + 3) % 92}%`,
      delay: (i * 0.4) % 5,
      duration: 14 + (i % 5) * 2,
      y0: 100 + (i % 4) * 8,
      pair: i % 2 === 0,
    }));
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {items.map((row) => (
        <motion.div
          key={row.id}
          className="absolute select-none text-2xl opacity-[0.12] sm:text-3xl sm:opacity-[0.18]"
          style={{ left: row.left, top: `${8 + (row.id % 6) * 12}%` }}
          initial={{ y: row.y0, x: 0, rotate: 0 }}
          animate={{
            y: [-20, -180, -40],
            x: [0, row.pair ? 30 : -25, 0],
            rotate: [0, row.pair ? 12 : -10, 0],
          }}
          transition={{
            duration: row.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: row.delay,
          }}
        >
          {row.pair ? "🔬🦠" : "🦠🔬"}
        </motion.div>
      ))}
    </div>
  );
}

function LeafCelebration() {
  const leaves = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 13 + (i % 5) * 7) % 100}%`,
        delay: (i % 8) * 0.08,
        duration: 2.4 + (i % 4) * 0.35,
        drift: (i % 2 === 0 ? 1 : -1) * (40 + (i % 6) * 12),
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {leaves.map((L) => (
        <motion.span
          key={L.id}
          className="absolute text-2xl sm:text-3xl"
          style={{ left: L.left, top: "-8%" }}
          initial={{ opacity: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0.6],
            y: ["0vh", "78vh"],
            x: [0, L.drift],
            rotate: [0, L.drift * 0.4],
          }}
          transition={{
            duration: L.duration,
            delay: L.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          🍃
        </motion.span>
      ))}
    </div>
  );
}

export function BiologyQuizClient() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [difficulty, setDifficulty] = useState<DifficultyId | null>(null);
  const [deck, setDeck] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const total = deck.length;
  const current = deck[index];
  const plant = getPlantStage(correctCount, total);

  const startQuiz = useCallback((d: DifficultyId) => {
    setDifficulty(d);
    setDeck(shuffle(QUESTIONS[d]));
    setIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setRevealed(false);
    setPhase("quiz");
  }, []);

  const resetAll = useCallback(() => {
    setPhase("intro");
    setDifficulty(null);
    setDeck([]);
    setIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setRevealed(false);
  }, []);

  const pickChoice = (choiceIndex: number) => {
    if (revealed || !current) return;
    setSelected(choiceIndex);
    setRevealed(true);
    if (choiceIndex === current.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const goNext = () => {
    if (!current) return;
    if (index + 1 >= deck.length) {
      setPhase("complete");
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  };

  const meta = difficulty ? DIFFICULTY_META[difficulty] : null;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-sky-100 via-emerald-50 to-teal-100 text-slate-800 dark:from-sky-950 dark:via-emerald-950 dark:to-teal-950 dark:text-emerald-50">
      <div
        className="absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgb(186 230 253 / 0.5), transparent 45%), radial-gradient(circle at 80% 10%, rgb(167 243 208 / 0.45), transparent 40%), radial-gradient(circle at 50% 90%, rgb(153 246 228 / 0.4), transparent 50%)",
        }}
        aria-hidden
      />
      <MicroscopicFloaters />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-lg flex-col px-4 pb-10 pt-8 sm:max-w-xl sm:px-6 sm:pt-12">
        <header className="mb-6 text-center">
          <p className="mb-1 text-sm font-semibold tracking-wide text-teal-700 dark:text-teal-300">
            🧬 Middle school biology
          </p>
          <h1 className="text-balance text-2xl font-extrabold tracking-tight text-emerald-900 dark:text-emerald-100 sm:text-3xl">
            Nature Lab Quiz
          </h1>
          <p className="mt-2 text-pretty text-sm text-teal-800/90 dark:text-teal-200/90">
            🌱 Cells · photosynthesis · animal groups — learn with emojis and grow your plant!
          </p>
        </header>

        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-1 flex-col gap-4"
            >
              <div className="rounded-2xl border border-emerald-200/80 bg-white/70 p-5 shadow-lg shadow-emerald-900/5 backdrop-blur-md dark:border-emerald-800/60 dark:bg-slate-900/60">
                <p className="text-center text-sm leading-relaxed text-slate-700 dark:text-emerald-100/90">
                  Pick a trail. Each level mixes{" "}
                  <span className="whitespace-nowrap">
                    🦠 cell structure
                  </span>
                  ,{" "}
                  <span className="whitespace-nowrap">🌱 photosynthesis</span>
                  , and{" "}
                  <span className="whitespace-nowrap">🧫 classification</span>
                  . Your plant grows with every correct answer!
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {(Object.keys(DIFFICULTY_META) as DifficultyId[]).map((d) => {
                    const m = DIFFICULTY_META[d];
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => startQuiz(d)}
                        className="group flex w-full flex-col rounded-xl border-2 border-emerald-200/90 bg-gradient-to-r from-emerald-50 to-sky-50 px-4 py-3 text-left transition hover:border-teal-400 hover:shadow-md dark:border-emerald-800 dark:from-emerald-950/80 dark:to-sky-950/50 dark:hover:border-teal-500"
                      >
                        <span className="font-bold text-emerald-900 dark:text-emerald-100">
                          {m.label}{" "}
                          <span className="font-normal text-slate-600 dark:text-emerald-200/80">
                            · {m.ages}
                          </span>
                        </span>
                        <span className="text-sm text-teal-800 dark:text-teal-200/90">
                          {m.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-center text-xs text-teal-700/80 dark:text-teal-300/80">
                🧫 Tip: read each question twice — science words are precise!
              </p>
            </motion.div>
          )}

          {phase === "quiz" && current && meta && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex flex-1 flex-col"
            >
              <div className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-sky-200/80 bg-white/75 px-3 py-2.5 shadow-sm backdrop-blur dark:border-sky-800/60 dark:bg-slate-900/55">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xs font-medium text-teal-700 dark:text-teal-300">
                    {meta.label} · Question {index + 1} of {total}
                  </span>
                  <span className="text-lg font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
                    Progress: {plant}{" "}
                    <span className="text-sm font-normal text-slate-600 dark:text-emerald-200/80">
                      ({correctCount} correct)
                    </span>
                  </span>
                </div>
                <div
                  className="shrink-0 text-4xl transition-transform duration-500"
                  style={{ transform: `scale(${0.95 + (correctCount / Math.max(total, 1)) * 0.15})` }}
                  aria-hidden
                >
                  {plant}
                </div>
              </div>

              <motion.div
                layout
                className="flex flex-1 flex-col rounded-2xl border border-emerald-200/80 bg-white/80 p-5 shadow-xl shadow-teal-900/10 backdrop-blur-md dark:border-emerald-800/50 dark:bg-slate-900/65"
              >
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-teal-800 dark:text-teal-200">
                  <span className="text-2xl" aria-hidden>
                    {topicEmoji(current.topic)}
                  </span>
                  <span className="uppercase tracking-wider">
                    {current.topic === "cells" && "Cell structure"}
                    {current.topic === "photosynthesis" && "Photosynthesis"}
                    {current.topic === "classification" && "Classification"}
                  </span>
                  <span className="ml-auto text-lg opacity-80" aria-hidden>
                    🧬
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={current.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="mb-5 text-pretty text-base font-medium leading-snug text-slate-800 dark:text-emerald-50 sm:text-lg"
                  >
                    {current.prompt}
                  </motion.p>
                </AnimatePresence>

                <ul className="flex flex-col gap-2.5">
                  {current.choices.map((label, i) => {
                    const isSel = selected === i;
                    const isCorrect = i === current.correctIndex;
                    let ring =
                      "border-emerald-200/90 dark:border-emerald-700/80 hover:border-teal-400 dark:hover:border-teal-500";
                    if (revealed) {
                      if (isCorrect)
                        ring =
                          "border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/80";
                      else if (isSel)
                        ring =
                          "border-rose-400 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/50";
                    } else if (isSel) {
                      ring =
                        "border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/40";
                    }
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          disabled={revealed}
                          onClick={() => pickChoice(i)}
                          className={`flex w-full items-start gap-3 rounded-xl border-2 px-3 py-3 text-left text-sm transition sm:text-base ${ring}`}
                        >
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="pt-0.5 leading-snug">{label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex flex-col gap-3"
                  >
                    <p className="text-center text-sm font-medium text-slate-700 dark:text-emerald-100/90">
                      {selected === current.correctIndex ? (
                        <span>
                          🌱 Nice! That&apos;s exactly right — your knowledge is
                          growing.
                        </span>
                      ) : (
                        <span>
                          🧫 The best answer was{" "}
                          <strong>
                            {String.fromCharCode(65 + current.correctIndex)}
                          </strong>
                          . Keep going — every miss is data for your brain!
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={goNext}
                      className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-teal-900/25 transition hover:from-teal-500 hover:to-emerald-500"
                    >
                      {index + 1 >= deck.length ? "See results 🌳" : "Next question 🌿"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {phase === "complete" && meta && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex flex-1 flex-col items-center justify-center"
            >
              <LeafCelebration />
              <div className="relative z-10 w-full max-w-md rounded-3xl border-2 border-emerald-300/90 bg-white/85 p-8 text-center shadow-2xl shadow-emerald-900/15 backdrop-blur-md dark:border-emerald-600/50 dark:bg-slate-900/75">
                <motion.div
                  initial={{ scale: 0.8, rotate: -4 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto mb-4 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-sky-500 text-white shadow-inner ring-4 ring-emerald-200/80 dark:ring-emerald-700/60"
                >
                  <span className="text-3xl leading-none" aria-hidden>
                    🔬🧪🧬
                  </span>
                  <span className="mt-1 px-1 text-[10px] font-extrabold uppercase tracking-widest">
                    Junior Biologist
                  </span>
                </motion.div>
                <h2 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100">
                  You finished the {meta.label} trail!
                </h2>
                <p className="mt-2 text-pretty text-sm text-slate-700 dark:text-emerald-100/85">
                  Score:{" "}
                  <strong className="text-emerald-800 dark:text-emerald-300">
                    {correctCount}
                  </strong>{" "}
                  out of{" "}
                  <strong className="text-emerald-800 dark:text-emerald-300">
                    {total}
                  </strong>{" "}
                  — your plant reached{" "}
                  <span className="text-2xl" aria-hidden>
                    {getPlantStage(correctCount, total)}
                  </span>
                </p>
                <p className="mt-3 text-xs text-teal-800 dark:text-teal-200/90">
                  🍃 Floating leaves for your curiosity — share your badge with
                  a friend who loves science!
                </p>
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-6 w-full rounded-xl border-2 border-emerald-300 bg-emerald-50 py-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-100 dark:hover:bg-emerald-900"
                >
                  Try another level 🌱
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
