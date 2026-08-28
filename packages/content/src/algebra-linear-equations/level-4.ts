import {
  balanceTwoStepLesson,
  bothSidesLesson,
  levelReviewLesson,
  lesson,
  mcScene,
} from "./_helpers";

/** Level 4 — Combining terms */
export const ALGEBRA_LINEQ_LEVEL_4_SEEDS = [
  lesson(
    4,
    "combining-terms",
    "Combining Terms",
    "beginner",
    [
      mcScene(
        "l4-comb-1",
        "Like terms",
        "3x + 2x combines to…",
        ["5x", "5x²", "6x", "x"],
        "5x",
        "l4_comb_like",
        { correct: "Add coefficients: 3 + 2 = 5.", incorrect: "Same variable → add coefs.", hint: "5x." },
      ),
      mcScene(
        "l4-comb-2",
        "Unlike terms",
        "3x + 4 can be simplified to…",
        ["3x + 4 (already simplest)", "7x", "7", "12x"],
        "3x + 4 (already simplest)",
        "l4_comb_unlike",
        { correct: "x and constants are unlike.", incorrect: "Cannot combine x and 4.", hint: "3x + 4." },
      ),
      mcScene(
        "l4-comb-3",
        "Combine constants",
        "2x + 5 + 3x − 1 = ?",
        ["5x + 4", "5x + 6", "6x + 4", "5x"],
        "5x + 4",
        "l4_comb_both",
        { correct: "5x + 4.", incorrect: "Group x terms and constants.", hint: "5x + 4." },
      ),
    ],
    mcScene(
      "l4-comb-final",
      "Mastery check",
      "7y − 2y = ?",
      ["5y", "9y", "5", "y"],
      "5y",
      "l4_comb_mastery",
      { correct: "5y.", incorrect: "Subtract coefficients.", hint: "5y." },
    ),
  ),
  balanceTwoStepLesson(4, "combining-to-solve", "Combining to Solve", 2, 4, 18),
  bothSidesLesson(4, "variables-on-both-sides", "Variables on Both Sides", 3, 2, 5),
  balanceTwoStepLesson(4, "solving-equations", "Solving Equations", 4, 1, 21),
  levelReviewLesson(4, "level-review", "Level Review", [
    { prompt: "4x + 3x = ?", choices: ["7x", "7", "12x", "x"], answer: "7x" },
    { prompt: "5x − 2 = 3x + 6 → move x terms?", choices: ["Subtract 3x both sides", "Add 3x", "Divide by x", "Ignore x"], answer: "Subtract 3x both sides" },
    { prompt: "2x + 1 = 9 → x = ?", choices: ["4", "5", "8", "10"], answer: "4" },
    { prompt: "Like terms must share…", choices: ["The same variable part", "Same coefficient", "Same sign", "Same constant"], answer: "The same variable part" },
  ]),
];
