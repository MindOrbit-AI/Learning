import { levelReviewLesson, percentDealLesson } from "./_helpers";

/** Level 12 — Working with decimals / percentages in equations */
export const ALGEBRA_LINEQ_LEVEL_12_SEEDS = [
  percentDealLesson(12, "adding-percentages", "Adding Percentages", 100, 20),
  percentDealLesson(12, "subtracting-percentages", "Subtracting Percentages", 80, 25),
  percentDealLesson(12, "two-discounts", "Two Discounts", 200, 10),
  percentDealLesson(12, "comparing-deals", "Comparing Deals", 50, 15),
  levelReviewLesson(12, "level-review", "Level Review", [
    { prompt: "20% of 100 = ?", choices: ["20", "80", "120", "200"], answer: "20" },
    { prompt: "$80 − 25% off = ?", choices: ["60", "55", "75", "20"], answer: "60" },
    { prompt: "Increase 100 by 10% →", choices: ["110", "100", "10", "90"], answer: "110" },
    { prompt: "Percent means…", choices: ["Per hundred", "Per ten", "Per whole", "Per thousand"], answer: "Per hundred" },
  ]),
];
