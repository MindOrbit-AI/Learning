import type { Scene, SceneUserInput, ValidationRule } from "@/types/scene";

export type ValidationResult = {
  isCorrect: boolean;
  rule: ValidationRule;
  detail?: string;
};

function sortedNums(a: number[]): number[] {
  return [...a].sort((x, y) => x - y);
}

function arraysEqualSorted(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = sortedNums(a);
  const sb = sortedNums(b);
  return sa.every((v, i) => Math.abs(v - (sb[i] ?? NaN)) < 1e-9);
}

function readNumberArray(input: SceneUserInput, keys: string[]): number[] | null {
  for (const k of keys) {
    const v = input[k];
    if (Array.isArray(v) && v.every((x) => typeof x === "number")) return v as number[];
  }
  return null;
}

function readStringArray(input: SceneUserInput, keys: string[]): string[] | null {
  for (const k of keys) {
    const v = input[k];
    if (Array.isArray(v) && v.every((x) => typeof x === "string")) return v as string[];
  }
  return null;
}

function readChoice(input: SceneUserInput): string | null {
  if (typeof input.choice === "string") return input.choice;
  if (typeof input.selectedChoice === "string") return input.selectedChoice;
  return null;
}

function readPoints(input: SceneUserInput): { x: number; y: number }[] {
  if (Array.isArray(input.points)) {
    return (input.points as unknown[]).map((p) => {
      if (p && typeof p === "object" && "x" in p && typeof (p as { x: unknown }).x === "number") {
        const o = p as { x: number; y?: number };
        return { x: o.x, y: typeof o.y === "number" ? o.y : 0 };
      }
      if (typeof p === "number") return { x: p, y: 0 };
      return { x: 0, y: 0 };
    });
  }
  /** Number line convenience: `{ values: [0.5] }` */
  const vals = readNumberArray(input, ["values", "positions"]);
  if (vals) return vals.map((x) => ({ x, y: 0 }));
  if (typeof input.value === "number" && Number.isFinite(input.value)) {
    return [{ x: input.value, y: 0 }];
  }
  return [];
}

export function validateRule(rule: ValidationRule, input: SceneUserInput): ValidationResult {
  switch (rule.type) {
    case "exact_selection": {
      const sel =
        readNumberArray(input, ["selectedIndices", "selectedPartIndices", "selectedCellIndices"]) ?? [];
      const ok = arraysEqualSorted(sel, rule.expected);
      return { isCorrect: ok, rule, detail: ok ? undefined : `expected indices ${rule.expected.join(", ")}` };
    }
    case "count_match": {
      const sel =
        readNumberArray(input, ["selectedIndices", "selectedPartIndices", "selectedCellIndices"]) ?? [];
      const ok = sel.length === rule.expectedCount;
      return {
        isCorrect: ok,
        rule,
        detail: ok ? undefined : `expected ${rule.expectedCount} selected, got ${sel.length}`,
      };
    }
    case "ordered_sequence": {
      const order = readStringArray(input, ["order", "itemOrder"]) ?? [];
      const ok =
        order.length === rule.expectedOrder.length &&
        order.every((id, i) => id === rule.expectedOrder[i]);
      return { isCorrect: ok, rule, detail: ok ? undefined : "order does not match" };
    }
    case "point_match": {
      const pts = readPoints(input);
      const tol = rule.tolerance ?? 0.06;
      if (pts.length === 0) {
        return { isCorrect: false, rule, detail: "no point placed" };
      }
      const p = pts[0];
      if (!p) {
        return { isCorrect: false, rule, detail: "no point placed" };
      }
      const dx = Math.abs(p.x - rule.expectedPoint.x);
      const dy = Math.abs(p.y - rule.expectedPoint.y);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ok = dist <= tol;
      return { isCorrect: ok, rule, detail: ok ? undefined : `point off by ~${dist.toFixed(2)}` };
    }
    case "choice_match": {
      const c = readChoice(input);
      if (!c) return { isCorrect: false, rule, detail: "no choice selected" };
      const ok = c === rule.expectedChoice;
      return { isCorrect: ok, rule, detail: ok ? undefined : `selected “${c}”` };
    }
    default: {
      const _exhaustive: never = rule;
      return { isCorrect: false, rule: _exhaustive, detail: "unknown rule" };
    }
  }
}

export function validateScene(scene: Scene, userInput: SceneUserInput): ValidationResult {
  return validateRule(scene.validation, userInput);
}
