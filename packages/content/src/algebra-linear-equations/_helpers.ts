/** Shared builders for the Algebra linear equations curriculum (Visual Problem Engine). */

export type LineqDifficulty = "beginner" | "intermediate";

export type LineqSceneSeed = {
  id: string;
  title: string;
  type:
    | "balance_scale"
    | "fraction_bar"
    | "number_line"
    | "graph_plot"
    | "multiple_choice"
    | "segment_select"
    | "drag_drop_sort"
    | "drag_drop_match"
    | "gear";
  prompt: string;
  visualPrompt: string;
  data: Record<string, unknown>;
  interaction: "tap_to_fill" | "place_point" | "select_choice" | "reorder" | "drag_to_place";
  validation: Record<string, unknown> & { type: string };
  feedback: { correct: string; incorrect: string; hint?: string };
  masteryTarget: { conceptNodeId: string; skill: string };
};

export type LineqTrackLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type LineqLessonSeed = {
  id: string;
  title: string;
  subject: "Algebra";
  topic: string;
  level: LineqDifficulty;
  lineqTrackLevel: LineqTrackLevel;
  scenes: LineqSceneSeed[];
  finalMasteryCheck: LineqSceneSeed;
};

export const LINEQ_CONCEPT = "linear-equations";

export function topicForLineqLevel(n: LineqTrackLevel) {
  return `Linear Equations (Level ${n})`;
}

export function lessonId(level: LineqTrackLevel, slug: string) {
  return `lesson-lineq-l${level}-${slug}`;
}

export function lesson(
  level: LineqTrackLevel,
  slug: string,
  title: string,
  difficulty: LineqDifficulty,
  scenes: LineqSceneSeed[],
  finalMasteryCheck: LineqSceneSeed,
): LineqLessonSeed {
  return {
    id: lessonId(level, slug),
    title,
    subject: "Algebra",
    topic: topicForLineqLevel(level),
    level: difficulty,
    lineqTrackLevel: level,
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
): LineqSceneSeed {
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
    masteryTarget: { conceptNodeId: LINEQ_CONCEPT, skill },
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
): LineqSceneSeed {
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
    masteryTarget: { conceptNodeId: LINEQ_CONCEPT, skill },
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
): LineqSceneSeed {
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
    masteryTarget: { conceptNodeId: LINEQ_CONCEPT, skill },
  };
}

export function balanceScene(
  id: string,
  title: string,
  prompt: string,
  opts: {
    weights: number[];
    fixedLeft?: number[];
    fixedRight?: number[];
    left: number[];
    right: number[];
    unit?: string;
  },
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
  visualPrompt = "Drag weights onto the pans until the scale balances.",
): LineqSceneSeed {
  return {
    id,
    title,
    type: "balance_scale",
    prompt,
    visualPrompt,
    data: {
      weights: opts.weights,
      fixedLeft: opts.fixedLeft ?? [],
      fixedRight: opts.fixedRight ?? [],
      unit: opts.unit ?? "",
    },
    interaction: "drag_to_place",
    validation: { type: "balance_match", left: opts.left, right: opts.right },
    feedback,
    masteryTarget: { conceptNodeId: LINEQ_CONCEPT, skill },
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
): LineqSceneSeed {
  return {
    id,
    title,
    type: "number_line",
    prompt,
    visualPrompt: "Drag the marker to the solution set boundary.",
    data: { min, max, step },
    interaction: "place_point",
    validation: { type: "point_match", expectedPoint: { x, y: 0 }, tolerance: 0.08 },
    feedback,
    masteryTarget: { conceptNodeId: LINEQ_CONCEPT, skill },
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
  bounds = { xMin: -2, xMax: 6, yMin: -2, yMax: 6 },
): LineqSceneSeed {
  return {
    id,
    title,
    type: "graph_plot",
    prompt,
    visualPrompt: "Place a point on the coordinate grid.",
    data: { ...bounds, lines: [] },
    interaction: "place_point",
    validation: { type: "point_match", expectedPoint: { x, y }, tolerance: 0.45 },
    feedback,
    masteryTarget: { conceptNodeId: LINEQ_CONCEPT, skill },
  };
}

export function levelReviewLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  questions: { prompt: string; choices: string[]; answer: string }[],
  difficulty: LineqDifficulty = "beginner",
): LineqLessonSeed {
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

/** Standard 3-scene + final pack for x + a = b style equations. */
export function balanceAddLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  difficulty: LineqDifficulty = "beginner",
): LineqLessonSeed {
  const x = b - a;
  const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((w) => w <= Math.max(b, 12));
  if (!weights.includes(x)) weights.push(x);
  if (!weights.includes(b)) weights.push(b);
  weights.sort((p, q) => p - q);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      balanceScene(
        `${prefix}-1`,
        `x + ${a} = ${b}`,
        `Fixed ${a} on the left. Add the unknown weight x so the scale balances ${b} on the right.`,
        { weights, fixedLeft: [a], fixedRight: [b], left: [a, x], right: [b] },
        `${slug}_balance`,
        {
          correct: `${a} + ${x} = ${b}, so x = ${x}.`,
          incorrect: `Find w so ${a} + w = ${b}.`,
          hint: `${b} − ${a} = ${x}.`,
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Name x",
        `In x + ${a} = ${b}, what is x?`,
        [String(x), String(a), String(b), String(a + b)],
        String(x),
        `${slug}_name_x`,
        {
          correct: `x = ${x}.`,
          incorrect: `Subtract ${a} from both sides.`,
          hint: `${b} − ${a}.`,
        },
      ),
      balanceScene(
        `${prefix}-3`,
        "Check balance",
        `Show ${a} + x = ${b} again with weights on the scale.`,
        { weights, fixedLeft: [a], fixedRight: [b], left: [a, x], right: [b] },
        `${slug}_check`,
        {
          correct: "Level scale — equation and picture match.",
          incorrect: `Left pan should total ${b}.`,
          hint: `Add a ${x}-weight to the left.`,
        },
      ),
    ],
    balanceScene(
      `${prefix}-final`,
      "Mastery check",
      `Solve x + ${a} = ${b} on the balance scale.`,
      { weights, fixedLeft: [a], fixedRight: [b], left: [a, x], right: [b] },
      `${slug}_mastery`,
      {
        correct: `x = ${x} — ${title} complete.`,
        incorrect: `${b} − ${a} = ${x}.`,
        hint: `Place ${x} on the left pan.`,
      },
    ),
  );
}

