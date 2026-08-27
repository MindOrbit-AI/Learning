/** Shared builders for the Math proportional reasoning curriculum. */

export type PropDifficulty = "beginner" | "intermediate";

export type PropSceneSeed = {
  id: string;
  title: string;
  type:
    | "fraction_bar"
    | "grid_model"
    | "graph_plot"
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

export type PropTrackLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PropLessonSeed = {
  id: string;
  title: string;
  subject: "Math";
  topic: string;
  level: PropDifficulty;
  propTrackLevel: PropTrackLevel;
  scenes: PropSceneSeed[];
  finalMasteryCheck: PropSceneSeed;
};

export const PROP_CONCEPT = "proportional-reasoning";

export type GraphBounds = { xMin: number; xMax: number; yMin: number; yMax: number };

export const PROP_GRAPH_BOUNDS: GraphBounds = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 };

export function topicForPropLevel(n: PropTrackLevel) {
  return `Proportional Reasoning (Level ${n})`;
}

export function lessonId(level: PropTrackLevel, slug: string) {
  return `lesson-prop-l${level}-${slug}`;
}

export function ratioLabel(a: number, b: number) {
  return `${a}:${b}`;
}

export function lesson(
  level: PropTrackLevel,
  slug: string,
  title: string,
  difficulty: PropDifficulty,
  scenes: PropSceneSeed[],
  finalMasteryCheck: PropSceneSeed,
): PropLessonSeed {
  return {
    id: lessonId(level, slug),
    title,
    subject: "Math",
    topic: topicForPropLevel(level),
    level: difficulty,
    propTrackLevel: level,
    scenes,
    finalMasteryCheck,
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
): PropSceneSeed {
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
    masteryTarget: { conceptNodeId: PROP_CONCEPT, skill },
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
): PropSceneSeed {
  return {
    id,
    title,
    type: "drag_drop_match",
    prompt,
    visualPrompt: "Tap a card, then tap a slot.",
    data: { items, slots },
    interaction: "drag_to_place",
    validation: { type: "slot_match", expected },
    feedback,
    masteryTarget: { conceptNodeId: PROP_CONCEPT, skill },
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
): PropSceneSeed {
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
    masteryTarget: { conceptNodeId: PROP_CONCEPT, skill },
  };
}

export function graphScene(
  id: string,
  title: string,
  prompt: string,
  x: number,
  y: number,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
  bounds: GraphBounds = PROP_GRAPH_BOUNDS,
  lines: { x1: number; y1: number; x2: number; y2: number }[] = [],
): PropSceneSeed {
  return {
    id,
    title,
    type: "graph_plot",
    prompt,
    visualPrompt: "Tap the grid to place a point.",
    data: { ...bounds, lines },
    interaction: "place_point",
    validation: { type: "point_match", expectedPoint: { x, y }, tolerance: 0.45 },
    feedback,
    masteryTarget: { conceptNodeId: PROP_CONCEPT, skill },
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
): PropSceneSeed {
  return {
    id,
    title,
    type: "grid_model",
    prompt,
    visualPrompt: "Tap cells to model the ratio.",
    data: { rows, columns },
    interaction: "tap_to_fill",
    validation: { type: "count_match", expectedCount },
    feedback,
    masteryTarget: { conceptNodeId: PROP_CONCEPT, skill },
  };
}

/** Ratio a:b — what does it mean? */
export function ratioSetupLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  context: string,
  difficulty: PropDifficulty = "beginner",
): PropLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Read the ratio",
        `${context}: ratio ${ratioLabel(a, b)} means…`,
        [
          `${a} parts to ${b} parts`,
          `${b} parts to ${a} parts`,
          `${a + b} total only`,
          `${a} × ${b} product`,
        ],
        `${a} parts to ${b} parts`,
        `${slug}_read`,
        {
          correct: `${ratioLabel(a, b)} compares ${a} to ${b}.`,
          incorrect: "Order matters in a ratio.",
          hint: `${a} to ${b}.`,
        },
      ),
      gridScene(
        `${prefix}-2`,
        "Model the ratio",
        `Shade ${a + b} cells: ${a} for the first part, ${b} for the second (${ratioLabel(a, b)}).`,
        2,
        Math.max(a + b, 6),
        a,
        `${slug}_model`,
        {
          correct: `${a} of ${a + b} cells models the first part.`,
          incorrect: `Shade ${a} cells for the first quantity.`,
          hint: `${a} cells.`,
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Total parts",
        `In ${ratioLabel(a, b)}, how many equal parts in all?`,
        [String(a + b), String(a), String(b), String(a * b)],
        String(a + b),
        `${slug}_total_parts`,
        {
          correct: `${a} + ${b} = ${a + b} parts.`,
          incorrect: "Add both parts of the ratio.",
          hint: String(a + b),
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${ratioLabel(a, b)} compares…`,
      [`${a} to ${b}`, `${b} to ${a}`, `${a + b} to 1`, "Equal totals"],
      `${a} to ${b}`,
      `${slug}_mastery`,
      { correct: ratioLabel(a, b), incorrect: "First number : second number.", hint: `${a} to ${b}.` },
    ),
  );
}

/** Scale ratio by factor k. */
export function scaleRatioLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  k: number,
  direction: "up" | "down",
  difficulty: PropDifficulty = "beginner",
): PropLessonSeed {
  const scaledA = a * k;
  const scaledB = b * k;
  const prefix = `l${trackLevel}-${slug}`;
  const verb = direction === "up" ? "Multiply" : "Divide";
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Scale factor",
        `${ratioLabel(a, b)} scaled by ${k} gives…`,
        [ratioLabel(scaledA, scaledB), ratioLabel(a + k, b + k), ratioLabel(a, b * k), ratioLabel(k, k)],
        ratioLabel(scaledA, scaledB),
        `${slug}_scale`,
        {
          correct: `${verb} both parts by ${k}: ${ratioLabel(scaledA, scaledB)}.`,
          incorrect: "Scale both parts by the same factor.",
          hint: ratioLabel(scaledA, scaledB),
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Still equivalent?",
        `${ratioLabel(a, b)} and ${ratioLabel(scaledA, scaledB)} are…`,
        ["Equivalent ratios", "Different ratios", "Only equal if k = 1", "Never comparable"],
        "Equivalent ratios",
        `${slug}_equiv`,
        {
          correct: "Same relationship — equivalent ratios.",
          incorrect: "Scaling keeps the ratio equivalent.",
          hint: "Equivalent.",
        },
      ),
      sortScene(
        `${prefix}-3`,
        "Steps",
        `Order the steps to scale ${ratioLabel(a, b)} by ${k}.`,
        [
          `New second part = ${b} × ${k}`,
          `New first part = ${a} × ${k}`,
          `Write ${ratioLabel(scaledA, scaledB)}`,
        ],
        [`New first part = ${a} × ${k}`, `New second part = ${b} × ${k}`, `Write ${ratioLabel(scaledA, scaledB)}`],
        `${slug}_steps`,
        {
          correct: "Scale each part, then write the ratio.",
          incorrect: "Multiply both parts by k.",
          hint: "Both parts first.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${ratioLabel(a, b)} × ${k} = ?`,
      [ratioLabel(scaledA, scaledB), ratioLabel(a + k, b + k), ratioLabel(a, b), ratioLabel(k, k)],
      ratioLabel(scaledA, scaledB),
      `${slug}_mastery`,
      { correct: ratioLabel(scaledA, scaledB), incorrect: "Multiply both terms.", hint: ratioLabel(scaledA, scaledB) },
    ),
  );
}

