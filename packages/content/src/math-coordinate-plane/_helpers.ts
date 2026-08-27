/** Shared builders for the Math coordinate plane curriculum. */

export type CoordDifficulty = "beginner" | "intermediate";

export type CoordSceneSeed = {
  id: string;
  title: string;
  type:
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

export type CoordTrackLevel = 1 | 2 | 3 | 4 | 5;

export type CoordLessonSeed = {
  id: string;
  title: string;
  subject: "Math";
  topic: string;
  level: CoordDifficulty;
  coordTrackLevel: CoordTrackLevel;
  scenes: CoordSceneSeed[];
  finalMasteryCheck: CoordSceneSeed;
};

export const COORD_CONCEPT = "coordinate-plane";

export type GraphBounds = { xMin: number; xMax: number; yMin: number; yMax: number };

export const QUADRANT1_BOUNDS: GraphBounds = { xMin: 0, xMax: 6, yMin: 0, yMax: 6 };
export const FULL_PLANE_BOUNDS: GraphBounds = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

export function topicForCoordLevel(n: CoordTrackLevel) {
  return `Coordinate Plane (Level ${n})`;
}

export function lessonId(level: CoordTrackLevel, slug: string) {
  return `lesson-coord-l${level}-${slug}`;
}

export function lesson(
  level: CoordTrackLevel,
  slug: string,
  title: string,
  difficulty: CoordDifficulty,
  scenes: CoordSceneSeed[],
  finalMasteryCheck: CoordSceneSeed,
): CoordLessonSeed {
  return {
    id: lessonId(level, slug),
    title,
    subject: "Math",
    topic: topicForCoordLevel(level),
    level: difficulty,
    coordTrackLevel: level,
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
): CoordSceneSeed {
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
    masteryTarget: { conceptNodeId: COORD_CONCEPT, skill },
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
): CoordSceneSeed {
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
    masteryTarget: { conceptNodeId: COORD_CONCEPT, skill },
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
  bounds: GraphBounds = QUADRANT1_BOUNDS,
  lines: { x1: number; y1: number; x2: number; y2: number }[] = [],
): CoordSceneSeed {
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
    masteryTarget: { conceptNodeId: COORD_CONCEPT, skill },
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
): CoordSceneSeed {
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
    masteryTarget: { conceptNodeId: COORD_CONCEPT, skill },
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
): CoordSceneSeed {
  return {
    id,
    title,
    type: "drag_drop_sort",
    prompt,
    visualPrompt: "Drag into the correct order.",
    data: { items },
    interaction: "reorder",
    validation: { type: "ordered_sequence", expectedOrder },
    feedback,
    masteryTarget: { conceptNodeId: COORD_CONCEPT, skill },
  };
}

function pair(x: number, y: number) {
  return `(${x}, ${y})`;
}

function quadrantOf(x: number, y: number): 1 | 2 | 3 | 4 {
  if (x >= 0 && y >= 0) return 1;
  if (x < 0 && y >= 0) return 2;
  if (x < 0 && y < 0) return 3;
  return 4;
}

/** Plot a point lesson: intro MC, plot, identify. */
export function plotPointLesson(
  trackLevel: CoordTrackLevel,
  slug: string,
  title: string,
  x: number,
  y: number,
  bounds: GraphBounds = trackLevel >= 2 ? FULL_PLANE_BOUNDS : QUADRANT1_BOUNDS,
  difficulty: CoordDifficulty = "beginner",
): CoordLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Read the pair",
        `What are the coordinates of a point at x = ${x}, y = ${y}?`,
        [pair(x, y), pair(y, x), pair(-x, y), pair(x, -y)],
        pair(x, y),
        `${slug}_read`,
        {
          correct: `${pair(x, y)} — x first, then y.`,
          incorrect: "Order is (x, y): horizontal, then vertical.",
          hint: `(${x}, ${y}).`,
        },
      ),
      graphScene(
        `${prefix}-2`,
        "Plot the point",
        `Place ${pair(x, y)} on the grid.`,
        x,
        y,
        `${slug}_plot`,
        {
          correct: `${pair(x, y)} plotted.`,
          incorrect: `Move to x = ${x}, y = ${y}.`,
          hint: `${x} across, ${y} up${y < 0 ? " (down if negative)" : ""}.`,
        },
        bounds,
      ),
      mcScene(
        `${prefix}-3`,
        "Which point?",
        `Which point has x = ${x} and y = ${y}?`,
        [pair(x, y), pair(x + 1, y), pair(x, y + 1), pair(y, x)],
        pair(x, y),
        `${slug}_identify`,
        {
          correct: `${pair(x, y)}.`,
          incorrect: "Match both coordinates.",
          hint: pair(x, y),
        },
      ),
    ],
    graphScene(
      `${prefix}-final`,
      "Mastery check",
      `Plot ${pair(x, y)}.`,
      x,
      y,
      `${slug}_mastery`,
      { correct: "Nice plot!", incorrect: "Check x then y.", hint: pair(x, y) },
      bounds,
    ),
  );
}

