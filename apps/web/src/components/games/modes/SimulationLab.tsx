"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mindorbit/ui";
import { cn } from "@mindorbit/ui";
import { Beaker, CheckCircle2, FlaskConical, Sparkles } from "lucide-react";
import type { InteractiveModeBaseProps } from "@/features/interactive-games/runner-types";
import { getGameConfig } from "@/features/interactive-games/runner-types";
import { FeedbackToast } from "@/components/games/shared/FeedbackToast";

type SimVariable = { id: string; label: string; min: number; max: number; default: number };
type SimRule = { condition: string; result: string };

function parseVariables(raw: unknown): SimVariable[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x, i) => {
      const o = x as Record<string, unknown>;
      const id = String(o.id ?? `v${i + 1}`).trim();
      const min = Number(o.min ?? 0);
      const max = Number(o.max ?? 100);
      const def = Number(o.default ?? o.initial ?? (min + max) / 2);
      return {
        id,
        label: String(o.label ?? id),
        min: Number.isFinite(min) ? min : 0,
        max: Number.isFinite(max) ? max : 100,
        default: Number.isFinite(def) ? def : 50,
      };
    })
    .filter((v) => v.id)
    .map((v) => ({
      ...v,
      min: Math.min(v.min, v.max),
      max: Math.max(v.min, v.max),
      default: Math.min(v.max, Math.max(v.min, v.default)),
    }));
}

function parseRules(raw: unknown): SimRule[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => {
      const o = x as Record<string, unknown>;
      return {
        condition: String(o.condition ?? "").trim(),
        result: String(o.result ?? o.outcome ?? "—").trim() || "—",
      };
    })
    .filter((r) => r.condition);
}

function parseIdeal(raw: unknown): Record<string, number> {
  const o = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(o)) {
    const n = Number(v);
    if (Number.isFinite(n)) out[k] = n;
  }
  return out;
}

/** Safe boolean expression: OR groups of AND-chains of `id op number` atoms. */
function evaluateCondition(condition: string, values: Record<string, number>): boolean {
  const c = condition.trim();
  if (!c) return false;
  const orParts = c.split(/\s+or\s+/i);
  return orParts.some((orPart) => {
    const andParts = orPart.split(/\s+and\s+/i);
    return andParts.every((atom) => {
      const m = atom
        .trim()
        .match(/^(\w+)\s*(<=|>=|==|!=|<|>)\s*(-?\d*\.?\d+(?:e[-+]?\d+)?)$/i);
      if (!m) return false;
      const id = m[1]!;
      const op = m[2]!;
      const rhs = Number(m[3]);
      if (!Number.isFinite(rhs)) return false;
      const lhs = values[id];
      if (typeof lhs !== "number" || !Number.isFinite(lhs)) return false;
      switch (op) {
        case "<":
          return lhs < rhs;
        case ">":
          return lhs > rhs;
        case "<=":
          return lhs <= rhs;
        case ">=":
          return lhs >= rhs;
        case "==":
          return Math.abs(lhs - rhs) < 1e-6;
        case "!=":
          return Math.abs(lhs - rhs) >= 1e-6;
        default:
          return false;
      }
    });
  });
}

function toleranceFor(v: SimVariable): number {
  const span = v.max - v.min;
  return Math.max(3, span * 0.12);
}

function withinIdeal(values: Record<string, number>, variables: SimVariable[], ideal: Record<string, number>): boolean {
  for (const spec of variables) {
    const target = ideal[spec.id];
    if (typeof target !== "number" || !Number.isFinite(target)) return false;
    const cur = values[spec.id];
    if (typeof cur !== "number" || !Number.isFinite(cur)) return false;
    if (Math.abs(cur - target) > toleranceFor(spec)) return false;
  }
  return true;
}

function ruleReadoutIsPositive(result: string): boolean {
  const r = result.toLowerCase();
  if (/(underpowered|under-powered|failure|fail|crash|collapse|toxic|danger|blocked|stall)/i.test(result)) return false;
  if (new RegExp("(strong|stable|optimal|success|high|peak|balanced|healthy|efficient|target)", "i").test(r)) return true;
  return false;
}

function scoreByRules(values: Record<string, number>, rules: SimRule[]): boolean {
  const matched = rules.filter((rule) => evaluateCondition(rule.condition, values));
  if (matched.length === 0) return false;
  return matched.some((m) => ruleReadoutIsPositive(m.result));
}

