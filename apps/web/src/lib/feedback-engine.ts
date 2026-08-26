import type { Scene, SceneType, SceneUserInput } from "@/types/scene";
import type { ValidationResult } from "./validation-engine";
import { validateScene } from "./validation-engine";

function countSelected(input: SceneUserInput): number {
  const keys = ["selectedIndices", "selectedPartIndices", "selectedCellIndices"];
  for (const k of keys) {
    const v = input[k];
    if (Array.isArray(v)) return v.length;
  }
  return 0;
}

function readTotalParts(scene: Scene): number {
  const d = scene.data as { totalParts?: number; rows?: number; columns?: number };
  if (typeof d.totalParts === "number") return d.totalParts;
  if (typeof d.rows === "number" && typeof d.columns === "number") return d.rows * d.columns;
  return 0;
}

function describeVisualAction(scene: Scene, input: SceneUserInput): string {
  switch (scene.type as SceneType) {
    case "fraction_bar": {
      const n = countSelected(input);
      const t = readTotalParts(scene) || "several";
      return `You shaded ${n} out of ${t} parts`;
    }
    case "grid_model": {
      const n = countSelected(input);
      const t = readTotalParts(scene);
      return `You shaded ${n} cell${n === 1 ? "" : "s"}${t ? ` out of ${t}` : ""}`;
    }
    case "number_line": {
      const pts = Array.isArray(input.points)
        ? (input.points as { x?: number }[])
        : Array.isArray(input.values)
          ? (input.values as number[]).map((x) => ({ x }))
          : [];
      const x = pts[0]?.x;
      if (typeof x === "number") return `You placed a mark at ${x}`;
      return "You have not placed a mark on the line yet";
    }
    case "multiple_choice": {
      const c = typeof input.choice === "string" ? input.choice : String(input.selectedChoice ?? "");
      return c ? `You chose “${c}”` : "You have not selected an answer";
    }
    case "drag_drop_sort": {
      const order = (input.order as string[]) ?? (input.itemOrder as string[]) ?? [];
      return order.length
        ? `Your order starts with: ${order.slice(0, 3).join(" → ")}${order.length > 3 ? " …" : ""}`
        : "Nothing has been reordered yet";
    }
    case "drag_drop_match": {
      const slots =
        input.slots && typeof input.slots === "object" && !Array.isArray(input.slots)
          ? (input.slots as Record<string, string>)
          : {};
      const filled = Object.keys(slots).length;
      return filled ? `You placed ${filled} card${filled === 1 ? "" : "s"} in slots` : "No cards placed yet";
    }
    case "graph_plot": {
      const pts = Array.isArray(input.points) ? (input.points as { x: number; y: number }[]) : [];
      if (!pts.length) return "No point is on the graph yet";
      const p = pts[0];
      if (!p) return "No point is on the graph yet";
      return `You placed a point near (${p.x.toFixed(2)}, ${p.y.toFixed(2)})`;
    }
    case "concept_map": {
      const edges = Array.isArray(input.edges) ? (input.edges as unknown[]).length : 0;
      return `You drew ${edges} connection${edges === 1 ? "" : "s"}`;
    }
    case "slider": {
      const v = input.value;
      if (typeof v === "number" && Number.isFinite(v)) return `You set the slider to ${v}`;
      return "You have not moved the slider yet";
    }
    case "venn_two":
    case "segment_select": {
      const c = typeof input.choice === "string" ? input.choice : String(input.selectedChoice ?? "");
      return c ? `You chose “${c}”` : "You have not selected a region yet";
    }
    case "true_false": {
      const c = typeof input.choice === "string" ? input.choice : String(input.selectedChoice ?? "");
      return c ? `You answered “${c}”` : "You have not chosen True or False yet";
    }
    case "balance_scale": {
      const left = (input.leftWeights as number[]) ?? [];
      const right = (input.rightWeights as number[]) ?? [];
      const ls = left.reduce((a, b) => a + b, 0);
      const rs = right.reduce((a, b) => a + b, 0);
      return `Your scale reads ${ls} on the left and ${rs} on the right`;
    }
    case "gear": {
      const driven = typeof input.drivenTeeth === "number" ? input.drivenTeeth : "?";
      const angle = typeof input.driverAngle === "number" ? input.driverAngle : 0;
      return `Driven gear ${driven}T with driver at ${Math.round(angle)}°`;
    }
    default:
      return "Here is how your work compares to the goal";
  }
}

export type FeedbackPayload = {
  isCorrect: boolean;
  feedback: string;
  misconception?: string;
  visualCorrection?: unknown;
};

export function buildFeedback(
  scene: Scene,
  userInput: SceneUserInput,
  validation: ValidationResult,
): FeedbackPayload {
  const action = describeVisualAction(scene, userInput);
  if (validation.isCorrect) {
    return {
      isCorrect: true,
      feedback: `${action}. ${scene.feedback.correct}`,
      visualCorrection: undefined,
    };
  }
  const misconception =
    scene.type === "multiple_choice" || scene.type === "true_false"
      ? "Selected option does not match the correct answer for this check."
      : validation.detail;
  return {
    isCorrect: false,
    feedback: `${action}. ${scene.feedback.incorrect}`,
    misconception,
    visualCorrection: scene.data,
  };
}

export function validateSceneWithFeedback(scene: Scene, userInput: SceneUserInput): FeedbackPayload {
  const v = validateScene(scene, userInput);
  return buildFeedback(scene, userInput, v);
}
