import {
  distanceRangeLesson,
  equalDistanceLesson,
  estimateDistanceLesson,
  levelCheckLesson,
  withinDistanceLesson,
} from "./_helpers";

/** Level 2 — Estimating distance */
export const ALGEBRA_CGEO_LEVEL_2_SEEDS = [
  estimateDistanceLesson(2, "estimating-distance", "Estimating Distance", 3, 4),
  withinDistanceLesson(2, "within-a-distance", "Within a Distance", 5),
  distanceRangeLesson(2, "distance-ranges", "Distance Ranges"),
  equalDistanceLesson(2, "equal-distance", "Equal Distance"),
  estimateDistanceLesson(2, "estimating-distance-refined", "Estimating Distance", 5, 12, "intermediate"),
  levelCheckLesson(2, "level-check", "Level Check", [
    { prompt: "Distance (0,0) to (3,4) ≈ ?", choices: ["5", "7", "3", "12"], answer: "5" },
    { prompt: "(1,1) is within 2 units of origin?", choices: ["Yes", "No", "Only on axis", "Always"], answer: "Yes" },
    { prompt: "3 < d < 5 from origin forms…", choices: ["A ring", "A point", "A line", "Empty set"], answer: "A ring" },
    { prompt: "(3,4) and (4,3) from origin…", choices: ["Same distance", "Different", "Zero", "Undefined"], answer: "Same distance" },
  ], "intermediate"),
];
