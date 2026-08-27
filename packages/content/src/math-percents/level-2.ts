import { levelReviewLesson, percentIncreaseLesson } from "./_helpers";

/** Level 2 — Percent increase */
export const MATH_PERCENTS_LEVEL_2_SEEDS = [
  percentIncreaseLesson(2, "percent-increase", "Percent Increase", 100, 10),
  percentIncreaseLesson(2, "price-increase", "Price Increase", 40, 25),
  percentIncreaseLesson(2, "calculating-percent-increase", "Calculating Percent Increase", 80, 15),
  levelReviewLesson(2, "level-check", "Level Check", [
    { prompt: "10% increase on 200 adds…", choices: ["20", "10", "220", "200"], answer: "20" },
    { prompt: "50 + 20% = ?", choices: ["60", "70", "50", "20"], answer: "60" },
    { prompt: "Increase = percent × …", choices: ["Original", "New price", "Zero", "100 only"], answer: "Original" },
    { prompt: "100 + 5% = ?", choices: ["105", "100", "5", "150"], answer: "105" },
  ]),
];