function initialValues(variables: SimVariable[]): Record<string, number> {
  const o: Record<string, number> = {};
  for (const v of variables) o[v.id] = v.default;
  return o;
}

export function SimulationLab({
  envelope,
  runtime,
  setRuntime,
  setScoreXp,
  postEvent,
  onCompleteSession,
}: InteractiveModeBaseProps) {
  const gc = getGameConfig(envelope);
  const topic = String(envelope.topic ?? "this model");

  const variables = useMemo(() => parseVariables(gc.variables), [gc.variables]);
  const rules = useMemo(() => parseRules(gc.rules), [gc.rules]);
  const idealSettings = useMemo(() => parseIdeal(gc.idealSettings), [gc.idealSettings]);
  const goal = String(gc.goal ?? `Tune the levers until the lab readout matches a strong outcome for ${topic}.`);

  const [values, setValues] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{ text: string; variant: "success" | "error" | "info" } | null>(null);
  const [solved, setSolved] = useState(false);
  const t0 = useRef(Date.now());

  useEffect(() => {
    if (variables.length === 0) return;
    setValues((prev) => {
      if (Object.keys(prev).length === 0) return initialValues(variables);
      const next = { ...prev };
      for (const v of variables) {
        if (typeof next[v.id] !== "number" || !Number.isFinite(next[v.id])) next[v.id] = v.default;
        next[v.id] = Math.min(v.max, Math.max(v.min, next[v.id]!));
      }
      return next;
    });
  }, [variables]);

  const effectiveValues = useMemo(() => {
    if (variables.length === 0) return {};
    const next = { ...values };
    for (const v of variables) {
      if (typeof next[v.id] !== "number" || !Number.isFinite(next[v.id])) {
        next[v.id] = v.default;
      }
      next[v.id] = Math.min(v.max, Math.max(v.min, next[v.id]!));
    }
    return next;
  }, [variables, values]);

  const matchedRules = useMemo(
    () => rules.filter((r) => evaluateCondition(r.condition, effectiveValues)),
    [rules, effectiveValues]
  );

  const canScoreIdeal = useMemo(() => {
    if (variables.length === 0) return false;
    return variables.every((v) => v.id in idealSettings);
  }, [variables, idealSettings]);

  const avgToleranceHint = useMemo(() => {
    if (variables.length === 0) return 12;
    return Math.round(variables.reduce((a, v) => a + toleranceFor(v), 0) / variables.length);
  }, [variables]);

  const onSubmit = useCallback(async () => {
    if (solved) return;
    const ms = Date.now() - t0.current;
    let ok = false;
    if (canScoreIdeal) ok = withinIdeal(effectiveValues, variables, idealSettings);
    else if (rules.length > 0) ok = scoreByRules(effectiveValues, rules);
    else ok = false;

    const r = await postEvent({
      eventType: "simulation_lab_submit",
      payload: {
        concept: topic,
        difficulty: "medium",
        questionIndex: 0,
        values: effectiveValues,
        matchedRuleResults: matchedRules.map((m) => m.result),
      },
      isCorrect: ok,
      responseTimeMs: ms,
    });
    setRuntime(r.state);
    setScoreXp(r.score, r.xp);
    if (ok) {
      setSolved(true);
      setToast({ text: "Readout locked in — you found a stable operating zone.", variant: "success" });
    } else {
      setToast({
        text: canScoreIdeal
          ? "Not quite — compare your sliders to the goal and watch how the readout shifts."
          : "No favorable readout yet — explore the space until a positive state appears.",
        variant: "error",
      });
    }
  }, [
    solved,
    canScoreIdeal,
    effectiveValues,
    variables,
    idealSettings,
    rules,
    matchedRules,
    topic,
    postEvent,
    setRuntime,
    setScoreXp,
  ]);

  if (variables.length === 0) {
    return (
      <div className="rounded-2xl border border-lime-500/30 bg-lime-950/15 p-6 text-center text-sm text-lime-100">
        This lab is missing <code className="font-mono">variables</code> in <code className="font-mono">gameConfig</code>.
        Regenerate the game or pick another topic.
      </div>
    );
  }

  if (!canScoreIdeal && rules.length === 0) {
    return (
      <div className="rounded-2xl border border-lime-500/30 bg-lime-950/15 p-6 text-center text-sm text-lime-100">
        Add <code className="font-mono">idealSettings</code> (for all variables) or <code className="font-mono">rules</code>{" "}
        so this lab can be scored.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <FlaskConical className="h-4 w-4 text-lime-400" />
        <span>
          <strong className="text-zinc-200">Adjust</strong> the variables, watch the <strong className="text-zinc-200">readout</strong>
          , then <strong className="text-zinc-200">submit</strong> when you hit the goal.
        </span>
      </div>

      <FeedbackToast message={toast?.text ?? null} variant={toast?.variant ?? "info"} />

      <motion.div
        layout
        className="rounded-2xl border border-lime-500/25 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/25 p-5 shadow-xl"
      >
        <div className="mb-3 flex items-center gap-2 text-lime-200/90">
          <Beaker className="h-4 w-4" />
          <p className="text-xs font-bold uppercase tracking-wider">Goal</p>
        </div>
        <p className="text-sm leading-relaxed text-zinc-200">{goal}</p>
        {canScoreIdeal ? (
          <p className="mt-3 text-xs text-zinc-500">
            Success when each dial is within about ±{avgToleranceHint} units of the lab&apos;s stable target band.
          </p>
        ) : (
          <p className="mt-3 text-xs text-zinc-500">
            Aim for a readout that sounds clearly positive (stable, strong, optimal, or similar) based on the rules
            below.
          </p>
        )}
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-5 rounded-2xl border border-zinc-700 bg-zinc-950/80 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Variables</p>
          {variables.map((v) => (
            <div key={v.id}>
              <div className="mb-1 flex justify-between text-sm">
                <label htmlFor={`sim-${v.id}`} className="font-medium text-zinc-200">
                  {v.label}
                </label>
                <span className="font-mono text-lime-300">{Math.round(effectiveValues[v.id] ?? v.default)}</span>
              </div>
              <input
                id={`sim-${v.id}`}
                type="range"
                min={v.min}
                max={v.max}
                step={(v.max - v.min) / 200 || 1}
                disabled={solved}
                value={effectiveValues[v.id] ?? v.default}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setValues((prev) => ({ ...prev, [v.id]: n }));
                }}
                className={cn(
                  "h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-lime-500",
                  solved && "cursor-not-allowed opacity-60"
                )}
              />
              <div className="mt-0.5 flex justify-between text-[10px] text-zinc-600">
                <span>{v.min}</span>
                <span>{v.max}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-zinc-950/90 p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-400/90">Live readout</p>
          {matchedRules.length === 0 ? (
            <p className="text-sm text-zinc-500">No rule fired yet — keep exploring the parameter space.</p>
          ) : (
            <ul className="space-y-2">
              {matchedRules.map((r, i) => (
                <motion.li
                  key={`${r.condition}-${i}`}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm",
                    ruleReadoutIsPositive(r.result)
                      ? "border-emerald-500/35 bg-emerald-950/25 text-emerald-100"
                      : "border-zinc-600 bg-zinc-900/60 text-zinc-300"
                  )}
                >
                  <span className="block text-[10px] uppercase tracking-wider text-zinc-500">Effect</span>
                  {r.result}
                </motion.li>
              ))}
            </ul>
          )}
          {rules.length > 0 && (
            <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">
              Rules fire in definition order; multiple effects can stack when several conditions match.
            </p>
          )}
        </div>
      </div>

      {!solved ? (
        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-zinc-600"
            onClick={() => setValues(initialValues(variables))}
          >
            Reset dials
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-gradient-to-r from-lime-600 to-emerald-700 px-6 font-bold hover:from-lime-500 hover:to-emerald-600"
            onClick={() => void onSubmit()}
          >
            Submit run
          </Button>
        </div>
      ) : null}

      <AnimatePresence>
        {solved ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4 rounded-2xl border border-emerald-500/35 bg-emerald-950/20 p-5"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-bold text-emerald-100">Cause → effect</p>
                <p className="mt-1 text-sm text-emerald-100/90">
                  Small parameter moves changed the system readout. That mapping is the skill this lab trains.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-emerald-500/20 pt-4">
              <p className="text-xs text-zinc-400">
                Streak {runtime.streak} · Score {runtime.score} XP
              </p>
              <Button
                type="button"
                className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 font-bold hover:from-amber-500 hover:to-orange-500"
                onClick={() => void onCompleteSession()}
              >
                <Sparkles className="mr-2 inline h-4 w-4" />
                Complete &amp; view results
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
