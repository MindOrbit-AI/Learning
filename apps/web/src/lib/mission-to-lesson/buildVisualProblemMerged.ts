import { expandNumberLineBounds, inferNumericTarget } from "@/features/visual-problem-solving/numberLineBounds";
import { normalizeBasePairTokens } from "@/features/visual-problem-solving/basePairSelectValidation";
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

function buildVisualStem(content: Record<string, unknown>): string {
  return [content.problemScenario, content.finalPrompt, content.title]
    .map((x) => String(x ?? ""))
    .join(" ");
}

/**
 * Prompt asks which concrete artworks / portraits to choose, but the UI can only show numbered cells
 * unless cellLabels name each option — treat as degenerate and fall back to text-only visual.
 */
function stemExpectsLabeledArtOrPortraitChoices(stem: string): boolean {
  const s = stem.toLowerCase();
  if (/\bwhich\s+(two|three|2|3|these)\b/.test(s) && /\b(painting|paintings|portrait|portraits|fresco|canvas)\b/.test(s))
    return true;
  if (/\bwhich\s+(two|three|these)\b/.test(s) && /\b(artwork|artworks|masterpiece|sculpture|architect)\b/.test(s))
    return true;
  if (/\bwhich\s+(of\s+the\s+following|work|works)\b/.test(s) && /\b(paint|depict|renaissance|baroque)\b/.test(s))
    return true;
  return false;
}

function partModelCellLabelsAreOnlyNumericOrMissing(vis: Record<string, unknown>): boolean {
  const labels = vis.cellLabels;
  if (!Array.isArray(labels) || labels.length === 0) return true;
  return labels.every((x) => /^\s*\d+\s*$/.test(String(x)));
}

/** part_model count mode where anonymous cells contradict a stem about named works. */
function partModelMismatchesArtHumanitiesStem(content: Record<string, unknown>, vis: Record<string, unknown>): boolean {
  const vk = String(vis.kind ?? "part_model");
  if (!isTapShadePartKind(vk)) return false;
  if (String(vis.match ?? "count") !== "count") return false;
  const stem = buildVisualStem(content);
  if (!stemExpectsLabeledArtOrPortraitChoices(stem)) return false;
  return partModelCellLabelsAreOnlyNumericOrMissing(vis);
}

function stemAsksVariablesInExpression(stem: string): boolean {
  const s = stem.toLowerCase();
  if (!/\bvariabl(es)?\b/.test(s)) return false;
  if (/\b(in the expression|in this expression|expression above|algebraic expression)\b/.test(s)) return true;
  if (/\bwhat (are|is) the variabl/.test(s)) return true;
  if (/\b(identify|list|name|find)\b.*\bvariabl/.test(s)) return true;
  return false;
}

