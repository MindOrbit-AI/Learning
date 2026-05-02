import type { SceneInteraction, SceneType } from "@/types/scene";

const DEFAULT_INTERACTION: Record<SceneType, SceneInteraction> = {
  fraction_bar: "tap_to_fill",
  number_line: "place_point",
  grid_model: "tap_to_fill",
  drag_drop_sort: "reorder",
  graph_plot: "place_point",
  concept_map: "connect_nodes",
  multiple_choice: "select_choice",
  slider: "place_point",
  venn_two: "select_choice",
  true_false: "select_choice",
  segment_select: "select_choice",
};

export function defaultInteractionForSceneType(type: SceneType): SceneInteraction {
  return DEFAULT_INTERACTION[type];
}

export const VISUAL_SCENE_TYPES: SceneType[] = [
  "fraction_bar",
  "number_line",
  "grid_model",
  "drag_drop_sort",
  "graph_plot",
  "concept_map",
  "slider",
  "venn_two",
  "segment_select",
];

/** Text-only choice steps (count toward the 30% non-manipulation cap). */
const NON_MANIPULATION_SCENE_TYPES: SceneType[] = ["multiple_choice", "true_false"];

export function isVisualInteractionSceneType(type: SceneType): boolean {
  return !NON_MANIPULATION_SCENE_TYPES.includes(type);
}

/**
 * Fraction of scenes (including final mastery) that must use a non–multiple-choice visual workspace.
 * Product rule: ≥ 70%.
 */
export function visualInteractionRatio(lesson: {
  scenes: { type: SceneType }[];
  finalMasteryCheck: { type: SceneType };
}): number {
  const all = [...lesson.scenes, lesson.finalMasteryCheck];
  const visual = all.filter((s) => isVisualInteractionSceneType(s.type)).length;
  return visual / all.length;
}

export function lessonPassesVisualInteractionRule(lesson: {
  scenes: { type: SceneType }[];
  finalMasteryCheck: { type: SceneType };
}): boolean {
  return visualInteractionRatio(lesson) >= 0.7;
}
