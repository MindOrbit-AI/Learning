export type SceneOutcome = {
  isCorrect: boolean;
  attempts: number;
  /** Deepest hint tier revealed (1–3), or 0 if none */
  maxHintLevel?: number;
};

/**
 * Star rating for a completed mission.
 * - 3: perfect score, one attempt per item, no hints
 * - 2: perfect score with retries and/or hints
 * - 1: incomplete mastery on at least one item (passed with gaps)
 */
export function starsFromSceneOutcomes(outcomes: SceneOutcome[]): 1 | 2 | 3 {
  if (outcomes.length === 0) return 2;
  const n = outcomes.length;
  const correct = outcomes.filter((o) => o.isCorrect).length;
  if (correct < n) return 1;

  const maxAttempts = Math.max(...outcomes.map((o) => o.attempts), 1);
  const maxHints = Math.max(...outcomes.map((o) => o.maxHintLevel ?? 0), 0);
  if (maxAttempts <= 1 && maxHints === 0) return 3;
  return 2;
}

export function starsFromTaskOutcome(params: {
  totalTasks: number;
  correctCount: number;
  taskIds: string[];
  checkCountsByTask: Record<string, number>;
}): 1 | 2 | 3 {
  const { totalTasks, correctCount, taskIds, checkCountsByTask } = params;
  if (totalTasks === 0) return 2;
  if (correctCount < totalTasks) return 1;

  const counts = taskIds.map((id) => Math.max(1, checkCountsByTask[id] ?? 1));
  if (counts.every((c) => c <= 1)) return 3;
  return 2;
}

/** missionType: Prisma MissionType string */
export function xpFromMissionPerformance(opts: {
  xpReward: number;
  accuracy01: number;
  stars: 1 | 2 | 3;
  missionType: string;
}): number {
  const acc = Math.max(0, Math.min(1, opts.accuracy01));
  let xp = opts.xpReward * (0.5 + 0.5 * acc);
  const starFactor = opts.stars === 3 ? 1.12 : opts.stars === 2 ? 1 : 0.88;
  xp *= starFactor;
  if (opts.missionType === "repair") xp += 5;
  if (opts.missionType === "challenge") xp *= 1.08;
  return Math.max(1, Math.round(xp));
}

export function starRatingLabel(stars: 1 | 2 | 3): string {
  switch (stars) {
    case 3:
      return "Flawless";
    case 2:
      return "Solid";
    default:
      return "Passed";
  }
}