/** Mix two ratio parts into a new total. */
export function mixtureLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  multiplier: number,
  difficulty: PropDifficulty = "beginner",
): PropLessonSeed {
  const totalA = a * multiplier;
  const totalB = b * multiplier;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Batch size",
        `Mix ${ratioLabel(a, b)} using multiplier ${multiplier}. First part = ?`,
        [String(totalA), String(totalB), String(a + b), String(multiplier)],
        String(totalA),
        `${slug}_part1`,
        {
          correct: `${a} × ${multiplier} = ${totalA}.`,
          incorrect: "Multiply the first ratio part.",
          hint: String(totalA),
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Second part",
        `Second part = ?`,
        [String(totalB), String(totalA), String(b), String(a)],
        String(totalB),
        `${slug}_part2`,
        {
          correct: `${b} × ${multiplier} = ${totalB}.`,
          incorrect: "Multiply the second ratio part.",
          hint: String(totalB),
        },
      ),
      mcScene(
        `${prefix}-3`,
        "New mixture",
        `The new mixture ratio is still…`,
        [ratioLabel(a, b), ratioLabel(totalA, totalB), ratioLabel(a + b, multiplier), ratioLabel(1, 1)],
        ratioLabel(a, b),
        `${slug}_same`,
        {
          correct: "Equivalent ratio — same relationship.",
          incorrect: "Scaling keeps the ratio.",
          hint: ratioLabel(a, b),
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${ratioLabel(a, b)} with multiplier ${multiplier} → ${ratioLabel(totalA, totalB)}. Equivalent?`,
      ["Yes", "No", "Only if a = b", "Cannot tell"],
      "Yes",
      `${slug}_mastery`,
      { correct: "Equivalent ratios.", incorrect: "Both parts scaled equally.", hint: "Yes." },
    ),
  );
}

/** Match equivalent ratios. */
export function equivalentRatioLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  difficulty: PropDifficulty = "beginner",
): PropLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  const eq1 = ratioLabel(a * 2, b * 2);
  const eq2 = ratioLabel(a * 3, b * 3);
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Same relationship",
        `${ratioLabel(a, b)} = ${eq1} because…`,
        [
          "Both parts doubled",
          "Only the first doubled",
          "Parts were added",
          "Parts were subtracted",
        ],
        "Both parts doubled",
        `${slug}_why`,
        {
          correct: "Multiply both parts by the same number.",
          incorrect: "Equivalent → same multiplier on both.",
          hint: "Both doubled.",
        },
      ),
      matchScene(
        `${prefix}-2`,
        "Match equivalents",
        "Match each ratio to an equivalent.",
        [
          { id: "r1", label: ratioLabel(a, b) },
          { id: "r2", label: ratioLabel(a * 4, b * 4) },
          { id: "e1", label: eq1 },
          { id: "e2", label: eq2 },
        ],
        [
          { id: "s1", label: ratioLabel(a, b) },
          { id: "s2", label: ratioLabel(a * 4, b * 4) },
        ],
        { s1: "e1", s2: "e2" },
        `${slug}_match`,
        {
          correct: "Same scale factor → equivalent.",
          incorrect: "Match equal relationships.",
          hint: `${ratioLabel(a, b)} = ${eq1}.`,
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Simplify",
        `${ratioLabel(a * 2, b * 2)} in simplest form?`,
        [ratioLabel(a, b), ratioLabel(a + 2, b + 2), ratioLabel(2, 2), ratioLabel(a, b * 2)],
        ratioLabel(a, b),
        `${slug}_simp`,
        {
          correct: `Divide both by 2 → ${ratioLabel(a, b)}.`,
          incorrect: "Find the common factor.",
          hint: ratioLabel(a, b),
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${ratioLabel(a, b)} = ${eq2}?`,
      ["Yes", "No", "Only for even numbers", "Only if a = 1"],
      "Yes",
      `${slug}_mastery`,
      { correct: "Triple both parts.", incorrect: "×3 on both.", hint: "Yes." },
    ),
  );
}

