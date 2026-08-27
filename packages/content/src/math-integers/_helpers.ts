/** Shared builders for the Math negative numbers / integers curriculum. */

export type IntegerDifficulty = "beginner" | "intermediate";

export type IntegerSceneSeed = {
  id: string;
  title: string;
  type:
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

export type IntegerTrackLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type IntegerLessonSeed = {
  id: string;
  title: string;
  subject: "Math";
  topic: string;
  level: IntegerDifficulty;
  integerTrackLevel: IntegerTrackLevel;
  scenes: IntegerSceneSeed[];
  finalMasteryCheck: IntegerSceneSeed;
};

export const INTEGERS_CONCEPT = "integers";

export function topicForIntegerLevel(n: IntegerTrackLevel) {
  return `Negative Numbers (Level ${n})`;
}

export function lessonId(level: IntegerTrackLevel, slug: string) {
  return `lesson-integers-l${level}-${slug}`;
}

export function lesson(
  level: IntegerTrackLevel,
  slug: string,
  title: string,
  difficulty: IntegerDifficulty,
  scenes: IntegerSceneSeed[],
  finalMasteryCheck: IntegerSceneSeed,
): IntegerLessonSeed {
  return {
    id: lessonId(level, slug),
    title,
    subject: "Math",
    topic: topicForIntegerLevel(level),
    level: difficulty,
    integerTrackLevel: level,
    scenes,
    finalMasteryCheck,
  };
}

const NL_MIN = -10;
const NL_MAX = 10;
const NL_STEP = 1;

export function mcScene(
  id: string,
  title: string,
  prompt: string,
  choices: string[],
  expectedChoice: string,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
): IntegerSceneSeed {
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
    masteryTarget: { conceptNodeId: INTEGERS_CONCEPT, skill },
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
): IntegerSceneSeed {
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
    masteryTarget: { conceptNodeId: INTEGERS_CONCEPT, skill },
  };
}

export function nlScene(
  id: string,
  title: string,
  prompt: string,
  x: number,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
  bounds = { min: NL_MIN, max: NL_MAX, step: NL_STEP },
): IntegerSceneSeed {
  return {
    id,
    title,
    type: "number_line",
    prompt,
    visualPrompt: "Drag the marker to the correct integer.",
    data: bounds,
    interaction: "place_point",
    validation: { type: "point_match", expectedPoint: { x, y: 0 }, tolerance: 0.08 },
    feedback,
    masteryTarget: { conceptNodeId: INTEGERS_CONCEPT, skill },
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
): IntegerSceneSeed {
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
    masteryTarget: { conceptNodeId: INTEGERS_CONCEPT, skill },
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
): IntegerSceneSeed {
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
    masteryTarget: { conceptNodeId: INTEGERS_CONCEPT, skill },
  };
}

function fmt(n: number) {
  return n >= 0 ? `${n}` : `${n}`;
}

function addPrompt(a: number, b: number) {
  return `What is ${fmt(a)} + (${fmt(b)})?`;
}

function subPrompt(a: number, b: number) {
  return `What is ${fmt(a)} − ${fmt(b)}?`;
}

function mcAdd(a: number, b: number, distractors: number[]) {
  const sum = a + b;
  const choices = [...new Set([String(sum), ...distractors.map(String)])].slice(0, 4);
  while (choices.length < 4) choices.push(String(sum + choices.length));
  return { choices, expected: String(sum) };
}

function mcSub(a: number, b: number, distractors: number[]) {
  const diff = a - b;
  const choices = [...new Set([String(diff), ...distractors.map(String)])].slice(0, 4);
  while (choices.length < 4) choices.push(String(diff - choices.length));
  return { choices, expected: String(diff) };
}

