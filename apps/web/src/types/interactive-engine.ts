import type { SceneType } from "@/types/scene";

/**
 * MindOrbit Interactive Engine — canonical primitives that LESSON JSON drives.
 * Each scene in a VisualLesson selects one primary primitive (and optional overlays).
 */
export type EnginePrimitive =
  | "drag"
  | "drop_zone"
  | "slider"
  | "number_line"
  | "graph"
  | "coordinate_plane"
  | "tiles"
  | "balance_scale"
  | "geometry_canvas"
  | "simulation"
  | "matching"
  | "sequence_builder"
  | "math_input"
  | "multiple_choice"
  | "gear";

export const ENGINE_PRIMITIVES: readonly EnginePrimitive[] = [
  "drag",
  "drop_zone",
  "slider",
  "number_line",
  "graph",
  "coordinate_plane",
  "tiles",
  "balance_scale",
  "geometry_canvas",
  "simulation",
  "matching",
  "sequence_builder",
  "math_input",
  "multiple_choice",
  "gear",
] as const;

export const ENGINE_PRIMITIVE_COUNT = ENGINE_PRIMITIVES.length;

/** Human-readable labels for UI and docs. */
export const ENGINE_PRIMITIVE_LABEL: Record<EnginePrimitive, string> = {
  drag: "Drag",
  drop_zone: "Drop Zone",
  slider: "Slider",
  number_line: "Number Line",
  graph: "Graph",
  coordinate_plane: "Coordinate Plane",
  tiles: "Tiles",
  balance_scale: "Balance Scale",
  geometry_canvas: "Geometry Canvas",
  simulation: "Simulation",
  matching: "Matching",
  sequence_builder: "Sequence Builder",
  math_input: "Math Input",
  multiple_choice: "Multiple Choice",
  gear: "Gear",
};

/** Maps implemented `SceneType` values to the engine primitive(s) they render. */
export const SCENE_TYPE_ENGINE_MAP: Record<SceneType, EnginePrimitive[]> = {
  fraction_bar: ["tiles"],
  grid_model: ["tiles"],
  number_line: ["number_line"],
  drag_drop_sort: ["drag", "sequence_builder"],
  graph_plot: ["graph", "coordinate_plane"],
  concept_map: ["drag", "drop_zone"],
  slider: ["slider", "simulation"],
  balance_scale: ["balance_scale"],
  gear: ["gear"],
  multiple_choice: ["multiple_choice"],
  true_false: ["multiple_choice"],
  segment_select: ["multiple_choice"],
  venn_two: ["multiple_choice", "matching"],
  gear: ["gear"],
};

export function enginePrimitivesForSceneType(type: SceneType): EnginePrimitive[] {
  return SCENE_TYPE_ENGINE_MAP[type];
}

export function primaryEnginePrimitive(type: SceneType): EnginePrimitive {
  return SCENE_TYPE_ENGINE_MAP[type][0];
}