/** nx = b style */
export function balanceMultLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  n: number,
  total: number,
  difficulty: LineqDifficulty = "beginner",
): LineqLessonSeed {
  const x = total / n;
  const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].filter((w) => w <= Math.max(total, 12));
  const prefix = `l${trackLevel}-${slug}`;
  const left = Array(n).fill(x) as number[];
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      balanceScene(
        `${prefix}-1`,
        `${n}x = ${total}`,
        `Place ${n} equal weights on the left to balance ${total} on the right.`,
        { weights, fixedRight: [total], left, right: [total] },
        `${slug}_mult`,
        {
          correct: `${n} × ${x} = ${total}, so x = ${x}.`,
          incorrect: `Split ${total} into ${n} equal parts.`,
          hint: `${total} ÷ ${n} = ${x}.`,
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Value of x",
        `${n}x = ${total}. What is x?`,
        [String(x), String(n), String(total), String(n + total)],
        String(x),
        `${slug}_value`,
        {
          correct: `x = ${x}.`,
          incorrect: `Divide both sides by ${n}.`,
          hint: `${total} ÷ ${n}.`,
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Read the equation",
        `${n} identical x-weights sum to ${total}. Which equation matches?`,
        [`${n}x = ${total}`, `x + ${n} = ${total}`, `${total}x = ${n}`, `x = ${n + total}`],
        `${n}x = ${total}`,
        `${slug}_read`,
        {
          correct: `${n}x = ${total} — ${n} copies of x.`,
          incorrect: "Repeated addition becomes multiplication.",
          hint: `${n} groups of x.`,
        },
      ),
    ],
    balanceScene(
      `${prefix}-final`,
      "Mastery check",
      `Balance ${n}x = ${total} on the scale.`,
      { weights, fixedRight: [total], left, right: [total] },
      `${slug}_mastery`,
      {
        correct: `x = ${x}.`,
        incorrect: `${n} equal weights summing to ${total}.`,
        hint: `Each weight should be ${x}.`,
      },
    ),
  );
}

/** ax + b = c style */
export function balanceTwoStepLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  c: number,
  difficulty: LineqDifficulty = "intermediate",
): LineqLessonSeed {
  const x = (c - b) / a;
  const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16];
  const prefix = `l${trackLevel}-${slug}`;
  const left = [...Array(a).fill(x), b];
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      balanceScene(
        `${prefix}-1`,
        `${a}x + ${b} = ${c}`,
        `Fixed ${b} on the left. Add ${a} equal x-weights to balance ${c}.`,
        { weights, fixedLeft: [b], fixedRight: [c], left, right: [c] },
        `${slug}_two_step`,
        {
          correct: `${a}(${x}) + ${b} = ${c}.`,
          incorrect: `Left must sum to ${c}.`,
          hint: `${c} − ${b} = ${a * x}; divide by ${a}.`,
        },
      ),
      sortScene(
        `${prefix}-2`,
        "Solve in order",
        `Order the steps to solve ${a}x + ${b} = ${c}.`,
        [
          `x = ${x}`,
          `Subtract ${b}: ${a}x = ${c - b}`,
          `Divide by ${a}: x = ${x}`,
          `Start: ${a}x + ${b} = ${c}`,
        ],
        [
          `Start: ${a}x + ${b} = ${c}`,
          `Subtract ${b}: ${a}x = ${c - b}`,
          `Divide by ${a}: x = ${x}`,
          `x = ${x}`,
        ],
        `${slug}_steps`,
        {
          correct: "Undo +b, then divide by a.",
          incorrect: "Remove the constant before dividing.",
          hint: "Subtract first.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Solution",
        `${a}x + ${b} = ${c} → x = ?`,
        [String(x), String(b), String(c), String(a)],
        String(x),
        `${slug}_sol`,
        {
          correct: `x = ${x}.`,
          incorrect: `${c - b} ÷ ${a}.`,
          hint: `${c - b} = ${a * x}.`,
        },
      ),
    ],
    balanceScene(
      `${prefix}-final`,
      "Mastery check",
      `Solve ${a}x + ${b} = ${c} on the scale.`,
      { weights, fixedLeft: [b], fixedRight: [c], left, right: [c] },
      `${slug}_mastery`,
      {
        correct: `x = ${x}.`,
        incorrect: `${a} equal weights plus ${b} must equal ${c}.`,
        hint: `Each x-weight is ${x}.`,
      },
    ),
  );
}

