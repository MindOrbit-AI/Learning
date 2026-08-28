import {
  balanceAddLesson,
  coefficientsLesson,
  expressionLesson,
  levelReviewLesson,
  variablesLesson,
} from "./_helpers";

/** Level 1 — Variables */
export const ALGEBRA_LINEQ_LEVEL_1_SEEDS = [
  variablesLesson(1, "variables", "Variables"),
  balanceAddLesson(1, "finding-unknown-values", "Finding Unknown Values", 3, 11),
  coefficientsLesson(1, "combining-and-coefficients", "Combining and Coefficients", 4, 2),
  expressionLesson(1, "writing-expressions", "Writing Expressions"),
  levelReviewLesson(1, "level-review", "Level Review", [
    { prompt: "A variable represents…", choices: ["An unknown value", "Always 0", "Only whole numbers", "A fixed constant"], answer: "An unknown value" },
    { prompt: "x + 5 = 12 → x = ?", choices: ["7", "5", "12", "17"], answer: "7" },
    { prompt: "4x means…", choices: ["4 × x", "4 + x", "x + 4", "x ÷ 4"], answer: "4 × x" },
    { prompt: "Expression for ‘twice a number n’?", choices: ["2n", "n + 2", "n²", "n/2"], answer: "2n" },
  ]),
];
