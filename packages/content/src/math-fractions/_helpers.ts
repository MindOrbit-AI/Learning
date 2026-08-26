/** Shared builders for the Math fractions curriculum (Visual Problem Engine). */

export type FractionLessonLevel = "beginner" | "intermediate";

export type FractionSceneSeed = {
  id: string;
  title: string;
  type:
    | "fraction_bar"
    | "grid_model"
    | "number_line"
    | "multiple_choice"
    | "segment_select"
    | "drag_drop_sort"
    | "drag_drop_match";
  prompt: string;
  visualPrompt: string;
  data: Record<string, unknown>;
  interaction: "tap_to_fill" | "place_point" | "select_choice" | "reorder" | "drag_to_place";
  validation: Record<string, unknown> & { type: string };
  feedback: { correct: string; incorrect: string; hint?: string };
  masteryTarget: { conceptNodeId: string; skill: string };
};

export type FractionLessonSeed = {
  id: string;
  title: string;
  subject: "Math";
  topic: string;
  level: FractionLessonLevel;
  fractionTrackLevel: 1 | 2 | 3 | 4 | 5;
  scenes: FractionSceneSeed[];
  finalMasteryCheck: FractionSceneSeed;
};

export const FRACTION_CONCEPT = "variables";

export function topicForLevel(n: 1 | 2 | 3 | 4 | 5) {
  return `Fractions (Level ${n})`;
}

export function barScene(
  id: string,
  title: string,
  prompt: string,
  totalParts: number,
  expectedCount: number,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
  visualPrompt = "Tap slices to shade the correct number of equal parts.",
): FractionSceneSeed {
  return {
    id,
    title,
    type: "fraction_bar",
    prompt,
    visualPrompt,
    data: { totalParts },
    interaction: "tap_to_fill",
    validation: { type: "count_match", expectedCount },
    feedback,
    masteryTarget: { conceptNodeId: FRACTION_CONCEPT, skill },
  };
}

export function gridScene(
  id: string,
  title: string,
  prompt: string,
  rows: number,
  columns: number,
  expectedCount: number,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
): FractionSceneSeed {
  return {
    id,
    title,
    type: "grid_model",
    prompt,
    visualPrompt: "Tap cells to shade them.",
    data: { rows, columns },
    interaction: "tap_to_fill",
    validation: { type: "count_match", expectedCount },
    feedback,
    masteryTarget: { conceptNodeId: FRACTION_CONCEPT, skill },
  };
}

export function nlScene(
  id: string,
  title: string,
  prompt: string,
  min: number,
  max: number,
  step: number,
  x: number,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
): FractionSceneSeed {
  return {
    id,
    title,
    type: "number_line",
    prompt,
    visualPrompt: "Drag the marker to the correct position.",
    data: { min, max, step },
    interaction: "place_point",
    validation: { type: "point_match", expectedPoint: { x, y: 0 }, tolerance: 0.07 },
    feedback,
    masteryTarget: { conceptNodeId: FRACTION_CONCEPT, skill },
  };
}

export function mcScene(
  id: string,
  title: string,
  prompt: string,
  choices: string[],
  expectedChoice: string,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
): FractionSceneSeed {
  return {
    id,
    title,
    type: "multiple_choice",
    prompt,
    visualPrompt: "Pick the best answer.",
    data: { choices },
    interaction: "select_choice",
    validation: { type: "choice_match", expectedChoice },
    feedback,
    masteryTarget: { conceptNodeId: FRACTION_CONCEPT, skill },
  };
}

export function segScene(
  id: string,
  title: string,
  prompt: string,
  segments: { id: string; label: string }[],
  expectedChoice: string,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
): FractionSceneSeed {
  return {
    id,
    title,
    type: "segment_select",
    prompt,
    visualPrompt: "Select one option.",
    data: { segments },
    interaction: "select_choice",
    validation: { type: "choice_match", expectedChoice },
    feedback,
    masteryTarget: { conceptNodeId: FRACTION_CONCEPT, skill },
  };
}

export function matchScene(
  id: string,
  title: string,
  prompt: string,
  items: { id: string; label: string }[],
  slots: { id: string; label: string }[],
  expected: Record<string, string>,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
): FractionSceneSeed {
  return {
    id,
    title,
    type: "drag_drop_match",
    prompt,
    visualPrompt: "Tap a card, then tap a slot to place it.",
    data: { items, slots },
    interaction: "drag_to_place",
    validation: { type: "slot_match", expected },
    feedback,
    masteryTarget: { conceptNodeId: FRACTION_CONCEPT, skill },
  };
}

export function sortScene(
  id: string,
  title: string,
  prompt: string,
  items: string[],
  expectedOrder: string[],
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
): FractionSceneSeed {
  return {
    id,
    title,
    type: "drag_drop_sort",
    prompt,
    visualPrompt: "Drag steps into the correct order.",
    data: { items },
    interaction: "reorder",
    validation: { type: "ordered_sequence", expectedOrder },
    feedback,
    masteryTarget: { conceptNodeId: FRACTION_CONCEPT, skill },
  };
}

export function lesson(
  id: string,
  title: string,
  fractionTrackLevel: 1 | 2 | 3 | 4 | 5,
  level: FractionLessonLevel,
  scenes: FractionSceneSeed[],
  finalMasteryCheck: FractionSceneSeed,
): FractionLessonSeed {
  return {
    id,
    title,
    subject: "Math",
    topic: topicForLevel(fractionTrackLevel),
    level,
    fractionTrackLevel,
    scenes,
    finalMasteryCheck,
  };
}
