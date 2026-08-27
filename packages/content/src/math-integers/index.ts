import { MATH_INTEGERS_LEVEL_1_SEEDS } from "./level-1";
import { MATH_INTEGERS_LEVEL_2_SEEDS } from "./level-2";
import { MATH_INTEGERS_LEVEL_3_SEEDS } from "./level-3";
import { MATH_INTEGERS_LEVEL_4_SEEDS } from "./level-4";
import { MATH_INTEGERS_LEVEL_5_SEEDS } from "./level-5";
import { MATH_INTEGERS_LEVEL_6_SEEDS } from "./level-6";
import { MATH_INTEGERS_LEVEL_7_SEEDS } from "./level-7";
import { MATH_INTEGERS_LEVEL_8_SEEDS } from "./level-8";
import type { IntegerLessonSeed } from "./_helpers";

export * from "./_helpers";
export { MATH_INTEGERS_LEVEL_1_SEEDS } from "./level-1";
export { MATH_INTEGERS_LEVEL_2_SEEDS } from "./level-2";
export { MATH_INTEGERS_LEVEL_3_SEEDS } from "./level-3";
export { MATH_INTEGERS_LEVEL_4_SEEDS } from "./level-4";
export { MATH_INTEGERS_LEVEL_5_SEEDS } from "./level-5";
export { MATH_INTEGERS_LEVEL_6_SEEDS } from "./level-6";
export { MATH_INTEGERS_LEVEL_7_SEEDS } from "./level-7";
export { MATH_INTEGERS_LEVEL_8_SEEDS } from "./level-8";

/** All Math negative numbers track lessons (Levels 1–8). */
export const MATH_INTEGERS_CURRICULUM_SEEDS: IntegerLessonSeed[] = [
  ...MATH_INTEGERS_LEVEL_1_SEEDS,
  ...MATH_INTEGERS_LEVEL_2_SEEDS,
  ...MATH_INTEGERS_LEVEL_3_SEEDS,
  ...MATH_INTEGERS_LEVEL_4_SEEDS,
  ...MATH_INTEGERS_LEVEL_5_SEEDS,
  ...MATH_INTEGERS_LEVEL_6_SEEDS,
  ...MATH_INTEGERS_LEVEL_7_SEEDS,
  ...MATH_INTEGERS_LEVEL_8_SEEDS,
];

export const MATH_INTEGERS_CURRICULUM_COUNT = MATH_INTEGERS_CURRICULUM_SEEDS.length;
