import { compoundInequalityLesson, lesson, mcScene } from "./_helpers";

/** Level 13 — Multiple / compound inequalities */
export const ALGEBRA_LINEQ_LEVEL_13_SEEDS = [
  lesson(
    13,
    "multiple-inequalities",
    "Multiple Inequalities",
    "intermediate",
    [
      mcScene(
        "l13-mult-1",
        "And",
        "x > 2 AND x < 5 means…",
        ["2 < x < 5", "x > 5", "x < 2", "All real x"],
        "2 < x < 5",
        "l13_mult_and",
        { correct: "Intersection: between 2 and 5.", incorrect: "Both must hold.", hint: "2 < x < 5." },
      ),
      mcScene(
        "l13-mult-2",
        "Or",
        "x < −1 OR x > 3 allows…",
        ["x = 4", "x = 0", "x = −1", "x = 3"],
        "x = 4",
        "l13_mult_or",
        { correct: "4 > 3 satisfies OR.", incorrect: "0 is between −1 and 3.", hint: "x = 4." },
      ),
      mcScene(
        "l13-mult-3",
        "Graph",
        "Compound AND graphs as…",
        ["Overlap of two rays/intervals", "Two separate rays only", "Empty always", "A single point"],
        "Overlap of two rays/intervals",
        "l13_mult_graph",
        { correct: "Intersection on number line.", incorrect: "Overlap region.", hint: "Overlap." },
      ),
    ],
    mcScene(
      "l13-mult-final",
      "Mastery check",
      "−2 < x ≤ 4 includes x = ?",
      ["4", "5", "−2", "−3"],
      "4",
      "l13_mult_mastery",
      { correct: "4 is included (≤).", incorrect: "−2 not included (<).", hint: "4." },
    ),
  ),
  compoundInequalityLesson(13, "writing-compound-inequalities", "Writing Compound Inequalities", 1, 6),
  compoundInequalityLesson(13, "either-inequality", "Either Inequality", -3, 2),
  compoundInequalityLesson(13, "combining-graphs", "Combining Graphs", 0, 8),
  compoundInequalityLesson(13, "solving-compound-inequalities", "Solving Compound Inequalities", 2, 10),
];
