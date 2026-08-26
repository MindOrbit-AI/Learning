import { MATH_FRACTIONS_LEVEL_1_SEEDS } from "./level-1";
import { MATH_FRACTIONS_LEVEL_2_SEEDS } from "./level-2";
import { MATH_FRACTIONS_LEVEL_3_SEEDS } from "./level-3";
import { MATH_FRACTIONS_LEVEL_4_SEEDS } from "./level-4";
import { MATH_FRACTIONS_LEVEL_5_SEEDS } from "./level-5";
import type { FractionLessonSeed } from "./_helpers";

export * from "./_helpers";
export { MATH_FRACTIONS_LEVEL_1_SEEDS } from "./level-1";
export { MATH_FRACTIONS_LEVEL_2_SEEDS } from "./level-2";
export { MATH_FRACTIONS_LEVEL_3_SEEDS } from "./level-3";
export { MATH_FRACTIONS_LEVEL_4_SEEDS } from "./level-4";
export { MATH_FRACTIONS_LEVEL_5_SEEDS } from "./level-5";

/** All Math fractions track lessons (Levels 1–5). */
export const MATH_FRACTIONS_CURRICULUM_SEEDS: FractionLessonSeed[] = [
  ...MATH_FRACTIONS_LEVEL_1_SEEDS,
  ...MATH_FRACTIONS_LEVEL_2_SEEDS,
  ...MATH_FRACTIONS_LEVEL_3_SEEDS,
  ...MATH_FRACTIONS_LEVEL_4_SEEDS,
  ...MATH_FRACTIONS_LEVEL_5_SEEDS,
];

export const MATH_FRACTIONS_CURRICULUM_COUNT = MATH_FRACTIONS_CURRICULUM_SEEDS.length;
