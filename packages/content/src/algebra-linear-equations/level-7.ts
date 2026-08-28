import { inequalityLesson, levelReviewLesson, lesson, mcScene } from "./_helpers";

/** Level 7 — Solving inequalities with negatives */
export const ALGEBRA_LINEQ_LEVEL_7_SEEDS = [
  lesson(
    7,
    "testing-values-in-inequalities",
    "Testing Values in Inequalities",
    "intermediate",
    [
      mcScene(
        "l7-test-1",
        "Pick a test",
        "Which value satisfies x > −2?",
        ["0", "−3", "−2", "−5"],
        "0",
        "l7_test_pick",
        { correct: "0 > −2.", incorrect: "Try each value.", hint: "0." },
      ),
      mcScene(
        "l7-test-2",
        "Fail",
        "Which fails x ≤ 1?",
        ["2", "1", "0", "−1"],
        "2",
        "l7_test_fail",
        { correct: "2 > 1.", incorrect: "≤ allows 1 and below.", hint: "2." },
      ),
      mcScene(
        "l7-test-3",
        "Strategy",
        "Testing values helps when…",
        ["Checking a solution", "Finding slope", "Factoring", "Graphing only"],
        "Checking a solution",
        "l7_test_strategy",
        { correct: "Plug in to verify.", incorrect: "Substitution check.", hint: "Checking." },
      ),
    ],
    mcScene(
      "l7-test-final",
      "Mastery check",
      "x < 4: is x = 3 a solution?",
      ["Yes", "No", "Only at 4", "Never"],
      "Yes",
      "l7_test_mastery",
      { correct: "3 < 4.", incorrect: "Test 3.", hint: "Yes." },
    ),
  ),
  inequalityLesson(7, "dividing-by-a-negative-value", "Dividing by a Negative Value", 2, "lt"),
  inequalityLesson(7, "graphing-solutions", "Graphing Solutions", 5, "gt"),
  inequalityLesson(7, "solving-inequalities", "Solving Inequalities", -2, "lt"),
  levelReviewLesson(7, "level-review", "Level Review", [
    { prompt: "−2x > 6 → x ___ −3", choices: ["<", ">", "=", "≥"], answer: "<" },
    { prompt: "Multiply inequality by −1: flip…", choices: ["The inequality sign", "Both sides only", "Nothing", "The variable"], answer: "The inequality sign" },
    { prompt: "x ≥ −4 includes x = ?", choices: ["−4", "−5", "−6", "None"], answer: "−4" },
    { prompt: "−3x ≤ 9 → x ≥ ?", choices: ["−3", "3", "−27", "27"], answer: "−3" },
  ]),
];
