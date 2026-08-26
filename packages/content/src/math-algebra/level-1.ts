import {
  balanceAddLesson,
  balanceMultLesson,
  lesson,
  matchScene,
  mcScene,
} from "./_helpers";

export const MATH_ALGEBRA_LEVEL_1_SEEDS = [
  balanceAddLesson(1, "finding-unknowns", "Finding Unknowns", 2, 5),
  balanceAddLesson(1, "equations-with-unknowns", "Equations with Unknowns", 3, 8),
  lesson(
    1,
    "building-expressions",
    "Building Expressions",
    "beginner",
    [
      matchScene(
        "l1-build-1",
        "Build 2 + x",
        "Match parts to the expression 2 + x.",
        [
          { id: "two", label: "2" },
          { id: "x", label: "x" },
          { id: "plus", label: "+" },
          { id: "five", label: "5" },
        ],
        [
          { id: "const", label: "Constant" },
          { id: "var", label: "Variable" },
        ],
        { const: "two", var: "x" },
        "build_expr_parts",
        {
          correct: "2 + x — constant plus unknown.",
          incorrect: "A constant and a variable are the building blocks.",
          hint: "2 is known; x is unknown.",
        },
      ),
      mcScene(
        "l1-build-2",
        "Expression value",
        "If x = 3, what is 2 + x?",
        ["5", "6", "2", "3"],
        "5",
        "build_expr_eval",
        {
          correct: "2 + 3 = 5.",
          incorrect: "Replace x with 3.",
          hint: "Substitute x = 3.",
        },
      ),
      matchScene(
        "l1-build-3",
        "Match 3x",
        "Match the expression 3x to its meaning.",
        [
          { id: "a", label: "3 × x" },
          { id: "b", label: "3 + x" },
          { id: "c", label: "x + x + x" },
        ],
        [{ id: "mean", label: "Meaning of 3x" }],
        { mean: "a" },
        "build_expr_3x",
        {
          correct: "3x means 3 times x.",
          incorrect: "Multiplication shorthand: 3x = 3 × x.",
          hint: "Coefficient times variable.",
        },
      ),
    ],
    mcScene(
      "l1-build-final",
      "Mastery check",
      "Which expression means ‘a number x plus 4’?",
      ["x + 4", "4x", "x − 4", "4 − x"],
      "x + 4",
      "build_expr_mastery",
      {
        correct: "Building Expressions complete.",
        incorrect: "Plus 4 → add 4 to x.",
        hint: "x plus 4.",
      },
    ),
  ),
  balanceMultLesson(1, "working-with-unknowns", "Working with Unknowns", 2, 8),
  balanceAddLesson(1, "level-1-check", "Level 1 Check", 4, 11),
] as const;
