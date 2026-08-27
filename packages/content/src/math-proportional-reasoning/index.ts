import { MATH_PROP_LEVEL_1_SEEDS } from "./level-1";
import { MATH_PROP_LEVEL_2_SEEDS } from "./level-2";
import { MATH_PROP_LEVEL_3_SEEDS } from "./level-3";
import { MATH_PROP_LEVEL_4_SEEDS } from "./level-4";
import { MATH_PROP_LEVEL_5_SEEDS } from "./level-5";
import { MATH_PROP_LEVEL_6_SEEDS } from "./level-6";
import { MATH_PROP_LEVEL_7_SEEDS } from "./level-7";
import type { PropLessonSeed } from "./_helpers";

export { MATH_PROP_LEVEL_1_SEEDS } from "./level-1";
export { MATH_PROP_LEVEL_2_SEEDS } from "./level-2";
export { MATH_PROP_LEVEL_3_SEEDS } from "./level-3";
export { MATH_PROP_LEVEL_4_SEEDS } from "./level-4";
export { MATH_PROP_LEVEL_5_SEEDS } from "./level-5";
export { MATH_PROP_LEVEL_6_SEEDS } from "./level-6";
export { MATH_PROP_LEVEL_7_SEEDS } from "./level-7";

/** All Math proportional reasoning track lessons (Levels 1–7). */
export const MATH_PROPORTIONAL_REASONING_CURRICULUM_SEEDS: PropLessonSeed[] = [
  ...MATH_PROP_LEVEL_1_SEEDS,
  ...MATH_PROP_LEVEL_2_SEEDS,
  ...MATH_PROP_LEVEL_3_SEEDS,
  ...MATH_PROP_LEVEL_4_SEEDS,
  ...MATH_PROP_LEVEL_5_SEEDS,
  ...MATH_PROP_LEVEL_6_SEEDS,
  ...MATH_PROP_LEVEL_7_SEEDS,
];

export const MATH_PROPORTIONAL_REASONING_CURRICULUM_COUNT =
  MATH_PROPORTIONAL_REASONING_CURRICULUM_SEEDS.length;