export function quadrantLesson(
  trackLevel: CoordTrackLevel,
  slug: string,
  title: string,
  x: number,
  y: number,
  difficulty: CoordDifficulty = "beginner",
): CoordLessonSeed {
  const q = quadrantOf(x, y);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Which quadrant?",
        `Point ${pair(x, y)} lies in which quadrant?`,
        ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
        `Quadrant ${["I", "II", "III", "IV"][q - 1]}`,
        `${slug}_quad`,
        {
          correct: `Quadrant ${["I", "II", "III", "IV"][q - 1]} — signs (${x >= 0 ? "+" : "−"}, ${y >= 0 ? "+" : "−"}).`,
          incorrect: "Use the sign of x and y.",
          hint: `Quadrant ${q}.`,
        },
      ),
      graphScene(
        `${prefix}-2`,
        "Plot in quadrant",
        `Plot ${pair(x, y)}.`,
        x,
        y,
        `${slug}_plot`,
        { correct: "Plotted.", incorrect: "Watch the signs.", hint: pair(x, y) },
        FULL_PLANE_BOUNDS,
      ),
      segScene(
        `${prefix}-3`,
        "Sign pattern",
        `In quadrant ${q}, x is ${x >= 0 ? "≥ 0" : "< 0"} and y is ${y >= 0 ? "≥ 0" : "< 0"}.`,
        [
          { id: "yes", label: "Correct sign pattern" },
          { id: "no", label: "Both negative" },
          { id: "mix", label: "Both positive" },
        ],
        "yes",
        `${slug}_signs`,
        { correct: "Signs match the quadrant.", incorrect: "Check x and y signs.", hint: "Correct." },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${pair(x, y)} is in quadrant…`,
      ["I", "II", "III", "IV"],
      ["I", "II", "III", "IV"][q - 1]!,
      `${slug}_mastery`,
      { correct: `Quadrant ${["I", "II", "III", "IV"][q - 1]}.`, incorrect: "Count by signs.", hint: String(q) },
    ),
  );
}

export function horizontalLineLesson(
  trackLevel: CoordTrackLevel,
  slug: string,
  title: string,
  yVal: number,
  difficulty: CoordDifficulty = "intermediate",
): CoordLessonSeed {
  const line = { x1: -5, y1: yVal, x2: 5, y2: yVal };
  const prefix = `l${trackLevel}-${slug}`;
  const sampleX = 2;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Horizontal line",
        `Points with y = ${yVal} form a ___ line.`,
        ["Horizontal", "Vertical", "Diagonal", "Point"],
        "Horizontal",
        `${slug}_type`,
        { correct: "Same y → horizontal.", incorrect: "y constant → flat line.", hint: "Horizontal." },
      ),
      graphScene(
        `${prefix}-2`,
        "Point on the line",
        `The horizontal line y = ${yVal} is drawn. Place a point on it at x = ${sampleX}.`,
        sampleX,
        yVal,
        `${slug}_plot`,
        { correct: `(${sampleX}, ${yVal}) on the line.`, incorrect: `y must be ${yVal}.`, hint: `y = ${yVal}.` },
        FULL_PLANE_BOUNDS,
        [line],
      ),
      mcScene(
        `${prefix}-3`,
        "Which fits?",
        `Which point lies on y = ${yVal}?`,
        [pair(sampleX, yVal), pair(sampleX, yVal + 1), pair(sampleX + 1, yVal + 1), pair(0, 0)],
        pair(sampleX, yVal),
        `${slug}_which`,
        { correct: `y = ${yVal}.`, incorrect: "Same y-coordinate.", hint: pair(sampleX, yVal) },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `y = ${yVal} means every point has…`,
      [`y = ${yVal}`, `x = ${yVal}`, "x = y", "x + y = 0"],
      `y = ${yVal}`,
      `${slug}_mastery`,
      { correct: "Constant y.", incorrect: "Horizontal lines fix y.", hint: `y = ${yVal}.` },
    ),
  );
}

export function verticalLineLesson(
  trackLevel: CoordTrackLevel,
  slug: string,
  title: string,
  xVal: number,
  difficulty: CoordDifficulty = "intermediate",
): CoordLessonSeed {
  const line = { x1: xVal, y1: -5, x2: xVal, y2: 5 };
  const prefix = `l${trackLevel}-${slug}`;
  const sampleY = 3;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Vertical line",
        `Points with x = ${xVal} form a ___ line.`,
        ["Vertical", "Horizontal", "Diagonal", "Circle"],
        "Vertical",
        `${slug}_type`,
        { correct: "Same x → vertical.", incorrect: "x constant → upright line.", hint: "Vertical." },
      ),
      graphScene(
        `${prefix}-2`,
        "Point on the line",
        `The vertical line x = ${xVal} is shown. Place a point on it at y = ${sampleY}.`,
        xVal,
        sampleY,
        `${slug}_plot`,
        { correct: `(${xVal}, ${sampleY}) on the line.`, incorrect: `x must be ${xVal}.`, hint: `x = ${xVal}.` },
        FULL_PLANE_BOUNDS,
        [line],
      ),
      mcScene(
        `${prefix}-3`,
        "Which fits?",
        `Which point lies on x = ${xVal}?`,
        [pair(xVal, sampleY), pair(xVal + 1, sampleY), pair(xVal, sampleY + 1), pair(0, 0)],
        pair(xVal, sampleY),
        `${slug}_which`,
        { correct: `x = ${xVal}.`, incorrect: "Same x-coordinate.", hint: pair(xVal, sampleY) },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `x = ${xVal} means every point has…`,
      [`x = ${xVal}`, `y = ${xVal}`, "x = −y", "y = 0"],
      `x = ${xVal}`,
      `${slug}_mastery`,
      { correct: "Constant x.", incorrect: "Vertical lines fix x.", hint: `x = ${xVal}.` },
    ),
  );
}

export function graphInequalityLesson(
  trackLevel: CoordTrackLevel,
  slug: string,
  title: string,
  axis: "x" | "y",
  boundary: number,
  direction: "gt" | "lt" | "gte" | "lte",
  difficulty: CoordDifficulty = "intermediate",
): CoordLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  const sym = direction === "gt" ? ">" : direction === "lt" ? "<" : direction === "gte" ? "≥" : "≤";
  const varName = axis;
  const ineq = `${varName} ${sym} ${boundary}`;
  const testPoint =
    axis === "x"
      ? direction.startsWith("g")
        ? pair(boundary + 1, 0)
        : pair(boundary - 1, 0)
      : direction.startsWith("g")
        ? pair(0, boundary + 1)
        : pair(0, boundary - 1);
  const region =
    axis === "y"
      ? direction.startsWith("g")
        ? "Above the line"
        : "Below the line"
      : direction.startsWith("g")
        ? "Right of the line"
        : "Left of the line";

  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Read the inequality",
        `${ineq} on the coordinate plane restricts which ${varName}-values?`,
        [
          `${varName} ${sym} ${boundary}`,
          `${varName} = ${boundary} only`,
          axis === "x" ? `y ${sym} ${boundary}` : `x ${sym} ${boundary}`,
          `${varName} ${direction.startsWith("g") ? "<" : ">"} ${boundary}`,
        ],
        `${varName} ${sym} ${boundary}`,
        `${slug}_read`,
        { correct: ineq, incorrect: "Match variable and symbol.", hint: ineq },
      ),
      segScene(
        `${prefix}-2`,
        "Shaded region",
        `Which region satisfies ${ineq}?`,
        [
          { id: "correct", label: region },
          { id: "wrong", label: axis === "y" ? "Below the line" : "Left of the line" },
          { id: "line", label: "Only on the boundary" },
        ],
        "correct",
        `${slug}_region`,
        { correct: region, incorrect: "Think which side of the boundary.", hint: region },
      ),
      mcScene(
        `${prefix}-3`,
        "Test a point",
        `Does ${testPoint} satisfy ${ineq}?`,
        ["Yes", "No", "Only on the boundary", "Cannot tell"],
        "Yes",
        `${slug}_test`,
        { correct: `${testPoint} works.`, incorrect: "Plug in coordinates.", hint: "Yes." },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Which point satisfies ${ineq}?`,
      [testPoint, pair(boundary - (direction.startsWith("g") ? 2 : -2), boundary), pair(0, 0), pair(1, 1)],
      testPoint,
      `${slug}_mastery`,
      { correct: `${testPoint} satisfies ${ineq}.`, incorrect: "Test each coordinate.", hint: testPoint },
    ),
  );
}

