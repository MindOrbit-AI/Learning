import {
  closestPointLesson,
  combineSeparationsLesson,
  compareDistanceLesson,
  levelCheckLesson,
  separationLesson,
} from "./_helpers";

/** Level 1 — Distance between points */
export const ALGEBRA_CGEO_LEVEL_1_SEEDS = [
  separationLesson(1, "separation-between-points", "Separation Between Points", 0, 0, 4, 0),
  combineSeparationsLesson(1, "combining-separations", "Combining Separations", 3, 4),
  closestPointLesson(1, "the-closest-point", "The Closest Point"),
  compareDistanceLesson(1, "comparing-distance", "Comparing Distance"),
  levelCheckLesson(1, "level-check", "Level Check", [
    { prompt: "Distance from (0,0) to (3,0)?", choices: ["3", "0", "4", "9"], answer: "3" },
    { prompt: "3 east + 4 north → straight distance?", choices: ["5", "7", "3", "4"], answer: "5" },
    { prompt: "Which is closest to (0,0)?", choices: ["(1,1)", "(5,0)", "(0,6)", "(4,4)"], answer: "(1,1)" },
    { prompt: "Compare distances by…", choices: ["Computing each", "Adding x and y always", "Ignoring y", "Squaring x only"], answer: "Computing each" },
  ]),
];
