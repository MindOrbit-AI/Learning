/** Shared builders for the Math percents curriculum. */

export type PercentDifficulty = "beginner" | "intermediate";

export type PercentSceneSeed = {
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

export type PercentTrackLevel = 1 | 2 | 3 | 4 | 5;

export type PercentLessonSeed = {
  id: string;
  title: string;
  subject: "Math";
  topic: string;
  level: PercentDifficulty;
  percentTrackLevel: PercentTrackLevel;
  scenes: PercentSceneSeed[];
  finalMasteryCheck: PercentSceneSeed;
};

export const PERCENT_CONCEPT = "percents";

export function topicForPercentLevel(n: PercentTrackLevel) {
  return `Percents (Level ${n})`;
}

export function lessonId(level: PercentTrackLevel, slug: string) {
  return `lesson-percents-l${level}-${slug}`;
}

export function lesson(
  level: PercentTrackLevel,
  slug: string,
  title: string,
  difficulty: PercentDifficulty,
  scenes: PercentSceneSeed[],
  finalMasteryCheck: PercentSceneSeed,
): PercentLessonSeed {
  return {
    id: lessonId(level, slug),
    title,
    subject: "Math",
    topic: topicForPercentLevel(level),
    level: difficulty,
    percentTrackLevel: level,
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
): PercentSceneSeed {
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
    masteryTarget: { conceptNodeId: PERCENT_CONCEPT, skill },
  };
}

export function barScene(
  id: string,
  title: string,
  prompt: string,
  totalParts: number,
  expectedCount: number,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
): PercentSceneSeed {
  return {
    id,
    title,
    type: "fraction_bar",
    prompt,
    visualPrompt: "Tap slices to shade the correct percentage.",
    data: { totalParts },
    interaction: "tap_to_fill",
    validation: { type: "count_match", expectedCount },
    feedback,
    masteryTarget: { conceptNodeId: PERCENT_CONCEPT, skill },
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
): PercentSceneSeed {
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
    masteryTarget: { conceptNodeId: PERCENT_CONCEPT, skill },
  };
}

export function nlScene(
  id: string,
  title: string,
  prompt: string,
  x: number,
  skill: string,
  feedback: { correct: string; incorrect: string; hint?: string },
  bounds = { min: 0, max: 1, step: 0.05 },
): PercentSceneSeed {
  return {
    id,
    title,
    type: "number_line",
    prompt,
    visualPrompt: "Drag the marker to the correct value.",
    data: bounds,
    interaction: "place_point",
    validation: { type: "point_match", expectedPoint: { x, y: 0 }, tolerance: 0.06 },
    feedback,
    masteryTarget: { conceptNodeId: PERCENT_CONCEPT, skill },
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
): PercentSceneSeed {
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
    masteryTarget: { conceptNodeId: PERCENT_CONCEPT, skill },
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
): PercentSceneSeed {
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
    masteryTarget: { conceptNodeId: PERCENT_CONCEPT, skill },
  };
}

export function percentOfLesson(
  trackLevel: PercentTrackLevel,
  slug: string,
  title: string,
  percent: number,
  whole: number,
  difficulty: PercentDifficulty = "beginner",
): PercentLessonSeed {
  const answer = (percent / 100) * whole;
  const answerStr = String(answer);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Percent means per hundred",
        `${percent}% of a whole means…`,
        [
          `${percent} out of every 100 parts`,
          `${percent} out of 10 parts`,
          `${whole} out of 100`,
          `${percent} + ${whole}`,
        ],
        `${percent} out of every 100 parts`,
        `${slug}_meaning`,
        { correct: "Percent = per hundred.", incorrect: "Percent counts parts per 100.", hint: "Per hundred." },
      ),
      barScene(
        `${prefix}-2`,
        "Shade the percent",
        `Shade ${percent}% of this 100-part bar.`,
        100,
        percent,
        `${slug}_bar`,
        { correct: `${percent} of 100 parts shaded.`, incorrect: `Shade exactly ${percent} slices.`, hint: `${percent} parts.` },
      ),
      mcScene(
        `${prefix}-3`,
        "Calculate",
        `What is ${percent}% of ${whole}?`,
        [answerStr, String(whole - answer), String(percent + whole), String(percent * whole)],
        answerStr,
        `${slug}_calc`,
        { correct: `${percent}% × ${whole} = ${answerStr}.`, incorrect: `Multiply: (${percent}/100) × ${whole}.`, hint: answerStr },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${percent}% of ${whole} = ?`,
      [answerStr, String(answer + 1), String(whole), String(percent)],
      answerStr,
      `${slug}_mastery`,
      { correct: answerStr, incorrect: "Use percent × whole.", hint: answerStr },
    ),
  );
}

export function percentIncreaseLesson(
  trackLevel: PercentTrackLevel,
  slug: string,
  title: string,
  base: number,
  increasePct: number,
  difficulty: PercentDifficulty = "intermediate",
): PercentLessonSeed {
  const newVal = base * (1 + increasePct / 100);
  const increase = newVal - base;
  const newStr = String(newVal);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Increase",
        `A ${increasePct}% increase on ${base} adds…`,
        [String(increase), String(base), String(increasePct), String(base - increasePct)],
        String(increase),
        `${slug}_add`,
        { correct: `${increasePct}% of ${base} = ${increase}.`, incorrect: "Increase = base × (percent/100).", hint: String(increase) },
      ),
      mcScene(
        `${prefix}-2`,
        "New value",
        `${base} increased by ${increasePct}% becomes…`,
        [newStr, String(base), String(increasePct), String(base + increasePct)],
        newStr,
        `${slug}_new`,
        { correct: `${base} + ${increase} = ${newStr}.`, incorrect: "Add the increase to the original.", hint: newStr },
      ),
      sortScene(
        `${prefix}-3`,
        "Steps",
        "Order the steps for a percent increase.",
        [`New = ${base} + increase`, `Increase = ${increasePct}% of ${base}`, `Increase = ${increase}`],
        [`Increase = ${increasePct}% of ${base}`, `Increase = ${increase}`, `New = ${base} + increase`],
        `${slug}_steps`,
        { correct: "Find increase, then add.", incorrect: "Percent of original first.", hint: "Increase then add." },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${base} + ${increasePct}% = ?`,
      [newStr, String(base), String(increasePct), String(base * increasePct)],
      newStr,
      `${slug}_mastery`,
      { correct: newStr, incorrect: "Multiply by (1 + p/100).", hint: newStr },
    ),
  );
}