/** ax = b — divide both sides to solve */
export function solveDivideLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  difficulty: LineqDifficulty = "beginner",
): LineqLessonSeed {
  const x = b / a;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Read the equation",
        `${a}x = ${b}. What operation undoes multiplying by ${a}?`,
        [`Divide by ${a}`, `Add ${a}`, `Subtract ${a}`, `Multiply by ${a}`],
        `Divide by ${a}`,
        `${slug}_inverse`,
        {
          correct: `Division undoes multiplication: divide both sides by ${a}.`,
          incorrect: "Use the inverse of multiplication.",
          hint: "What undoes ×?",
        },
      ),
      sortScene(
        `${prefix}-2`,
        "Divide to solve",
        `Order the steps to solve ${a}x = ${b}.`,
        [
          `x = ${x}`,
          `Divide both sides by ${a}`,
          `Start: ${a}x = ${b}`,
          `${a}x ÷ ${a} = ${b} ÷ ${a}`,
        ],
        [
          `Start: ${a}x = ${b}`,
          `Divide both sides by ${a}`,
          `${a}x ÷ ${a} = ${b} ÷ ${a}`,
          `x = ${x}`,
        ],
        `${slug}_divide_steps`,
        {
          correct: `${b} ÷ ${a} = ${x}.`,
          incorrect: "Divide both sides by the coefficient of x.",
          hint: "Same operation on both sides.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Solution",
        `${a}x = ${b}. What is x?`,
        [String(x), String(a), String(b), String(b - a)],
        String(x),
        `${slug}_divide_sol`,
        {
          correct: `x = ${x}.`,
          incorrect: `${b} ÷ ${a}.`,
          hint: "Divide both sides.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Solve ${a}x = ${b}. x = ?`,
      [String(x), String(a + b), String(b - a), String(a * b)],
      String(x),
      `${slug}_mastery`,
      {
        correct: `x = ${x} — ${title} complete.`,
        incorrect: `Divide ${b} by ${a}.`,
        hint: `${b} ÷ ${a}.`,
      },
    ),
  );
}

/** Intro to variables — what x represents */
export function variablesLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  difficulty: LineqDifficulty = "beginner",
): LineqLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "What is a variable?",
        "In algebra, a letter like x usually stands for…",
        ["An unknown value", "Always 0", "The answer only", "A math operation"],
        "An unknown value",
        `${slug}_define`,
        {
          correct: "A variable represents a number we do not know yet.",
          incorrect: "Variables stand for quantities we want to find.",
          hint: "Think 'unknown'.",
        },
      ),
      matchScene(
        `${prefix}-2`,
        "Match the unknown",
        "Match each situation to what x could represent.",
        [
          { id: "age", label: "Maya's age in years" },
          { id: "count", label: "Number of apples in a bag" },
          { id: "wrong", label: "The plus sign in 2 + 3" },
        ],
        [
          { id: "sit1", label: "x + 5 = 12 (years old)" },
          { id: "sit2", label: "x + 3 = 10 (fruit count)" },
        ],
        { sit1: "age", sit2: "count" },
        `${slug}_match`,
        {
          correct: "x replaces a specific unknown number in context.",
          incorrect: "Pick what the letter counts or measures.",
          hint: "What is being found?",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Same letter, same value",
        "In one equation, how many values can x have?",
        ["Exactly one (when solvable)", "Any value always", "Always two", "Zero"],
        "Exactly one (when solvable)",
        `${slug}_one_value`,
        {
          correct: "Within a single equation, x must stay the same throughout.",
          incorrect: "Once fixed, x does not change mid-equation.",
          hint: "One equation → one solution (usually).",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      "Which best describes a variable in an equation?",
      [
        "A placeholder for an unknown number",
        "A label for addition only",
        "Always equal to 1",
        "The same as the equals sign",
      ],
      "A placeholder for an unknown number",
      `${slug}_mastery`,
      {
        correct: `${title} complete — variables hold unknown values.`,
        incorrect: "Letters like x stand for numbers we solve for.",
        hint: "Unknown number.",
      },
    ),
  );
}

