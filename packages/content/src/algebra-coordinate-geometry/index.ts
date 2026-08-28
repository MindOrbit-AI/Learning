import { ALGEBRA_CGEO_LEVEL_1_SEEDS } from "./level-1";
import { ALGEBRA_CGEO_LEVEL_2_SEEDS } from "./level-2";
import { ALGEBRA_CGEO_LEVEL_3_SEEDS } from "./level-3";
import { ALGEBRA_CGEO_LEVEL_4_SEEDS } from "./level-4";
import { ALGEBRA_CGEO_LEVEL_5_SEEDS } from "./level-5";
import { ALGEBRA_CGEO_LEVEL_6_SEEDS } from "./level-6";
import { ALGEBRA_CGEO_LEVEL_7_SEEDS } from "./level-7";
import { ALGEBRA_CGEO_LEVEL_8_SEEDS } from "./level-8";
import { ALGEBRA_CGEO_LEVEL_9_SEEDS } from "./level-9";
import { ALGEBRA_CGEO_LEVEL_10_SEEDS } from "./level-10";
import type { CgeoLessonSeed } from "./_helpers";

export { ALGEBRA_CGEO_LEVEL_1_SEEDS } from "./level-1";
export { ALGEBRA_CGEO_LEVEL_2_SEEDS } from "./level-2";
export { ALGEBRA_CGEO_LEVEL_3_SEEDS } from "./level-3";
export { ALGEBRA_CGEO_LEVEL_4_SEEDS } from "./level-4";
export { ALGEBRA_CGEO_LEVEL_5_SEEDS } from "./level-5";
export { ALGEBRA_CGEO_LEVEL_6_SEEDS } from "./level-6";
export { ALGEBRA_CGEO_LEVEL_7_SEEDS } from "./level-7";
export { ALGEBRA_CGEO_LEVEL_8_SEEDS } from "./level-8";
export { ALGEBRA_CGEO_LEVEL_9_SEEDS } from "./level-9";
export { ALGEBRA_CGEO_LEVEL_10_SEEDS } from "./level-10";

/** All Algebra coordinate geometry track lessons (Levels 1–10). */
export const ALGEBRA_COORDINATE_GEOMETRY_CURRICULUM_SEEDS: CgeoLessonSeed[] = [
  ...ALGEBRA_CGEO_LEVEL_1_SEEDS,
  ...ALGEBRA_CGEO_LEVEL_2_SEEDS,
  ...ALGEBRA_CGEO_LEVEL_3_SEEDS,
  ...ALGEBRA_CGEO_LEVEL_4_SEEDS,
  ...ALGEBRA_CGEO_LEVEL_5_SEEDS,
  ...ALGEBRA_CGEO_LEVEL_6_SEEDS,
  ...ALGEBRA_CGEO_LEVEL_7_SEEDS,
  ...ALGEBRA_CGEO_LEVEL_8_SEEDS,
  ...ALGEBRA_CGEO_LEVEL_9_SEEDS,
  ...ALGEBRA_CGEO_LEVEL_10_SEEDS,
];

export const ALGEBRA_COORDINATE_GEOMETRY_CURRICULUM_COUNT =
  ALGEBRA_COORDINATE_GEOMETRY_CURRICULUM_SEEDS.length;
