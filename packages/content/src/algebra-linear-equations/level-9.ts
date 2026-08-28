import { factorLesson, levelReviewLesson, lesson, mcScene } from "./_helpers";

/** Level 9 — Factoring */
export const ALGEBRA_LINEQ_LEVEL_9_SEEDS = [
  lesson(
    9,
    "factoring-constants",
    "Factoring Constants",
    "intermediate",
    [
      mcScene(
        "l9-fc-1",
        "GCF numbers",
        "GCF of 12 and 18?",
        ["6", "3", "36", "2"],
        "6",
        "l9_fc_gcf",
        { correct: "6 divides both.", incorrect: "Largest common factor.", hint: "6." },
      ),
      mcScene(
        "l9-fc-2",
        "Factor",
        "6x + 18 = ?",
        ["6(x + 3)", "6(x + 18)", "x(6 + 18)", "3(2x + 6)"],
        "6(x + 3)",
        "l9_fc_factor",
        { correct: "Factor out 6.", incorrect: "6(x + 3).", hint: "6(x + 3)." },
      ),
      mcScene(
        "l9-fc-3",
        "Check",
        "6(x + 3) expands to…",
        ["6x + 18", "6x + 3", "x + 18", "6x + 9"],
        "6x + 18",
        "l9_fc_check",
        { correct: "Distribute 6.", incorrect: "6·x + 6·3.", hint: "6x + 18." },
      ),
    ],
    mcScene(
      "l9-fc-final",
      "Mastery check",
      "4x + 20 = ?",
      ["4(x + 5)", "4(x + 20)", "x(4 + 5)", "20(x + 4)"],
      "4(x + 5)",
      "l9_fc_mastery",
      { correct: "4(x + 5).", incorrect: "Factor 4.", hint: "4(x + 5)." },
    ),
  ),
  factorLesson(9, "factoring-and-distributing", "Factoring and Distributing", 3, 4, 24),
  factorLesson(9, "greatest-common-factor", "Greatest Common Factor", 5, 2, 35),
  factorLesson(9, "factoring-to-solve", "Factoring to Solve", 4, 5, 36),
  levelReviewLesson(9, "level-review", "Level Review", [
    { prompt: "GCF of 8x² and 12x?", choices: ["4x", "4", "x", "24x"], answer: "4x" },
    { prompt: "5x + 15 = 0 → factor?", choices: ["5(x + 3)", "5(x + 15)", "x(5 + 15)", "5x(1 + 3)"], answer: "5(x + 3)" },
    { prompt: "Factoring reverses…", choices: ["Distributing", "Adding", "Graphing", "Inequalities"], answer: "Distributing" },
    { prompt: "3(x + 2) = 0 → x = ?", choices: ["−2", "2", "3", "−3"], answer: "−2" },
  ]),
];