/** e.g. "Consider the expression 2x + 3y - 7." → "2x + 3y - 7" */
function extractInlineExpression(blob: string): string | null {
  const m = blob.match(/\bexpression:?\s+([^.\n?!]+)/i);
  if (m) {
    const s = m[1]!.trim();
    if (s.length >= 2 && /[a-zA-Z]/.test(s)) return s;
  }
  const m2 = blob.match(/\bexpression\s+(?:is|=)\s+([^.\n?!]+)/i);
  if (m2) {
    const s = m2[1]!.trim();
    if (s.length >= 2 && /[a-zA-Z]/.test(s)) return s;
  }
  const tick = blob.match(/`([^`\n]+)`/);
  if (tick && /[a-zA-Z]/.test(tick[1]!) && /\d/.test(tick[1]!)) return tick[1]!.trim();
  return null;
}

/** Coefficient·letter pairs and bare letters: "2x+3y-7" → x, y in first-seen order. */
function extractSingleLetterVariablesFromExpression(expr: string): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  const re = /\b(\d*)([a-zA-Z])\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(expr)) !== null) {
    const ch = m[2]!;
    if (!/^[a-zA-Z]$/.test(ch)) continue;
    const key = ch.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    ordered.push(ch);
  }
  return ordered;
}

function partModelMismatchesExpressionVariablesStem(content: Record<string, unknown>, vis: Record<string, unknown>): boolean {
  const vk = String(vis.kind ?? "part_model");
  if (!isTapShadePartKind(vk)) return false;
  if (String(vis.match ?? "count") !== "count") return false;
  const stem = buildVisualStem(content);
  if (!stemAsksVariablesInExpression(stem)) return false;
  return partModelCellLabelsAreOnlyNumericOrMissing(vis);
}

function synthesizeExpressionVariableCellLabels(content: Record<string, unknown>, totalParts: number): string[] | null {
  if (!Number.isFinite(totalParts) || totalParts < 2 || totalParts > 16) return null;
  const blob = buildVisualStem(content);
  const expr = extractInlineExpression(blob);
  if (!expr) return null;
  const vars = extractSingleLetterVariablesFromExpression(expr);
  if (vars.length === 0) return null;
  const out: string[] = [];
  for (let i = 0; i < totalParts; i++) {
    out.push(vars[i] ?? `Part ${i + 1}`);
  }
  return out;
}

function dedupeTitlesPreservingOrder(titles: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (let t of titles) {
    t = t.replace(/\s+/g, " ").trim();
    if (t.length < 2) continue;
    const key = t.toLowerCase().replace(/^the\s+/, "");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

function titlesFromAnswer(answer: string): string[] {
  const a = answer.trim();
  if (!a) return [];
  const chunks = a
    .split(/\s*(?:,|;|\||\n|\t|\+|&|\band\b)\s*/gi)
    .map((s) => s.trim())
    .filter(Boolean);
  const filtered = chunks.filter(
    (s) => s.length >= 2 && !/^\d+$/.test(s) && !/^\d+\/\d+$/.test(s) && !/^x$/i.test(s)
  );
  return dedupeTitlesPreservingOrder(filtered);
}

function titlesFromScenario(scenario: string): string[] {
  const found: string[] = [];
  const bold = /\*\*([^*]+)\*\*/g;
  let m: RegExpExecArray | null;
  while ((m = bold.exec(scenario)) !== null) {
    const x = m[1]!.trim();
    if (x.length >= 3 && x.length <= 120 && !/\n/.test(x)) found.push(x);
  }
  const quoted = /"([^"]{3,80})"|'([^']{3,80})'/g;
  while ((m = quoted.exec(scenario)) !== null) {
    found.push((m[1] ?? m[2]!).trim());
  }
  for (const line of scenario.split(/\n/)) {
    const lm = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.{3,100})$/);
    if (lm) found.push(lm[1]!.trim());
  }
  return dedupeTitlesPreservingOrder(found);
}

/**
 * Infer one short label per tap cell from the symbolic answer and/or scenario so art-history
 * questions are not stuck on anonymous "1,2,3" tiles. Returns null if we cannot find at least two titles.
 */
function synthesizeArtPickCellLabels(
  content: Record<string, unknown>,
  textAnswer: string,
  totalParts: number
): string[] | null {
  if (!Number.isFinite(totalParts) || totalParts < 2 || totalParts > 16) return null;
  const scenario = String(content.problemScenario ?? "");
  const merged = dedupeTitlesPreservingOrder([...titlesFromAnswer(textAnswer), ...titlesFromScenario(scenario)]);
  if (merged.length < 2) return null;
  const out: string[] = [];
  for (let i = 0; i < totalParts; i++) {
    out.push(merged[i] ?? `Study work ${i + 1}`);
  }
  return out;
}

function passthroughReferenceImages(source: Record<string, unknown>): Array<{ url: string; label?: string }> | undefined {
  const raw = source.referenceImages ?? source.artworkImages;
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const norm: Array<{ url: string; label?: string }> = [];
  for (const x of raw) {
    if (typeof x === "string") {
      const url = x.trim();
      if (url) norm.push({ url });
    } else if (x && typeof x === "object") {
      const o = x as Record<string, unknown>;
      const url = String(o.url ?? o.src ?? o.href ?? "").trim();
      if (!url) continue;
      const label = o.label != null ? String(o.label).trim() : undefined;
      norm.push(label ? { url, label } : { url });
    }
  }
  return norm.length > 0 ? norm : undefined;
}

function firstReferenceImageList(...sources: Record<string, unknown>[]): Array<{ url: string; label?: string }> | undefined {
  for (const s of sources) {
    const r = passthroughReferenceImages(s);
    if (r) return r;
  }
  return undefined;
}

const arrLen = (x: unknown) => (Array.isArray(x) ? x.length : 0);

/**
 * LLMs often put `nodes` / `items` only on `correctAnswerJson.visual` while `visualWorkspace` stays sparse.
 * Merge canonical fields so the client can render node_link, slot_fill, and timeline.
 */
export function syncVisualWorkspaceFromMergedVisual(
  workspace: Record<string, unknown>,
  visual: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {
    ...workspace,
    kind: String(visual.kind ?? workspace.kind ?? "part_model"),
  };
  const k = String(out.kind);
  if (
    (k === "part_model" || k === "fraction_bar" || k === "pizza_model" || k === "area_model") &&
    Array.isArray((visual as { referenceImages?: unknown }).referenceImages)
  ) {
    out.referenceImages = (visual as { referenceImages: unknown[] }).referenceImages;
  }
  if (k === "node_link" || k === "cause_effect_link") {
    out.nodes = enrichNodeLinkNodesWithEdgeEndpoints(normalizeNodeList(workspace.nodes), visual);
  }
  if (k === "slot_fill") {
    if (arrLen(out.items) === 0 && arrLen(visual.items) > 0) out.items = visual.items;
    if (arrLen(out.slots) === 0 && arrLen(visual.slots) > 0) out.slots = visual.slots;
  }
  if (k === "timeline") {
    if (arrLen(out.items) === 0 && arrLen(visual.items) > 0) out.items = visual.items;
    if (arrLen(out.correctOrder) === 0 && Array.isArray(visual.correctOrder)) out.correctOrder = visual.correctOrder;
  }
  return out;
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

function collectNodeLinkEndpointIds(visual: Record<string, unknown>): Set<string> {
  const ids = new Set<string>();
  for (const [a, b] of pairsFromEdgeList(visual.correctEdges)) {
    ids.add(a);
    ids.add(b);
  }
  for (const [a, b] of pairsFromEdgeList(visual.correctEdge)) {
    ids.add(a);
    ids.add(b);
  }
  const single = visual.correctEdge as unknown;
  if (Array.isArray(single) && single.length === 2 && typeof single[0] !== "object") {
    ids.add(String(single[0]));
    ids.add(String(single[1]));
  }
  if (Array.isArray(visual.chain)) {
    for (const t of visual.chain as unknown[]) {
      const s = String(t).trim();
      if (s) ids.add(s);
    }
  }
  return ids;
}

function prettifyNodeEndpointId(id: string): string {
  const t = id.trim();
  if (!t) return id;
  const s = t
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
  if (!s) return t;
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Authors often list only “people” nodes while `correctEdges` reference other ids.
 * Merge `visual.nodes` (answer key), workspace `nodes` (labels from content win on id clash),
 * then add a bubble for every edge/chain endpoint so the graph is drawable.
 */
export function enrichNodeLinkNodesWithEdgeEndpoints(
  workspaceNodes: Array<{ id: string; label: string }>,
  visual: Record<string, unknown>
): Array<{ id: string; label: string }> {
  const byId = new Map<string, { id: string; label: string }>();
  for (const n of normalizeNodeList(visual.nodes)) {
    byId.set(n.id, n);
  }
  for (const n of workspaceNodes) {
    byId.set(n.id, n);
  }
  for (const id of collectNodeLinkEndpointIds(visual)) {
    if (!id || byId.has(id)) continue;
    byId.set(id, { id, label: prettifyNodeEndpointId(id) });
  }
  return [...byId.values()];
}

function enrichNodeLinkVisualInPlace(vis: Record<string, unknown>): Record<string, unknown> {
  const k = String(vis.kind ?? "");
  if (k !== "node_link" && k !== "cause_effect_link") return vis;
  const merged = enrichNodeLinkNodesWithEdgeEndpoints(normalizeNodeList(vis.nodes), vis);
  return { ...vis, nodes: merged };
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

  if (
    explicitVisual &&
    String(vw.kind ?? "") === "base_pair_select" &&
    isTapShadePartKind(String(explicitVisual.kind ?? "part_model"))
  ) {
    explicitVisual = null;
  }

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
      const needsPartLabelSynth =
        partModelMismatchesArtHumanitiesStem(content, vis) ||
        partModelMismatchesExpressionVariablesStem(content, vis);
      if (needsPartLabelSynth) {
        const syn =
          synthesizeArtPickCellLabels(content, textAnswer, total) ??
          synthesizeExpressionVariableCellLabels(content, total);
        if (syn) {
          const refs = firstReferenceImageList(content, vis as Record<string, unknown>);
          vis = { ...vis, cellLabels: syn, ...(refs ? { referenceImages: refs } : {}) };
        } else {
          return JSON.stringify({ answer: textAnswer, visual: { kind: "none" } });
        }
      }
    }
    if (vk === "node_link" || vk === "cause_effect_link") {
      const nodes = normalizeNodeList((vis.nodes ?? vw.nodes) as unknown);
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
    if (vk === "base_pair_select") {
      const tokens = normalizeBasePairTokens((vis.tokens ?? vw.tokens) as unknown);
      const rawReq = Number(vis.requiredCorrectPairs ?? vw.requiredCorrectPairs);
      const required =
        Number.isFinite(rawReq) && rawReq > 0
          ? Math.round(rawReq)
          : Math.max(1, Math.floor(tokens.length / 2));
      return JSON.stringify({
        answer: textAnswer,
        visual: { kind: "base_pair_select", tokens, requiredCorrectPairs: required },
      });
    }
    if (String(vis.kind ?? "") === "node_link" || String(vis.kind ?? "") === "cause_effect_link") {
      vis = enrichNodeLinkVisualInPlace(vis);
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
    let rawNodes: unknown = vw.nodes;
    if (
      normalizeNodeList(rawNodes).length === 0 &&
      correct &&
      typeof correct === "object" &&
      !Array.isArray(correct)
    ) {
      const cv = (correct as Record<string, unknown>).visual;
      if (cv && typeof cv === "object" && (cv as Record<string, unknown>).nodes != null) {
        rawNodes = (cv as Record<string, unknown>).nodes;
      }
    }
    const nodes = normalizeNodeList(rawNodes);
    const nodePayload = nodes.map((n) => ({ id: n.id, label: n.label }));
    const best = bestNodeLinkPairs(vw, nodes);
    if (best.length > 0) {
      const visual = enrichNodeLinkVisualInPlace({
        kind: "node_link",
        correctEdges: best,
        nodes: nodePayload,
      });
      return JSON.stringify({
        answer: textAnswer,
        visual,
      });
    }
    const edge = vw.correctEdge as [string, string] | undefined;
    const correctEdge: [string, string] =
      Array.isArray(edge) && edge.length === 2
        ? [String(edge[0]), String(edge[1])]
        : [String(nodes[0]?.id ?? "a"), String(nodes[1]?.id ?? "b")];
    const visual = enrichNodeLinkVisualInPlace({
      kind: "node_link",
      correctEdges: [correctEdge],
      nodes: nodePayload,
    });
    return JSON.stringify({
      answer: textAnswer,
      visual,
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

  if (kind === "base_pair_select") {
    const tokens = normalizeBasePairTokens(vw.tokens);
    const rawReq = Number(vw.requiredCorrectPairs);
    const required =
      Number.isFinite(rawReq) && rawReq > 0 ? Math.round(rawReq) : Math.max(1, Math.floor(tokens.length / 2));
    return JSON.stringify({
      answer: textAnswer,
      visual: { kind: "base_pair_select", tokens, requiredCorrectPairs: required },
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
  const implicitVis: Record<string, unknown> = {
    kind: "part_model",
    totalParts: total,
    targetShadedCount: target,
    match,
    ...extras,
  };
  const needsImplicitPartLabelSynth =
    partModelMismatchesArtHumanitiesStem(content, implicitVis) ||
    partModelMismatchesExpressionVariablesStem(content, implicitVis);
  if (needsImplicitPartLabelSynth) {
    const syn =
      synthesizeArtPickCellLabels(content, textAnswer, total) ??
      synthesizeExpressionVariableCellLabels(content, total);
    if (syn) {
      const refs = firstReferenceImageList(content, implicitVis);
      Object.assign(implicitVis, { cellLabels: syn, ...(refs ? { referenceImages: refs } : {}) });
    } else {
      return JSON.stringify({ answer: textAnswer || "?", visual: { kind: "none" } });
    }
  }
  return JSON.stringify({
    answer: textAnswer || "?",
    visual: implicitVis,
  });
}
