import { expandNumberLineBounds, inferNumericTarget } from "@/features/visual-problem-solving/numberLineBounds";
import { reconcilePartModelCountTarget } from "@/features/visual-problem-solving/partModelCountTarget";

export function normalizeNodeList(raw: unknown): Array<{ id: string; label: string }> {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((n, i) => {
    if (typeof n === "string") return { id: n, label: n };
    const o = n as Record<string, unknown>;
    const label = String(o.label ?? o.text ?? o.value ?? o.id ?? `n${i}`);
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
    const vk = String(explicitVisual.kind ?? "part_model");
    const match = String(explicitVisual.match ?? "count");
    if (
      (vk === "part_model" || vk === "fraction_bar" || vk === "pizza_model" || vk === "area_model") &&
      match === "count"
    ) {
      const total = Number(explicitVisual.totalParts ?? vw.totalParts ?? 8);
      const raw = Number(explicitVisual.targetShadedCount ?? explicitVisual.shadedCount ?? 0);
      const fixed = reconcilePartModelCountTarget(total, raw, textAnswer, match);
      explicitVisual = { ...explicitVisual, totalParts: total, targetShadedCount: fixed };
    }
    return JSON.stringify({ answer: textAnswer, visual: explicitVisual });
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
    if (Array.isArray(vw.correctEdges) && (vw.correctEdges as unknown[]).length > 0) {
      const pairs = (vw.correctEdges as unknown[])
        .filter((x): x is [string, string] => Array.isArray(x) && x.length === 2)
        .map((x) => [String(x[0]), String(x[1])] as [string, string]);
      return JSON.stringify({
        answer: textAnswer,
        visual: { kind: "node_link", correctEdges: pairs },
      });
    }
    if (Array.isArray(vw.chain) && (vw.chain as unknown[]).length >= 2) {
      const chain = (vw.chain as unknown[]).map(String);
      const pairs = chainLabelsToEdges(chain, nodes);
      return JSON.stringify({
        answer: textAnswer,
        visual: { kind: "node_link", correctEdges: pairs },
      });
    }
    const edge = vw.correctEdge as [string, string] | undefined;
    const correctEdge: [string, string] =
      Array.isArray(edge) && edge.length === 2
        ? [String(edge[0]), String(edge[1])]
        : [String(nodes[0]?.id ?? "a"), String(nodes[1]?.id ?? "b")];
    return JSON.stringify({
      answer: textAnswer,
      visual: { kind: "node_link", correctEdges: [correctEdge] },
    });
  }

  const total = Number(vw.totalParts ?? 8);
  const rawTarget = Number(vw.targetShadedCount ?? 1);
  const match = String(vw.match ?? "count");
  const target = reconcilePartModelCountTarget(total, rawTarget, textAnswer, match);
  return JSON.stringify({
    answer: textAnswer || "?",
    visual: {
      kind: "part_model",
      totalParts: total,
      targetShadedCount: target,
      match,
    },
  });
}