/** Coefficients — identify and combine */
export function coefficientsLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  coef: number,
  constant: number,
  difficulty: LineqDifficulty = "beginner",
): LineqLessonSeed {
  const sum = coef + coef;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Name the coefficient",
        `In ${coef}x + ${constant}, what is the coefficient of x?`,
        [String(coef), String(constant), String(coef + constant), "x"],
        String(coef),
        `${slug}_identify`,
        {
          correct: `The coefficient of x is ${coef}.`,
          incorrect: "The coefficient is the number multiplying x.",
          hint: "Number in front of x.",
        },
      ),
      matchScene(
        `${prefix}-2`,
        "Combine like terms",
        `Match ${coef}x + ${coef}x to its simplified form.`,
        [
          { id: "s", label: `${sum}x` },
          { id: "w1", label: `${coef}x${coef}x}` },
          { id: "w2", label: `${sum}` },
        ],
        [{ id: "simp", label: "Combined" }],
        { simp: "s" },
        `${slug}_combine`,
        {
          correct: `${coef}x + ${coef}x = ${sum}x — add coefficients.`,
          incorrect: "Same variable → add the coefficients.",
          hint: `${coef} + ${coef} = ${sum}.`,
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Expression value",
        `${sum}x + ${constant}. If x = 1, what is the value?`,
        [String(sum + constant), String(sum), String(constant), String(sum * constant)],
        String(sum + constant),
        `${slug}_evaluate`,
        {
          correct: `${sum}(1) + ${constant} = ${sum + constant}.`,
          incorrect: `Substitute x = 1: ${sum} + ${constant}.`,
          hint: "Replace x with 1.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${coef}x + ${coef}x simplifies to?`,
      [`${sum}x`, `${coef + constant}x`, `${sum}x + ${constant}`, `${coef}²x`],
      `${sum}x`,
      `${slug}_mastery`,
      {
        correct: `${sum}x — ${title} complete.`,
        incorrect: `${coef} + ${coef} = ${sum}.`,
        hint: "Add coefficients of x.",
      },
    ),
  );
}

/** Writing expressions from words */
export function expressionLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  difficulty: LineqDifficulty = "beginner",
): LineqLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Five more than x",
        '"5 more than a number x" as an expression:',
        ["x + 5", "5x", "x − 5", "x ÷ 5"],
        "x + 5",
        `${slug}_more`,
        {
          correct: '"More than" means add: x + 5.',
          incorrect: '"More than x" adds to x, not multiplies.',
          hint: "Plus 5.",
        },
      ),
      matchScene(
        `${prefix}-2`,
        "Match phrases",
        "Match each phrase to its expression.",
        [
          { id: "twice", label: "2x" },
          { id: "triple", label: "3x" },
          { id: "minus", label: "x − 7" },
        ],
        [
          { id: "p1", label: "Twice a number" },
          { id: "p2", label: "Triple a number" },
          { id: "p3", label: "7 less than x" },
        ],
        { p1: "twice", p2: "triple", p3: "minus" },
        `${slug}_phrases`,
        {
          correct: "Twice → 2x, triple → 3x, 7 less than x → x − 7.",
          incorrect: '"Less than" reverses order: x − 7, not 7 − x.',
          hint: "Watch 'less than' wording.",
        },
      ),
      sortScene(
        `${prefix}-3`,
        "Build the expression",
        'Order parts to write "3 less than twice x".',
        ["Start with x", "Double it: 2x", "Subtract 3: 2x − 3", "Done"],
        ["Start with x", "Double it: 2x", "Subtract 3: 2x − 3", "Done"],
        `${slug}_build`,
        {
          correct: "Twice x first, then subtract 3 → 2x − 3.",
          incorrect: "Apply operations in the phrase order.",
          hint: "2x, then −3.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      '"The sum of x and 4" is written as:',
      ["x + 4", "4x", "x − 4", "x/4"],
      "x + 4",
      `${slug}_mastery`,
      {
        correct: `${title} complete — sum means add.`,
        incorrect: '"Sum of" → addition.',
        hint: "x + 4.",
      },
    ),
  );
}

