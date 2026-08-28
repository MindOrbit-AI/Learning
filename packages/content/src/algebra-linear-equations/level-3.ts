import { inequalityLesson, levelReviewLesson, lesson, mcScene } from "./_helpers";

/** Level 3 — Solving inequalities */
export const ALGEBRA_LINEQ_LEVEL_3_SEEDS = [
  inequalityLesson(3, "solutions-to-inequalities", "Solutions to Inequalities", 4, "gt"),
  inequalityLesson(3, "graphing-solutions", "Graphing Solutions", 2, "lt"),
  lesson(
    3,
    "reading-inequalities",
    "Reading Inequalities",
    "beginner",
    [
      mcScene(
        "l3-read-1",
        "Symbol",
        "x > 3 means x is…",
        ["Greater than 3", "Less than 3", "Equal to 3", "At most 3"],
        "Greater than 3",
        "l3_read_gt",
        { correct: "> means greater than.", incorrect: "Open end toward larger values.", hint: "Greater than 3." },
      ),
      mcScene(
        "l3-read-2",
        "Test a value",
        "Is x = 5 a solution to x > 3?",
        ["Yes", "No", "Only if x = 3", "Cannot tell"],
        "Yes",
        "l3_read_test",
        { correct: "5 > 3.", incorrect: "Plug in 5.", hint: "Yes." },
      ),
      mcScene(
        "l3-read-3",
        "Not a solution",
        "Which is NOT a solution to x ≤ 4?",
        ["5", "4", "3", "0"],
        "5",
        "l3_read_not",
        { correct: "5 is greater than 4.", incorrect: "≤ allows 4 and below.", hint: "5." },
      ),
    ],
    mcScene(
      "l3-read-final",
      "Mastery check",
      "x < 2 includes x = ?",
      ["1", "2", "3", "4"],
      "1",
      "l3_read_mastery",
      { correct: "1 < 2.", incorrect: "Strict less than 2.", hint: "1." },
    ),
  ),
  inequalityLesson(3, "finding-the-boundary", "Finding the Boundary", 6, "gt"),
  inequalityLesson(3, "solving-inequalities", "Solving Inequalities", 3, "lt"),
  levelReviewLesson(3, "level-review", "Level Review", [
    { prompt: "x + 2 > 7 → x > ?", choices: ["5", "9", "2", "7"], answer: "5" },
    { prompt: "Open circle on a graph means…", choices: ["Endpoint not included", "Endpoint included", "No solutions", "All real numbers"], answer: "Endpoint not included" },
    { prompt: "x ≥ −1 allows x = ?", choices: ["−1", "−2", "−3", "None of these"], answer: "−1" },
    { prompt: "Reverse direction when multiplying by negative?", choices: ["Yes", "No", "Only for equations", "Never"], answer: "Yes" },
  ]),
];
