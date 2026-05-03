/**
 * MindOrbit Learn - Shared Utilities
 */

export * from "./billing";
export { levelFromXp, xpThresholdForLevel } from "./gamification/xp-level";
export {
  starsFromSceneOutcomes,
  starsFromTaskOutcome,
  xpFromMissionPerformance,
  starRatingLabel,
  type SceneOutcome,
} from "./gamification/mission-performance";

export const SUBJECTS = {
  algebra: { slug: "algebra", title: "Algebra", icon: "📐", color: "#3B82F6" },
  geometry: { slug: "geometry", title: "Geometry", icon: "📏", color: "#8B5CF6" },
  chemistry: { slug: "chemistry", title: "Chemistry", icon: "⚗️", color: "#10B981" },
  biology: { slug: "biology", title: "Biology", icon: "🧬", color: "#22C55E" },
  worldHistory: { slug: "world-history", title: "World History", icon: "🌍", color: "#F59E0B" },
  satMath: { slug: "sat-math", title: "SAT Math", icon: "📊", color: "#EC4899" },
} as const;

export type SubjectKey = keyof typeof SUBJECTS;

export function isSubjectKey(k: string): k is SubjectKey {
  return Object.prototype.hasOwnProperty.call(SUBJECTS, k);
}

/** Slugs stored on `Subject` rows — use when resolving onboarding keys to the database. */
export function subjectSlugForKey(key: SubjectKey): string {
  return SUBJECTS[key].slug;
}

/** Subject keys offered in onboarding for each high-school-style grade (typical US sequencing). */
const ONBOARDING_SUBJECTS_BY_GRADE: Record<string, readonly SubjectKey[]> = {
  "9": ["algebra", "geometry", "biology", "worldHistory"],
  "10": ["algebra", "geometry", "biology", "chemistry", "worldHistory"],
  "11": ["algebra", "geometry", "biology", "chemistry", "worldHistory", "satMath"],
  "12": ["algebra", "geometry", "biology", "chemistry", "worldHistory", "satMath"],
  College: ["algebra", "geometry", "biology", "chemistry", "worldHistory", "satMath"],
  Other: ["algebra", "geometry", "biology", "chemistry", "worldHistory", "satMath"],
};

/** Returns which catalog subjects to show for onboarding step 3 for the given grade level. */
export function subjectKeysForGradeLevel(gradeLevel: string): SubjectKey[] {
  const keys = ONBOARDING_SUBJECTS_BY_GRADE[gradeLevel];
  if (keys) return [...keys];
  return Object.keys(SUBJECTS) as SubjectKey[];
}

export const NODE_STATE_COLORS = {
  mastered: "#22C55E",
  weak: "#F59E0B",
  learning: "#3B82F6",
  /** Not yet practiced — shown in red so it reads as “needs a first pass” on the map. */
  untouched: "#EF4444",
} as const;

export const RESOURCE_TYPE_LABELS = {
  note: "Note",
  summary: "Summary",
  flashcard_set: "Flashcards",
  diagram: "Diagram",
  walkthrough: "Walkthrough",
  mini_lesson: "Mini-lesson",
} as const;

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
