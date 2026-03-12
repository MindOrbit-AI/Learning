/**
 * MindOrbit Learn - Shared Utilities
 */

export const SUBJECTS = {
  algebra: { slug: "algebra", title: "Algebra", icon: "📐", color: "#3B82F6" },
  geometry: { slug: "geometry", title: "Geometry", icon: "📏", color: "#8B5CF6" },
  chemistry: { slug: "chemistry", title: "Chemistry", icon: "⚗️", color: "#10B981" },
  biology: { slug: "biology", title: "Biology", icon: "🧬", color: "#22C55E" },
  worldHistory: { slug: "world-history", title: "World History", icon: "🌍", color: "#F59E0B" },
  satMath: { slug: "sat-math", title: "SAT Math", icon: "📊", color: "#EC4899" },
} as const;

export const NODE_STATE_COLORS = {
  mastered: "#22C55E",
  weak: "#F59E0B",
  missing: "#EF4444",
  learning: "#3B82F6",
  untouched: "#6B7280",
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
