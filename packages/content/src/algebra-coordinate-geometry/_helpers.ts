/** Shared builders for the Algebra coordinate geometry curriculum. */

export type CgeoDifficulty = "beginner" | "intermediate";

export type CgeoSceneSeed = {
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

export type CgeoTrackLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CgeoLessonSeed = {
  id: string;
  title: string;
  subject: "Algebra";
  topic: string;
  level: CgeoDifficulty;
  cgeoTrackLevel: CgeoTrackLevel;
  scenes: CgeoSceneSeed[];
  finalMasteryCheck: CgeoSceneSeed;
};

export const CGEO_CONCEPT = "coordinate-geometry";

export type GraphBounds = { xMin: number; xMax: number; yMin: number; yMax: number };

export const QUADRANT1_BOUNDS: GraphBounds = { xMin: 0, xMax: 8, yMin: 0, yMax: 8 };
export const FULL_PLANE_BOUNDS: GraphBounds = { xMin: -8, xMax: 8, yMin: -8, yMax: 8 };

export function topicForCgeoLevel(n: CgeoTrackLevel) {
  return `Coordinate Geometry (Level ${n})`;
}

export function lessonId(level: CgeoTrackLevel, slug: string) {
  return `lesson-cgeo-l${level}-${slug}`;
}

export function lesson(
  level: CgeoTrackLevel,
  slug: string,
  title: string,
  difficulty: CgeoDifficulty,
  scenes: CgeoSceneSeed[],
  finalMasteryCheck: CgeoSceneSeed,
): CgeoLessonSeed {
  return {
    id: lessonId(level, slug),
    title,
    subject: "Algebra",
    topic: topicForCgeoLevel(level),
    level: difficulty,
    cgeoTrackLevel: level,
    scenes,
    finalMasteryCheck,
  };
}

export function pair(x: number, y: number) {
  return `(${x}, ${y})`;
}

export function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.round(Math.hypot(x2 - x1, y2 - y1) * 100) / 100;
}

export function mcScene(
  id: string,
  title: string,
  prompt: string,
  choices: string[],
  expectedChoice: string,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
): CgeoSceneSeed {
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
    masteryTarget: { conceptNodeId: CGEO_CONCEPT, skill },
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
): CgeoSceneSeed {
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
    masteryTarget: { conceptNodeId: CGEO_CONCEPT, skill },
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
  bounds: GraphBounds = FULL_PLANE_BOUNDS,
  lines: { x1: number; y1: number; x2: number; y2: number }[] = [],
): CgeoSceneSeed {
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
    masteryTarget: { conceptNodeId: CGEO_CONCEPT, skill },
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
): CgeoSceneSeed {
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
    masteryTarget: { conceptNodeId: CGEO_CONCEPT, skill },
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
): CgeoSceneSeed {
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
    masteryTarget: { conceptNodeId: CGEO_CONCEPT, skill },
  };
}

