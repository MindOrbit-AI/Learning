"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mindorbit/ui";
import { cn } from "@mindorbit/ui";
import { GitBranch, Sparkles, Target } from "lucide-react";
import type { InteractiveModeBaseProps } from "@/features/interactive-games/runner-types";
import { getGameConfig } from "@/features/interactive-games/runner-types";
import { FeedbackToast } from "@/components/games/shared/FeedbackToast";

type SimChoice = {
  text: string;
  nextStateId: string;
  effect: string;
  scoreDelta: number;
  concept?: string;
};

type SimState = {
  id: string;
  narrative: string;
  choices: SimChoice[];
};

function asObj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function parseChoices(raw: unknown): SimChoice[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => {
      const o = asObj(x);
      return {
        text: String(o.text ?? o.label ?? "").trim() || "Choose",
        nextStateId: String(o.nextStateId ?? o.to ?? "").trim(),
        effect: String(o.effect ?? o.outcome ?? "").trim() || "Outcome unfolds.",
        scoreDelta: Number(o.scoreDelta ?? o.points ?? 0) || 0,
        concept: o.concept != null ? String(o.concept) : undefined,
      };
    })
    .filter((c) => c.text && c.nextStateId);
}

function parseStates(raw: unknown): SimState[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x, i) => {
      const o = asObj(x);
      return {
        id: String(o.id ?? `s${i}`).trim() || `s${i}`,
        narrative: String(o.narrative ?? o.text ?? o.description ?? "What happens next?").trim(),
        choices: parseChoices(o.choices),
      };
    })
    .filter((s) => s.id);
}

function clientInitialStateId(gc: Record<string, unknown>, states: SimState[]): string {
  const explicit = String(gc.initialStateId ?? "").trim();
  if (explicit && states.some((s) => s.id === explicit)) return explicit;
  const playable = states.find((s) => s.choices.length > 0);
  return playable?.id ?? states[0]?.id ?? "";
}

function stateById(states: SimState[], id: string): SimState | undefined {
  return states.find((s) => s.id === id);
}

/** Some generators link choices to ids like "conclusion" without a matching `states` row. */
function isReferencedAsNextState(states: SimState[], id: string): boolean {
  if (!id) return false;
  for (const s of states) {
    for (const c of s.choices) {
      if (c.nextStateId === id) return true;
    }
  }
  return false;
}

function resolveImplicitSinkNarrative(gc: Record<string, unknown>, stateId: string): string {
  const endings = Array.isArray(gc.endings) ? gc.endings : [];
  for (const raw of endings) {
    const o = asObj(raw);
    const sid = String(o.stateId ?? o.id ?? o.forState ?? "").trim();
    if (sid !== stateId) continue;
    const text = String(o.summary ?? o.narrative ?? o.text ?? o.description ?? o.title ?? "").trim();
    if (text) return text;
  }
  return "This branch is complete — review what you learned from each outcome above.";
}

function resolveEffectiveState(
  gc: Record<string, unknown>,
  states: SimState[],
  activeId: string
): SimState | "missing" {
  const found = stateById(states, activeId);
  if (found) return found;
  if (isReferencedAsNextState(states, activeId)) {
    return {
      id: activeId,
      narrative: resolveImplicitSinkNarrative(gc, activeId),
      choices: [],
    };
  }
  return "missing";
}

