import type { SceneCategory } from "@/types/scene";
import {
  ENGINE_PRIMITIVE_COUNT,
  ENGINE_PRIMITIVE_LABEL,
  type EnginePrimitive,
} from "@/types/interactive-engine";

export type EnginePrimitiveMeta = {
  slug: string;
  label: string;
  description: string;
  sceneCategory: SceneCategory;
  demoId: string;
  /** Short example of what LESSON JSON drives for this primitive. */
  jsonHint: string;
};

export const ENGINE_PRIMITIVE_META: Record<EnginePrimitive, EnginePrimitiveMeta> = {
  drag: {
    slug: "drag",
    label: ENGINE_PRIMITIVE_LABEL.drag,
    description: "Pick up and move objects — blocks, labels, particles, or diagram parts.",
    sceneCategory: "construction",
    demoId: "drag",
    jsonHint: '{ "type": "drag", "items": [...] }',
  },
  drop_zone: {
    slug: "drop-zone",
    label: ENGINE_PRIMITIVE_LABEL.drop_zone,
    description: "Drop dragged items into labeled zones — classify, sort, or assemble models.",
    sceneCategory: "construction",
    demoId: "drop-zone",
    jsonHint:
      '{ "type": "drag_drop_match", "items": [{ "id": "r2", "label": "x = 2" }], "slots": [...] }',
  },
  slider: {
    slug: "slider",
    label: ENGINE_PRIMITIVE_LABEL.slider,
    description: "Slide a variable along a range — force, concentration, temperature, and more.",
    sceneCategory: "simulation",
    demoId: "slider",
    jsonHint: '{ "type": "slider", "min": 0, "max": 10, "step": 0.5 }',
  },
  number_line: {
    slug: "number-line",
    label: ENGINE_PRIMITIVE_LABEL.number_line,
    description: "Place markers on an axis — fractions, decimals, and signed magnitudes.",
    sceneCategory: "spatial",
    demoId: "number-line",
    jsonHint: '{ "type": "number_line", "min": 0, "max": 1, "step": 0.25 }',
  },
  graph: {
    slug: "graph",
    label: ENGINE_PRIMITIVE_LABEL.graph,
    description: "Plot points on a graph — force vs acceleration, energy curves, data trends.",
    sceneCategory: "spatial",
    demoId: "graph",
    jsonHint: '{ "type": "graph_plot", "xMin": 0, "xMax": 6, "yMin": 0, "yMax": 8 }',
  },
  coordinate_plane: {
    slug: "coordinate-plane",
    label: ENGINE_PRIMITIVE_LABEL.coordinate_plane,
    description: "Work on a full xy-plane — slope, intercepts, vectors, and geometric loci.",
    sceneCategory: "spatial",
    demoId: "coordinate-plane",
    jsonHint: '{ "type": "graph_plot", "grid": true, "axes": "xy" }',
  },
  tiles: {
    slug: "tiles",
    label: ENGINE_PRIMITIVE_LABEL.tiles,
    description: "Tap or shade grid cells — Punnett squares, area models, and ratio tables.",
    sceneCategory: "construction",
    demoId: "tiles",
    jsonHint: '{ "type": "grid_model", "rows": 2, "columns": 2 }',
  },
  balance_scale: {
    slug: "balance-scale",
    label: ENGINE_PRIMITIVE_LABEL.balance_scale,
    description: "Balance pans with weights — stoichiometry, equations, and proportional reasoning.",
    sceneCategory: "construction",
    demoId: "balance-scale",
    jsonHint: '{ "type": "balance_scale", "weights": [1,2,3], "fixedLeft": [3], "fixedRight": [7] }',
  },
  geometry_canvas: {
    slug: "geometry-canvas",
    label: ENGINE_PRIMITIVE_LABEL.geometry_canvas,
    description: "Interact with shapes on a canvas — triangles, angles, constructions, proofs.",
    sceneCategory: "spatial",
    demoId: "geometry-canvas",
    jsonHint: '{ "type": "geometry_canvas", "shape": "triangle" }',
  },
  simulation: {
    slug: "simulation",
    label: ENGINE_PRIMITIVE_LABEL.simulation,
    description: "Change inputs and watch a system respond — motion, reactions, populations.",
    sceneCategory: "simulation",
    demoId: "simulation",
    jsonHint: '{ "type": "simulation", "variable": "temperature" }',
  },
  matching: {
    slug: "matching",
    label: ENGINE_PRIMITIVE_LABEL.matching,
    description: "Pair terms to definitions, structures, or labels — memory and recognition.",
    sceneCategory: "selection",
    demoId: "matching",
    jsonHint: '{ "type": "matching", "pairs": [...] }',
  },
  sequence_builder: {
    slug: "sequence-builder",
    label: ENGINE_PRIMITIVE_LABEL.sequence_builder,
    description: "Reorder steps into the correct sequence — proofs, cycles, lab procedures.",
    sceneCategory: "construction",
    demoId: "sequence-builder",
    jsonHint: '{ "type": "drag_drop_sort", "items": [...] }',
  },
  math_input: {
    slug: "math-input",
    label: ENGINE_PRIMITIVE_LABEL.math_input,
    description: "Type a numeric or symbolic answer after visual work — equations, fractions, units.",
    sceneCategory: "input",
    demoId: "math-input",
    jsonHint: '{ "type": "math_input", "accept": ["1", "4/4"] }',
  },
  multiple_choice: {
    slug: "multiple-choice",
    label: ENGINE_PRIMITIVE_LABEL.multiple_choice,
    description: "Choose among options — quick checks, true/false, and segment buttons.",
    sceneCategory: "selection",
    demoId: "multiple-choice",
    jsonHint: '{ "type": "multiple_choice", "choices": [...] }',
  },
  gear: {
    slug: "gear",
    label: ENGINE_PRIMITIVE_LABEL.gear,
    description:
      "Mesh gears and explore ratios — rotate drivers, swap tooth counts, solve algebra with g and d.",
    sceneCategory: "simulation",
    demoId: "gear",
    jsonHint:
      '{ "type": "gear", "equation": "d = 3g", "driverTeeth": 12, "drivenOptions": [24, 36] }',
  },
};

export { ENGINE_PRIMITIVE_COUNT };

export type EngineFilter = EnginePrimitive | "All";

export function engineLabel(primitive: EnginePrimitive): string {
  return ENGINE_PRIMITIVE_META[primitive].label;
}
