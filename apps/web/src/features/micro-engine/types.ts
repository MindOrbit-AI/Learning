import type { MicroInteractionType as PrismaMicroInteractionType } from "@prisma/client";

/** Prisma enum plus engine extensions (Prisma client types lag until `yarn db:generate`). */
export type MicroInteractionType = PrismaMicroInteractionType | "visual_problem";

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
  /** Visual reasoning skill id (e.g. fraction_part_whole_visual) for mastery analytics. */
  masterySkill?: string | null;
};
