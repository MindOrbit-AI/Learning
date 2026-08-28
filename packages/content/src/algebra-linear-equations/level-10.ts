import { infiniteSolutionsLesson, levelReviewLesson, noSolutionsLesson } from "./_helpers";

/** Level 10 — Equations with no or many solutions */
export const ALGEBRA_LINEQ_LEVEL_10_SEEDS = [
  noSolutionsLesson(10, "no-solutions", "No Solutions"),
  infiniteSolutionsLesson(10, "many-solutions", "Many Solutions"),
  levelReviewLesson(10, "identifying-solutions", "Identifying Solutions", [
    { prompt: "2x + 4 = 2(x + 2) has…", choices: ["Infinitely many solutions", "No solution", "Exactly one", "Two solutions"], answer: "Infinitely many solutions" },
    { prompt: "x + 3 = x + 5 has…", choices: ["No solution", "One solution", "x = 2", "All real numbers"], answer: "No solution" },
    { prompt: "0 = 0 means…", choices: ["Always true", "Never true", "x = 0", "No x"], answer: "Always true" },
    { prompt: "Contradiction like 0 = 4 means…", choices: ["No solution", "Many solutions", "x = 4", "x = 0"], answer: "No solution" },
  ]),
  levelReviewLesson(10, "level-review", "Level Review", [
    { prompt: "3x + 6 = 3(x + 2) →", choices: ["Identity (all x)", "No solution", "x = 2", "x = 0"], answer: "Identity (all x)" },
    { prompt: "2x + 1 = 2x + 4 →", choices: ["No solution", "x = 3", "All x", "x = 0"], answer: "No solution" },
    { prompt: "Same line on graph →", choices: ["Infinite solutions", "No solutions", "One point", "Two points"], answer: "Infinite solutions" },
    { prompt: "Parallel lines →", choices: ["No solution", "One solution", "Infinite", "Two solutions"], answer: "No solution" },
  ]),
];