export function percentDecreaseLesson(
  trackLevel: PercentTrackLevel,
  slug: string,
  title: string,
  base: number,
  decreasePct: number,
  difficulty: PercentDifficulty = "intermediate",
): PercentLessonSeed {
  const newVal = base * (1 - decreasePct / 100);
  const decrease = base - newVal;
  const newStr = String(newVal);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Decrease amount",
        `${decreasePct}% off ${base} removes…`,
        [String(decrease), String(base), String(decreasePct), String(newVal)],
        String(decrease),
        `${slug}_off`,
        { correct: `${decreasePct}% of ${base} = ${decrease}.`, incorrect: "Find the discount.", hint: String(decrease) },
      ),
      mcScene(
        `${prefix}-2`,
        "Sale price",
        `After ${decreasePct}% off, ${base} costs…`,
        [newStr, String(base), String(decrease), String(base + decreasePct)],
        newStr,
        `${slug}_sale`,
        { correct: `${base} − ${decrease} = ${newStr}.`, incorrect: "Subtract the decrease.", hint: newStr },
      ),
      mcScene(
        `${prefix}-3`,
        "Multiplier",
        `${decreasePct}% decrease uses multiplier…`,
        [`${1 - decreasePct / 100}`, `${1 + decreasePct / 100}`, `${decreasePct / 100}`, "0"],
        `${1 - decreasePct / 100}`,
        `${slug}_mult`,
        { correct: `Multiply by ${1 - decreasePct / 100}.`, incorrect: "Decrease → subtract percent from 1.", hint: `${1 - decreasePct / 100}.` },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${base} decreased by ${decreasePct}% = ?`,
      [newStr, String(base), String(decreasePct), String(base - decreasePct)],
      newStr,
      `${slug}_mastery`,
      { correct: newStr, incorrect: "Subtract the percent amount.", hint: newStr },
    ),
  );
}

export function reversePercentLesson(
  trackLevel: PercentTrackLevel,
  slug: string,
  title: string,
  afterPrice: number,
  decreasePct: number,
  difficulty: PercentDifficulty = "intermediate",
): PercentLessonSeed {
  const original = afterPrice / (1 - decreasePct / 100);
  const origStr = String(original);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "After discount",
        `Sale price $${afterPrice} is ${100 - decreasePct}% of original. Original was…`,
        [origStr, String(afterPrice + decreasePct), String(afterPrice * 2), String(decreasePct)],
        origStr,
        `${slug}_reverse`,
        { correct: `$${afterPrice} ÷ ${(100 - decreasePct) / 100} = $${origStr}.`, incorrect: "Divide by the remaining percent.", hint: origStr },
      ),
      mcScene(
        `${prefix}-2`,
        "Check",
        `If original is $${origStr}, ${decreasePct}% off gives…`,
        [String(afterPrice), origStr, String(decreasePct), String(Number(origStr) + decreasePct)],
        String(afterPrice),
        `${slug}_check`,
        { correct: "Reversing works.", incorrect: "Multiply original by (1 − p/100).", hint: String(afterPrice) },
      ),
      mcScene(
        `${prefix}-3`,
        "Equation",
        "Original × (1 − p/100) = sale price. Solve for original by…",
        ["Dividing sale price by (1 − p/100)", "Multiplying by p", "Adding p", "Subtracting p only"],
        "Dividing sale price by (1 − p/100)",
        `${slug}_eq`,
        { correct: "Divide to undo the multiplier.", incorrect: "Reverse the percent factor.", hint: "Divide." },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `$${afterPrice} after ${decreasePct}% off → original $${origStr}?`,
      ["Yes", "No", "Only if tax included", "Cannot tell"],
      "Yes",
      `${slug}_mastery`,
      { correct: `Original $${origStr}.`, incorrect: "Divide by remaining fraction.", hint: "Yes." },
    ),
  );
}

export function percentFractionLesson(
  trackLevel: PercentTrackLevel,
  slug: string,
  title: string,
  percent: number,
  difficulty: PercentDifficulty = "beginner",
): PercentLessonSeed {
  const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b));
  const d = g(percent, 100);
  const frac = `${percent / d}/${100 / d}`;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Percent to fraction",
        `${percent}% = ? / 100`,
        [String(percent), String(100 - percent), "1", "10"],
        String(percent),
        `${slug}_over100`,
        { correct: `${percent}/100.`, incorrect: "Percent → over 100.", hint: String(percent) },
      ),
      matchScene(
        `${prefix}-2`,
        "Match equivalents",
        "Match each percent to its fraction.",
        [
          { id: "p25", label: "25%" },
          { id: "p50", label: "50%" },
          { id: "f14", label: "1/4" },
          { id: "f12", label: "1/2" },
        ],
        [
          { id: "s25", label: "25%" },
          { id: "s50", label: "50%" },
        ],
        { s25: "f14", s50: "f12" },
        `${slug}_match`,
        { correct: "25% = 1/4, 50% = 1/2.", incorrect: "Match equal amounts.", hint: "1/4 and 1/2." },
      ),
      mcScene(
        `${prefix}-3`,
        "Simplify",
        `${percent}% as a fraction in lowest terms?`,
        [frac, `${percent}/100`, `${percent}/10`, `1/${percent}`],
        frac,
        `${slug}_simp`,
        { correct: `${percent}% = ${frac}.`, incorrect: "Simplify over 100.", hint: frac },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${percent}% = ?/100`,
      [String(percent), "100", String(percent * 2), "1"],
      String(percent),
      `${slug}_mastery`,
      { correct: `${percent}/100.`, incorrect: "Numerator = percent.", hint: String(percent) },
    ),
  );
}