/** ax + b = cx + d — collect x on one side (d derived for integer x) */
export function bothSidesLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  c: number,
  difficulty: LineqDifficulty = "intermediate",
): LineqLessonSeed {
  const x = 3;
  const d = a * x + b - c * x;
  const coef = a - c;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Both sides have x",
        `${a}x + ${b} = ${c}x + ${d}. What is the first move?`,
        [
          `Subtract ${c}x from both sides`,
          `Add ${c}x to both sides`,
          `Divide by ${a}`,
          `Subtract ${b} only from the left`,
        ],
        `Subtract ${c}x from both sides`,
        `${slug}_move_x`,
        {
          correct: `Move x-terms to one side: ${coef}x + ${b} = ${d}.`,
          incorrect: "Get all x terms on the same side.",
          hint: "Subtract the smaller x-term from both sides.",
        },
      ),
      sortScene(
        `${prefix}-2`,
        "Collect and solve",
        `Order steps to solve ${a}x + ${b} = ${c}x + ${d}.`,
        [
          `x = ${x}`,
          `Subtract ${b}: ${coef}x = ${d - b}`,
          `Subtract ${c}x from both sides`,
          `Divide by ${coef}: x = ${x}`,
        ],
        [
          `Subtract ${c}x from both sides`,
          `Subtract ${b}: ${coef}x = ${d - b}`,
          `Divide by ${coef}: x = ${x}`,
          `x = ${x}`,
        ],
        `${slug}_both_steps`,
        {
          correct: `Collect x → subtract constant → divide: x = ${x}.`,
          incorrect: "Move x terms, then constants, then divide.",
          hint: "Same order as two-step, with an extra move first.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Solution",
        `${a}x + ${b} = ${c}x + ${d} → x = ?`,
        [String(x), String(b), String(d), String(coef)],
        String(x),
        `${slug}_both_sol`,
        {
          correct: `x = ${x}.`,
          incorrect: `${coef}x = ${d - b}; divide by ${coef}.`,
          hint: `${d - b} ÷ ${coef}.`,
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `After moving x-terms in ${a}x + ${b} = ${c}x + ${d}, x equals?`,
      [String(x), String(b - d), String(a + c), String(d - b)],
      String(x),
      `${slug}_mastery`,
      {
        correct: `x = ${x} — ${title} complete.`,
        incorrect: "Collect like terms on both sides first.",
        hint: `${coef}x = ${d - b}.`,
      },
    ),
  );
}

/** −ax + b = c */
export function negativeCoefLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  c: number,
  difficulty: LineqDifficulty = "intermediate",
): LineqLessonSeed {
  const x = (c - b) / -a;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Negative coefficient",
        `−${a}x + ${b} = ${c}. The coefficient of x is:`,
        [`−${a}`, String(a), String(b), String(-c)],
        `−${a}`,
        `${slug}_neg_coef`,
        {
          correct: `Coefficient is −${a} — includes the sign.`,
          incorrect: "The sign in front of x is part of the coefficient.",
          hint: "Sign + number.",
        },
      ),
      sortScene(
        `${prefix}-2`,
        "Solve with a negative coef",
        `Order steps to solve −${a}x + ${b} = ${c}.`,
        [
          `x = ${x}`,
          `Subtract ${b}: −${a}x = ${c - b}`,
          `Divide by −${a}: x = ${x}`,
          `Start: −${a}x + ${b} = ${c}`,
        ],
        [
          `Start: −${a}x + ${b} = ${c}`,
          `Subtract ${b}: −${a}x = ${c - b}`,
          `Divide by −${a}: x = ${x}`,
          `x = ${x}`,
        ],
        `${slug}_neg_steps`,
        {
          correct: `Dividing by −${a} flips the sign: x = ${x}.`,
          incorrect: "Undo +b first, then divide by the negative coefficient.",
          hint: "Watch the negative when dividing.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Solution",
        `−${a}x + ${b} = ${c} → x = ?`,
        [String(x), String(-x), String(b - c), String(c - b)],
        String(x),
        `${slug}_neg_sol`,
        {
          correct: `x = ${x}.`,
          incorrect: `${c - b} ÷ (−${a}).`,
          hint: "Divide by negative a.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Solve −${a}x + ${b} = ${c}. x = ?`,
      [String(x), String(a), String(b + c), String(-(c - b) / a)],
      String(x),
      `${slug}_mastery`,
      {
        correct: `x = ${x} — ${title} complete.`,
        incorrect: "Subtract b, then divide by −a.",
        hint: `${c - b} ÷ (−${a}).`,
      },
    ),
  );
}

