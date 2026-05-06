import type { RuntimeMicroStep } from "@/features/micro-engine/types";
import {
  canonicalSlotFillExpected,
  normalizeNodeList,
} from "@/lib/mission-to-lesson/buildVisualProblemMerged";
import { basePairSelectSatisfied } from "./basePairSelectValidation";
import { stripMathTeachingLabel } from "./mathLabelDisplay";
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

/** Drag items into ordered slots (array representation). */
function slotFillVars(
  exp: Record<string, unknown>,
  got: Record<string, unknown>
): { ok: boolean; vars: Record<string, string | number> } {
  const { slots, correctOrder: want } = canonicalSlotFillExpected(exp);
  const assign =
    got.slotAssignments && typeof got.slotAssignments === "object"
      ? (got.slotAssignments as Record<string, unknown>)
      : {};
  const filled = slots.filter((s) => {
    const v = assign[s.id];
    return v != null && String(v).length > 0;
  }).length;
  const vars: Record<string, string | number> = {
    total: slots.length,
    shaded: filled,
    expected: want.length,
  };
  if (want.length === 0 || slots.length === 0) return { ok: false, vars };
  if (want.length !== slots.length) return { ok: false, vars };
  if (filled !== slots.length) return { ok: false, vars };
  for (let i = 0; i < slots.length; i++) {
    const sid = slots[i]!.id;
    const h = assign[sid] != null ? String(assign[sid]) : "";
    if (h !== want[i]) return { ok: false, vars };
  }
  return { ok: true, vars };
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

function edgePairFromUnknown(x: unknown): [string, string] | null {
  if (Array.isArray(x) && x.length === 2) return [String(x[0]), String(x[1])];
  if (x && typeof x === "object") {
    const o = x as Record<string, unknown>;
    if (o.from != null && o.to != null) return [String(o.from), String(o.to)];
    if (o.fromId != null && o.toId != null) return [String(o.fromId), String(o.toId)];
  }
  return null;
}

function normalizeExpectedEdges(exp: Record<string, unknown>): [string, string][] {
  if (Array.isArray(exp.correctEdges) && exp.correctEdges.length > 0) {
    const pairs = (exp.correctEdges as unknown[])
      .map(edgePairFromUnknown)
      .filter((p): p is [string, string] => p !== null);
    if (pairs.length > 0) return pairs;
  }
  const cel = exp.correctEdge as unknown;
  if (Array.isArray(cel) && cel.length > 0) {
    if (cel.length === 2 && typeof cel[0] !== "object") {
      const p = edgePairFromUnknown(cel);
      if (p) return [p];
    } else {
      const pairs = (cel as unknown[]).map(edgePairFromUnknown).filter((p): p is [string, string] => p !== null);
      if (pairs.length > 0) return pairs;
    }
  }
  const chain = exp.chain as unknown;
  if (Array.isArray(chain) && chain.length >= 2) {
    const out: [string, string][] = [];
    for (let i = 0; i < chain.length - 1; i++) {
      out.push([String(chain[i]), String(chain[i + 1])]);
    }
    return out;
  }
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

/** Map endpoint token to canonical node id when `nodes` lists id + display label (AI may use either). */
function normalizeNodeLinkEndpoint(
  nodes: Array<{ id: string; label: string }>,
  token: string
): string {
  const t = String(token).trim();
  if (!t) return t;
  if (nodes.some((n) => n.id === t)) return t;
  const compact = (s: string) => s.replace(/\s+/g, "");
  const ct = compact(t);
  const strippedT = stripMathTeachingLabel(t);
  const hit = nodes.find(
    (n) =>
      n.label === t ||
      stripMathTeachingLabel(n.label) === strippedT ||
      compact(n.label) === ct ||
      compact(stripMathTeachingLabel(n.label)) === compact(strippedT)
  );
  return hit?.id ?? t;
}

/** Directed edges: order (from → to) must match each segment (linked lists, cause→effect chains). */
function nodeLinkVars(
  exp: Record<string, unknown>,
  got: Record<string, unknown>
): { ok: boolean; vars: Record<string, string | number> } {
  const nodes = normalizeNodeList(exp.nodes);
  const wantRaw = normalizeExpectedEdges(exp);
  const haveRaw = normalizeGotEdges(got);
  const canon = (a: string, b: string) =>
    nodes.length > 0
      ? ([normalizeNodeLinkEndpoint(nodes, a), normalizeNodeLinkEndpoint(nodes, b)] as [string, string])
      : ([a, b] as [string, string]);
  const want = wantRaw.map(([a, b]) => canon(a, b));
  const have = haveRaw.map(([a, b]) => canon(a, b));
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
    case "none":
      return { ok: true, vars: { total: 0, shaded: 0, expected: 0 } };
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
    case "slot_fill":
      return slotFillVars(expectedVisual, got);
    case "base_pair_select":
      return basePairSelectSatisfied(expectedVisual, got);
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