/** Standard add-integers lesson: number line, MC, match. */
export function addIntegersLesson(
  trackLevel: IntegerTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  difficulty: IntegerDifficulty = "beginner",
): IntegerLessonSeed {
  const sum = a + b;
  const prefix = `l${trackLevel}-${slug}`;
  const mc = mcAdd(a, b, [sum + 1, sum - 1, a - b]);
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      nlScene(
        `${prefix}-1`,
        "On the number line",
        `Start at ${fmt(a)}. Move ${b >= 0 ? "right" : "left"} ${Math.abs(b)}. Where do you land?`,
        sum,
        `${slug}_nl`,
        {
          correct: `${fmt(a)} + (${fmt(b)}) = ${sum}.`,
          incorrect: `From ${fmt(a)}, move ${Math.abs(b)} ${b >= 0 ? "right" : "left"}.`,
          hint: `Count ${Math.abs(b)} tick marks from ${fmt(a)}.`,
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Compute the sum",
        addPrompt(a, b),
        mc.choices,
        mc.expected,
        `${slug}_mc`,
        {
          correct: `${fmt(a)} + (${fmt(b)}) = ${sum}.`,
          incorrect: "Add the signed values.",
          hint: b >= 0 ? "Move right on the number line." : "Adding a negative moves left.",
        },
      ),
      segScene(
        `${prefix}-3`,
        "Sign of the result",
        addPrompt(a, b),
        [
          { id: "pos", label: "Positive" },
          { id: "neg", label: "Negative" },
          { id: "zero", label: "Zero" },
        ],
        sum > 0 ? "pos" : sum < 0 ? "neg" : "zero",
        `${slug}_sign`,
        {
          correct: sum === 0 ? "The sum is zero." : sum > 0 ? "Positive sum." : "Negative sum.",
          incorrect: "Check the sign of the result.",
          hint: `The answer is ${sum}.`,
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      addPrompt(a, b),
      mc.choices,
      mc.expected,
      `${slug}_mastery`,
      {
        correct: `${fmt(a)} + (${fmt(b)}) = ${sum}.`,
        incorrect: "Add carefully — watch the signs.",
        hint: `Result: ${sum}.`,
      },
    ),
  );
}

/** Standard subtract-integers lesson. */
export function subIntegersLesson(
  trackLevel: IntegerTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  difficulty: IntegerDifficulty = "beginner",
): IntegerLessonSeed {
  const diff = a - b;
  const prefix = `l${trackLevel}-${slug}`;
  const mc = mcSub(a, b, [diff + 2, diff - 2, a + b]);
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Subtract",
        subPrompt(a, b),
        mc.choices,
        mc.expected,
        `${slug}_mc1`,
        {
          correct: `${fmt(a)} − ${fmt(b)} = ${diff}.`,
          incorrect: "Subtract the second number from the first.",
          hint: `Think: ${fmt(a)} + (${fmt(-b)}).`,
        },
      ),
      nlScene(
        `${prefix}-2`,
        "Number line move",
        `Start at ${fmt(a)}. Move left ${Math.abs(b)} if subtracting ${fmt(b)} — where do you land?`,
        diff,
        `${slug}_nl`,
        {
          correct: `${fmt(a)} − ${fmt(b)} = ${diff}.`,
          incorrect: "Subtracting moves opposite the sign of the number removed.",
          hint: `Land on ${diff}.`,
        },
      ),
      mcScene(
        `${prefix}-3`,
        "As addition",
        `${fmt(a)} − ${fmt(b)} is the same as ${fmt(a)} + (?)`,
        [`${-b}`, `${b}`, `${a}`, `${b - a}`],
        `${-b}`,
        `${slug}_rewrite`,
        {
          correct: `Subtracting ${fmt(b)} = adding ${fmt(-b)}.`,
          incorrect: "Flip the sign of the subtracted number.",
          hint: `− ${fmt(b)} = + (${fmt(-b)}).`,
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      subPrompt(a, b),
      mc.choices,
      mc.expected,
      `${slug}_mastery`,
      {
        correct: `${fmt(a)} − ${fmt(b)} = ${diff}.`,
        incorrect: "Check your subtraction.",
        hint: `Answer: ${diff}.`,
      },
    ),
  );
}

