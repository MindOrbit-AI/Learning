import type { MicroInteractionType, RuntimeMicroStep } from "./types";
import { validateVisualProblem } from "@/features/visual-problem-solving/validateVisualProblem";

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

export function validateMicroAnswer(step: RuntimeMicroStep, submitted: unknown): boolean {
  const sub =
    typeof submitted === "string"
      ? submitted
      : submitted != null
        ? JSON.stringify(submitted)
        : "";
  const expected = step.correctAnswer;

  switch (step.type) {
    case "tap_choice":
      return norm(sub) === norm(expected) || norm(sub) === norm(String(step.interactionConfig.correctLabel ?? ""));

    case "fill_blank": {
      if (step.interactionConfig.acceptAny === true) {
        return norm(sub).length >= 2;
      }
      const loose = step.interactionConfig.loose === true;
      if (loose) return norm(sub).includes(norm(expected)) || norm(expected).includes(norm(sub));
      return norm(sub) === norm(expected);
    }

    case "sequence_order": {
      const a = parseJson<string[]>(sub, []);
      const b = parseJson<string[]>(expected, []);
      if (a.length !== b.length) return false;
      return a.every((v, i) => v === b[i]);
    }

    case "drag_match": {
      const got = parseJson<Record<string, string>>(sub, {});
      const want = parseJson<Record<string, string>>(expected, {});
      const keys = new Set([...Object.keys(got), ...Object.keys(want)]);
      for (const k of keys) {
        if (got[k] !== want[k]) return false;
      }
      return Object.keys(want).length > 0;
    }

    case "slider_adjust": {
      const tol = Number(step.interactionConfig.tolerance ?? 2);
      const n = Number(sub);
      const t = Number(expected);
      if (Number.isNaN(n) || Number.isNaN(t)) return false;
      return Math.abs(n - t) <= tol;
    }

    case "reveal_step": {
      if (expected === "__timer__") {
        return sub === "__timer__" || sub === "__tap__";
      }
      return sub === expected || sub === "__tap__";
    }

    case "connect_nodes": {
      const a = parseJson<string[]>(sub, []).map(String);
      const b = parseJson<string[]>(expected, []).map(String);
      return a.length === b.length && a[0] === b[0] && a[1] === b[1];
    }

    case "visual_toggle": {
      const got = parseJson<string[]>(sub, []).slice().sort();
      const want = parseJson<string[]>(expected, []).slice().sort();
      if (got.length !== want.length) return false;
      return got.every((v, i) => v === want[i]);
    }

    case "visual_problem":
      return validateVisualProblem(expected, submitted);

    default:
      return norm(sub) === norm(expected);
  }
}

export function defaultFeedbackWrong(type: MicroInteractionType): string {
  switch (type) {
    case "slider_adjust":
      return "Adjust until you hit the target.";
    case "sequence_order":
      return "Reorder — think cause → effect.";
    case "drag_match":
      return "Try a different pairing.";
    case "connect_nodes":
      return "Trace the relationship again.";
    case "visual_toggle":
      return "Toggle the pieces that matter.";
    case "visual_problem":
      return "Fix the visual model, then match your answer to what you built.";
    default:
      return "Almost — one more try.";
  }
}
