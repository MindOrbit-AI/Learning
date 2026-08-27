import {
  gridScene,
  lesson,
  levelReviewLesson,
  mcScene,
  percentFractionLesson,
  percentOfLesson,
} from "./_helpers";

/** Level 1 — Intro to percentages */
export const MATH_PERCENTS_LEVEL_1_SEEDS = [
  percentOfLesson(1, "working-out-percentages", "Working out Percentages", 20, 50),
  lesson(
    1,
    "percentages-and-batteries",
    "Percentages and Batteries",
    "beginner",
    [
      mcScene(
        "l1-bat-1",
        "Battery charge",
        "A battery at 75% means…",
        ["75 out of 100 capacity", "75 batteries total", "25% used only", "0.75 batteries left always"],
        "75 out of 100 capacity",
        "l1_battery_meaning",
        { correct: "75% full.", incorrect: "Percent of full charge.", hint: "75 per hundred." },
      ),
      gridScene(
        "l1-bat-2",
        "Shade charge",
        "Shade 60% of this 10×10 grid (60 cells).",
        10,
        10,
        60,
        "l1_battery_grid",
        { correct: "60 of 100 cells = 60%.", incorrect: "Shade 60 cells.", hint: "60 cells." },
      ),
      mcScene(
        "l1-bat-3",
        "Compare",
        "Which is more charged: 40% or 65%?",
        ["65%", "40%", "Equal", "Cannot tell"],
        "65%",
        "l1_battery_compare",
        { correct: "65 > 40.", incorrect: "Higher percent = more charge.", hint: "65%." },
      ),
    ],
    mcScene(
      "l1-bat-final",
      "Mastery check",
      "30% of 100 = ?",
      ["30", "70", "3", "300"],
      "30",
      "l1_battery_mastery",
      { correct: "30.", incorrect: "30% of 100.", hint: "30." },
    ),
  ),
  percentFractionLesson(1, "percentages-as-fractions", "Percentages as Fractions", 25),
  levelReviewLesson(1, "level-check", "Level Check", [
    { prompt: "50% means…", choices: ["50 per 100", "50 per 10", "1/50", "50 + 100"], answer: "50 per 100" },
    { prompt: "20% of 80 = ?", choices: ["16", "20", "80", "100"], answer: "16" },
    { prompt: "25% as a fraction?", choices: ["1/4", "1/2", "1/25", "25/1"], answer: "1/4" },
    { prompt: "100% of a whole = ?", choices: ["The whole", "Half", "Zero", "Double"], answer: "The whole" },
  ]),
];