/** Opposites and absolute value helpers. */
export function oppositesLesson(
  trackLevel: IntegerTrackLevel,
  slug: string,
  title: string,
  n: number,
  difficulty: IntegerDifficulty = "beginner",
): IntegerLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  const opp = -n;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Find the opposite",
        `What is the opposite of ${fmt(n)}?`,
        [String(opp), String(n), String(Math.abs(n)), "0"],
        String(opp),
        `${slug}_opp`,
        {
          correct: `Opposite of ${fmt(n)} is ${fmt(opp)} — same distance from 0, other direction.`,
          incorrect: "Opposites sum to zero.",
          hint: `Flip the sign: ${fmt(opp)}.`,
        },
      ),
      matchScene(
        `${prefix}-2`,
        "Match opposites",
        "Pair each integer with its opposite.",
        [
          { id: "a", label: fmt(n) },
          { id: "b", label: fmt(opp) },
          { id: "c", label: fmt(n + 1) },
          { id: "d", label: fmt(-(n + 1)) },
        ],
        [
          { id: "slot1", label: fmt(n) },
          { id: "slot2", label: fmt(n + 1) },
        ],
        { slot1: "b", slot2: "d" },
        `${slug}_match`,
        {
          correct: `${fmt(n)} ↔ ${fmt(opp)} and ${fmt(n + 1)} ↔ ${fmt(-(n + 1))}.`,
          incorrect: "Opposites are the same distance from zero.",
          hint: "Flip each sign.",
        },
      ),
      nlScene(
        `${prefix}-3`,
        "Plot the opposite",
        `Place ${fmt(opp)} on the number line (opposite of ${fmt(n)}).`,
        opp,
        `${slug}_nl`,
        {
          correct: `${fmt(opp)} mirrors ${fmt(n)} across 0.`,
          incorrect: `Opposite of ${fmt(n)} is ${fmt(opp)}.`,
          hint: `Plot ${fmt(opp)}.`,
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${fmt(n)} + (?) = 0`,
      [String(opp), String(n), String(Math.abs(n)), "1"],
      String(opp),
      `${slug}_mastery`,
      {
        correct: `${fmt(n)} + ${fmt(opp)} = 0.`,
        incorrect: "Opposites cancel to zero.",
        hint: `Add ${fmt(opp)}.`,
      },
    ),
  );
}

export function absValueLesson(
  trackLevel: IntegerTrackLevel,
  slug: string,
  title: string,
  n: number,
  difficulty: IntegerDifficulty = "beginner",
): IntegerLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  const abs = Math.abs(n);
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Absolute value",
        `|${fmt(n)}| = ?`,
        [String(abs), String(n), String(-abs), "0"],
        String(abs),
        `${slug}_abs`,
        {
          correct: `|${fmt(n)}| = ${abs} — distance from 0, always non-negative.`,
          incorrect: "Absolute value drops the sign.",
          hint: `Distance from 0 is ${abs}.`,
        },
      ),
      nlScene(
        `${prefix}-2`,
        "Distance from zero",
        `Mark the point ${abs} units from 0 on the positive side.`,
        abs,
        `${slug}_nl`,
        {
          correct: `|${fmt(n)}| = ${abs}.`,
          incorrect: "Absolute value is the distance from zero.",
          hint: `Plot ${abs}.`,
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Compare",
        `Which is larger: |${fmt(n)}| or ${fmt(n)}?`,
        n >= 0 ? [`|${fmt(n)}|`, `${fmt(n)}`, "Equal", "Cannot tell"] : [`|${fmt(n)}|`, `${fmt(n)}`, "Equal", "Cannot tell"],
        n >= 0 ? "Equal" : `|${fmt(n)}|`,
        `${slug}_compare`,
        {
          correct: n >= 0 ? "For non-negatives, |x| = x." : "Distance is positive: |x| > x when x < 0.",
          incorrect: "Compare value vs distance from 0.",
          hint: `|${fmt(n)}| = ${abs}.`,
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `|${fmt(n)}| = ?`,
      [String(abs), String(n), String(-n), String(n * 2)],
      String(abs),
      `${slug}_mastery`,
      { correct: `${abs}.`, incorrect: "Drop the sign.", hint: `|${fmt(n)}| = ${abs}.` },
    ),
  );
}

export function orderIntegersLesson(
  trackLevel: IntegerTrackLevel,
  slug: string,
  title: string,
  values: number[],
  difficulty: IntegerDifficulty = "beginner",
): IntegerLessonSeed {
  const sorted = [...values].sort((a, b) => a - b);
  const labels = values.map(fmt);
  const expectedOrder = sorted.map(fmt);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      sortScene(
        `${prefix}-1`,
        "Least to greatest",
        "Order these integers from least to greatest.",
        labels,
        expectedOrder,
        `${slug}_sort`,
        {
          correct: `Order: ${expectedOrder.join(", ")}.`,
          incorrect: "Negatives are left of positives on the number line.",
          hint: "Start with the smallest.",
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Which is smallest?",
        `Which is the least: ${labels.join(", ")}?`,
        labels,
        fmt(sorted[0]!),
        `${slug}_min`,
        {
          correct: `${fmt(sorted[0]!)} is smallest.`,
          incorrect: "Leftmost on the number line is least.",
          hint: "Compare signs first.",
        },
      ),
      nlScene(
        `${prefix}-3`,
        "Leftmost value",
        `Place the smallest of {${labels.join(", ")}} on the number line.`,
        sorted[0]!,
        `${slug}_nl`,
        {
          correct: `${fmt(sorted[0]!)} is leftmost.`,
          incorrect: "Pick the least value.",
          hint: `Plot ${fmt(sorted[0]!)}.`,
        },
      ),
    ],
    sortScene(
      `${prefix}-final`,
      "Mastery check",
      "Order from least to greatest.",
      labels,
      expectedOrder,
      `${slug}_mastery`,
      {
        correct: `${expectedOrder.join(" < ")}.`,
        incorrect: "Use the number line order.",
        hint: "Negatives before positives.",
      },
    ),
  );
}

export function distanceLesson(
  trackLevel: IntegerTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  difficulty: IntegerDifficulty = "intermediate",
): IntegerLessonSeed {
  const dist = Math.abs(a - b);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Distance",
        `How far apart are ${fmt(a)} and ${fmt(b)}?`,
        [String(dist), String(a - b), String(a + b), String(Math.abs(a + b))],
        String(dist),
        `${slug}_dist`,
        {
          correct: `|${fmt(a)} − ${fmt(b)}| = ${dist}.`,
          incorrect: "Distance is always non-negative.",
          hint: `|${a - b}| = ${dist}.`,
        },
      ),
      nlScene(
        `${prefix}-2`,
        "Count the units",
        `Mark a point ${dist} units from ${fmt(a)} toward ${fmt(b)}.`,
        b,
        `${slug}_nl`,
        {
          correct: `${dist} units between ${fmt(a)} and ${fmt(b)}.`,
          incorrect: "Count tick marks between the integers.",
          hint: `End at ${fmt(b)}.`,
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Absolute value form",
        `Distance between ${fmt(a)} and ${fmt(b)} equals |${fmt(a)} − (?) |`,
        [String(b), String(-b), String(a), String(dist)],
        String(b),
        `${slug}_formula`,
        {
          correct: `|${fmt(a)} − ${fmt(b)}| = ${dist}.`,
          incorrect: "Subtract, then take absolute value.",
          hint: `Use ${fmt(b)}.`,
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Distance from ${fmt(a)} to ${fmt(b)}?`,
      [String(dist), String(a - b), String(-dist), String(a + b)],
      String(dist),
      `${slug}_mastery`,
      { correct: `${dist} units.`, incorrect: "|difference| gives distance.", hint: `${dist}.` },
    ),
  );
}

