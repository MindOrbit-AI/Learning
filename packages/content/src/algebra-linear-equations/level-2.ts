import {
  balanceTwoStepLesson,
  levelReviewLesson,
  lesson,
  mcScene,
  solveDivideLesson,
  sortScene,
} from "./_helpers";

/** Level 2 — Solving equations */
export const ALGEBRA_LINEQ_LEVEL_2_SEEDS = [
  solveDivideLesson(2, "dividing-to-solve", "Dividing to Solve", 3, 15),
  balanceTwoStepLesson(2, "solving-in-two-steps", "Solving in Two Steps", 2, 3, 13),
  lesson(
    2,
    "equation-solving-moves",
    "Equation Solving Moves",
    "beginner",
    [
      sortScene(
        "l2-moves-1",
        "Valid moves",
        "Order steps to solve x + 4 = 9.",
        ["Subtract 4 from both sides", "x + 4 = 9", "x = 5", "Add 4 to both sides"],
        ["x + 4 = 9", "Subtract 4 from both sides", "x = 5"],
        "l2_moves_order",
        { correct: "Undo +4 on both sides.", incorrect: "Same operation both sides.", hint: "Subtract 4." },
      ),
      mcScene(
        "l2-moves-2",
        "Why it works",
        "Subtracting 4 from both sides keeps the equation…",
        ["Balanced / equivalent", "Wrong", "Only true for x", "Impossible"],
        "Balanced / equivalent",
        "l2_moves_why",
        { correct: "Equal changes → same solution.", incorrect: "Balance property.", hint: "Balanced." },
      ),
      mcScene(
        "l2-moves-3",
        "Inverse operation",
        "To undo +4, you…",
        ["Subtract 4", "Add 4", "Multiply by 4", "Divide by 4"],
        "Subtract 4",
        "l2_moves_inverse",
        { correct: "Inverse of add is subtract.", incorrect: "Opposite operation.", hint: "Subtract 4." },
      ),
    ],
    mcScene(
      "l2-moves-final",
      "Mastery check",
      "To undo ×3, you…",
      ["Divide by 3", "Add 3", "Subtract 3", "Multiply by 3"],
      "Divide by 3",
      "l2_moves_mastery",
      { correct: "Divide both sides by 3.", incorrect: "Inverse of multiply.", hint: "Divide by 3." },
    ),
  ),
  solveDivideLesson(2, "dividing-first", "Dividing First", 5, 20),
  balanceTwoStepLesson(2, "multiple-steps", "Multiple Steps", 3, 2, 17),
  levelReviewLesson(2, "level-review", "Level Review", [
    { prompt: "6x = 24 → x = ?", choices: ["4", "6", "24", "18"], answer: "4" },
    { prompt: "2x + 1 = 9 → x = ?", choices: ["4", "5", "8", "10"], answer: "4" },
    { prompt: "First step for 3x = 15?", choices: ["Divide by 3", "Add 3", "Subtract 3", "Square both sides"], answer: "Divide by 3" },
    { prompt: "x + 7 = 2 → x = ?", choices: ["−5", "5", "9", "−9"], answer: "−5" },
  ]),
];
