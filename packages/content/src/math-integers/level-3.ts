import { lesson, levelReviewLesson, mcScene, subIntegersLesson } from "./_helpers";

/** Level 3 — Subtracting Integers */
export const MATH_INTEGERS_LEVEL_3_SEEDS = [
  lesson(
    3,
    "missing-values",
    "Missing Values",
    "beginner",
    [
      mcScene(
        "l3-miss-1",
        "Find the missing",
        "7 − ? = 3",
        ["4", "−4", "10", "−10"],
        "4",
        "l3_missing",
        { correct: "7 − 4 = 3.", incorrect: "What subtracts from 7 to get 3?", hint: "7 − 4." },
      ),
      mcScene(
        "l3-miss-2",
        "With negatives",
        "? − 5 = −2",
        ["3", "−3", "7", "−7"],
        "3",
        "l3_missing_neg",
        { correct: "3 − 5 = −2.", incorrect: "Add 5 to −2.", hint: "−2 + 5 = 3." },
      ),
      mcScene(
        "l3-miss-3",
        "Check",
        "−1 − ? = −4",
        ["3", "−3", "5", "−5"],
        "3",
        "l3_missing_check",
        { correct: "−1 − 3 = −4.", incorrect: "−1 − 3 moves left 3.", hint: "Subtract 3." },
      ),
    ],
    mcScene(
      "l3-miss-final",
      "Mastery check",
      "5 − ? = −1",
      ["6", "−6", "4", "−4"],
      "6",
      "l3_miss_mastery",
      { correct: "5 − 6 = −1.", incorrect: "Need to go below zero.", hint: "6." },
    ),
  ),
  subIntegersLesson(3, "subtracting-positives", "Subtracting Positives", 5, 3),
  subIntegersLesson(3, "subtracting-negatives", "Subtracting Negatives", 2, -4),
  subIntegersLesson(3, "subtracting-from-zero", "Subtracting From Zero", 0, 6),
  subIntegersLesson(3, "subtracting-positives-2", "Subtracting Positives 2", -3, 2),
  subIntegersLesson(3, "subtracting-negatives-2", "Subtracting Negatives 2", -1, -5),
  levelReviewLesson(3, "level-review", "Level Review", [
    { prompt: "8 − 3 = ?", choices: ["5", "−5", "11", "−11"], answer: "5" },
    { prompt: "2 − (−4) = ?", choices: ["6", "−6", "−2", "2"], answer: "6" },
    { prompt: "0 − 7 = ?", choices: ["−7", "7", "0", "−1"], answer: "−7" },
    { prompt: "−3 − 2 = ?", choices: ["−5", "5", "−1", "1"], answer: "−5" },
  ]),
];
