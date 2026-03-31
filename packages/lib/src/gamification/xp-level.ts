/**
 * Derive learner level from lifetime XP. Level n starts at n² × 100 XP.
 */
export function levelFromXp(xp: number): number {
  if (xp <= 0) return 0;
  return Math.floor(Math.sqrt(xp / 100));
}

export function xpThresholdForLevel(level: number): number {
  return level * level * 100;
}