export function levelReviewLesson(
  trackLevel: IntegerTrackLevel,
  slug: string,
  title: string,
  questions: { prompt: string; choices: string[]; answer: string }[],
  difficulty: IntegerDifficulty = "beginner",
): IntegerLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  const scenes = questions.slice(0, 3).map((q, i) =>
    mcScene(`${prefix}-q${i + 1}`, `Review ${i + 1}`, q.prompt, q.choices, q.answer, `${slug}_q${i + 1}`, {
      correct: `Correct: ${q.answer}.`,
      incorrect: "Try again — use what you learned this level.",
      hint: "Review the level topics.",
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
      "Level review",
      final.prompt,
      final.choices,
      final.answer,
      `${slug}_mastery`,
      {
        correct: `${final.answer} — level ${trackLevel} complete!`,
        incorrect: "One more try.",
        hint: final.answer,
      },
    ),
  );
}

export function expressionOrderLesson(
  trackLevel: IntegerTrackLevel,
  slug: string,
  title: string,
  terms: string[],
  expectedOrder: string[],
  finalPrompt: string,
  finalAnswer: string,
  finalChoices: string[],
  difficulty: IntegerDifficulty = "intermediate",
): IntegerLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      sortScene(
        `${prefix}-1`,
        "Reorder terms",
        "Arrange these terms for easier mental math.",
        terms,
        expectedOrder,
        `${slug}_sort`,
        {
          correct: "Grouping positives and negatives separately helps.",
          incorrect: "Look for opposites that cancel.",
          hint: "Combine like signs first.",
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Commutative property",
        "When adding integers, you can…",
        ["Reorder addends", "Only add left to right", "Never swap negatives", "Skip zero terms only"],
        "Reorder addends",
        `${slug}_comm`,
        {
          correct: "Addition is commutative — order of addends can change.",
          incorrect: "a + b = b + a for integers.",
          hint: "Swap order freely when adding.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Rewrite subtraction",
        "a − b equals…",
        ["a + (−b)", "a + b", "b − a", "−a − b"],
        "a + (−b)",
        `${slug}_rewrite`,
        {
          correct: "Subtracting b = adding the opposite of b.",
          incorrect: "Flip the sign of the subtracted number.",
          hint: "a − b = a + (−b).",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      finalPrompt,
      finalChoices,
      finalAnswer,
      `${slug}_mastery`,
      { correct: finalAnswer, incorrect: "Apply order and sign rules.", hint: finalAnswer },
    ),
  );
}