/** a(x + b) = c — distribute then solve */
export function distributeLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  c: number,
  difficulty: LineqDifficulty = "intermediate",
): LineqLessonSeed {
  const ab = a * b;
  const x = (c - ab) / a;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      matchScene(
        `${prefix}-1`,
        "Distribute",
        `Expand ${a}(x + ${b}). Match each product.`,
        [
          { id: "t1", label: `${a}x` },
          { id: "t2", label: `${ab}` },
          { id: "t3", label: `x + ${b}` },
          { id: "t4", label: `${a + b}` },
        ],
        [
          { id: "first", label: `${a} · x` },
          { id: "second", label: `${a} · ${b}` },
        ],
        { first: "t1", second: "t2" },
        `${slug}_dist`,
        {
          correct: `${a}(x + ${b}) = ${a}x + ${ab}.`,
          incorrect: "Multiply a by each term inside the parentheses.",
          hint: `${a} × x and ${a} × ${b}.`,
        },
      ),
      sortScene(
        `${prefix}-2`,
        "Solve after distributing",
        `Order steps to solve ${a}(x + ${b}) = ${c}.`,
        [
          `x = ${x}`,
          `Expand: ${a}x + ${ab} = ${c}`,
          `Subtract ${ab}: ${a}x = ${c - ab}`,
          `Divide by ${a}: x = ${x}`,
        ],
        [
          `Expand: ${a}x + ${ab} = ${c}`,
          `Subtract ${ab}: ${a}x = ${c - ab}`,
          `Divide by ${a}: x = ${x}`,
          `x = ${x}`,
        ],
        `${slug}_dist_steps`,
        {
          correct: "Distribute → subtract constant → divide.",
          incorrect: "Expand before isolating x.",
          hint: "Remove parentheses first.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Solution",
        `${a}(x + ${b}) = ${c} → x = ?`,
        [String(x), String(ab), String(c - ab), String(a + b)],
        String(x),
        `${slug}_dist_sol`,
        {
          correct: `x = ${x}.`,
          incorrect: `${c - ab} ÷ ${a}.`,
          hint: "After expanding, two-step solve.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Solve ${a}(x + ${b}) = ${c}. x = ?`,
      [String(x), String(b), String(c / a), String(ab + c)],
      String(x),
      `${slug}_mastery`,
      {
        correct: `x = ${x} — ${title} complete.`,
        incorrect: "Distribute, then solve the linear equation.",
        hint: `${a}x + ${ab} = ${c}.`,
      },
    ),
  );
}

/** ax + ab = c — factor a(x + b) = c */
export function factorLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  c: number,
  difficulty: LineqDifficulty = "intermediate",
): LineqLessonSeed {
  const ab = a * b;
  const x = c / a - b;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      matchScene(
        `${prefix}-1`,
        "Spot the common factor",
        `${a}x + ${ab} = ${c}. Match the factored form.`,
        [
          { id: "fact", label: `${a}(x + ${b}) = ${c}` },
          { id: "w1", label: `x(${a} + ${b}) = ${c}` },
          { id: "w2", label: `${a}x + ${b} = ${c}` },
        ],
        [{ id: "form", label: "Factored" }],
        { form: "fact" },
        `${slug}_factor`,
        {
          correct: `${a}x + ${ab} = ${a}(x + ${b}) — factor out ${a}.`,
          incorrect: "Both terms share a factor of a.",
          hint: `${a}(x + ${b}).`,
        },
      ),
      sortScene(
        `${prefix}-2`,
        "Factor then solve",
        `Order steps to solve ${a}x + ${ab} = ${c}.`,
        [
          `x = ${x}`,
          `Factor: ${a}(x + ${b}) = ${c}`,
          `Divide by ${a}: x + ${b} = ${c / a}`,
          `Subtract ${b}: x = ${x}`,
        ],
        [
          `Factor: ${a}(x + ${b}) = ${c}`,
          `Divide by ${a}: x + ${b} = ${c / a}`,
          `Subtract ${b}: x = ${x}`,
          `x = ${x}`,
        ],
        `${slug}_factor_steps`,
        {
          correct: "Factoring groups the x-term and constant under a.",
          incorrect: "Factor first, then divide, then subtract.",
          hint: "Common factor a.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Solution",
        `${a}x + ${ab} = ${c} → x = ?`,
        [String(x), String(c / a), String(b), String(ab)],
        String(x),
        `${slug}_factor_sol`,
        {
          correct: `x = ${x}.`,
          incorrect: `${a}(x + ${b}) = ${c}; divide by ${a}.`,
          hint: `x + ${b} = ${c / a}.`,
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Factored form of ${a}x + ${ab} = ${c} gives x = ?`,
      [String(x), String(c - ab), String(a + b), String(b - x)],
      String(x),
      `${slug}_mastery`,
      {
        correct: `x = ${x} — ${title} complete.`,
        incorrect: "Factor out a, then solve.",
        hint: `${a}(x + ${b}) = ${c}.`,
      },
    ),
  );
}

/** 0x = 0 — infinitely many solutions */
export function infiniteSolutionsLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  difficulty: LineqDifficulty = "intermediate",
): LineqLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Identical sides",
        "If both sides simplify to 0 = 0, how many solutions exist?",
        ["Infinitely many", "Exactly one", "None", "Exactly two"],
        "Infinitely many",
        `${slug}_identical`,
        {
          correct: "0 = 0 is always true — every x works.",
          incorrect: "When both sides are the same, any x satisfies the equation.",
          hint: "Always true.",
        },
      ),
      matchScene(
        `${prefix}-2`,
        "Match the outcome",
        "Match each simplified result to its solution type.",
        [
          { id: "inf", label: "Infinitely many solutions" },
          { id: "one", label: "Exactly one solution" },
          { id: "none", label: "No solution" },
        ],
        [
          { id: "r1", label: "0 = 0" },
          { id: "r2", label: "x = 4" },
          { id: "r3", label: "0 = 5" },
        ],
        { r1: "inf", r2: "one", r3: "none" },
        `${slug}_outcomes`,
        {
          correct: "0 = 0 → infinite; x = k → one; 0 = c (c ≠ 0) → none.",
          incorrect: "True for all x vs true for one x vs never true.",
          hint: "0 = 0 is always true.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Example",
        "2x + 4 = 2(x + 2) simplifies to 0 = 0. This means:",
        [
          "Every real x is a solution",
          "No x works",
          "Only x = 0 works",
          "Only x = 2 works",
        ],
        "Every real x is a solution",
        `${slug}_example`,
        {
          correct: "Both sides are equivalent — identity equation.",
          incorrect: "Expand and simplify: same expression both sides.",
          hint: "Always true equation.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      "An equation that simplifies to 0 = 0 has:",
      ["Infinitely many solutions", "No solutions", "One solution", "Two solutions"],
      "Infinitely many solutions",
      `${slug}_mastery`,
      {
        correct: `${title} complete — identity equations have infinite solutions.`,
        incorrect: "0 = 0 is true for every value of x.",
        hint: "Always true.",
      },
    ),
  );
}

/** 0x = c (c ≠ 0) — no solution */
export function noSolutionsLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  difficulty: LineqDifficulty = "intermediate",
): LineqLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Contradiction",
        "If an equation simplifies to 0 = 7, how many solutions are there?",
        ["None", "One", "Infinitely many", "Seven"],
        "None",
        `${slug}_contradiction`,
        {
          correct: "0 = 7 is never true — no x satisfies it.",
          incorrect: "A false statement means zero solutions.",
          hint: "Can 0 equal 7?",
        },
      ),
      matchScene(
        `${prefix}-2`,
        "Match the result",
        "Match each simplified equation to its solution count.",
        [
          { id: "none", label: "No solution" },
          { id: "one", label: "One solution" },
          { id: "inf", label: "Infinitely many" },
        ],
        [
          { id: "e1", label: "3x + 1 = 3x + 5" },
          { id: "e2", label: "2x = 8" },
          { id: "e3", label: "x + 2 = x + 2" },
        ],
        { e1: "none", e2: "one", e3: "inf" },
        `${slug}_match_none`,
        {
          correct: "Subtract 3x: 1 = 5 is false → no solution.",
          incorrect: "If variables cancel leaving a false number sentence, no x works.",
          hint: "1 ≠ 5.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Why no solution?",
        "x + 3 = x + 7 has no solution because after subtracting x:",
        ["3 = 7 (false)", "x = 7", "0 = 0", "x = 3"],
        "3 = 7 (false)",
        `${slug}_why_none`,
        {
          correct: "3 = 7 is a contradiction — impossible.",
          incorrect: "Same x on both sides cancels; constants must match.",
          hint: "What remains after canceling x?",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      "An equation simplifying to 0 = 5 has:",
      ["No solutions", "One solution", "Five solutions", "Infinite solutions"],
      "No solutions",
      `${slug}_mastery`,
      {
        correct: `${title} complete — contradictions have no solution.`,
        incorrect: "0 = 5 is never true for any x.",
        hint: "False statement.",
      },
    ),
  );
}

/** Inequality — MC + number line */
export function inequalityLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  boundary: number,
  direction: "gt" | "lt",
  difficulty: LineqDifficulty = "intermediate",
): LineqLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  const sym = direction === "gt" ? ">" : "<";
  const testVal = direction === "gt" ? boundary + 1 : boundary - 1;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Read the inequality",
        `x ${sym} ${boundary}. Which value satisfies it?`,
        [String(testVal), String(boundary - 2), String(boundary + (direction === "gt" ? -2 : 2)), "0"],
        String(testVal),
        `${slug}_read`,
        {
          correct: `${testVal} ${sym === ">" ? ">" : "<"} ${boundary}.`,
          incorrect: `Test a value ${direction === "gt" ? "greater" : "less"} than ${boundary}.`,
          hint: `Pick x ${direction === "gt" ? "above" : "below"} ${boundary}.`,
        },
      ),
      nlScene(
        `${prefix}-2`,
        "Boundary on the line",
        `Mark the boundary ${boundary} on the number line (−2 to 8).`,
        -2,
        8,
        1,
        boundary,
        `${slug}_boundary`,
        {
          correct: `Boundary at ${boundary}.`,
          incorrect: `Place the marker at ${boundary}.`,
          hint: "The cutoff value for the inequality.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Direction",
        `Solutions to x ${sym} ${boundary} are values that are:`,
        [
          direction === "gt" ? `Greater than ${boundary}` : `Less than ${boundary}`,
          direction === "gt" ? `Less than ${boundary}` : `Greater than ${boundary}`,
          `Only equal to ${boundary}`,
          "Always negative",
        ],
        direction === "gt" ? `Greater than ${boundary}` : `Less than ${boundary}`,
        `${slug}_dir`,
        {
          correct: `x ${sym} ${boundary} — ${direction === "gt" ? "to the right" : "to the left"}.`,
          incorrect: "Open circle at boundary, shade the solution side.",
          hint: `${sym} points which way?`,
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Which satisfies x ${sym} ${boundary}?`,
      [String(testVal), String(boundary), String(boundary + (direction === "gt" ? -1 : 1))],
      String(testVal),
      `${slug}_mastery`,
      {
        correct: `${title} complete.`,
        incorrect: `Test values on the ${direction === "gt" ? "greater" : "less"} side.`,
        hint: `${testVal} works.`,
      },
    ),
  );
}

/** Percent discount / deal — find sale price or savings */
export function percentDealLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  base: number,
  pct: number,
  difficulty: LineqDifficulty = "intermediate",
): LineqLessonSeed {
  const discount = (base * pct) / 100;
  const sale = base - discount;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Discount amount",
        `A $${base} item is ${pct}% off. How much do you save?`,
        [String(discount), String(sale), String(pct), String(base + pct)],
        String(discount),
        `${slug}_save`,
        {
          correct: `${pct}% of $${base} = $${discount} saved.`,
          incorrect: `${pct}% × ${base} = discount.`,
          hint: `${base} × ${pct / 100}.`,
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Sale price",
        `After ${pct}% off a $${base} item, you pay:`,
        [String(sale), String(discount), String(base), String(base + discount)],
        String(sale),
        `${slug}_sale`,
        {
          correct: `$${base} − $${discount} = $${sale}.`,
          incorrect: "Subtract the discount from the original price.",
          hint: `${base} − ${discount}.`,
        },
      ),
      matchScene(
        `${prefix}-3`,
        "Match the equation",
        `Match "sale price after ${pct}% off $${base}".`,
        [
          { id: "eq1", label: `${base} − 0.${pct}(${base}) = ${sale}` },
          { id: "eq2", label: `${base} + ${pct} = ${base + pct}` },
          { id: "eq3", label: `${pct}x = ${base}` },
        ],
        [{ id: "model", label: "Correct model" }],
        { model: "eq1" },
        `${slug}_eq`,
        {
          correct: `Sale = original − (${pct}/100)(original) = ${sale}.`,
          incorrect: "Percent off means subtract that fraction of the price.",
          hint: "Original minus discount.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `$${base} with ${pct}% off costs:`,
      [String(sale), String(discount), String(base), String(pct)],
      String(sale),
      `${slug}_mastery`,
      {
        correct: `$${sale} — ${title} complete.`,
        incorrect: `Save $${discount}; pay $${sale}.`,
        hint: `${base} − ${discount}.`,
      },
    ),
  );
}

