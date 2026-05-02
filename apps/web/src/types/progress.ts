export type ProgressSnapshot = {
  masteryScore: number;
  confidence: number;
  completedLessons: number;
  weakConcepts: string[];
  reviewQueue: string[];
  xp: number;
};

export type MasteryUpdatePayload = {
  deltaMastery: number;
  deltaConfidence: number;
  xpGained: number;
  reviewQueued: boolean;
  misconceptionStored?: boolean;
};