/** Recipe scaling: flour:sugar ratio, n batches. */
export function recipeBatchLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  flour: number,
  sugar: number,
  batches: number,
  difficulty: PropDifficulty = "beginner",
): PropLessonSeed {
  const totalFlour = flour * batches;
  const totalSugar = sugar * batches;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "One batch",
        `Recipe ratio flour:sugar = ${ratioLabel(flour, sugar)}. One batch uses ${flour} cups flour. Sugar?`,
        [String(sugar), String(flour), String(flour + sugar), String(batches)],
        String(sugar),
        `${slug}_one`,
        {
          correct: `${ratioLabel(flour, sugar)} → ${sugar} cups sugar.`,
          incorrect: "Read the second part of the ratio.",
          hint: String(sugar),
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Scale up",
        `${batches} batches need ${totalFlour} cups flour. Sugar needed?`,
        [String(totalSugar), String(totalFlour), String(sugar), String(batches)],
        String(totalSugar),
        `${slug}_batch`,
        {
          correct: `${sugar} × ${batches} = ${totalSugar}.`,
          incorrect: "Multiply sugar by batch count.",
          hint: String(totalSugar),
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Ratio holds",
        `${batches} batches still use ratio…`,
        [ratioLabel(flour, sugar), ratioLabel(totalFlour, totalSugar), ratioLabel(batches, batches), "1:1 always"],
        ratioLabel(flour, sugar),
        `${slug}_holds`,
        {
          correct: "Equivalent ratio each batch.",
          incorrect: "Ratio stays the same.",
          hint: ratioLabel(flour, sugar),
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${batches} batches: ${totalFlour} flour, ? sugar`,
      [String(totalSugar), String(totalFlour), String(sugar), String(flour)],
      String(totalSugar),
      `${slug}_mastery`,
      { correct: String(totalSugar), incorrect: `${sugar} × ${batches}.`, hint: String(totalSugar) },
    ),
  );
}

/** Given total and ratio a:b, find parts. */
export function findPartsLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  total: number,
  difficulty: PropDifficulty = "intermediate",
): PropLessonSeed {
  const parts = a + b;
  const unit = total / parts;
  const partA = a * unit;
  const partB = b * unit;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Unit part",
        `Total ${total} split ${ratioLabel(a, b)}. One unit part = ?`,
        [String(unit), String(total), String(a), String(b)],
        String(unit),
        `${slug}_unit`,
        {
          correct: `${total} ÷ ${parts} = ${unit}.`,
          incorrect: "Divide total by sum of ratio parts.",
          hint: String(unit),
        },
      ),
      mcScene(
        `${prefix}-2`,
        "First quantity",
        `The first quantity (${a} parts) = ?`,
        [String(partA), String(partB), String(total), String(a)],
        String(partA),
        `${slug}_first`,
        {
          correct: `${a} × ${unit} = ${partA}.`,
          incorrect: "Multiply unit by first ratio part.",
          hint: String(partA),
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Check total",
        `${partA} + ${partB} = ?`,
        [String(total), String(parts), String(unit), String(partA + partB + 1)],
        String(total),
        `${slug}_check`,
        {
          correct: "Parts add to the total.",
          incorrect: "Verify the split.",
          hint: String(total),
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${total} in ratio ${ratioLabel(a, b)} → larger part = ?`,
      [String(Math.max(partA, partB)), String(Math.min(partA, partB)), String(total), String(parts)],
      String(Math.max(partA, partB)),
      `${slug}_mastery`,
      { correct: String(Math.max(partA, partB)), incorrect: "Find both parts.", hint: String(Math.max(partA, partB)) },
    ),
  );
}

/** Unit rate: quantity per 1 unit. */
export function unitRateLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  totalQty: number,
  units: number,
  unitName: string,
  difficulty: PropDifficulty = "beginner",
): PropLessonSeed {
  const rate = totalQty / units;
  const rateStr = Number.isInteger(rate) ? String(rate) : String(Math.round(rate * 100) / 100);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Per one",
        `${totalQty} ${unitName} in ${units} units → per 1 unit?`,
        [`${rateStr} ${unitName}`, `${totalQty} ${unitName}`, `${units} ${unitName}`, `${totalQty + units} ${unitName}`],
        `${rateStr} ${unitName}`,
        `${slug}_per_one`,
        {
          correct: `${totalQty} ÷ ${units} = ${rateStr}.`,
          incorrect: "Divide total by number of units.",
          hint: `${rateStr} ${unitName}`,
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Use the rate",
        `At ${rateStr} ${unitName} per unit, ${units * 2} units = ?`,
        [String(Number(rateStr) * units * 2), String(totalQty), String(units * 2), rateStr],
        String(Number(rateStr) * units * 2),
        `${slug}_apply`,
        {
          correct: "Multiply unit rate by units.",
          incorrect: "Rate × units.",
          hint: String(Number(rateStr) * units * 2),
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Unit rate name",
        "A unit rate always compares to…",
        ["1 unit", "100 units", "0 units", "The total only"],
        "1 unit",
        `${slug}_def`,
        {
          correct: "Per 1 — that's the unit.",
          incorrect: "Unit rate → divide to get per 1.",
          hint: "1 unit.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${totalQty} for ${units} → unit rate = ?`,
      [rateStr, String(totalQty), String(units), String(totalQty * units)],
      rateStr,
      `${slug}_mastery`,
      { correct: rateStr, incorrect: "Divide.", hint: rateStr },
    ),
  );
}

/** Compare two unit rates. */
export function compareRatesLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  qtyA: number,
  unitsA: number,
  qtyB: number,
  unitsB: number,
  labelA: string,
  labelB: string,
  difficulty: PropDifficulty = "intermediate",
): PropLessonSeed {
  const rateA = qtyA / unitsA;
  const rateB = qtyB / unitsB;
  const better = rateA <= rateB ? labelA : labelB;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Rate A",
        `${labelA}: ${qtyA} in ${unitsA} units → per 1?`,
        [String(rateA), String(qtyA), String(unitsA), String(rateB)],
        String(rateA),
        `${slug}_rate_a`,
        {
          correct: `${qtyA} ÷ ${unitsA} = ${rateA}.`,
          incorrect: "Compute unit rate A.",
          hint: String(rateA),
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Rate B",
        `${labelB}: ${qtyB} in ${unitsB} units → per 1?`,
        [String(rateB), String(qtyB), String(unitsB), String(rateA)],
        String(rateB),
        `${slug}_rate_b`,
        {
          correct: `${qtyB} ÷ ${unitsB} = ${rateB}.`,
          incorrect: "Compute unit rate B.",
          hint: String(rateB),
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Compare",
        `Which has the lower unit rate (better value)?`,
        [better, better === labelA ? labelB : labelA, "Equal always", "Cannot compare"],
        better,
        `${slug}_compare`,
        {
          correct: `${better} — lower per-unit cost.`,
          incorrect: "Compare unit rates.",
          hint: better,
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Lower unit rate wins for cost. ${better}?`,
      ["Yes", "No", "Only for distance", "Rates never compare"],
      "Yes",
      `${slug}_mastery`,
      { correct: "Compare per 1.", incorrect: "Unit rates.", hint: "Yes." },
    ),
  );
}

/** Plot proportional point (x, kx) on graph through origin. */
export function plotProportionalLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  x: number,
  k: number,
  difficulty: PropDifficulty = "beginner",
): PropLessonSeed {
  const y = x * k;
  const prefix = `l${trackLevel}-${slug}`;
  const originLine = [{ x1: 0, y1: 0, x2: 10, y2: 10 * k }];
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Ratio to point",
        `Ratio ${ratioLabel(x, y)} as a point (x, y) = ?`,
        [`(${x}, ${y})`, `(${y}, ${x})`, `(${x}, ${x})`, `(0, ${y})`],
        `(${x}, ${y})`,
        `${slug}_pair`,
        {
          correct: `x = ${x}, y = ${y}.`,
          incorrect: "First coordinate = x, second = y.",
          hint: `(${x}, ${y}).`,
        },
      ),
      graphScene(
        `${prefix}-2`,
        "Plot it",
        `Plot (${x}, ${y}) on the grid.`,
        x,
        y,
        `${slug}_plot`,
        {
          correct: `(${x}, ${y}) on the line through the origin.`,
          incorrect: `Move to x=${x}, y=${y}.`,
          hint: `(${x}, ${y}).`,
        },
        PROP_GRAPH_BOUNDS,
        trackLevel >= 6 ? originLine : [],
      ),
      mcScene(
        `${prefix}-3`,
        "Through origin?",
        `Proportional points lie on a line through…`,
        ["The origin (0, 0)", "(1, 1) only", "The y-axis only", "Any point"],
        "The origin (0, 0)",
        `${slug}_origin`,
        {
          correct: "y = kx passes through (0, 0).",
          incorrect: "Proportional → through origin.",
          hint: "Origin.",
        },
      ),
    ],
    graphScene(
      `${prefix}-final`,
      "Mastery check",
      `Plot (${x}, ${y}).`,
      x,
      y,
      `${slug}_mastery`,
      { correct: "Plotted!", incorrect: "Check coordinates.", hint: `(${x}, ${y}).` },
      PROP_GRAPH_BOUNDS,
      originLine,
    ),
  );
}

/** Constant of proportionality k in y = kx. */
export function constantKLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  x: number,
  y: number,
  difficulty: PropDifficulty = "intermediate",
): PropLessonSeed {
  const k = y / x;
  const kStr = Number.isInteger(k) ? String(k) : String(Math.round(k * 100) / 100);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Find k",
        `Point (${x}, ${y}) on y = kx. k = ?`,
        [kStr, String(x), String(y), String(x + y)],
        kStr,
        `${slug}_k`,
        {
          correct: `k = y ÷ x = ${kStr}.`,
          incorrect: "Divide y by x.",
          hint: kStr,
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Equation",
        `The equation is…`,
        [`y = ${kStr}x`, `y = ${x}x`, `y = x + ${kStr}`, `y = ${kStr} + x`],
        `y = ${kStr}x`,
        `${slug}_eq`,
        {
          correct: `y = ${kStr}x.`,
          incorrect: "k is the multiplier of x.",
          hint: `y = ${kStr}x`,
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Another point",
        `When x = ${x * 2}, y = ?`,
        [String(y * 2), String(y), String(x * 2), kStr],
        String(y * 2),
        `${slug}_next`,
        {
          correct: `y = ${kStr} × ${x * 2} = ${y * 2}.`,
          incorrect: "Use y = kx.",
          hint: String(y * 2),
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Constant of proportionality for (${x}, ${y})?`,
      [kStr, String(x), String(y), "1"],
      kStr,
      `${slug}_mastery`,
      { correct: kStr, incorrect: "y/x.", hint: kStr },
    ),
  );
}

/** Write y = kx from a point. */
export function equationFromPointLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  x: number,
  y: number,
  difficulty: PropDifficulty = "intermediate",
): PropLessonSeed {
  const k = y / x;
  const kStr = Number.isInteger(k) ? String(k) : String(Math.round(k * 100) / 100);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Slope as k",
        `Line through origin and (${x}, ${y}). k = ?`,
        [kStr, String(x), String(y), String(x - y)],
        kStr,
        `${slug}_slope`,
        {
          correct: `k = ${y}/${x} = ${kStr}.`,
          incorrect: "k = y/x for proportional.",
          hint: kStr,
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Write equation",
        `Equation of the relationship?`,
        [`y = ${kStr}x`, `y = ${x}x`, `x = ${kStr}y`, `y = x + ${kStr}`],
        `y = ${kStr}x`,
        `${slug}_write`,
        {
          correct: `y = ${kStr}x.`,
          incorrect: "Proportional form y = kx.",
          hint: `y = ${kStr}x`,
        },
      ),
      graphScene(
        `${prefix}-3`,
        "Graph it",
        `Plot (${x}, ${y}) on y = ${kStr}x.`,
        x,
        y,
        `${slug}_graph`,
        {
          correct: "On the proportional line.",
          incorrect: `Plot (${x}, ${y}).`,
          hint: `(${x}, ${y}).`,
        },
        PROP_GRAPH_BOUNDS,
        [{ x1: 0, y1: 0, x2: 10, y2: 10 * Number(kStr) }],
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `(${x}, ${y}) → y = ?`,
      [`${kStr}x`, `${x}x`, `x + ${kStr}`, `${y}x`],
      `${kStr}x`,
      `${slug}_mastery`,
      { correct: `y = ${kStr}x`, incorrect: "Find k first.", hint: `${kStr}x` },
    ),
  );
}