export function decimalPercentLesson(
  trackLevel: PercentTrackLevel,
  slug: string,
  title: string,
  percent: number,
  difficulty: PercentDifficulty = "beginner",
): PercentLessonSeed {
  const decimal = percent / 100;
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "Move decimal",
        `${percent}% as a decimal?`,
        [String(decimal), String(percent), String(percent / 10), String(percent * 100)],
        String(decimal),
        `${slug}_dec`,
        { correct: `${percent}% = ${decimal}.`, incorrect: "Divide percent by 100.", hint: String(decimal) },
      ),
      nlScene(
        `${prefix}-2`,
        "On 0 to 1",
        `Place ${decimal} on the number line (that's ${percent}%).`,
        decimal,
        `${slug}_nl`,
        { correct: `${percent}% = ${decimal}.`, incorrect: "Mark the decimal.", hint: String(decimal) },
      ),
      mcScene(
        `${prefix}-3`,
        "Hundredths link",
        `${percent}% equals ${percent} hundredths = ${decimal}.`,
        ["True", "False", "Only for 50%", "Only for 10%"],
        "True",
        `${slug}_hundredth`,
        { correct: "Percent ↔ hundredths ↔ decimal.", incorrect: "Divide by 100.", hint: "True." },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `0.25 = ?%`,
      ["25", "2.5", "250", "0.25"],
      "25",
      `${slug}_mastery`,
      { correct: "25%.", incorrect: "Multiply decimal by 100.", hint: "25." },
    ),
  );
}

