import type { RuntimeMicroStep } from "@/features/micro-engine/types";
import { reconcilePartModelCountTarget } from "./partModelCountTarget";

export type VisualProblemPayload = {
  visual: Record<string, unknown>;
  text: string;
};

export type VisualDiagnosis =
  | { ok: true; vars: Record<string, string | number> }
  | { ok: false; failed: "visual" | "text"; vars: Record<string, string | number> };

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function parsePayload(submitted: unknown): VisualProblemPayload | null {
  if (submitted == null) return null;
  if (typeof submitted === "string") {
    const o = parseJson<Record<string, unknown>>(submitted, {});
    if (o && typeof o === "object" && "visual" in o) {
      return {
        visual: (o.visual as Record<string, unknown>) ?? {},
        text: String(o.text ?? o.answer ?? "").trim(),
      };
    }
    return null;
  }
  if (typeof submitted === "object" && submitted !== null) {
    const o = submitted as Record<string, unknown>;
    if (o.visual) {
      const t = o.text ?? o.answer;
      return {
        visual: o.visual as Record<string, unknown>,
        text: typeof t === "string" ? t.trim() : "",
      };
    }
  }
  return null;
}

function expectedRecord(
  correctAnswer: string
): { answer: string; visual: Record<string, unknown> } | null {
  const o = parseJson<Record<string, unknown>>(correctAnswer, {});
  if (!o || typeof o !== "object") return null;
  const visual = o.visual as Record<string, unknown> | undefined;
  if (!visual || typeof visual !== "object") return null;
  const answer = o.answer ?? o.text ?? o.correctAnswer;
  return { answer: answer != null ? String(answer) : "", visual };
}

function parseExpectedVisual(correctAnswer: string): Record<string, unknown> | null {
  const o = parseJson<Record<string, unknown>>(correctAnswer, {});
  const visual = o?.visual as Record<string, unknown> | undefined;
  if (!visual || typeof visual !== "object") return null;
  return visual;
}

function partModelVars(
  exp: Record<string, unknown>,
  got: Record<string, unknown>,
  symbolicAnswer: string
): { ok: boolean; vars: Record<string, string | number> } {
  const total = Number(exp.totalParts) || 0;
  const rawTarget = Number(exp.targetShadedCount ?? exp.shadedCount ?? 0);
  const match = String(exp.match ?? "count") as "count" | "exact";
  const target =
    match === "count"
      ? reconcilePartModelCountTarget(total, rawTarget, symbolicAnswer, match)
      : rawTarget;
  const shadedPartIds = Array.isArray(got.shadedPartIds) ? (got.shadedPartIds as string[]) : [];
  const inRange = (id: string) => {
    const x = Number(id);
    return Number.isInteger(x) && x >= 0 && x < total;
  };
  const shaded = new Set(shadedPartIds.filter(inRange)).size;
  const vars: Record<string, string | number> = { total, shaded, expected: target };
  if (match === "exact") {
    const want = Array.isArray(exp.shadedPartIds)
      ? (exp.shadedPartIds as string[]).slice().sort().join(",")
      : "";
    const have = shadedPartIds.slice().sort().join(",");
    return { ok: want.length > 0 && want === have, vars: { ...vars, shaded, expected: want.split(",").length } };
  }
  return { ok: total > 0 && shaded === target, vars };
}

function numberLineVars(
  exp: Record<string, unknown>,
  got: Record<string, unknown>
): { ok: boolean; vars: Record<string, string | number> } {
  const target = Number(exp.targetValue);
  const val = Number(got.value);
  const step = Number(exp.step ?? 0.5);
  const tol =
    exp.tolerance != null && !Number.isNaN(Number(exp.tolerance))
      ? Number(exp.tolerance)
      : Math.max(step / 2, 0.25);
  const min = Number(exp.min ?? 0);
  const max = Number(exp.max ?? 10);
  const vars: Record<string, string | number> = {
    total: max - min,
    shaded: val,
    expected: target,
    value: val,
  };
  if (Number.isNaN(val) || Number.isNaN(target)) return { ok: false, vars };
  return { ok: Math.abs(val - target) <= tol, vars };
}

function timelineVars(
  exp: Record<string, unknown>,
  got: Record<string, unknown>
): { ok: boolean; vars: Record<string, string | number> } {
  const want = Array.isArray(exp.correctOrder) ? (exp.correctOrder as string[]) : [];
  const order = Array.isArray(got.order) ? (got.order as string[]) : [];
  const vars: Record<string, string | number> = {
    total: want.length,
    shaded: order.length,
    expected: want.length,
  };
  if (want.length !== order.length) return { ok: false, vars };
  const ok = want.every((id, i) => id === order[i]);
  return { ok, vars };
}

