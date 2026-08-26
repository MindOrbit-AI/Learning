import {
  balanceAddLesson,
  balanceMultLesson,
  balanceTwoStepLesson,
  lesson,
  mcScene,
  sortScene,
  substitutionLesson,
} from "./_helpers";

export const MATH_ALGEBRA_LEVEL_2_SEEDS = [
  balanceAddLesson(2, "finding-solutions", "Finding Solutions", 1, 6),
  balanceTwoStepLesson(2, "solving-multiple-equations", "Solving Multiple Equations", 2, 3, 11),
  lesson(
    2,
    "rewriting-equations",
    "Rewriting Equations",
    "beginner",
    [
      sortScene(
        "l2-rew-1",
        "Same equation",
        "Order steps to rewrite x + 5 = 12 as x = 7.",
        ["x = 7", "Subtract 5 from both sides", "x + 5 = 12", "x + 5 − 5 = 12 − 5"],
        ["x + 5 = 12", "Subtract 5 from both sides", "x + 5 − 5 = 12 − 5", "x = 7"],
        "rewrite_steps",
        {
          correct: "Equivalent equations — same solution.",
          incorrect: "Undo +5 on both sides.",
          hint: "Start with the original.",
        },
      ),
      mcScene(
        "l2-rew-2",
        "Equivalent?",
        "Which has the same solution as x + 5 = 12?",
        ["x = 7", "x = 5", "x + 7 = 5", "5x = 12"],
        "x = 7",
        "rewrite_equiv",
        {
          correct: "x = 7 is the solved form.",
          incorrect: "Solve x + 5 = 12.",
          hint: "12 − 5.",
        },
      ),
      mcScene(
        "l2-rew-3",
        "Balance view",
        "Rewriting x + 5 = 12 removes 5 from both pans. This keeps…",
        ["Balance", "The unknown", "Only the left pan", "The constant 5"],
        "Balance",
        "rewrite_balance",
        {
          correct: "Balance preserved → equivalent equation.",
          incorrect: "Same operation on both sides.",
          hint: "Scale stays level.",
        },
      ),
    ],
    mcScene(
      "l2-rew-final",
      "Mastery check",
      "Rewrite 2x = 10 as x = ?",
      ["5", "10", "2", "20"],
      "5",
      "rewrite_mastery",
      { correct: "x = 5.", incorrect: "Divide by 2.", hint: "10 ÷ 2." },
    ),
  ),
  balanceMultLesson(2, "isolating-unknowns", "Isolating Unknowns", 3, 15),
  balanceTwoStepLesson(2, "solving-an-equation", "Solving an Equation", 3, 2, 14),
  substitutionLesson(2, "substitution", "Substitution", "y = x + 1", 4, "x + 1 = 7", 6),
  balanceTwoStepLesson(2, "level-2-check", "Level 2 Check", 2, 4, 18),
] as const;