export function levelCheckLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  questions: { prompt: string; choices: string[]; answer: string }[],
  difficulty: CgeoDifficulty = "beginner",
): CgeoLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  const scenes = questions.slice(0, 3).map((q, i) =>
    mcScene(`${prefix}-q${i + 1}`, `Check ${i + 1}`, q.prompt, q.choices, q.answer, `${slug}_q${i + 1}`, {
      correct: `${q.answer}.`,
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
    mcScene(`${prefix}-final`, "Level check", final.prompt, final.choices, final.answer, `${slug}_mastery`, {
      correct: `${final.answer} — level ${trackLevel} complete!`,
      incorrect: "One more try.",
      hint: final.answer,
    }),
  );
}

/** Distance between two grid points (horizontal, vertical, or diagonal). */
export function separationLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  difficulty: CgeoDifficulty = "beginner",
): CgeoLessonSeed {
  const d = dist(x1, y1, x2, y2);
  const run = Math.abs(x2 - x1);
  const rise = Math.abs(y2 - y1);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Count units",
        `How many units separate ${pair(x1, y1)} and ${pair(x2, y2)}?`,
        [String(d), String(run + rise), String(run), String(rise)],
        String(d),
        `${slug}_count`,
        {
          correct: `Distance = ${d} units.`,
          incorrect: run === 0 || rise === 0 ? "Count along the axis." : "Use the Pythagorean theorem.",
          hint: String(d),
        },
      ),
      graphScene(
        `${prefix}-2`,
        "Plot the point",
        `Plot ${pair(x2, y2)} (start at ${pair(x1, y1)}).`,
        x2,
        y2,
        `${slug}_plot`,
        { correct: "Point placed.", incorrect: pair(x2, y2), hint: pair(x2, y2) },
      ),
      mcScene(
        `${prefix}-3`,
        "Horizontal run",
        `Horizontal separation from x = ${x1} to x = ${x2}?`,
        [String(run), String(rise), String(d), "0"],
        String(run),
        `${slug}_run`,
        { correct: `|${x2} − ${x1}| = ${run}.`, incorrect: "Difference in x-coordinates.", hint: String(run) },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Distance from ${pair(x1, y1)} to ${pair(x2, y2)}?`,
      [String(d), String(d + 1), String(run), String(rise)],
      String(d),
      `${slug}_mastery`,
      { correct: `${d} units.`, incorrect: "Count or use a² + b² = c².", hint: String(d) },
    ),
  );
}

export function combineSeparationsLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  difficulty: CgeoDifficulty = "beginner",
): CgeoLessonSeed {
  const total = a + b;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Add segments",
        `Walk ${a} units east, then ${b} units east. Total eastward distance?`,
        [String(total), String(a), String(b), String(Math.abs(a - b))],
        String(total),
        `${slug}_add`,
        { correct: `${a} + ${b} = ${total}.`, incorrect: "Same direction → add.", hint: String(total) },
      ),
      mcScene(
        `${prefix}-2`,
        "Perpendicular path",
        `${a} units east then ${b} units north — total straight-line distance?`,
        [String(dist(0, 0, a, b)), String(total), String(a), String(b)],
        String(dist(0, 0, a, b)),
        `${slug}_diag`,
        {
          correct: `√(${a}² + ${b}²) = ${dist(0, 0, a, b)}.`,
          incorrect: "Perpendicular legs → use Pythagorean theorem.",
          hint: String(dist(0, 0, a, b)),
        },
      ),
      sortScene(
        `${prefix}-3`,
        "Path order",
        `Order: start at origin → move ${a} right → move ${b} up → find straight distance.`,
        [`Move ${a} right`, `Move ${b} up`, "Use Pythagorean theorem", "Add a + b for diagonal"],
        [`Move ${a} right`, `Move ${b} up`, "Use Pythagorean theorem"],
        `${slug}_order`,
        { correct: "Build legs, then find hypotenuse.", incorrect: "Diagonal ≠ sum of legs.", hint: "Legs first." },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${a} east + ${b} north → straight distance?`,
      [String(dist(0, 0, a, b)), String(total), String(a), String(b)],
      String(dist(0, 0, a, b)),
      `${slug}_mastery`,
      { correct: `${dist(0, 0, a, b)} units.`, incorrect: "Not a + b.", hint: String(dist(0, 0, a, b)) },
    ),
  );
}

export function closestPointLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  difficulty: CgeoDifficulty = "beginner",
): CgeoLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Nearest point",
        "Which point is closest to (0, 0)?",
        [pair(1, 1), pair(3, 4), pair(5, 0), pair(0, 6)],
        pair(1, 1),
        `${slug}_nearest`,
        { correct: "(1, 1) has the smallest distance.", incorrect: "Compare distances from the origin.", hint: pair(1, 1) },
      ),
      mcScene(
        `${prefix}-2`,
        "On a segment",
        "Point (2, 3) is closest to which corner of the rectangle with corners (0,0), (4,0), (4,5), (0,5)?",
        [pair(0, 0), pair(4, 0), pair(4, 5), pair(0, 5)],
        pair(0, 0),
        `${slug}_corner`,
        {
          correct: "(0, 0) is nearest — smallest combined run and rise.",
          incorrect: "Compare distances to each corner.",
          hint: pair(0, 0),
        },
      ),
      graphScene(
        `${prefix}-3`,
        "Mark closest",
        "Plot the point on the grid closest to (0, 0) among integer points with x + y = 4.",
        1,
        3,
        `${slug}_plot`,
        { correct: "(1, 3) or (2, 2) — (1, 3) works here.", incorrect: "Minimize distance to origin.", hint: pair(1, 3) },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      "Which is closest to (3, 4)?",
      [pair(3, 3), pair(0, 0), pair(6, 8), pair(3, 8)],
      pair(3, 3),
      `${slug}_mastery`,
      { correct: "(3, 3) — only 1 unit away vertically.", incorrect: "Compare each distance.", hint: pair(3, 3) },
    ),
  );
}