/** Compound inequality low < x < high */
export function compoundInequalityLesson(
  trackLevel: LineqTrackLevel,
  slug: string,
  title: string,
  low: number,
  high: number,
  difficulty: LineqDifficulty = "intermediate",
): LineqLessonSeed {
  const mid = Math.floor((low + high) / 2);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Read the compound inequality",
        `${low} < x < ${high}. Which value satisfies it?`,
        [String(mid), String(low), String(high), String(high + 1)],
        String(mid),
        `${slug}_read`,
        {
          correct: `${mid} is between ${low} and ${high}.`,
          incorrect: "x must be greater than the low bound and less than the high bound.",
          hint: "Pick a number strictly inside the interval.",
        },
      ),
      nlScene(
        `${prefix}-2`,
        "Mark the interval",
        `On a number line from ${low - 2} to ${high + 2}, mark the lower bound ${low}.`,
        low - 2,
        high + 2,
        1,
        low,
        `${slug}_low_bound`,
        {
          correct: `Lower bound at ${low} — open circle.`,
          incorrect: `Place the marker at ${low}.`,
          hint: "Left endpoint of the interval.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "Between the bounds",
        `Solutions to ${low} < x < ${high} are values that are:`,
        [
          `Greater than ${low} and less than ${high}`,
          `Greater than ${high}`,
          `Less than ${low}`,
          `Equal to ${low} or ${high}`,
        ],
        `Greater than ${low} and less than ${high}`,
        `${slug}_between`,
        {
          correct: "Strict inequalities — endpoints are not included.",
          incorrect: "Both bounds apply at once: in the middle.",
          hint: "Between low and high.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `Which satisfies ${low} < x < ${high}?`,
      [String(mid), String(low), String(high), String(high + 2)],
      String(mid),
      `${slug}_mastery`,
      {
        correct: `${mid} works — ${title} complete.`,
        incorrect: "Must be strictly between the two bounds.",
        hint: `${low} < x < ${high}.`,
      },
    ),
  );
}
