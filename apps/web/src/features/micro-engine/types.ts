import type { MicroInteractionType } from "@prisma/client";

export type { MicroInteractionType };

/** Runtime step for the Micro-Interaction Engine (from DB or scene adapter). */
export type RuntimeMicroStep = {
  id: string;
  sourceSceneId: string;
  orderIndex: number;
  type: MicroInteractionType;
  /** One short line — never a long paragraph. */
  prompt: string;
  interactionConfig: Record<string, unknown>;
  /** Normalized comparison payload (id, JSON string, sentinel tokens). */
  correctAnswer: string;
  feedbackCorrect: string;
  feedbackWrong: string;
  visualStateBefore: Record<string, unknown> | null;
  visualStateAfter: Record<string, unknown> | null;
  masterySkill: string | null;
};

export type SceneResponsePayload = {
  sceneId: string;
  isCorrect: boolean;
  attempts: number;
};