export function coordDistanceLesson(
  trackLevel: CoordTrackLevel,
  slug: string,
  title: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  difficulty: CoordDifficulty = "intermediate",
): CoordLessonSeed {
  const dist = Math.round(Math.hypot(x2 - x1, y2 - y1) * 10) / 10;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Distance formula",
        `Distance from ${pair(x1, y1)} to ${pair(x2, y2)}?`,
        [String(dist), String(Math.abs(x2 - x1) + Math.abs(y2 - y1)), String(x2 - x1), String(y2 - y1)],
        String(dist),
        `${slug}_dist`,
        {
          correct: `√((${x2}-${x1})² + (${y2}-${y1})²) = ${dist}.`,
          incorrect: "Use the distance formula.",
          hint: String(dist),
        },
      ),
      graphScene(
        `${prefix}-2`,
        "Plot the second point",
        `Plot ${pair(x2, y2)} (first point ${pair(x1, y1)} is the origin corner for counting).`,
        x2,
        y2,
        `${slug}_plot`,
        { correct: "Points marked.", incorrect: pair(x2, y2), hint: pair(x2, y2) },
        FULL_PLANE_BOUNDS,
      ),
      mcScene(
        `${prefix}-3`,
        "Horizontal run",
        `Horizontal distance from x = ${x1} to x = ${x2}?`,
        [String(Math.abs(x2 - x1)), String(Math.abs(y2 - y1)), String(dist), "0"],
        String(Math.abs(x2 - x1)),
        `${slug}_run`,
        { correct: `|${x2} − ${x1}| = ${Math.abs(x2 - x1)}.`, incorrect: "Difference in x.", hint: String(Math.abs(x2 - x1)) },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Distance ${pair(x1, y1)} to ${pair(x2, y2)}?`,
      [String(dist), String(dist + 1), String(Math.abs(x2 - x1)), "0"],
      String(dist),
      `${slug}_mastery`,
      { correct: `${dist} units.`, incorrect: "Pythagorean theorem.", hint: String(dist) },
    ),
  );
}

export function levelReviewLesson(
  trackLevel: CoordTrackLevel,
  slug: string,
  title: string,
  questions: { prompt: string; choices: string[]; answer: string }[],
  difficulty: CoordDifficulty = "beginner",
): CoordLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  const scenes = questions.slice(0, 3).map((q, i) =>
    mcScene(`${prefix}-q${i + 1}`, `Review ${i + 1}`, q.prompt, q.choices, q.answer, `${slug}_q${i + 1}`, {
      correct: q.answer,
      incorrect: "Review this level's ideas.",
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
      { correct: `${final.answer} — level ${trackLevel} complete!`, incorrect: "Try again.", hint: final.answer },
    ),
  );
}