export function compareDistanceLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  difficulty: CgeoDifficulty = "beginner",
): CgeoLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Which is farther?",
        "From (0, 0), which point is farther?",
        [pair(5, 0), pair(3, 4), pair(3, 4), pair(2, 2)],
        pair(5, 0),
        `${slug}_farther`,
        {
          correct: "(5, 0) and (3, 4) tie at distance 5 — pick (5, 0) as listed first equal.",
          incorrect: "Compute each distance.",
          hint: "Distance 5.",
        },
      ),
      matchScene(
        `${prefix}-2`,
        "Match distances",
        "Match each point to its distance from (0, 0).",
        [{ id: "a", label: pair(3, 0) }, { id: "b", label: pair(0, 4) }, { id: "c", label: pair(3, 4) }],
        [{ id: "s1", label: "3" }, { id: "s2", label: "4" }, { id: "s3", label: "5" }],
        { s1: "a", s2: "b", s3: "c" },
        `${slug}_match`,
        { correct: "3, 4, and 5 matched.", incorrect: "Use distance formula.", hint: "3-4-5 triangle." },
      ),
      mcScene(
        `${prefix}-3`,
        "Order by distance",
        "Which list orders points from nearest to farthest from (0, 0)?",
        [
          `${pair(1, 1)}, ${pair(3, 0)}, ${pair(3, 4)}`,
          `${pair(3, 4)}, ${pair(1, 1)}, ${pair(3, 0)}`,
          `${pair(3, 0)}, ${pair(3, 4)}, ${pair(1, 1)}`,
          `${pair(1, 1)}, ${pair(3, 4)}, ${pair(3, 0)}`,
        ],
        `${pair(1, 1)}, ${pair(3, 0)}, ${pair(3, 4)}`,
        `${slug}_order`,
        {
          correct: "≈1.41, 3, 5 — increasing.",
          incorrect: "Compare each distance from origin.",
          hint: "Nearest first.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      "Which is farthest from (1, 1)?",
      [pair(4, 5), pair(1, 4), pair(2, 1), pair(0, 1)],
      pair(4, 5),
      `${slug}_mastery`,
      { correct: "(4, 5) — distance ≈ 5.", incorrect: "Compare all four.", hint: pair(4, 5) },
    ),
  );
}

