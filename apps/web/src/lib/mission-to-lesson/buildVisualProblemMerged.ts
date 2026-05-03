import { expandNumberLineBounds, inferNumericTarget } from "@/features/visual-problem-solving/numberLineBounds";
import { reconcilePartModelCountTarget } from "@/features/visual-problem-solving/partModelCountTarget";

function isTapShadePartKind(kind: string): boolean {
  return (
    kind === "part_model" ||
    kind === "fraction_bar" ||
    kind === "pizza_model" ||
    kind === "area_model"
  );
}

/** Tap-to-shade with fewer than two cells is unusable; fall back to text-only grading. */
function partModelTotalTooSmall(vis: Record<string, unknown>): boolean {
  const vk = String(vis.kind ?? "part_model");
  if (!isTapShadePartKind(vk)) return false;
  const tp = Number(vis.totalParts);
  return !Number.isFinite(tp) || tp < 2;
}

/** Drop targets for slot_fill (array drag) — ids must match keys in learner `slotAssignments`. */
export function normalizeSlotFillSlots(raw: unknown, slotCount: number): Array<{ id: string; label: string }> {
  const n = Math.max(1, Math.round(slotCount));
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((z, i) => {
      if (typeof z === "string") return { id: `slot-${i}`, label: z };
      const o = z as Record<string, unknown>;
      return {
        id: String(o.id ?? `slot-${i}`),
        label: String(o.label ?? o.id ?? `${i + 1}`),
      };
    });
  }
  return Array.from({ length: n }, (_, i) => ({ id: String(i), label: String(i + 1) }));
}

export function normalizeNodeList(raw: unknown): Array<{ id: string; label: string }> {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((n, i) => {
    if (typeof n === "string") return { id: n, label: n };
    const o = n as Record<string, unknown>;
    const label = String(
      o.label ?? o.display ?? o.expression ?? o.text ?? o.value ?? o.equation ?? o.id ?? `n${i}`
    );
    const id = String(o.id ?? o.label ?? o.text ?? `n${i}`);
    return { id, label };
  });
}

function chainLabelsToEdges(chain: string[], nodes: Array<{ id: string; label: string }>): [string, string][] {
  const labelToId = new Map(nodes.map((n) => [n.label, n.id] as const));
  const toId = (token: string) => labelToId.get(token) ?? token;
  const ids = chain.map((t) => toId(String(t)));
  const pairs: [string, string][] = [];
  for (let i = 0; i < ids.length - 1; i++) pairs.push([ids[i]!, ids[i + 1]!]);
  return pairs;
}

/** Tuples `[from,to]` or `{ from, to }` / `{ fromId, toId }` from AI / CMS. */
function pairFromEdgeItem(x: unknown): [string, string] | null {
  if (Array.isArray(x) && x.length === 2) return [String(x[0]), String(x[1])];
  if (x && typeof x === "object") {
    const o = x as Record<string, unknown>;
    if (o.from != null && o.to != null) return [String(o.from), String(o.to)];
    if (o.fromId != null && o.toId != null) return [String(o.fromId), String(o.toId)];
  }
  return null;
}

function pairsFromEdgeList(raw: unknown): [string, string][] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (raw.length === 2 && !Array.isArray(raw[0]) && typeof raw[0] !== "object") {
    const p = pairFromEdgeItem(raw);
    return p ? [p] : [];
  }
  const out: [string, string][] = [];
  for (const x of raw) {
    const p = pairFromEdgeItem(x);
    if (p) out.push(p);
  }
  return out;
}

/** Prefer explicit edge list unless `chain` describes more links (stale single-edge correctEdges is common). */
function bestNodeLinkPairs(
  vw: Record<string, unknown>,
  nodes: Array<{ id: string; label: string }>
): [string, string][] {
  let fromEdges = pairsFromEdgeList(vw.correctEdges);
  if (fromEdges.length === 0) {
    fromEdges = pairsFromEdgeList(vw.correctEdge);
  }
  if (fromEdges.length === 0) {
    const single = vw.correctEdge as unknown;
    if (Array.isArray(single) && single.length === 2 && typeof single[0] !== "object") {
      fromEdges = [[String(single[0]), String(single[1])]];
    }
  }
  let fromChain: [string, string][] = [];
  if (Array.isArray(vw.chain) && vw.chain.length >= 2) {
    fromChain = chainLabelsToEdges((vw.chain as unknown[]).map(String), nodes);
  }
  if (fromChain.length > fromEdges.length) return fromChain;
  if (fromEdges.length > 0) return fromEdges;
  return fromChain;
}

