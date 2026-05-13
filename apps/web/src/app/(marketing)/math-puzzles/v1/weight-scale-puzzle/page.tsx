"use client";

import type { WeightScalePuzzleSpec } from "@mindorbit/ai";
import { useCallback, useEffect, useState, type ReactNode } from "react";

type CheckState = "idle" | "correct" | "wrong";
type LoadState = "loading" | "ready" | "error";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function YellowCircle({ className }: { className?: string }) {
  return (
    <div
      className={`size-8 shrink-0 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-md ring-1 ring-amber-200/30 transition-transform duration-200 ${className ?? ""}`}
      aria-hidden
    />
  );
}

function PinkSquare({ className }: { className?: string }) {
  return (
    <div
      className={`size-8 shrink-0 rounded-md bg-gradient-to-br from-pink-400 to-rose-500 shadow-md ring-1 ring-pink-200/30 transition-transform duration-200 ${className ?? ""}`}
      aria-hidden
    />
  );
}

function WeightBlock({ label }: { label: string }) {
  return (
    <div
      className="flex h-9 min-w-[2.25rem] shrink-0 items-center justify-center rounded-md bg-gradient-to-b from-zinc-500 to-zinc-700 px-2 text-sm font-bold tabular-nums text-zinc-100 shadow-inner ring-1 ring-zinc-900/40"
      aria-hidden
    >
      {label}
    </div>
  );
}

function DigitalReadout({ value, ghost }: { value: string; ghost?: boolean }) {
  return (
    <div
      className={`rounded-lg bg-zinc-950 px-3 py-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.65)] ring-1 ring-emerald-500/20 ${ghost ? "animate-pulse opacity-60" : ""}`}
    >
      <div
        className="text-center font-mono text-xl font-semibold tracking-[0.2em] text-emerald-400 tabular-nums drop-shadow-[0_0_8px_rgba(52,211,153,0.45)] sm:text-2xl"
        aria-live="polite"
      >
        {value}
      </div>
      <div className="mt-0.5 text-center text-[10px] font-medium uppercase tracking-widest text-emerald-600/80">
        Total
      </div>
    </div>
  );
}

function DigitalScale({
  displayValue,
  children,
  label,
  ghost,
}: {
  displayValue: string;
  children: ReactNode;
  label: string;
  ghost?: boolean;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 transition-all duration-300" aria-label={label}>
      <DigitalReadout value={displayValue} ghost={ghost} />
      <div
        className={`relative rounded-2xl bg-gradient-to-b from-zinc-700 to-zinc-900 p-3 shadow-[0_12px_28px_rgba(0,0,0,0.45)] ring-1 ring-white/10 ${ghost ? "animate-pulse opacity-70" : ""}`}
      >
        <div className="absolute inset-x-4 top-2 h-1 rounded-full bg-zinc-950/60" />
        <div className="relative mt-3 flex min-h-[4.5rem] flex-wrap items-center justify-center gap-2 rounded-xl bg-zinc-800/90 px-2 py-3 shadow-inner ring-1 ring-black/30">
          {children}
        </div>
        <div className="mx-auto mt-2 h-2 w-16 rounded-full bg-zinc-950/80 shadow-inner" />
      </div>
    </div>
  );
}