export function estimateDistanceLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  x2: number,
  y2: number,
  difficulty: CgeoDifficulty = "beginner",
): CgeoLessonSeed {
  const exact = dist(0, 0, x2, y2);
  const low = Math.floor(exact);
  const high = Math.ceil(exact);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Rough count",
        `About how far is ${pair(x2, y2)} from the origin?`,
        [`Between ${low} and ${high}`, String(low - 1), String(high + 2), "Exactly 0"],
        `Between ${low} and ${high}`,
        `${slug}_rough`,
        {
          correct: `√(${x2}² + ${y2}²) ≈ ${exact}.`,
          incorrect: "Estimate with a right triangle.",
          hint: `About ${exact}.`,
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Over or under?",
        `Is the true distance from (0,0) to ${pair(x2, y2)} greater than ${low}?`,
        [exact > low ? "Yes" : "No", "Cannot tell", "Always equal", "Zero"],
        exact > low ? "Yes" : "No",
        `${slug}_compare`,
        { correct: `True distance is ${exact}.`, incorrect: "Compare to ${low}.", hint: exact > low ? "Yes" : "No" },
      ),
      graphScene(
        `${prefix}-3`,
        "Plot endpoint",
        `Plot ${pair(x2, y2)} to visualize the separation.`,
        x2,
        y2,
        `${slug}_plot`,
        { correct: "Good plot.", incorrect: pair(x2, y2), hint: pair(x2, y2) },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Best estimate: distance from (0,0) to ${pair(x2, y2)}?`,
      [String(exact), String(x2 + y2), String(Math.abs(x2 - y2)), "1"],
      String(exact),
      `${slug}_mastery`,
      { correct: `${exact} units.`, incorrect: "Not the sum of coordinates.", hint: String(exact) },
    ),
  );
}

export function withinDistanceLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  radius: number,
  difficulty: CgeoDifficulty = "beginner",
): CgeoLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Inside the radius",
        `Which point is within ${radius} units of (0, 0)?`,
        [pair(1, 1), pair(radius + 2, 0), pair(0, radius + 3), pair(radius + 1, radius + 1)],
        pair(1, 1),
        `${slug}_inside`,
        {
          correct: "(1, 1) — distance ≈ 1.41 < " + radius + ".",
          incorrect: `Distance must be ≤ ${radius}.`,
          hint: pair(1, 1),
        },
      ),
      mcScene(
        `${prefix}-2`,
        "On the boundary",
        `Is ${pair(radius, 0)} exactly ${radius} units from (0, 0)?`,
        ["Yes", "No", "Only if radius = 0", "Cannot tell"],
        "Yes",
        `${slug}_boundary`,
        { correct: `Horizontal run = ${radius}.`, incorrect: "On the x-axis, distance = |x|.", hint: "Yes" },
      ),
      graphScene(
        `${prefix}-3`,
        "Plot inside",
        `Plot a point within ${radius} units of (0, 0) in quadrant I.`,
        Math.min(radius - 1, 2),
        1,
        `${slug}_plot`,
        { correct: "Inside the radius.", incorrect: `Stay within ${radius} units.`, hint: "Near the origin." },
        QUADRANT1_BOUNDS,
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Which is NOT within ${radius} units of (0, 0)?`,
      [pair(0, radius - 1), pair(radius - 1, 0), pair(radius + 1, 0), pair(1, 1)],
      pair(radius + 1, 0),
      `${slug}_mastery`,
      { correct: `Distance ${radius + 1} > ${radius}.`, incorrect: "Check each distance.", hint: pair(radius + 1, 0) },
    ),
  );
}

export function distanceRangeLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  difficulty: CgeoDifficulty = "intermediate",
): CgeoLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Between two distances",
        "Points between 3 and 5 units from (0, 0) form…",
        ["A ring (annulus)", "A single circle", "A line segment", "One point"],
        "A ring (annulus)",
        `${slug}_ring`,
        { correct: "All points with 3 < d < 5.", incorrect: "Two radii bound the region.", hint: "Ring." },
      ),
      mcScene(
        `${prefix}-2`,
        "Which fits?",
        "Which point has distance between 2 and 4 from (0, 0)?",
        [pair(3, 0), pair(5, 0), pair(0, 0), pair(1, 0)],
        pair(3, 0),
        `${slug}_fits`,
        { correct: "Distance 3 is between 2 and 4.", incorrect: "Compute distance.", hint: pair(3, 0) },
      ),
      mcScene(
        `${prefix}-3`,
        "Write the range",
        "Distance d from (0, 0) is at most 5. Which inequality works?",
        ["d ≤ 5", "d ≥ 5", "d = 5 only", "d < 0"],
        "d ≤ 5",
        `${slug}_ineq`,
        { correct: "At most 5 → d ≤ 5.", incorrect: "‘At most’ means ≤.", hint: "d ≤ 5" },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      "3 ≤ d ≤ 6 describes points…",
      ["Between circles of radius 3 and 6", "On one circle", "On a line", "At the origin"],
      "Between circles of radius 3 and 6",
      `${slug}_mastery`,
      { correct: "Annulus including both boundaries.", incorrect: "Two radii.", hint: "Ring." },
    ),
  );
}

