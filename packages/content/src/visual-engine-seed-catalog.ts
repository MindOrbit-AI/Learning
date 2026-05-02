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
] as const;

/** Map catalog `subject` label to an existing `Subject.slug` row for FK + mastery resolution. */
export function subjectSlugForVisualLessonSeed(seed: { subject: string }): string {
  const s = seed.subject.toLowerCase();
  if (s === "physics") return "physics";
  if (s === "biology") return "biology";
  if (s === "chemistry") return "chemistry";
  return "algebra";
}
