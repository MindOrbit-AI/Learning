export type QuestionDifficulty = "easy" | "medium" | "hard" | string;

export function xpForCorrect(difficulty: QuestionDifficulty): number {
  const d = String(difficulty).toLowerCase();
  if (d === "hard") return 35;
  if (d === "medium") return 20;
  return 10;
}

export function xpStreakBonus(streak: number): number {
  if (streak <= 0) return 0;
  return Math.min(streak, 12) * 5;
}

export const XP_COMPLETION_BONUS = 50;

export function speedBonusPoints(responseTimeMs: number, maxMs = 15000): number {
  if (responseTimeMs <= 0 || responseTimeMs >= maxMs) return 0;
  const ratio = 1 - responseTimeMs / maxMs;
  return Math.round(15 * ratio);
}