export function equalDistanceLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  difficulty: CgeoDifficulty = "intermediate",
): CgeoLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Same distance",
        "Which two points are the same distance from (0, 0)?",
        [`${pair(3, 4)} and ${pair(4, 3)}`, `${pair(1, 0)} and ${pair(3, 0)}`, `${pair(2, 2)} and ${pair(3, 4)}`, pair(0, 0)],
        `${pair(3, 4)} and ${pair(4, 3)}`,
        `${slug}_same`,
        { correct: "Both are distance 5.", incorrect: "Compute each distance.", hint: "Both 5." },
      ),
      mcScene(
        `${prefix}-2`,
        "Perpendicular bisector",
        "Points equidistant from (0, 0) and (6, 0) lie on…",
        ["The vertical line x = 3", "The x-axis", "The y-axis", "The line y = 3"],
        "The vertical line x = 3",
        `${slug}_bisect`,
        { correct: "Midpoint x = 3 — perpendicular bisector.", incorrect: "Equal distance from both endpoints.", hint: "x = 3" },
      ),
      graphScene(
        `${prefix}-3`,
        "Plot equidistant",
        "Plot a point equidistant from (0, 0) and (4, 0).",
        2,
        0,
        `${slug}_plot`,
        { correct: "(2, 0) is midpoint on x-axis.", incorrect: "Midpoint of the segment.", hint: pair(2, 0) },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      "Equidistant from (0, 0) and (0, 8)?",
      [pair(0, 4), pair(4, 0), pair(2, 2), pair(0, 0)],
      pair(0, 4),
      `${slug}_mastery`,
      { correct: "(0, 4) — midpoint.", incorrect: "Midpoint on y-axis.", hint: pair(0, 4) },
    ),
  );
}

export function rectangleAreaLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  w: number,
  h: number,
  difficulty: CgeoDifficulty = "beginner",
): CgeoLessonSeed {
  const area = w * h;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Area formula",
        `A ${w} × ${h} rectangle has area…`,
        [String(area), String(w + h), String(2 * (w + h)), String(w - h)],
        String(area),
        `${slug}_area`,
        { correct: `${w} × ${h} = ${area}.`, incorrect: "Area = length × width.", hint: String(area) },
      ),
      mcScene(
        `${prefix}-2`,
        "Missing side",
        `Area = ${area}, width = ${w}. Length = ?`,
        [String(h), String(w), String(area), String(area - w)],
        String(h),
        `${slug}_side`,
        { correct: `${area} ÷ ${w} = ${h}.`, incorrect: "Area ÷ width = length.", hint: String(h) },
      ),
      mcScene(
        `${prefix}-3`,
        "On the grid",
        `A rectangle from (0,0) to (${w}, ${h}) covers how many square units?`,
        [String(area), String(w + h), String(w), String(h)],
        String(area),
        `${slug}_grid`,
        { correct: "Count rows × columns.", incorrect: `${w} by ${h} grid.`, hint: String(area) },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Area of ${w} × ${h}?`,
      [String(area), String(w + h), "1", String(w)],
      String(area),
      `${slug}_mastery`,
      { correct: `${area} square units.`, incorrect: "Multiply.", hint: String(area) },
    ),
  );
}

export function triangleAreaLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  base: number,
  height: number,
  difficulty: CgeoDifficulty = "beginner",
): CgeoLessonSeed {
  const area = (base * height) / 2;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Triangle formula",
        `Base ${base}, height ${height} → area?`,
        [String(area), String(base * height), String(base + height), String(base / height)],
        String(area),
        `${slug}_formula`,
        { correct: `½ × ${base} × ${height} = ${area}.`, incorrect: "Area = ½bh.", hint: String(area) },
      ),
      mcScene(
        `${prefix}-2`,
        "Right triangle on grid",
        `Right triangle with legs ${base} and ${height} on the axes — area?`,
        [String(area), String(base * height), String(base + height), "0"],
        String(area),
        `${slug}_grid`,
        { correct: "Half the bounding rectangle.", incorrect: "½ × leg₁ × leg₂.", hint: String(area) },
      ),
      graphScene(
        `${prefix}-3`,
        "Right angle vertex",
        `Place the right-angle vertex of a triangle with legs along the axes from (0,0) to (${base}, ${height}).`,
        0,
        0,
        `${slug}_plot`,
        { correct: "(0, 0) — where legs meet.", incorrect: "Origin corner.", hint: pair(0, 0) },
        QUADRANT1_BOUNDS,
        [{ x1: 0, y1: 0, x2: base, y2: 0 }, { x1: 0, y1: 0, x2: 0, y2: height }],
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Area: base ${base}, height ${height}?`,
      [String(area), String(base * height), String(base), String(height)],
      String(area),
      `${slug}_mastery`,
      { correct: `${area} square units.`, incorrect: "Don't forget ½.", hint: String(area) },
    ),
  );
}

