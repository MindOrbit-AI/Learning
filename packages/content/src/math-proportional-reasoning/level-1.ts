import {
  levelReviewLesson,
  mixtureLesson,
  ratioSetupLesson,
  scaleRatioLesson,
} from "./_helpers";

/** Level 1 — Setting up ratios */
export const MATH_PROP_LEVEL_1_SEEDS = [
  ratioSetupLesson(1, "setting-up-ratios", "Setting Up Ratios", 2, 3, "Paint mix"),
  scaleRatioLesson(1, "scaling-up", "Scaling Up", 2, 3, 2, "up"),
  scaleRatioLesson(1, "scaling-down", "Scaling Down", 4, 6, 2, "down"),
  mixtureLesson(1, "making-a-new-mixture", "Making a New Mixture", 1, 4, 3),
  levelReviewLesson(1, "level-check", "Level Check", [
    { prompt: "Ratio 3:5 means…", choices: ["3 to 5", "5 to 3", "8 total only", "3 × 5"], answer: "3 to 5" },
    { prompt: "2:3 scaled by 4 = ?", choices: ["8:12", "6:7", "2:12", "4:4"], answer: "8:12" },
    { prompt: "Equivalent ratios have…", choices: ["Same relationship", "Same sum", "Same product", "Different scale"], answer: "Same relationship" },
    { prompt: "1:2 with multiplier 5 → first part?", choices: ["5", "2", "10", "1"], answer: "5" },
  ]),
];
