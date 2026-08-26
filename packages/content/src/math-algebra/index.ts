import { MATH_ALGEBRA_LEVEL_1_SEEDS } from "./level-1";
import { MATH_ALGEBRA_LEVEL_2_SEEDS } from "./level-2";
import { MATH_ALGEBRA_LEVEL_3_SEEDS } from "./level-3";
import { MATH_ALGEBRA_LEVEL_4_SEEDS } from "./level-4";
import { MATH_ALGEBRA_LEVEL_5_SEEDS } from "./level-5";
import { MATH_ALGEBRA_LEVEL_6_SEEDS } from "./level-6";
import { MATH_ALGEBRA_LEVEL_7_SEEDS } from "./level-7";
import { MATH_ALGEBRA_LEVEL_8_SEEDS, MATH_ALGEBRA_LEVEL_9_SEEDS } from "./level-8-9";
import { MATH_ALGEBRA_LEVEL_10_SEEDS } from "./level-10";
import {
  MATH_ALGEBRA_LEVEL_11_SEEDS,
  MATH_ALGEBRA_LEVEL_12_SEEDS,
  MATH_ALGEBRA_LEVEL_13_SEEDS,
} from "./level-11-13";
import type { AlgebraLessonSeed } from "./_helpers";

export * from "./_helpers";
export { MATH_ALGEBRA_LEVEL_1_SEEDS } from "./level-1";
export { MATH_ALGEBRA_LEVEL_2_SEEDS } from "./level-2";
export { MATH_ALGEBRA_LEVEL_3_SEEDS } from "./level-3";
export { MATH_ALGEBRA_LEVEL_4_SEEDS } from "./level-4";
export { MATH_ALGEBRA_LEVEL_5_SEEDS } from "./level-5";
export { MATH_ALGEBRA_LEVEL_6_SEEDS } from "./level-6";
export { MATH_ALGEBRA_LEVEL_7_SEEDS } from "./level-7";
export { MATH_ALGEBRA_LEVEL_8_SEEDS, MATH_ALGEBRA_LEVEL_9_SEEDS } from "./level-8-9";
export { MATH_ALGEBRA_LEVEL_10_SEEDS } from "./level-10";
export {
  MATH_ALGEBRA_LEVEL_11_SEEDS,
  MATH_ALGEBRA_LEVEL_12_SEEDS,
  MATH_ALGEBRA_LEVEL_13_SEEDS,
} from "./level-11-13";

/** All Math algebra / unknowns track lessons (Levels 1–13). */
export const MATH_ALGEBRA_CURRICULUM_SEEDS: AlgebraLessonSeed[] = [
  ...MATH_ALGEBRA_LEVEL_1_SEEDS,
  ...MATH_ALGEBRA_LEVEL_2_SEEDS,
  ...MATH_ALGEBRA_LEVEL_3_SEEDS,
  ...MATH_ALGEBRA_LEVEL_4_SEEDS,
  ...MATH_ALGEBRA_LEVEL_5_SEEDS,
  ...MATH_ALGEBRA_LEVEL_6_SEEDS,
  ...MATH_ALGEBRA_LEVEL_7_SEEDS,
  ...MATH_ALGEBRA_LEVEL_8_SEEDS,
  ...MATH_ALGEBRA_LEVEL_9_SEEDS,
  ...MATH_ALGEBRA_LEVEL_10_SEEDS,
  ...MATH_ALGEBRA_LEVEL_11_SEEDS,
  ...MATH_ALGEBRA_LEVEL_12_SEEDS,
  ...MATH_ALGEBRA_LEVEL_13_SEEDS,
];

export const MATH_ALGEBRA_CURRICULUM_COUNT = MATH_ALGEBRA_CURRICULUM_SEEDS.length;
