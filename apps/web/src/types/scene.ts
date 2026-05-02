export type SceneType =
  | "fraction_bar"
  | "number_line"
  | "grid_model"
  | "drag_drop_sort"
  | "graph_plot"
  | "concept_map"
  | "multiple_choice"
  | "slider"
  | "venn_two"
  | "true_false"
  | "segment_select";

/**
 * Product taxonomy for curriculum design and analytics (not stored on `Scene` JSON).
 * Hybrid is lesson-level: combine primitives across ordered scenes.
 */
export type SceneCategory =
  | "selection"
  | "construction"
  | "spatial"
  | "input"
  | "simulation"
  | "hybrid";

/** Maps each implemented `SceneType` to its primary category (implemented kinds only). */
export function sceneCategoryForType(
  type: SceneType,
): Extract<SceneCategory, "selection" | "construction" | "spatial"> {
  switch (type) {
    case "multiple_choice":
    case "true_false":
    case "venn_two":
    case "segment_select":
      return "selection";
    case "fraction_bar":
    case "grid_model":
    case "drag_drop_sort":
    case "concept_map":
    case "slider":
      return "construction";
    case "number_line":
    case "graph_plot":
      return "spatial";
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export type SceneInteraction =
  | "tap_to_fill"
  | "drag_to_place"
  | "reorder"
  | "place_point"
  | "connect_nodes"
  | "select_choice";

export type ValidationRule =
  | {
      type: "exact_selection";
      expected: number[];
    }
  | {
      type: "count_match";
      expectedCount: number;
    }
  | {
      type: "ordered_sequence";
      expectedOrder: string[];
    }
  | {
      type: "point_match";
      expectedPoint: { x: number; y: number };
      /** Max distance (axis units) to count as correct for number lines. */
      tolerance?: number;
    }
  | {
      type: "choice_match";
      expectedChoice: string;
    };

export type SceneFeedback = {
  correct: string;
  incorrect: string;
  hint?: string;
};

/**
 * `conceptNodeId` may be a real ConceptNode cuid or a stable slug (resolved via Subject in API).
 */
export type MasteryTarget = {
  conceptNodeId: string;
  skill: string;
};

export type Scene = {
  id: string;
  title: string;
  type: SceneType;
  prompt: string;
  visualPrompt: string;
  data: Record<string, unknown>;
  interaction: SceneInteraction;
  validation: ValidationRule;
  feedback: SceneFeedback;
  masteryTarget: MasteryTarget;
};

/** Loose user payload per scene type; normalized inside `validateScene`. */
export type SceneUserInput = Record<string, unknown>;
