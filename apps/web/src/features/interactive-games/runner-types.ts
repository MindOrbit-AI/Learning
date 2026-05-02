import type { GameMode } from "@prisma/client";

export type ClientRuntimeState = {
  score: number;
  xp: number;
  streak: number;
  combo: number;
  correctCount: number;
  incorrectCount: number;
  currentQuestionIndex: number;
  phase: string;
  /** ISO timestamp from server when the attempt began (used by timed modes). */
  startedAt?: string;
  playerHealth?: number;
  opponentHealth?: number;
  difficultyIndex?: number;
  /** Current node id for DECISION_SIMULATOR branching scenarios */
  decisionStateId?: string;
};

export type PostGameEventFn = (input: {
  eventType: string;
  payload: Record<string, unknown>;
  isCorrect: boolean | null;
  responseTimeMs: number | null;
}) => Promise<{ state: ClientRuntimeState; score: number; xp: number }>;

export type InteractiveModeBaseProps = {
  gameId: string;
  attemptId: string;
  gameMode: GameMode;
  envelope: Record<string, unknown>;
  runtime: ClientRuntimeState;
  setRuntime: (s: ClientRuntimeState) => void;
  setScoreXp: (score: number, xp: number) => void;
  postEvent: PostGameEventFn;
  onCompleteSession: () => Promise<void>;
};

function asObj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

export function getGameConfig(envelope: Record<string, unknown>): Record<string, unknown> {
  return asObj(envelope.gameConfig);
}