/** Merges scene `contentJson` + `correctAnswerJson` into canonical JSON for visual_problem steps. */
export function buildVisualProblemMergedCorrect(content: Record<string, unknown>, correct: unknown): string {
  const vw = (content.visualWorkspace ?? {}) as Record<string, unknown>;
  const kind = String(vw.kind ?? "part_model");

  let textAnswer = "";
  let explicitVisual: Record<string, unknown> | null = null;

  if (correct && typeof correct === "object" && !Array.isArray(correct)) {
    const c = correct as Record<string, unknown>;
    if (c.answer != null) textAnswer = String(c.answer);
    else if (c.text != null) textAnswer = String(c.text);
    if (c.visual && typeof c.visual === "object") explicitVisual = c.visual as Record<string, unknown>;
  } else if (correct != null && typeof correct !== "object") {
    textAnswer = String(correct);
  }

  if (!textAnswer) textAnswer = String(content.expectedAnswer ?? "");

  if (explicitVisual) {
    let vis = explicitVisual as Record<string, unknown>;
    const vk = String(vis.kind ?? "part_model");
    const match = String(vis.match ?? "count");
    if (
      (vk === "part_model" || vk === "fraction_bar" || vk === "pizza_model" || vk === "area_model") &&
      match === "count"
    ) {
      const total = Number(vis.totalParts ?? vw.totalParts ?? 8);
      const raw = Number(vis.targetShadedCount ?? vis.shadedCount ?? 0);
      const fixed = reconcilePartModelCountTarget(total, raw, textAnswer, match);
      const extras: Record<string, unknown> = {};
      if (Array.isArray(vis.cellLabels)) extras.cellLabels = vis.cellLabels;
      else if (Array.isArray(vis.partLabels)) extras.cellLabels = vis.partLabels;
      else if (Array.isArray(vw.cellLabels)) extras.cellLabels = vw.cellLabels;
      else if (Array.isArray(vw.partLabels)) extras.cellLabels = vw.partLabels;
      else if (Array.isArray(vw.labels)) extras.cellLabels = vw.labels;
      const gc = vis.gridCols ?? vis.cols ?? vw.gridCols ?? vw.cols;
      if (gc != null && Number.isFinite(Number(gc))) extras.gridCols = Math.min(16, Math.round(Number(gc)));
      vis = { ...vis, totalParts: total, targetShadedCount: fixed, ...extras };
    }
    if (vk === "node_link" || vk === "cause_effect_link") {
      const nodes = normalizeNodeList(vw.nodes);
      const nodePayload = nodes.map((n) => ({ id: n.id, label: n.label }));
      const syntheticVw = { ...vw } as Record<string, unknown>;
      if (Array.isArray(vis.correctEdges)) syntheticVw.correctEdges = vis.correctEdges;
      if (Array.isArray(vis.correctEdge)) syntheticVw.correctEdge = vis.correctEdge;
      const best = bestNodeLinkPairs(syntheticVw, nodes);
      if (best.length > 0) {
        vis = { ...vis, kind: "node_link", correctEdges: best, nodes: nodePayload };
      }
    }
    if (vk === "slot_fill") {
      const items = normalizeNodeList((vis.items ?? vw.items) as unknown);
      const slotCount = Number(vis.slotCount ?? vw.slotCount ?? items.length);
      const slotsRaw = Array.isArray(vis.slots) ? vis.slots : vw.slots;
      const slots = normalizeSlotFillSlots(
        slotsRaw,
        Math.max(slotCount, Array.isArray(slotsRaw) ? slotsRaw.length : 0, items.length || 1)
      );
      let correctOrder: string[] = [];
      if (Array.isArray(vis.correctOrder)) correctOrder = (vis.correctOrder as unknown[]).map(String);
      else if (Array.isArray(vw.correctOrder)) correctOrder = (vw.correctOrder as unknown[]).map(String);
      if (correctOrder.length !== slots.length && items.length >= slots.length) {
        correctOrder = items.slice(0, slots.length).map((x) => x.id);
      }
      vis = {
        ...vis,
        kind: "slot_fill",
        items: items.map((n) => ({ id: n.id, label: n.label })),
        slots,
        correctOrder,
      };
    }
    if (partModelTotalTooSmall(vis)) {
      return JSON.stringify({ answer: textAnswer, visual: { kind: "none" } });
    }
    return JSON.stringify({ answer: textAnswer, visual: vis });
  }

  if (kind === "number_line") {
    let min = Number(vw.min ?? 0);
    let max = Number(vw.max ?? 10);
    const step = Number(vw.step ?? 0.5);
    let target = Number(vw.targetValue ?? NaN);
    if (!Number.isFinite(target)) {
      const fromText = inferNumericTarget(textAnswer);
      if (fromText != null) target = fromText;
    }
    if (!Number.isFinite(target)) target = (min + max) / 2;
    const fit = expandNumberLineBounds({ min, max, step, targetValue: target });
    return JSON.stringify({
      answer: textAnswer,
      visual: {
        kind: "number_line",
        min: fit.min,
        max: fit.max,
        step: fit.step,
        targetValue: target,
        tolerance: vw.tolerance != null ? Number(vw.tolerance) : undefined,
      },
    });
  }

  if (kind === "timeline") {
    const order = Array.isArray(vw.correctOrder) ? (vw.correctOrder as string[]) : [];
    return JSON.stringify({
      answer: textAnswer,
      visual: { kind: "timeline", correctOrder: order },
    });
  }

  if (kind === "node_link" || kind === "cause_effect_link") {
    const nodes = normalizeNodeList(vw.nodes);
    const nodePayload = nodes.map((n) => ({ id: n.id, label: n.label }));
    const best = bestNodeLinkPairs(vw, nodes);
    if (best.length > 0) {
      return JSON.stringify({
        answer: textAnswer,
        visual: { kind: "node_link", correctEdges: best, nodes: nodePayload },
      });
    }
    const edge = vw.correctEdge as [string, string] | undefined;
    const correctEdge: [string, string] =
      Array.isArray(edge) && edge.length === 2
        ? [String(edge[0]), String(edge[1])]
        : [String(nodes[0]?.id ?? "a"), String(nodes[1]?.id ?? "b")];
    return JSON.stringify({
      answer: textAnswer,
      visual: { kind: "node_link", correctEdges: [correctEdge], nodes: nodePayload },
    });
  }

  if (kind === "slot_fill") {
    const items = normalizeNodeList(vw.items);
    const slotCount = Number(vw.slotCount ?? items.length);
    const slots = normalizeSlotFillSlots(vw.slots, Math.max(slotCount, Array.isArray(vw.slots) ? vw.slots.length : 0));
    let correctOrder: string[] = Array.isArray(vw.correctOrder) ? (vw.correctOrder as unknown[]).map(String) : [];
    if (correctOrder.length !== slots.length && items.length >= slots.length) {
      correctOrder = items.slice(0, slots.length).map((x) => x.id);
    }
    return JSON.stringify({
      answer: textAnswer,
      visual: {
        kind: "slot_fill",
        items: items.map((n) => ({ id: n.id, label: n.label })),
        slots,
        correctOrder,
      },
    });
  }

  const total = Number(vw.totalParts ?? 8);
  if (!Number.isFinite(total) || total < 2) {
    return JSON.stringify({
      answer: textAnswer || "?",
      visual: { kind: "none" },
    });
  }
  const rawTarget = Number(vw.targetShadedCount ?? 1);
  const match = String(vw.match ?? "count");
  const target = reconcilePartModelCountTarget(total, rawTarget, textAnswer, match);
  const extras: Record<string, unknown> = {};
  if (Array.isArray(vw.cellLabels)) extras.cellLabels = vw.cellLabels;
  else if (Array.isArray(vw.partLabels)) extras.cellLabels = vw.partLabels;
  else if (Array.isArray(vw.labels)) extras.cellLabels = vw.labels;
  const gc = vw.gridCols ?? vw.cols;
  if (gc != null && Number.isFinite(Number(gc))) extras.gridCols = Math.min(16, Math.round(Number(gc)));
  return JSON.stringify({
    answer: textAnswer || "?",
    visual: {
      kind: "part_model",
      totalParts: total,
      targetShadedCount: target,
      match,
      ...extras,
    },
  });
}