/** Graph from equation y = kx. */
export function graphFromEquationLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  k: number,
  difficulty: PropDifficulty = "intermediate",
): PropLessonSeed {
  const x = 3;
  const y = k * x;
  const kStr = String(k);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Predict y",
        `y = ${kStr}x. When x = ${x}, y = ?`,
        [String(y), String(x), kStr, String(x + y)],
        String(y),
        `${slug}_predict`,
        {
          correct: `${k} × ${x} = ${y}.`,
          incorrect: "Substitute x into y = kx.",
          hint: String(y),
        },
      ),
      graphScene(
        `${prefix}-2`,
        "Plot a point",
        `Plot (${x}, ${y}) on y = ${kStr}x.`,
        x,
        y,
        `${slug}_plot`,
        {
          correct: `(${x}, ${y}) satisfies y = ${kStr}x.`,
          incorrect: "Use y = kx.",
          hint: `(${x}, ${y}).`,
        },
        PROP_GRAPH_BOUNDS,
        [{ x1: 0, y1: 0, x2: 10, y2: 10 * k }],
      ),
      mcScene(
        `${prefix}-3`,
        "Through origin",
        `y = ${kStr}x passes through…`,
        ["(0, 0)", "(1, 0)", "(0, 1)", `(${k}, 0)`],
        "(0, 0)",
        `${slug}_origin`,
        {
          correct: "Every y = kx line through origin.",
          incorrect: "Plug in x = 0.",
          hint: "(0, 0).",
        },
      ),
    ],
    graphScene(
      `${prefix}-final`,
      "Mastery check",
      `Plot (${x}, ${y}) for y = ${kStr}x.`,
      x,
      y,
      `${slug}_mastery`,
      { correct: "Correct point.", incorrect: "y = kx.", hint: `(${x}, ${y}).` },
      PROP_GRAPH_BOUNDS,
      [{ x1: 0, y1: 0, x2: 10, y2: 10 * k }],
    ),
  );
}

export function levelReviewLesson(
  trackLevel: PropTrackLevel,
  slug: string,
  title: string,
  questions: { prompt: string; choices: string[]; answer: string }[],
  difficulty: PropDifficulty = "beginner",
): PropLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  const scenes = questions.slice(0, 3).map((q, i) =>
    mcScene(`${prefix}-q${i + 1}`, `Review ${i + 1}`, q.prompt, q.choices, q.answer, `${slug}_q${i + 1}`, {
      correct: q.answer,
      incorrect: "Review this level.",
      hint: q.answer,
    }),
  );
  const final = questions[3] ?? questions[0]!;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    scenes,
    mcScene(
      `${prefix}-final`,
      "Level check",
      final.prompt,
      final.choices,
      final.answer,
      `${slug}_mastery`,
      { correct: final.answer, incorrect: "Try again.", hint: final.answer },
    ),
  );
}
