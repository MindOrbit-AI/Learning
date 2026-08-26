/** Shared builders for the Math algebra / unknowns curriculum (Visual Problem Engine). */

export type AlgebraDifficulty = "beginner" | "intermediate";

export type AlgebraSceneSeed = {
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

export type AlgebraTrackLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type AlgebraLessonSeed = {
  id: string;
  title: string;
  subject: "Math";
  topic: string;
  level: AlgebraDifficulty;
  algebraTrackLevel: AlgebraTrackLevel;
  scenes: AlgebraSceneSeed[];
  finalMasteryCheck: AlgebraSceneSeed;
};

export const ALGEBRA_CONCEPT = "linear-equations";

export function topicForAlgebraLevel(n: AlgebraTrackLevel) {
  return `Algebra (Level ${n})`;
}

export function lessonId(level: AlgebraTrackLevel, slug: string) {
  return `lesson-algebra-l${level}-${slug}`;
}

export function lesson(
  level: AlgebraTrackLevel,
  slug: string,
  title: string,
  difficulty: AlgebraDifficulty,
  scenes: AlgebraSceneSeed[],
  finalMasteryCheck: AlgebraSceneSeed,
): AlgebraLessonSeed {
  return {
    id: lessonId(level, slug),
    title,
    subject: "Math",
    topic: topicForAlgebraLevel(level),
    level: difficulty,
    algebraTrackLevel: level,
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
): AlgebraSceneSeed {
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
    masteryTarget: { conceptNodeId: ALGEBRA_CONCEPT, skill },
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
): AlgebraSceneSeed {
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
    masteryTarget: { conceptNodeId: ALGEBRA_CONCEPT, skill },
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
): AlgebraSceneSeed {
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
    masteryTarget: { conceptNodeId: ALGEBRA_CONCEPT, skill },
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
): AlgebraSceneSeed {
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
    masteryTarget: { conceptNodeId: ALGEBRA_CONCEPT, skill },
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
): AlgebraSceneSeed {
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
    masteryTarget: { conceptNodeId: ALGEBRA_CONCEPT, skill },
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
): AlgebraSceneSeed {
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
    masteryTarget: { conceptNodeId: ALGEBRA_CONCEPT, skill },
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
): AlgebraSceneSeed {
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
    masteryTarget: { conceptNodeId: ALGEBRA_CONCEPT, skill },
  };
}

/** Standard 3-scene + final pack for x + a = b style equations. */
export function balanceAddLesson(
  trackLevel: AlgebraTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  difficulty: AlgebraDifficulty = "beginner",
): AlgebraLessonSeed {
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

/** 2x = b or nx = b style */
export function balanceMultLesson(
  trackLevel: AlgebraTrackLevel,
  slug: string,
  title: string,
  n: number,
  total: number,
  difficulty: AlgebraDifficulty = "beginner",
): AlgebraLessonSeed {
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
  trackLevel: AlgebraTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  c: number,
  difficulty: AlgebraDifficulty = "intermediate",
): AlgebraLessonSeed {
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

/** Match / substitute lesson template */
export function substitutionLesson(
  trackLevel: AlgebraTrackLevel,
  slug: string,
  title: string,
  yExpr: string,
  yVal: number,
  eqLeft: string,
  answer: number,
  difficulty: AlgebraDifficulty = "intermediate",
): AlgebraLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      matchScene(
        `${prefix}-1`,
        "Substitute",
        `Given ${yExpr}, match y = ${yVal} and the substitution into the next equation.`,
        [
          { id: "yv", label: `y = ${yVal}` },
          { id: "ya", label: `y = ${yVal + 1}` },
          { id: "sub", label: `Replace y with ${yVal}` },
        ],
        [
          { id: "known", label: "Known value" },
          { id: "action", label: "Substitution step" },
        ],
        { known: "yv", action: "sub" },
        `${slug}_sub`,
        {
          correct: `Substitute y = ${yVal} into the equation.`,
          incorrect: `When y = ${yVal}, replace every y with ${yVal}.`,
          hint: "Plug the known value in.",
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Solve after substituting",
        `After substituting y = ${yVal}, solve: ${eqLeft} = ?`,
        [String(answer), String(yVal), String(answer + 1), String(yVal * 2)],
        String(answer),
        `${slug}_solve`,
        {
          correct: `Answer = ${answer}.`,
          incorrect: "Evaluate after replacing y.",
          hint: "Substitute first, then solve.",
        },
      ),
      sortScene(
        `${prefix}-3`,
        "Substitution order",
        "Order: know y → substitute → solve → check.",
        [
          "State the solution for x",
          `Substitute y = ${yVal}`,
          `Use ${yExpr}`,
          "Solve the resulting equation",
        ],
        [`Use ${yExpr}`, `Substitute y = ${yVal}`, "Solve the resulting equation", "State the solution for x"],
        `${slug}_order`,
        {
          correct: "Substitution replaces a variable with an equivalent expression.",
          incorrect: "Find y (or its value) before substituting.",
          hint: "Start with what you know.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `y = ${yVal} and ${yExpr}. After substitution, x equals?`,
      [String(answer), String(yVal), "0", String(answer + 2)],
      String(answer),
      `${slug}_mastery`,
      {
        correct: `${title} — substitution complete.`,
        incorrect: "Plug y into the equation and solve.",
        hint: `Replace y with ${yVal}.`,
      },
    ),
  );
}

/** Distribute a(b + c) */
export function distributeLesson(
  trackLevel: AlgebraTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  c: number,
  difficulty: AlgebraDifficulty = "intermediate",
): AlgebraLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  const ab = a * b;
  const ac = a * c;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      matchScene(
        `${prefix}-1`,
        "Unpack the box",
        `Distribute ${a} over (${b} + ${c}). Match the expanded terms.`,
        [
          { id: "t1", label: `${ab}` },
          { id: "t2", label: `${ac}` },
          { id: "t3", label: `${a + b}` },
          { id: "t4", label: `${b + c}` },
        ],
        [
          { id: "first", label: `${a} × ${b}` },
          { id: "second", label: `${a} × ${c}` },
        ],
        { first: "t1", second: "t2" },
        `${slug}_dist`,
        {
          correct: `${a}(${b} + ${c}) = ${ab} + ${ac}.`,
          incorrect: "Multiply the outside factor by each term inside.",
          hint: `${a} × ${b} and ${a} × ${c}.`,
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Full expansion",
        `${a}(${b} + ${c}) = ?`,
        [`${ab} + ${ac}`, `${a + b + c}`, `${ab + ac + a}`, `${b + c}`],
        `${ab} + ${ac}`,
        `${slug}_expand`,
        {
          correct: `${ab} + ${ac}.`,
          incorrect: "Distribute to every term in the group.",
          hint: "Multiply each term inside by ${a}.",
        },
      ),
      sortScene(
        `${prefix}-3`,
        "Distribution steps",
        `Order the steps to expand ${a}(x + ${c}).`,
        [
          `${a}x + ${ac}`,
          `Multiply ${a} · x`,
          `Multiply ${a} · ${c}`,
          "Apply distribution",
        ],
        ["Apply distribution", `Multiply ${a} · x`, `Multiply ${a} · ${c}`, `${a}x + ${ac}`],
        `${slug}_steps`,
        {
          correct: "Each term inside gets multiplied by the outside factor.",
          incorrect: "Start with the distributive property.",
          hint: "Outside factor times each inside term.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${a}(${b} + ${c}) equals?`,
      [`${ab} + ${ac}`, `${a + b + c}`, `${ab}`, `${ac}`],
      `${ab} + ${ac}`,
      `${slug}_mastery`,
      {
        correct: `${title} complete.`,
        incorrect: `${a} × ${b} + ${a} × ${c}.`,
        hint: "Distribute fully.",
      },
    ),
  );
}

/** Inequality on number line x > a or x >= a */
export function inequalityLesson(
  trackLevel: AlgebraTrackLevel,
  slug: string,
  title: string,
  boundary: number,
  direction: "gt" | "lt",
  difficulty: AlgebraDifficulty = "intermediate",
): AlgebraLessonSeed {
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
      segScene(
        `${prefix}-3`,
        "Direction",
        `Solutions to x ${sym} ${boundary} live where?`,
        [
          { id: "right", label: direction === "gt" ? `Greater than ${boundary}` : `Less than ${boundary}` },
          { id: "wrong", label: direction === "gt" ? `Less than ${boundary}` : `Greater than ${boundary}` },
          { id: "eq", label: `Only at ${boundary}` },
        ],
        direction === "gt" ? "right" : "right",
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

/** Combine like terms: ax + bx */
export function combineLikeTermsLesson(
  trackLevel: AlgebraTrackLevel,
  slug: string,
  title: string,
  a: number,
  b: number,
  difficulty: AlgebraDifficulty = "intermediate",
): AlgebraLessonSeed {
  const sum = a + b;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      matchScene(
        `${prefix}-1`,
        "Combine x terms",
        `Match ${a}x + ${b}x to its simplified form.`,
        [
          { id: "s", label: `${sum}x` },
          { id: "w1", label: `${a + b}` },
          { id: "w2", label: `${a}x${b}x}` },
        ],
        [{ id: "simp", label: "Combined" }],
        { simp: "s" },
        `${slug}_combine`,
        {
          correct: `${a}x + ${b}x = ${sum}x — same variable, add coefficients.`,
          incorrect: "Add the coefficients of x.",
          hint: `${a} + ${b} = ${sum}.`,
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Coefficient sum",
        `${a}x + ${b}x = ?`,
        [`${sum}x`, `${a + b}`, `${a}x${b}`, `${sum}x²`],
        `${sum}x`,
        `${slug}_coef`,
        {
          correct: `${sum}x.`,
          incorrect: "Like terms: add coefficients, keep x.",
          hint: "Same variable x.",
        },
      ),
      sortScene(
        `${prefix}-3`,
        "Combine then solve",
        "Order: combine like terms → isolate x → divide.",
        [
          "Divide by the coefficient of x",
          `Combine to ${sum}x = constant`,
          "Subtract constants from both sides",
          "Identify like terms",
        ],
        ["Identify like terms", `Combine to ${sum}x = constant`, "Subtract constants from both sides", "Divide by the coefficient of x"],
        `${slug}_order`,
        {
          correct: "Simplify before isolating x.",
          incorrect: "Combine like terms first.",
          hint: "Group x terms before solving.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${a}x + ${b}x simplifies to?`,
      [`${sum}x`, `${a + b}x²`, `${a + b}`, `${sum}`],
      `${sum}x`,
      `${slug}_mastery`,
      {
        correct: `${title} complete.`,
        incorrect: `${a} + ${b} = ${sum}.`,
        hint: "Add coefficients.",
      },
    ),
  );
}

/** Systems elimination template */
export function eliminationLesson(
  trackLevel: AlgebraTrackLevel,
  slug: string,
  title: string,
  difficulty: AlgebraDifficulty = "intermediate",
): AlgebraLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      balanceScene(
        `${prefix}-1`,
        "Two scales",
        "Scale A: x + y = 5. Scale B: x − y = 1. Add equations — match 2x = 6.",
        { weights: [1, 2, 3, 4, 5, 6], fixedLeft: [3], fixedRight: [6], left: [3, 3], right: [6] },
        `${slug}_add_eq`,
        {
          correct: "Adding equations eliminates y: 2x = 6 → x = 3.",
          incorrect: "Combine left pans and right pans separately.",
          hint: "y − y = 0 when you add.",
        },
      ),
      sortScene(
        `${prefix}-2`,
        "Elimination steps",
        "Order elimination steps for a system.",
        [
          "Back-substitute to find y",
          "Add (or subtract) equations to eliminate a variable",
          "Solve for the remaining variable",
          "Align like terms",
        ],
        [
          "Align like terms",
          "Add (or subtract) equations to eliminate a variable",
          "Solve for the remaining variable",
          "Back-substitute to find y",
        ],
        `${slug}_elim_steps`,
        {
          correct: "Eliminate one variable, solve, then substitute back.",
          incorrect: "Line up equations before adding.",
          hint: "Elimination first.",
        },
      ),
      mcScene(
        `${prefix}-3`,
        "After elimination",
        "If 2x = 6 from adding equations, x = ?",
        ["3", "6", "2", "12"],
        "3",
        `${slug}_elim_x`,
        {
          correct: "x = 3.",
          incorrect: "Divide 6 by 2.",
          hint: "6 ÷ 2.",
        },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      "Elimination works because equal quantities added to equal quantities stay…",
      ["Equal", "Opposite", "Zero", "Doubled"],
      "Equal",
      `${slug}_mastery`,
      {
        correct: `${title} — elimination complete.`,
        incorrect: "Balance is preserved when you add the same to both sides.",
        hint: "Think balance property.",
      },
    ),
  );
}

/** Reasoning / constraints template */
export function reasoningLesson(
  trackLevel: AlgebraTrackLevel,
  slug: string,
  title: string,
  difficulty: AlgebraDifficulty = "intermediate",
): AlgebraLessonSeed {
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      balanceScene(
        `${prefix}-1`,
        "Compare pans",
        "Left pan: 2 weights + 3. Right pan: 1 weight + 7. Find the weight if scales balance with equal unknowns.",
        { weights: [1, 2, 3, 4, 5, 7], fixedLeft: [3], fixedRight: [7], left: [3, 4, 4], right: [7, 4] },
        `${slug}_compare`,
        {
          correct: "If each unknown is 4, both sides balance — strategic comparison.",
          incorrect: "2x + 3 = x + 7 → x = 4.",
          hint: "Remove equal weights from both sides.",
        },
      ),
      mcScene(
        `${prefix}-2`,
        "Strategic move",
        "Remove the same weight from both pans. What property lets you do that?",
        ["Balance property", "Commutative property", "Distributive property", "Zero property"],
        "Balance property",
        `${slug}_strategy`,
        {
          correct: "Equal removal from both sides keeps balance.",
          incorrect: "Same operation on both sides is valid.",
          hint: "Like subtracting from both sides.",
        },
      ),
      matchScene(
        `${prefix}-3`,
        "Match the constraint",
        "If x + y = 10 and x = 6, match y.",
        [
          { id: "y4", label: "y = 4" },
          { id: "y6", label: "y = 6" },
          { id: "y10", label: "y = 10" },
        ],
        [{ id: "sol", label: "Solution" }],
        { sol: "y4" },
        `${slug}_constraint`,
        {
          correct: "y = 4 — constraint reasoning.",
          incorrect: "10 − 6 = 4.",
          hint: "Substitute x = 6.",
        },
      ),
    ],
    balanceScene(
      `${prefix}-final`,
      "Mastery check",
      "Balance 2x + 1 = 9. Each x-weight equals?",
      { weights: [1, 2, 3, 4, 5, 9], fixedLeft: [1], fixedRight: [9], left: [1, 4, 4], right: [9] },
      `${slug}_mastery`,
      {
        correct: `${title} complete — x = 4.`,
        incorrect: "2 equal weights plus 1 must sum to 9.",
        hint: "9 − 1 = 8; split in two.",
      },
    ),
  );
}
