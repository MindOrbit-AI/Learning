import { FRACTIONS_VISUAL_LESSON_SEED } from "./visual-engine-fractions-lesson";
import { DECIMALS_VISUAL_LESSON_SEED } from "./visual-engine-decimals-lesson";
import { PHYSICS_MEASUREMENT_LESSON_SEED } from "./visual-engine-physics-measurement-lesson";
import { SLOPE_INTRO_VISUAL_LESSON_SEED } from "./visual-engine-slope-intro-lesson";
import { BIOLOGY_MITOSIS_LESSON_SEED } from "./visual-engine-biology-mitosis-lesson";
import { BIOLOGY_PHOTOSYNTHESIS_LESSON_SEED } from "./visual-engine-biology-photosynthesis-lesson";
import { CHEMISTRY_ATOMS_LESSON_SEED } from "./visual-engine-chemistry-atoms-lesson";
import { CHEMISTRY_LAB_SAFETY_LESSON_SEED } from "./visual-engine-chemistry-lab-lesson";
import { CHEMISTRY_BALANCING_LESSON_SEED } from "./visual-engine-chemistry-balancing-lesson";
import { CHEMISTRY_LIMITING_LESSON_SEED } from "./visual-engine-chemistry-limiting-lesson";
import { CHEMISTRY_THERMO_LESSON_SEED } from "./visual-engine-chemistry-thermo-lesson";
import { PHYSICS_FORCES_LESSON_SEED } from "./visual-engine-physics-forces-lesson";
import { BIOLOGY_DNA_LESSON_SEED } from "./visual-engine-biology-dna-lesson";
import { MATH_LINEAR_EQUATIONS_LESSON_SEED } from "./visual-engine-math-linear-equations-lesson";
import { BIOLOGY_PUNNETT_LESSON_SEED } from "./visual-engine-biology-punnett-lesson";
import { PHYSICS_CIRCUITS_LESSON_SEED } from "./visual-engine-physics-circuits-lesson";
import { CHEMISTRY_PERIODIC_TRENDS_LESSON_SEED } from "./visual-engine-chemistry-periodic-trends-lesson";
import { CHEMISTRY_BONDING_LESSON_SEED } from "./visual-engine-chemistry-bonding-lesson";
import { MATH_PYTHAGOREAN_LESSON_SEED } from "./visual-engine-math-pythagorean-lesson";
import { MATH_BALANCE_EQUALITY_LESSON_SEED } from "./visual-engine-math-balance-equality-lesson";
import { MATH_BALANCE_EQUATIONS_LESSON_SEED } from "./visual-engine-math-balance-equations-lesson";
import { MATH_BALANCE_FRACTIONS_LESSON_SEED } from "./visual-engine-math-balance-fractions-lesson";
import { MATH_GEAR_RATIOS_LESSON_SEED } from "./visual-engine-math-gear-ratios-lesson";
import { MATH_GEAR_ALGEBRA_LESSON_SEED } from "./visual-engine-math-gear-algebra-lesson";
import { MATH_QUADRATIC_EQUATIONS_LESSON_SEED } from "./visual-engine-math-quadratic-equations-lesson";
import { MATH_FRACTIONS_CURRICULUM_SEEDS } from "./math-fractions";
import { MATH_ALGEBRA_CURRICULUM_SEEDS } from "./math-algebra";
import { MATH_INTEGERS_CURRICULUM_SEEDS } from "./math-integers";
import { MATH_COORDINATE_PLANE_CURRICULUM_SEEDS } from "./math-coordinate-plane";
import { MATH_PERCENTS_CURRICULUM_SEEDS } from "./math-percents";
import { MATH_PROPORTIONAL_REASONING_CURRICULUM_SEEDS } from "./math-proportional-reasoning";
import { BIOLOGY_NATURAL_SELECTION_LESSON_SEED } from "./visual-engine-biology-natural-selection-lesson";
import { PHYSICS_WORK_ENERGY_LESSON_SEED } from "./visual-engine-physics-work-energy-lesson";

/** All built-in Visual Problem Engine lessons (canonical JSON for DB + app). */
export const VISUAL_ENGINE_LESSON_SEEDS = [
  FRACTIONS_VISUAL_LESSON_SEED,
  DECIMALS_VISUAL_LESSON_SEED,
  PHYSICS_MEASUREMENT_LESSON_SEED,
  SLOPE_INTRO_VISUAL_LESSON_SEED,
  BIOLOGY_MITOSIS_LESSON_SEED,
  BIOLOGY_PHOTOSYNTHESIS_LESSON_SEED,
  CHEMISTRY_ATOMS_LESSON_SEED,
  CHEMISTRY_LAB_SAFETY_LESSON_SEED,
  CHEMISTRY_BALANCING_LESSON_SEED,
  CHEMISTRY_LIMITING_LESSON_SEED,
  CHEMISTRY_THERMO_LESSON_SEED,
  PHYSICS_FORCES_LESSON_SEED,
  BIOLOGY_DNA_LESSON_SEED,
  MATH_LINEAR_EQUATIONS_LESSON_SEED,
  BIOLOGY_PUNNETT_LESSON_SEED,
  PHYSICS_CIRCUITS_LESSON_SEED,
  CHEMISTRY_PERIODIC_TRENDS_LESSON_SEED,
  CHEMISTRY_BONDING_LESSON_SEED,
  MATH_PYTHAGOREAN_LESSON_SEED,
  MATH_BALANCE_EQUALITY_LESSON_SEED,
  MATH_BALANCE_EQUATIONS_LESSON_SEED,
  MATH_BALANCE_FRACTIONS_LESSON_SEED,
  MATH_GEAR_RATIOS_LESSON_SEED,
  MATH_GEAR_ALGEBRA_LESSON_SEED,
  MATH_QUADRATIC_EQUATIONS_LESSON_SEED,
  ...MATH_FRACTIONS_CURRICULUM_SEEDS,
  ...MATH_ALGEBRA_CURRICULUM_SEEDS,
  ...MATH_INTEGERS_CURRICULUM_SEEDS,
  ...MATH_COORDINATE_PLANE_CURRICULUM_SEEDS,
  ...MATH_PERCENTS_CURRICULUM_SEEDS,
  ...MATH_PROPORTIONAL_REASONING_CURRICULUM_SEEDS,
  BIOLOGY_NATURAL_SELECTION_LESSON_SEED,
  PHYSICS_WORK_ENERGY_LESSON_SEED,
] as const;

/** Map catalog `subject` label to an existing `Subject.slug` row for FK + mastery resolution. */
export function subjectSlugForVisualLessonSeed(seed: { subject: string }): string {
  const s = seed.subject.toLowerCase();
  if (s === "physics") return "physics";
  if (s === "biology") return "biology";
  if (s === "chemistry") return "chemistry";
  return "algebra";
}