export function compoundChangeLesson(
  trackLevel: PercentTrackLevel,
  slug: string,
  title: string,
  base: number,
  pct1: number,
  pct2: number,
  difficulty: PercentDifficulty = "intermediate",
): PercentLessonSeed {
  const after1 = base * (1 + pct1 / 100);
  const after2 = after1 * (1 + pct2 / 100);
  const after2Str = String(Math.round(after2 * 100) / 100);
  const prefix = `l${trackLevel}-${slug}`;
  return lesson(
    trackLevel,
    slug,
    title,
    difficulty,
    [
      mcScene(
        `${prefix}-1`,
        "First change",
        `${base} grows ${pct1}% →`,
        [String(after1), String(base), String(pct1), String(base + pct1)],
        String(after1),
        `${slug}_step1`,
        { correct: `After first change: ${after1}.`, incorrect: "Apply first percent to base.", hint: String(after1) },
      ),
      mcScene(
        `${prefix}-2`,
        "Second change",
        `${after1} grows ${pct2}% →`,
        [after2Str, String(after1), String(pct2), String(Number(after1) + pct2)],
        after2Str,
        `${slug}_step2`,
        { correct: `Compound result: ${after2Str}.`, incorrect: "Apply second percent to new amount.", hint: after2Str },
      ),
      mcScene(
        `${prefix}-3`,
        "Not additive",
        `${pct1}% then ${pct2}% is ___ ${pct1 + pct2}% at once.`,
        ["Not the same as", "Exactly equal to", "Always less than", "Always zero"],
        "Not the same as",
        `${slug}_not_add`,
        { correct: "Compound changes multiply sequentially.", incorrect: "Don't add percents blindly.", hint: "Not the same as." },
      ),
    ],
    mcScene(
      `${prefix}-final`,
      "Mastery check",
      `${base} +${pct1}% then +${pct2}% ≈ ?`,
      [after2Str, String(base + pct1 + pct2), String(base), String(pct1 * pct2)],
      after2Str,
      `${slug}_mastery`,
      { correct: after2Str, incorrect: "Apply sequentially.", hint: after2Str },
    ),
  );
}

export function levelReviewLesson(
  trackLevel: PercentTrackLevel,
  slug: string,
  title: string,
  questions: { prompt: string; choices: string[]; answer: string }[],
  difficulty: PercentDifficulty = "beginner",
): PercentLessonSeed {
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
