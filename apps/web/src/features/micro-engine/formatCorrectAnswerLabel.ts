import type { RuntimeMicroStep } from "./types";

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

/** Option id to highlight for tap_choice when revealing the answer. */
export function tapChoiceCorrectOptionId(step: RuntimeMicroStep): string | null {
  if (step.type !== "tap_choice") return null;
  const opts = (step.interactionConfig.options ?? []) as Array<{ id: string; label: string }>;
  const expected = String(step.correctAnswer).trim();
  const correctLabel = String(step.interactionConfig.correctLabel ?? "").trim();
  const byId = opts.find((o) => norm(o.id) === norm(expected));
  if (byId) return byId.id;
  if (correctLabel) {
    const byLabel = opts.find((o) => norm(o.label) === norm(correctLabel));
    if (byLabel) return byLabel.id;
  }
  const byLabelEqExpected = opts.find((o) => norm(o.label) === norm(expected));
  return byLabelEqExpected?.id ?? null;
}

/** Human-readable correct answer for overlays and hints after max wrong tries. */
export function formatMicroStepCorrectAnswer(step: RuntimeMicroStep): string {
  switch (step.type) {
    case "tap_choice": {
      const opts = (step.interactionConfig.options ?? []) as Array<{ id: string; label: string }>;
      const id = tapChoiceCorrectOptionId(step);
      const opt = id ? opts.find((o) => o.id === id) : undefined;
      return (opt?.label ?? String(step.correctAnswer).trim()) || "the highlighted choice";
    }
    case "fill_blank":
      return String(step.correctAnswer);
    case "slider_adjust":
      return String(step.correctAnswer);
    case "sequence_order": {
      const ids = parseJson<string[]>(step.correctAnswer, []);
      const items = (step.interactionConfig.items ?? []) as Array<{ id: string; label: string }>;
      return ids
        .map((i) => items.find((x) => x.id === i)?.label ?? i)
        .join(" → ");
    }
    case "drag_match": {
      const want = parseJson<Record<string, string>>(step.correctAnswer, {});
      const items = (step.interactionConfig.items ?? []) as Array<{ id: string; label: string }>;
      const slots = (step.interactionConfig.slots ?? []) as Array<{ id: string; label?: string }>;
      const parts = Object.entries(want).map(([slotId, itemId]) => {
        const it = items.find((x) => x.id === itemId)?.label ?? itemId;
        const sl = slots.find((s) => s.id === slotId)?.label ?? slotId;
        return `${it} → ${sl}`;
      });
      return parts.length ? parts.join("; ") : String(step.correctAnswer);
    }
    case "connect_nodes": {
      const pair = parseJson<string[]>(step.correctAnswer, []);
      const nodes = (step.interactionConfig.nodes ?? []) as Array<{ id: string; label: string }>;
      if (pair.length >= 2) {
        const a = nodes.find((n) => n.id === pair[0])?.label ?? pair[0];
        const b = nodes.find((n) => n.id === pair[1])?.label ?? pair[1];
        return `${a} ↔ ${b}`;
      }
      return String(step.correctAnswer);
    }
    case "visual_toggle": {
      const want = parseJson<string[]>(step.correctAnswer, []);
      const targets = (step.interactionConfig.targets ?? []) as Array<{ id: string; label: string }>;
      return want.map((id) => targets.find((t) => t.id === id)?.label ?? id).join(", ");
    }
    case "visual_problem": {
      const o = parseJson<Record<string, unknown>>(step.correctAnswer, {});
      const ans = o.answer ?? o.text ?? o.correctAnswer;
      if (typeof ans === "string" && ans.trim()) return ans.trim();
      return "the solution shown on the card";
    }
    case "reveal_step":
      return String(step.interactionConfig.full ?? step.correctAnswer);
    default:
      return String(step.correctAnswer ?? "").trim() || "the correct response";
  }
}