export function DecisionSimulator({
  envelope,
  runtime,
  setRuntime,
  setScoreXp,
  postEvent,
  onCompleteSession,
}: InteractiveModeBaseProps) {
  const gc = getGameConfig(envelope);
  const topic = String(envelope.topic ?? "this situation");
  const initialScenario = String(
    gc.initialScenario ?? `You navigate trade-offs while learning about ${topic}.`
  );

  const states = useMemo(() => parseStates(gc.states), [gc.states]);

  const activeId = runtime.decisionStateId ?? clientInitialStateId(gc, states);
  const current = useMemo(() => resolveEffectiveState(gc, states, activeId), [gc, states, activeId]);
  const terminal = current !== "missing" && current.choices.length === 0;

  const [toast, setToast] = useState<{ text: string; variant: "success" | "error" | "info" } | null>(null);
  const [busy, setBusy] = useState(false);
  const t0 = useRef(Date.now());

  const onChoose = useCallback(
    async (choice: SimChoice) => {
      if (current === "missing" || busy) return;
      setBusy(true);
      const ms = Date.now() - t0.current;
      t0.current = Date.now();
      try {
        const r = await postEvent({
          eventType: "decision_choice",
          payload: {
            fromStateId: current.id,
            toStateId: choice.nextStateId,
            scoreDelta: choice.scoreDelta,
            concept: choice.concept ?? topic,
            difficulty: "medium",
          },
          isCorrect: null,
          responseTimeMs: ms,
        });
        setRuntime(r.state);
        setScoreXp(r.score, r.xp);
        const next = resolveEffectiveState(gc, states, choice.nextStateId);
        const endsHere = next !== "missing" && next.choices.length === 0;
        setToast({
          text: endsHere
            ? `${choice.effect} — path complete.`
            : `${choice.effect} (${choice.scoreDelta >= 0 ? "+" : ""}${choice.scoreDelta} score)`,
          variant: choice.scoreDelta > 0 ? "success" : choice.scoreDelta < 0 ? "error" : "info",
        });
      } catch (e) {
        setToast({
          text: e instanceof Error ? e.message : "Could not record that choice.",
          variant: "error",
        });
      } finally {
        setBusy(false);
      }
    },
    [busy, current, gc, postEvent, setRuntime, setScoreXp, states, topic]
  );

  if (states.length === 0) {
    return (
      <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-6 text-center text-sm text-blue-100">
        This scenario is missing a <code className="font-mono">states</code> tree in{" "}
        <code className="font-mono">gameConfig</code>. Regenerate the game or pick another topic.
      </div>
    );
  }

  if (current === "missing") {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 text-center text-sm text-rose-100">
        Unknown situation id <code className="font-mono">{activeId}</code>. The saved branch state may not match
        this game version.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <Target className="h-4 w-4 text-blue-400" />
        <span>
          Each branch has <strong className="text-zinc-200">consequences</strong> for score and streak — there is not
          always one &quot;textbook&quot; answer; learn from the outcome text.
        </span>
      </div>

      <FeedbackToast message={toast?.text ?? null} variant={toast?.variant ?? "info"} />

      <motion.div
        layout
        className="rounded-2xl border border-blue-500/25 bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950/35 p-5 shadow-xl"
      >
        <div className="mb-3 flex items-center gap-2 text-blue-200/90">
          <GitBranch className="h-4 w-4" />
          <p className="text-xs font-bold uppercase tracking-wider">Setup</p>
        </div>
        <p className="text-sm leading-relaxed text-zinc-200">{initialScenario}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="rounded-2xl border border-zinc-700 bg-zinc-950/85 p-5"
        >
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-500">Situation</p>
          <p className="text-base leading-relaxed text-zinc-100">{current.narrative}</p>

          {!terminal ? (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-zinc-300">Your move</p>
              <div className="grid gap-3 sm:grid-cols-1">
                {current.choices.map((c, i) => (
                  <motion.button
                    key={`${c.nextStateId}-${i}`}
                    type="button"
                    disabled={busy}
                    whileHover={{ scale: busy ? 1 : 1.01 }}
                    whileTap={{ scale: busy ? 1 : 0.99 }}
                    onClick={() => void onChoose(c)}
                    className={cn(
                      "rounded-2xl border-2 border-zinc-600 bg-zinc-900/80 px-4 py-4 text-left text-sm transition-all",
                      "hover:border-blue-500/45 hover:bg-blue-950/25",
                      busy && "pointer-events-none opacity-60"
                    )}
                  >
                    <p className="font-semibold text-zinc-50">{c.text}</p>
                    <p className="mt-2 text-xs text-zinc-500">Tap to commit — consequences update your run.</p>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4 border-t border-zinc-800 pt-6">
              <p className="text-sm text-zinc-400">No further branches — this path has concluded.</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-zinc-500">
                  Score {runtime.score} · XP {runtime.xp} · Streak {runtime.streak}
                </p>
                <Button
                  type="button"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 font-bold hover:from-blue-500 hover:to-violet-500"
                  onClick={() => void onCompleteSession()}
                >
                  <Sparkles className="mr-2 inline h-4 w-4" />
                  Complete &amp; view results
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
