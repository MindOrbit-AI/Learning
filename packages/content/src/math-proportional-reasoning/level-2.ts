import {
  equivalentRatioLesson,
  lesson,
  levelReviewLesson,
  mcScene,
  recipeBatchLesson,
  scaleRatioLesson,
} from "./_helpers";

/** Level 2 — Equivalent ratios */
export const MATH_PROP_LEVEL_2_SEEDS = [
  equivalentRatioLesson(2, "equivalent-ratios", "Equivalent Ratios", 2, 5),
  recipeBatchLesson(2, "scaling-up-recipes", "Scaling Up Recipes", 2, 1, 3),
  recipeBatchLesson(2, "making-batches", "Making Batches", 3, 2, 4),
  lesson(
    2,
    "finding-batches",
    "Finding Batches",
    "beginner",
    [
      mcScene(
        "l2-find-1",
        "Given amounts",
        "You have 12 cups flour and 6 cups sugar (ratio 2:1). How many batches?",
        ["6 batches", "2 batches", "12 batches", "1 batch"],
        "6 batches",
        "l2_finding_batches_count",
        { correct: "6 cups sugar = 6 one-batch recipes.", incorrect: "Divide by one-batch amount.", hint: "6 batches." },
      ),
      mcScene(
        "l2-find-2",
        "Limiting ingredient",
        "12 flour supports 6 batches (2 each). Sugar supports 6 (1 each). Batches possible?",
        ["6", "12", "3", "18"],
        "6",
        "l2_finding_batches_limit",
        { correct: "Both ingredients align at 6 batches.", incorrect: "Check each ingredient.", hint: "6." },
      ),
      mcScene(
        "l2-find-3",
        "Scale factor",
        "6 batches means scale factor…",
        ["6", "2", "12", "1"],
        "6",
        "l2_finding_batches_factor",
        { correct: "Multiply ratio by 6.", incorrect: "Batch count = scale factor.", hint: "6." },
      ),
    ],
    mcScene(
      "l2-find-final",
      "Mastery check",
      "Ratio 3:2, you have 9 and 6. Batches?",
      ["3", "2", "9", "6"],
      "3",
      "l2_finding_batches_mastery",
      { correct: "3 batches.", incorrect: "9÷3 or 6÷2.", hint: "3." },
    ),
  ),
  scaleRatioLesson(2, "scale-factor", "Scale Factor", 3, 4, 5, "up"),
  levelReviewLesson(2, "level-check", "Level Check", [
    { prompt: "2:5 = 4:? ", choices: ["10", "5", "8", "20"], answer: "10" },
    { prompt: "Recipe 2:1, 4 batches → flour?", choices: ["8", "4", "2", "6"], answer: "8" },
    { prompt: "Scale factor 3 on 1:4 →", choices: ["3:12", "4:7", "1:12", "3:4"], answer: "3:12" },
    { prompt: "Equivalent ratios: multiply both by…", choices: ["Same number", "Different numbers", "Add 1", "Subtract 1"], answer: "Same number" },
  ]),
];
