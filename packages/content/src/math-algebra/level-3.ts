import { distributeLesson, lesson, balanceTwoStepLesson, mcScene, sortScene } from "./_helpers";

export const MATH_ALGEBRA_LEVEL_3_SEEDS = [
  lesson(
    3,
    "groups-in-equations",
    "Groups in Equations",
    "intermediate",
    [
      mcScene(
        "l3-grp-1",
        "Parentheses",
        "2(x + 3) means…",
        ["2 times the group (x + 3)", "2 + x + 3", "2x + 3 only", "x + 5"],
        "2 times the group (x + 3)",
        "groups_meaning",
        {
          correct: "The group (x + 3) is multiplied by 2.",
          incorrect: "Parentheses group terms before multiplying.",
          hint: "Outside factor times the whole group.",
        },
      ),
      sortScene(
        "l3-grp-2",
        "Expand first",
        "Order: 2(x + 3) = 8 → distribute → solve.",
        ["x = 1", "2x + 6 = 8", "Distribute 2", "2(x + 3) = 8"],
        ["2(x + 3) = 8", "Distribute 2", "2x + 6 = 8", "x = 1"],
        "groups_order",
        {
          correct: "2x + 6 = 8 → x = 1.",
          incorrect: "Unpack the group before isolating x.",
          hint: "Distribute first.",
        },
      ),
      mcScene(
        "l3-grp-3",
        "After distribute",
        "2(x + 3) = 8 → 2x + 6 = 8 → x = ?",
        ["1", "2", "4", "6"],
        "1",
        "groups_solve",
        { correct: "x = 1.", incorrect: "Subtract 6, divide by 2.", hint: "8 − 6 = 2; 2÷2." },
      ),
    ],
    mcScene(
      "l3-grp-final",
      "Mastery check",
      "3(x + 1) = 12 → x = ?",
      ["3", "4", "1", "9"],
      "3",
      "groups_mastery",
      { correct: "x = 3.", incorrect: "3x + 3 = 12.", hint: "Distribute then solve." },
    ),
  ),
  distributeLesson(3, "working-with-groups", "Working with Groups", 2, 4, 1),
  balanceTwoStepLesson(3, "solving-with-groups", "Solving with Groups", 2, 5, 17),
  distributeLesson(3, "unpacking-boxes", "Unpacking Boxes", 3, 2, 4),
  distributeLesson(3, "distributing", "Distributing", 4, 1, 2),
] as const;