export default function WeightScalePuzzlePage() {
  const [puzzle, setPuzzle] = useState<WeightScalePuzzleSpec | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [genToken, setGenToken] = useState(0);

  const [selected, setSelected] = useState<number | null>(null);
  const [checkState, setCheckState] = useState<CheckState>("idle");

  const fetchPuzzle = useCallback(async () => {
    setLoadState("loading");
    setLoadError(null);
    setSelected(null);
    setCheckState("idle");
    try {
      const res = await fetch(`/api/weight-scale-puzzle/generate?t=${Date.now()}`, { method: "GET" });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(err?.error ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as WeightScalePuzzleSpec;
      setPuzzle(data);
      setLoadState("ready");
    } catch (e) {
      setLoadState("error");
      setLoadError(e instanceof Error ? e.message : "Something went wrong");
    }
  }, []);

  useEffect(() => {
    void fetchPuzzle();
  }, [fetchPuzzle, genToken]);

  const handleCheck = useCallback(() => {
    if (!puzzle) return;
    if (checkState === "wrong") {
      setCheckState("idle");
      return;
    }
    if (selected === null) return;
    setCheckState(selected === puzzle.correctAnswer ? "correct" : "wrong");
  }, [checkState, puzzle, selected]);

  const correctAnswer = puzzle?.correctAnswer ?? 0;
  const choices = puzzle?.choices ?? [];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-white/5 bg-zinc-950/90 px-3 py-3 backdrop-blur-md sm:gap-3 sm:px-4">
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 active:scale-95"
          aria-label="Close"
        >
          <CloseIcon className="size-5" />
        </button>
        <div
          className="flex min-w-0 flex-1 items-center justify-center gap-1.5"
          role="progressbar"
          aria-valuenow={2}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-label="Lesson progress"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${i === 2 ? "w-6 bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]" : i < 2 ? "bg-emerald-500/90" : "bg-zinc-700"}`}
            />
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={loadState === "loading"}
            onClick={() => setGenToken((t) => t + 1)}
            className="flex size-10 items-center justify-center rounded-full text-violet-300 transition-colors hover:bg-violet-500/15 hover:text-violet-100 disabled:cursor-wait disabled:opacity-40"
            aria-label="Generate new puzzle"
            title="New AI puzzle"
          >
            <RefreshIcon className={`size-5 ${loadState === "loading" ? "animate-spin" : ""}`} />
          </button>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1.5 ring-1 ring-amber-400/25">
            <LightningIcon className="size-5 text-amber-400" />
            <span className="text-sm font-semibold tabular-nums text-amber-200">5</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-28 pt-5 sm:px-6 sm:pt-6">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-200 ring-1 ring-violet-400/25">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-violet-400" />
            </span>
            AI-generated
          </span>
          {loadState === "ready" && puzzle ? (
            <h1 className="text-center text-2xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-3xl">
              {puzzle.question}
            </h1>
          ) : (
            <h1 className="text-center text-2xl font-semibold leading-tight tracking-tight text-zinc-500 sm:text-3xl">
              Loading puzzle…
            </h1>
          )}
        </div>

        {loadState === "error" && (
          <div className="mt-8 rounded-2xl border border-red-500/35 bg-red-500/10 px-4 py-4 text-center text-sm text-red-100">
            <p className="font-medium">{loadError ?? "Could not load puzzle."}</p>
            <button
              type="button"
              onClick={() => setGenToken((t) => t + 1)}
              className="mt-3 rounded-xl bg-red-500/25 px-4 py-2 text-sm font-semibold text-white ring-1 ring-red-400/40 transition hover:bg-red-500/35"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-zinc-500">Known</p>
            {loadState === "ready" && puzzle ? (
              <DigitalScale
                displayValue={String(puzzle.referenceTotal)}
                label="Reference scale with circles and labeled weight"
              >
                {Array.from({ length: puzzle.referenceCircles }, (_, i) => (
                  <YellowCircle key={`rc-${i}`} />
                ))}
                <span className="mx-0.5 text-zinc-500" aria-hidden>
                  +
                </span>
                <WeightBlock label={String(puzzle.referenceBlockWeight)} />
              </DigitalScale>
            ) : (
              <DigitalScale displayValue="–" label="Loading" ghost>
                <YellowCircle />
                <YellowCircle />
                <span className="mx-0.5 text-zinc-500">+</span>
                <div className="h-9 w-10 rounded-md bg-zinc-600/50" />
              </DigitalScale>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-sky-400/90">Solve</p>
            {loadState === "ready" && puzzle ? (
              <DigitalScale
                displayValue={String(puzzle.targetTotal)}
                label="Target scale with circles and squares"
              >
                {Array.from({ length: puzzle.targetCircles }, (_, i) => (
                  <YellowCircle key={`tc-${i}`} />
                ))}
                <span className="mx-0.5 text-zinc-500" aria-hidden>
                  +
                </span>
                {Array.from({ length: puzzle.targetSquares }, (_, i) => (
                  <PinkSquare key={`ts-${i}`} />
                ))}
              </DigitalScale>
            ) : (
              <DigitalScale displayValue="–" label="Loading" ghost>
                <YellowCircle />
                <YellowCircle />
                <YellowCircle />
                <span className="mx-0.5 text-zinc-500">+</span>
                <PinkSquare />
                <PinkSquare />
              </DigitalScale>
            )}
          </div>
        </div>

        <div className="mt-10">
          <p className="mb-3 text-center text-sm font-medium text-zinc-400">Pick an answer</p>
          <div className="grid grid-cols-4 gap-2 sm:gap-3" role="group" aria-label="Answer choices">
            {(loadState === "ready" && puzzle ? choices : [1, 2, 3, 4]).map((n) => {
              const isSelected = selected === n;
              let outcomeClass = "";
              if (loadState === "ready" && puzzle && checkState !== "idle") {
                if (n === correctAnswer) {
                  outcomeClass = "ring-2 ring-emerald-400 bg-emerald-500/15 text-emerald-100";
                } else if (isSelected && n !== correctAnswer) {
                  outcomeClass = "ring-2 ring-red-400 bg-red-500/15 text-red-100";
                }
              } else if (isSelected) {
                outcomeClass =
                  "ring-2 ring-sky-400 bg-sky-500/20 text-white shadow-[0_0_20px_rgba(56,189,248,0.25)]";
              }
              return (
                <button
                  key={n}
                  type="button"
                  disabled={loadState !== "ready" || !puzzle || checkState === "correct"}
                  onClick={() => setSelected(n)}
                  className={`rounded-2xl border border-white/10 bg-zinc-800/80 py-4 text-xl font-semibold tabular-nums text-zinc-100 shadow-md transition-all duration-200 hover:border-white/20 hover:bg-zinc-700/80 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${outcomeClass}`}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {loadState === "ready" && puzzle && checkState !== "idle" && (
          <div
            className={`mt-6 rounded-2xl border px-4 py-4 text-sm leading-relaxed transition-all duration-300 sm:text-base ${
              checkState === "correct"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                : "border-red-500/40 bg-red-500/10 text-red-100"
            }`}
            role="status"
          >
            <p className="font-semibold">{checkState === "correct" ? "Nice work!" : "Not quite."}</p>
            <p className="mt-2 text-zinc-200/95">{puzzle.explanation}</p>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-zinc-950/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="mx-auto w-full max-w-lg">
          <button
            type="button"
            disabled={
              loadState !== "ready" ||
              !puzzle ||
              checkState === "correct" ||
              (checkState === "idle" && selected === null)
            }
            onClick={handleCheck}
            className={`w-full rounded-2xl py-4 text-lg font-semibold tracking-wide shadow-lg transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed ${
              checkState === "correct"
                ? "bg-emerald-500 text-white shadow-emerald-500/25"
                : checkState === "wrong"
                  ? "bg-red-500 text-white shadow-red-500/25 hover:bg-red-400"
                  : "bg-sky-500 text-white shadow-sky-500/30 hover:bg-sky-400 disabled:opacity-40"
            }`}
          >
            {checkState === "idle"
              ? "Check"
              : checkState === "correct"
                ? "Correct"
                : "Try again"}
          </button>
        </div>
      </div>
    </div>
  );
}
