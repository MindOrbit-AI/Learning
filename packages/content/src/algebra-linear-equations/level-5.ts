import {
  balanceAddLesson,
  balanceTwoStepLesson,
  levelReviewLesson,
  lesson,
  mcScene,
  negativeCoefLesson,
} from "./_helpers";

/** Level 5 — Negative values */
export const ALGEBRA_LINEQ_LEVEL_5_SEEDS = [
  lesson(
    5,
    "negative-values",
    "Negative Values",
    "beginner",
    [
      mcScene(
        "l5-neg-1",
        "Negative solution",
        "x + 8 = 3 → x = ?",
        ["−5", "5", "11", "−11"],
        "−5",
        "l5_neg_sol",
        { correct: "3 − 8 = −5.", incorrect: "Subtract 8.", hint: "−5." },
      ),
      mcScene(
        "l5-neg-2",
        "Number line",
        "−3 is to the ___ of 0.",
        ["Left", "Right", "Above", "Same place"],
        "Left",
        "l5_neg_nl",
        { correct: "Negatives left of zero.", incorrect: "Left on number line.", hint: "Left." },
      ),
      mcScene(
        "l5-neg-3",
        "Check",
        "If x = −2, is x + 5 = 3 true?",
        ["Yes", "No", "Sometimes", "Undefined"],
        "Yes",
        "l5_neg_check",
        { correct: "−2 + 5 = 3.", incorrect: "Substitute x = −2.", hint: "Yes." },
      ),
    ],
    mcScene(
      "l5-neg-final",
      "Mastery check",
      "x − 4 = −1 → x = ?",
      ["3", "−3", "5", "−5"],
      "3",
      "l5_neg_mastery",
      { correct: "x = 3.", incorrect: "Add 4.", hint: "3." },
    ),
  ),
  balanceAddLesson(5, "missing-values-and-negatives", "Missing Values and Negatives", 7, 2),
  balanceTwoStepLesson(5, "negative-constants", "Negative Constants", 2, -3, 7),
  negativeCoefLesson(5, "negative-coefficients", "Negative Coefficients", -2, 3, 11),
  balanceTwoStepLesson(5, "more-missing-values", "More Missing Values", 3, -5, 10),
  levelReviewLesson(5, "level-review", "Level Review", [
    { prompt: "−x means…", choices: ["−1 × x", "x − 1", "1/x", "x + (−1)"], answer: "−1 × x" },
    { prompt: "x + (−6) = 1 → x = ?", choices: ["7", "−7", "5", "−5"], answer: "7" },
    { prompt: "−3x = 12 → x = ?", choices: ["−4", "4", "9", "−9"], answer: "−4" },
    { prompt: "Adding a negative is like…", choices: ["Subtracting", "Multiplying", "Dividing", "Squaring"], answer: "Subtracting" },
  ]),
];
