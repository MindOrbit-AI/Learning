import {
  addIntegersLesson,
  lesson,
  levelReviewLesson,
  mcScene,
  nlScene,
  oppositesLesson,
} from "./_helpers";

/** Level 2 — Addition, Opposites, and Zero */
export const MATH_INTEGERS_LEVEL_2_SEEDS = [
  addIntegersLesson(2, "increasing-value", "Increasing Value", 2, 3),
  addIntegersLesson(2, "decreasing-value", "Decreasing Value", 4, -3),
  lesson(
    2,
    "zero",
    "Zero",
    "beginner",
    [
      mcScene(
        "l2-zero-1",
        "Adding zero",
        "5 + 0 = ?",
        ["5", "0", "−5", "10"],
        "5",
        "l2_zero_add",
        { correct: "Adding 0 changes nothing.", incorrect: "Identity property.", hint: "5 stays 5." },
      ),
      mcScene(
        "l2-zero-2",
        "Opposite sum",
        "3 + (−3) = ?",
        ["0", "6", "−6", "3"],
        "0",
        "l2_zero_opp",
        { correct: "Opposites cancel to zero.", incorrect: "3 and −3 sum to 0.", hint: "Balance at zero." },
      ),
      nlScene("l2-zero-3", "Plot zero", "Place 0 on the number line.", 0, "l2_zero_nl", {
        correct: "Zero is the origin.",
        incorrect: "Center of the line.",
        hint: "0.",
      }),
    ],
    mcScene(
      "l2-zero-final",
      "Mastery check",
      "−4 + 4 = ?",
      ["0", "8", "−8", "4"],
      "0",
      "l2_zero_mastery",
      { correct: "Opposites → 0.", incorrect: "−4 + 4 cancels.", hint: "Zero." },
    ),
  ),
  oppositesLesson(2, "opposites", "Opposites", 5),
  addIntegersLesson(2, "adding-negatives", "Adding Negatives", -3, -4),
  addIntegersLesson(2, "adding-negatives-and-positives", "Adding Negatives and Positives", -2, 7),
  levelReviewLesson(2, "level-review", "Level Review", [
    { prompt: "Opposite of −6?", choices: ["6", "−6", "0", "1/6"], answer: "6" },
    { prompt: "−1 + (−2) = ?", choices: ["−3", "3", "−1", "1"], answer: "−3" },
    { prompt: "7 + 0 = ?", choices: ["7", "0", "−7", "14"], answer: "7" },
    { prompt: "−5 + 8 = ?", choices: ["3", "−3", "13", "−13"], answer: "3" },
  ]),
];