function normalizeExpectedEdges(exp: Record<string, unknown>): [string, string][] {
  if (Array.isArray(exp.correctEdges)) {
    return (exp.correctEdges as unknown[])
      .filter((x): x is [string, string] => Array.isArray(x) && x.length === 2)
      .map((x) => [String(x[0]), String(x[1])]);
  }
  const ce = exp.correctEdge as [string, string] | undefined;
  if (Array.isArray(ce) && ce.length === 2) return [[String(ce[0]), String(ce[1])]];
  return [];
}

function normalizeGotEdges(got: Record<string, unknown>): [string, string][] {
  if (Array.isArray(got.edges)) {
    return (got.edges as unknown[])
      .filter((x): x is [string, string] => Array.isArray(x) && x.length === 2)
      .map((x) => [String(x[0]), String(x[1])]);
  }
  const e = got.edge as [string, string] | undefined;
  if (Array.isArray(e) && e.length === 2) return [[String(e[0]), String(e[1])]];
  return [];
}

/** Directed edges: order (from → to) must match each segment (linked lists, cause→effect chains). */
function nodeLinkVars(
  exp: Record<string, unknown>,
  got: Record<string, unknown>
): { ok: boolean; vars: Record<string, string | number> } {
  const want = normalizeExpectedEdges(exp);
  const have = normalizeGotEdges(got);
  const vars: Record<string, string | number> = {
    total: want.length,
    shaded: have.length,
    expected: want.length,
  };
  if (want.length === 0) return { ok: false, vars };
  if (want.length !== have.length) return { ok: false, vars };
  for (let i = 0; i < want.length; i++) {
    const w = want[i] as [string, string];
    const h = have[i] as [string, string];
    if (String(w[0]) !== String(h[0]) || String(w[1]) !== String(h[1])) return { ok: false, vars };
  }
  return { ok: true, vars };
}

function visualMatches(
  expectedVisual: Record<string, unknown>,
  got: Record<string, unknown>,
  symbolicAnswer: string
) {
  const kind = String(expectedVisual.kind ?? "part_model");
  switch (kind) {
    case "part_model":
    case "fraction_bar":
    case "pizza_model":
    case "area_model":
      return partModelVars(expectedVisual, got, symbolicAnswer);
    case "number_line":
      return numberLineVars(expectedVisual, got);
    case "timeline":
      return timelineVars(expectedVisual, got);
    case "node_link":
    case "cause_effect_link":
      return nodeLinkVars(expectedVisual, got);
    default:
      return partModelVars(expectedVisual, got, symbolicAnswer);
  }
}

function textMatches(expected: string, got: string, loose: boolean): boolean {
  const a = norm(expected);
  const b = norm(got);
  if (!a) return true;
  if (!b) return false;
  if (a === b) return true;
  if (!loose) return false;
  const strip = (s: string) => s.replace(/\s+/g, "");
  if (strip(a) === strip(b)) return true;
  return strip(b).includes(strip(a)) || strip(a).includes(strip(b));
}

export function diagnoseVisualProblem(
  correctAnswer: string,
  submitted: unknown,
  looseText = true
): VisualDiagnosis {
  const exp = expectedRecord(correctAnswer);
  const payload = parsePayload(submitted);
  const baseVars: Record<string, string | number> = {
    total: 0,
    shaded: 0,
    expected: 0,
    answer: "",
  };

  if (!exp || !payload) {
    return { ok: false, failed: "visual", vars: { ...baseVars, answer: exp?.answer ?? "" } };
  }

  const gotVis = payload.visual ?? {};
  const { ok: vOk, vars: vVars } = visualMatches(exp.visual, gotVis, exp.answer);
  const vars: Record<string, string | number> = {
    ...baseVars,
    ...vVars,
    answer: exp.answer,
    userAnswer: payload.text,
  };

  if (!vOk) {
    return { ok: false, failed: "visual", vars };
  }

  const tOk = textMatches(exp.answer, payload.text, looseText);
  if (!tOk) {
    return { ok: false, failed: "text", vars: { ...vars, answer: exp.answer } };
  }

  return { ok: true, vars };
}

export function validateVisualProblem(correctAnswer: string, submitted: unknown): boolean {
  return diagnoseVisualProblem(correctAnswer, submitted).ok;
}

export function diagnoseVisualProblemStep(
  step: RuntimeMicroStep,
  submitted: unknown
): VisualDiagnosis {
  const loose = step.interactionConfig.looseText !== false;
  return diagnoseVisualProblem(step.correctAnswer, submitted, loose);
}

/** Whether the learner completed the required visual manipulation (answer field may still be empty). */
export function visualPhaseSatisfied(correctAnswer: string, visualPayload: Record<string, unknown>): boolean {
  const rec = expectedRecord(correctAnswer);
  if (!rec) return false;
  return visualMatches(rec.visual, visualPayload, rec.answer).ok;
}