export function pythagorasSideLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  findHypotenuse: boolean,
  difficulty: CgeoDifficulty = "intermediate",
): CgeoLessonSeed {
  const c = Math.round(Math.hypot(a, b) * 100) / 100;
  const prefix = `l${trackLevel}-${slug}`;
  const answer = findHypotenuse ? String(c) : String(Math.round(Math.sqrt(c * c - a * a) * 100) / 100);
  const prompt = findHypotenuse
    ? `Legs ${a} and ${b} → hypotenuse?`
    : `Hypotenuse ${c}, one leg ${a} → other leg?`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Formula",
        "Pythagorean theorem: a² + b² = …",
        ["c²", "2c", "a + b", "ab"],
        "c²",
        `${slug}_formula`,
        { correct: "c is the hypotenuse.", incorrect: "Squares of legs sum to hypotenuse squared.", hint: "c²" },
      ),
      mcScene(
        `${prefix}-2`,
        "Compute",
        prompt,
        findHypotenuse
          ? [String(c), String(a + b), String(a * b), String(a)]
          : [answer, String(a), String(c + a), "0"],
        answer,
        `${slug}_compute`,
        {
          correct: findHypotenuse ? `${a}² + ${b}² = ${c}² → c = ${c}.` : `Other leg = ${answer}.`,
          incorrect: "Use a² + b² = c².",
          hint: answer,
        },
      ),
      graphScene(
        `${prefix}-3`,
        "On the grid",
        findHypotenuse
          ? `Plot the far corner of a right triangle with legs ${a} and ${b} from (0,0).`
          : `Plot (0, ${answer}) given leg ${a} on the x-axis and hypotenuse ${c}.`,
        findHypotenuse ? a : 0,
        findHypotenuse ? b : Number(answer),
        `${slug}_plot`,
        { correct: "Right triangle on the grid.", incorrect: "Legs along axes.", hint: findHypotenuse ? pair(a, b) : pair(0, Number(answer)) },
        QUADRANT1_BOUNDS,
        findHypotenuse
          ? [{ x1: 0, y1: 0, x2: a, y2: 0 }, { x1: 0, y1: 0, x2: 0, y2: b }]
          : [{ x1: 0, y1: 0, x2: a, y2: 0 }],
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      findHypotenuse ? `Legs 3 and 4 → c = ?` : `c = 5, leg 3 → other leg?`,
      findHypotenuse ? ["5", "7", "12", "1"] : ["4", "2", "8", "3"],
      findHypotenuse ? "5" : "4",
      `${slug}_mastery`,
      { correct: "Classic 3-4-5 triangle.", incorrect: "a² + b² = c².", hint: findHypotenuse ? "5" : "4" },
    ),
  );
}

export function distanceFromOriginLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  x: number,
  y: number,
  difficulty: CgeoDifficulty = "intermediate",
): CgeoLessonSeed {
  const d = dist(0, 0, x, y);
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
        `Distance from (0, 0) to ${pair(x, y)}?`,
        [String(d), String(Math.abs(x) + Math.abs(y)), String(x + y), String(Math.abs(x - y))],
        String(d),
        `${slug}_dist`,
        { correct: `√(${x}² + ${y}²) = ${d}.`, incorrect: "Use Pythagorean theorem.", hint: String(d) },
      ),
      graphScene(
        `${prefix}-2`,
        "Plot the point",
        `Plot ${pair(x, y)}.`,
        x,
        y,
        `${slug}_plot`,
        { correct: "Plotted.", incorrect: pair(x, y), hint: pair(x, y) },
      ),
      mcScene(
        `${prefix}-3`,
        "Legs from origin",
        `Horizontal leg = ${Math.abs(x)}, vertical leg = ${Math.abs(y)}. Hypotenuse = ?`,
        [String(d), String(Math.abs(x) + Math.abs(y)), "0", "1"],
        String(d),
        `${slug}_legs`,
        { correct: `${Math.abs(x)}² + ${Math.abs(y)}² = ${d}².`, incorrect: "Square, sum, square root.", hint: String(d) },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Distance from origin to ${pair(x, y)}?`,
      [String(d), String(x + y), String(Math.abs(x)), String(Math.abs(y))],
      String(d),
      `${slug}_mastery`,
      { correct: `${d} units.`, incorrect: "Not x + y.", hint: String(d) },
    ),
  );
}

export function circleRadiusLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  h: number,
  k: number,
  r: number,
  difficulty: CgeoDifficulty = "intermediate",
): CgeoLessonSeed {
  const eq = `(x − ${h})² + (y − ${k})² = ${r * r}`;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Standard form",
        `Center (${h}, ${k}), radius ${r} → equation?`,
        [eq, `x² + y² = ${r}`, `(x − ${h})² = ${r}`, `x + y = ${r}`],
        eq,
        `${slug}_eq`,
        { correct: "Standard circle form.", incorrect: "(x − h)² + (y − k)² = r².", hint: eq },
      ),
      mcScene(
        `${prefix}-2`,
        "Read the radius",
        `${eq} → radius = ?`,
        [String(r), String(r * r), String(h), String(k)],
        String(r),
        `${slug}_radius`,
        { correct: `r² = ${r * r} → r = ${r}.`, incorrect: "r² is on the right side.", hint: String(r) },
      ),
      graphScene(
        `${prefix}-3`,
        "Plot center",
        `Plot the center (${h}, ${k}).`,
        h,
        k,
        `${slug}_plot`,
        { correct: "Center plotted.", incorrect: pair(h, k), hint: pair(h, k) },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Radius of (x − 1)² + (y − 2)² = 9?`,
      ["3", "9", "1", "2"],
      "3",
      `${slug}_mastery`,
      { correct: "r² = 9 → r = 3.", incorrect: "Square root of 9.", hint: "3" },
    ),
  );
}

export function circlePlotLesson(
  trackLevel: CgeoTrackLevel,
  slug: string,
  title: string,
  h: number,
  k: number,
  r: number,
  plotPoint: { x: number; y: number },
  difficulty: CgeoDifficulty = "intermediate",
): CgeoLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "On the circle",
        `Point ${pair(plotPoint.x, plotPoint.y)} lies on (x − ${h})² + (y − ${k})² = ${r * r}?`,
        [
          dist(h, k, plotPoint.x, plotPoint.y) === r ? "Yes" : "No",
          dist(h, k, plotPoint.x, plotPoint.y) === r ? "No" : "Yes",
          "Maybe",
          "Always",
        ],
        dist(h, k, plotPoint.x, plotPoint.y) === r ? "Yes" : "No",
        `${slug}_on`,
        {
          correct: `Distance from center = ${dist(h, k, plotPoint.x, plotPoint.y)}.`,
          incorrect: "Check distance from center.",
          hint: dist(h, k, plotPoint.x, plotPoint.y) === r ? "Yes" : "No",
        },
      ),
      graphScene(
        `${prefix}-2`,
        "Plot on circle",
        `Plot a point on the circle centered at (${h}, ${k}) with radius ${r}.`,
        plotPoint.x,
        plotPoint.y,
        `${slug}_plot`,
        { correct: "On the circle.", incorrect: "Distance from center = radius.", hint: pair(plotPoint.x, plotPoint.y) },
      ),
      mcScene(
        `${prefix}-3`,
        "Center",
        `(x − ${h})² + (y − ${k})² = ${r * r} has center…`,
        [pair(h, k), pair(0, 0), pair(r, r), pair(h, r)],
        pair(h, k),
        `${slug}_center`,
        { correct: `Center (${h}, ${k}).`, incorrect: "Read h and k from the equation.", hint: pair(h, k) },
      ),
    ],
    graphScene(
      `${prefix}-final`,
      "Mastery check",
      `Plot the center of x² + y² = ${r * r}.`,
      0,
      0,
      `${slug}_mastery`,
      { correct: "(0, 0).", incorrect: "Origin.", hint: pair(0, 0) },
    ),
  );
}
