import { prisma } from "@mindorbit/db";
import type { GameMode, GameRewardType, Prisma } from "@prisma/client";
import { getAIProvider } from "@mindorbit/ai";
import type { InteractiveGameConfigJson, InteractiveGameModeSlug } from "@mindorbit/ai";
import { LearningStateEngine } from "@/services/learning-state-engine";
import { createMissionsForWeakNodes } from "@/lib/missions";
import {
  XP_COMPLETION_BONUS,
  speedBonusPoints,
  xpForCorrect,
  xpStreakBonus,
} from "@/lib/game-xp";
import { AnalyticsService, EVENT_TYPES } from "@/services/analytics-service";

function trackGame(userId: string, event: (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES], payload?: Record<string, unknown>) {
  void AnalyticsService.track(userId, event, payload).catch(() => {});
}

function slugifyTopic(topic: string): string {
  return topic
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

export async function findOrCreateTopicConceptNode(
  subjectId: string,
  topic: string,
  learningGoal: string
) {
  const slugBase = slugifyTopic(topic) || "custom-topic";
  const existing = await prisma.conceptNode.findFirst({
    where: {
      subjectId,
      OR: [{ slug: slugBase }, { title: { equals: topic.trim(), mode: "insensitive" } }],
    },
  });
  if (existing) return existing;

  const cluster = await prisma.cluster.findFirst({
    where: { subjectId },
    orderBy: { orderIndex: "asc" },
  });
  if (!cluster) {
    throw new Error("No curriculum cluster found for this subject. Add clusters in admin first.");
  }

  const slug = `${slugBase}-${Date.now().toString(36)}`.slice(0, 90);
  return prisma.conceptNode.create({
    data: {
      subjectId,
      clusterId: cluster.id,
      slug,
      title: topic.trim(),
      description: learningGoal.trim() || `Interactive practice: ${topic}`,
      status: "draft",
      learningObjective: learningGoal.trim() || null,
    },
  });
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

export function parseGameEnvelope(config: Prisma.JsonValue): InteractiveGameConfigJson {
  const c = config as InteractiveGameConfigJson;
  return c && typeof c === "object" ? c : {};
}

type RuntimeState = {
  score: number;
  xp: number;
  streak: number;
  combo: number;
  correctCount: number;
  incorrectCount: number;
  currentQuestionIndex: number;
  phase: string;
  conceptStats: Record<string, { correct: number; total: number }>;
  startedAt: string;
  playerHealth?: number;
  opponentHealth?: number;
  currentPathNodeId?: string;
  difficultyIndex?: number;
  decisionStateId?: string;
};

function defaultRuntime(gameMode: GameMode, envelope: InteractiveGameConfigJson): RuntimeState {
  const gc = asRecord(envelope.gameConfig);
  const now = new Date().toISOString();
  const base: RuntimeState = {
    score: 0,
    xp: 0,
    streak: 0,
    combo: 0,
    correctCount: 0,
    incorrectCount: 0,
    currentQuestionIndex: 0,
    phase: "playing",
    conceptStats: {},
    startedAt: now,
    difficultyIndex: 0,
  };
  if (gameMode === "CONCEPT_BATTLE") {
    base.playerHealth = Number(gc.playerHealth) || 100;
    base.opponentHealth = Number(gc.opponentHealth) || 100;
  }
  if (gameMode === "DECISION_SIMULATOR") {
    base.decisionStateId = resolveInitialDecisionStateId(gc);
  }
  return base;
}

function resolveInitialDecisionStateId(gc: Record<string, unknown>): string {
  const explicit = String(gc.initialStateId ?? "").trim();
  const states = Array.isArray(gc.states) ? gc.states : [];
  if (explicit && states.some((s) => String(asRecord(s).id) === explicit)) {
    return explicit;
  }
  for (const s of states) {
    const o = asRecord(s);
    const choices = Array.isArray(o.choices) ? o.choices : [];
    if (choices.length > 0 && o.id != null) return String(o.id);
  }
  const first = states[0] != null ? asRecord(states[0]) : {};
  return String(first.id ?? "start");
}

function findDecisionTransitionMeta(
  gc: Record<string, unknown>,
  fromStateId: string,
  toStateId: string
): { scoreDelta: number; concept?: string; effect?: string } | null {
  const states = Array.isArray(gc.states) ? gc.states : [];
  const node = states.map(asRecord).find((s) => String(s.id) === fromStateId);
  if (!node) return null;
  const choices = Array.isArray(node.choices) ? node.choices : [];
  for (const raw of choices) {
    const ch = asRecord(raw);
    if (String(ch.nextStateId ?? "") !== toStateId) continue;
    return {
      scoreDelta: Number(ch.scoreDelta) || 0,
      concept: typeof ch.concept === "string" ? ch.concept : undefined,
      effect: typeof ch.effect === "string" ? ch.effect : undefined,
    };
  }
  return null;
}

function bumpConcept(
  stats: Record<string, { correct: number; total: number }>,
  concept: string | undefined,
  correct: boolean
) {
  const key = (concept ?? "general").trim() || "general";
  const cur = stats[key] ?? { correct: 0, total: 0 };
  cur.total += 1;
  if (correct) cur.correct += 1;
  stats[key] = cur;
}

export async function generateGameForUser(input: {
  userId: string;
  subjectId: string;
  topic: string;
  gradeLevel: string;
  learningGoal: string;
  gameMode: GameMode;
}): Promise<string> {
  const subject = await prisma.subject.findUnique({
    where: { id: input.subjectId },
    select: { id: true, title: true },
  });
  if (!subject) throw new Error("Subject not found");

  const node = await findOrCreateTopicConceptNode(
    input.subjectId,
    input.topic,
    input.learningGoal
  );

  const provider = getAIProvider();
  const raw = await provider.generateInteractiveGameConfig({
    subjectTitle: subject.title,
    topic: input.topic,
    gradeLevel: input.gradeLevel,
    learningGoal: input.learningGoal,
    gameMode: input.gameMode as InteractiveGameModeSlug,
  });

  const title = String(raw.title ?? `${input.topic} — ${input.gameMode}`);
  const description = String(raw.description ?? (input.learningGoal || "Generated learning game"));

  const game = await prisma.game.create({
    data: {
      userId: input.userId,
      subjectId: input.subjectId,
      topic: input.topic,
      gradeLevel: input.gradeLevel,
      learningGoal: input.learningGoal,
      gameMode: input.gameMode,
      title,
      description,
      conceptNodeId: node.id,
      config: raw as Prisma.InputJsonValue,
      status: "active",
    },
  });

  trackGame(input.userId, EVENT_TYPES.game_generated, {
    gameId: game.id,
    gameMode: input.gameMode,
    subjectId: input.subjectId,
    topic: input.topic,
  });

  return game.id;
}

export async function getGameBundle(gameId: string, userId: string) {
  const game = await prisma.game.findFirst({
    where: { id: gameId, userId },
    include: {
      attempts: {
        where: { completedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!game) return null;
  const activeAttempt = game.attempts[0] ?? null;
  return {
    game: {
      id: game.id,
      title: game.title,
      description: game.description,
      gameMode: game.gameMode,
      status: game.status,
      topic: game.topic,
      gradeLevel: game.gradeLevel,
      learningGoal: game.learningGoal,
      subjectId: game.subjectId,
      conceptNodeId: game.conceptNodeId,
      config: game.config,
    },
    attempt: activeAttempt
      ? {
          id: activeAttempt.id,
          currentState: activeAttempt.currentState,
          score: activeAttempt.score,
          xpEarned: activeAttempt.xpEarned,
        }
      : null,
  };
}

export async function startAttempt(gameId: string, userId: string) {
  const game = await prisma.game.findFirst({
    where: { id: gameId, userId },
  });
  if (!game) throw new Error("Game not found");

  const envelope = parseGameEnvelope(game.config);
  const initial = defaultRuntime(game.gameMode, envelope);

  const attempt = await prisma.gameAttempt.create({
    data: {
      userId,
      gameId,
      score: 0,
      xpEarned: 0,
      currentState: initial as unknown as Prisma.InputJsonValue,
    },
  });

  trackGame(userId, EVENT_TYPES.game_started, {
    gameId,
    attemptId: attempt.id,
    gameMode: game.gameMode,
  });

  return { attemptId: attempt.id, state: initial };
}

export async function recordGameEvent(input: {
  gameId: string;
  userId: string;
  attemptId: string;
  eventType: string;
  payload: unknown;
  isCorrect: boolean | null;
  responseTimeMs: number | null;
  conceptNodeId: string | null;
}) {
  const attempt = await prisma.gameAttempt.findFirst({
    where: { id: input.attemptId, userId: input.userId, gameId: input.gameId },
    include: { game: true },
  });
  if (!attempt || attempt.completedAt) throw new Error("Attempt not found or already completed");

  const payloadObj =
    input.payload && typeof input.payload === "object"
      ? (input.payload as Record<string, unknown>)
      : {};

  await prisma.gameEvent.create({
    data: {
      attemptId: attempt.id,
      eventType: input.eventType,
      payload: payloadObj as Prisma.InputJsonValue,
      isCorrect: input.isCorrect,
      responseTimeMs: input.responseTimeMs ?? undefined,
      conceptNodeId: input.conceptNodeId ?? undefined,
    },
  });

  if (input.isCorrect !== null && input.isCorrect !== undefined) {
    trackGame(input.userId, EVENT_TYPES.game_answer, {
      gameId: input.gameId,
      attemptId: input.attemptId,
      gameMode: attempt.game.gameMode,
      interactionEventType: input.eventType,
      isCorrect: input.isCorrect,
    });
  }

  const envelope = parseGameEnvelope(attempt.game.config);
  const state =
    (attempt.currentState as RuntimeState) ?? defaultRuntime(attempt.game.gameMode, envelope);
  if (attempt.game.gameMode === "DECISION_SIMULATOR" && !state.decisionStateId) {
    state.decisionStateId = resolveInitialDecisionStateId(asRecord(envelope.gameConfig));
  }
  const scoring = asRecord(envelope.scoring);
  const basePoints = Number(scoring.basePoints) || 10;
  const difficulty = String(payloadObj.difficulty ?? "medium").toLowerCase();

  if (attempt.game.gameMode === "DECISION_SIMULATOR" && input.eventType === "decision_choice") {
    const gc = asRecord(envelope.gameConfig);
    const fromId = String(payloadObj.fromStateId ?? "");
    const toId = String(payloadObj.toStateId ?? "");
    const current = String(state.decisionStateId ?? "");
    if (!fromId || !toId || fromId !== current) {
      throw new Error("Invalid decision step");
    }
    const meta = findDecisionTransitionMeta(gc, fromId, toId);
    if (!meta) {
      throw new Error("That choice is not available from this situation");
    }
    const beneficial = meta.scoreDelta >= 0;
    if (beneficial) {
      state.streak += 1;
      state.correctCount += 1;
      state.combo += 1;
      bumpConcept(state.conceptStats, meta.concept, true);
    } else {
      state.streak = 0;
      state.incorrectCount += 1;
      state.combo = 0;
      bumpConcept(state.conceptStats, meta.concept, false);
    }
    state.decisionStateId = toId;
    state.currentQuestionIndex = (state.currentQuestionIndex ?? 0) + 1;
    state.score += meta.scoreDelta;
    const stepXp = beneficial
      ? xpForCorrect(difficulty) +
        xpStreakBonus(state.streak) +
        Math.max(0, Math.min(25, Math.round(meta.scoreDelta)))
      : Math.max(0, 6 + Math.round(meta.scoreDelta * 0.35));
    state.xp += stepXp;
    if (input.responseTimeMs != null && scoring.speedBonus !== false) {
      state.score += speedBonusPoints(input.responseTimeMs);
    }

    const updated = await prisma.gameAttempt.update({
      where: { id: attempt.id },
      data: {
        score: state.score,
        xpEarned: state.xp,
        currentState: state as unknown as Prisma.InputJsonValue,
      },
    });

    return {
      state: updated.currentState as RuntimeState,
      score: updated.score,
      xp: updated.xpEarned,
    };
  }

  let addScore = 0;
  let addXp = 0;

  if (input.isCorrect === true) {
    state.streak += 1;
    state.correctCount += 1;
    state.combo += 1;
    const concept = typeof payloadObj.concept === "string" ? payloadObj.concept : undefined;
    bumpConcept(state.conceptStats, concept, true);
    addXp += xpForCorrect(difficulty);
    addXp += xpStreakBonus(state.streak);
    addScore += basePoints;
    if (scoring.speedBonus !== false && input.responseTimeMs != null) {
      addScore += speedBonusPoints(input.responseTimeMs);
    }
    if (attempt.game.gameMode === "SPEED_RUN") {
      addScore += Math.min(25, Math.floor(20000 / Math.max(800, input.responseTimeMs ?? 5000)));
    }
    if (attempt.game.gameMode === "CONCEPT_BATTLE") {
      const dmg = Number(payloadObj.damage) || 20;
      state.opponentHealth = Math.max(0, (state.opponentHealth ?? 100) - dmg);
    }
  } else if (input.isCorrect === false) {
    state.streak = 0;
    state.incorrectCount += 1;
    state.combo = 0;
    const concept = typeof payloadObj.concept === "string" ? payloadObj.concept : undefined;
    bumpConcept(state.conceptStats, concept, false);
    addScore -= 3;
    if (attempt.game.gameMode === "CONCEPT_BATTLE") {
      const dmg = Number(payloadObj.damageToPlayer) || 15;
      state.playerHealth = Math.max(0, (state.playerHealth ?? 100) - dmg);
    }
    if (attempt.game.gameMode === "ADAPTIVE_QUIZ") {
      state.difficultyIndex = Math.max(0, (state.difficultyIndex ?? 0) - 1);
    }
  }

  if (input.isCorrect === true && attempt.game.gameMode === "ADAPTIVE_QUIZ") {
    state.difficultyIndex = (state.difficultyIndex ?? 0) + 1;
  }

  if (typeof payloadObj.questionIndex === "number") {
    state.currentQuestionIndex = payloadObj.questionIndex;
  }

  state.score += addScore;
  state.xp += addXp;

  const updated = await prisma.gameAttempt.update({
    where: { id: attempt.id },
    data: {
      score: state.score,
      xpEarned: state.xp,
      currentState: state as unknown as Prisma.InputJsonValue,
    },
  });

  return {
    state: updated.currentState as RuntimeState,
    score: updated.score,
    xp: updated.xpEarned,
  };
}

function accuracyFromState(state: RuntimeState, eventsFallback: { isCorrect: boolean | null }[]) {
  const total = state.correctCount + state.incorrectCount;
  if (total > 0) return (state.correctCount / total) * 100;
  const ev = eventsFallback.filter((e) => e.isCorrect !== null);
  if (ev.length === 0) return 0;
  const c = ev.filter((e) => e.isCorrect === true).length;
  return (c / ev.length) * 100;
}

function weakAndStrong(
  conceptStats: Record<string, { correct: number; total: number }>
): { weak: string[]; strong: string[] } {
  const weak: string[] = [];
  const strong: string[] = [];
  for (const [name, { correct, total }] of Object.entries(conceptStats)) {
    if (total === 0) continue;
    const acc = (correct / total) * 100;
    if (acc < 60) weak.push(name);
    else if (acc >= 80) strong.push(name);
  }
  return { weak, strong };
}

export async function getAttemptSummary(attemptId: string, userId: string) {
  const attempt = await prisma.gameAttempt.findFirst({
    where: { id: attemptId, userId },
    include: {
      game: { select: { id: true, title: true, gameMode: true, topic: true, subjectId: true } },
      rewards: true,
    },
  });
  if (!attempt || !attempt.completedAt) return null;

  const rawWeak = attempt.weakConcepts;
  const weak = Array.isArray(rawWeak)
    ? rawWeak.filter((x): x is string => typeof x === "string")
    : typeof rawWeak === "object" && rawWeak !== null
      ? Object.keys(rawWeak as object)
      : [];

  const state = (attempt.currentState as RuntimeState) ?? null;
  const strong: string[] = [];
  if (state?.conceptStats) {
    for (const [name, { correct, total }] of Object.entries(state.conceptStats)) {
      if (total > 0 && (correct / total) * 100 >= 80) strong.push(name);
    }
  }

  const weakest = weak[0] ?? attempt.game.topic;
  const recommendation =
    weak.length > 0
      ? { type: "mission" as const, label: `Strengthen: ${weakest}`, href: "/missions" }
      : { type: "game" as const, label: "Generate another challenge", href: "/games" };

  return {
    attemptId: attempt.id,
    gameId: attempt.game.id,
    gameTitle: attempt.game.title,
    gameMode: attempt.game.gameMode,
    score: attempt.score,
    xpEarned: attempt.xpEarned,
    accuracy: attempt.accuracy ?? 0,
    correctCount: state?.correctCount ?? 0,
    incorrectCount: state?.incorrectCount ?? 0,
    strongConcepts: strong,
    weakConcepts: weak,
    rewards: attempt.rewards,
    recommendation,
  };
}

export async function completeAttempt(gameId: string, userId: string, attemptId: string) {
  const attempt = await prisma.gameAttempt.findFirst({
    where: { id: attemptId, userId, gameId },
    include: {
      game: true,
      events: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!attempt || attempt.completedAt) throw new Error("Attempt not found or already completed");

  const envelope = parseGameEnvelope(attempt.game.config);
  const state =
    (attempt.currentState as RuntimeState) ?? defaultRuntime(attempt.game.gameMode, envelope);
  const acc = accuracyFromState(
    state,
    attempt.events.map((e: { isCorrect: boolean | null }) => ({ isCorrect: e.isCorrect }))
  );

  const { weak, strong } = weakAndStrong(state.conceptStats);

  let bonusXp = XP_COMPLETION_BONUS;
  if (acc >= 95) bonusXp += 40;
  const totalXp = Math.round(attempt.xpEarned + bonusXp);

  const masteryDelta: Record<string, number> = {};
  for (const [conceptName, { correct, total }] of Object.entries(state.conceptStats)) {
    if (total === 0) continue;
    const a = (correct / total) * 100;
    if (a >= 80) masteryDelta[conceptName] = Math.min(15, Math.round((a - 75) / 2));
    else if (a < 60) masteryDelta[conceptName] = -8;
    else masteryDelta[conceptName] = 2;
  }

  await applyMasteryForGame(
    userId,
    attempt.game.subjectId,
    attempt.game.conceptNodeId,
    state.conceptStats,
    acc
  );

  const weakNodeIds: string[] = [];
  for (const w of weak) {
    const node = await prisma.conceptNode.findFirst({
      where: {
        subjectId: attempt.game.subjectId,
        title: { contains: w.slice(0, 48), mode: "insensitive" },
      },
      select: { id: true },
    });
    if (node) weakNodeIds.push(node.id);
  }
  if (weakNodeIds.length > 0) {
    await createMissionsForWeakNodes(userId, attempt.game.subjectId, weakNodeIds).catch(() => []);
  }

  const rewards: Array<{ type: GameRewardType; name: string; description: string | null; icon: string | null }> = [
    {
      type: "xp",
      name: "Session XP",
      description: `+${totalXp} total XP`,
      icon: "zap",
    },
  ];

  if (acc >= 99) {
    rewards.push({
      type: "badge",
      name: "Mastery Streak",
      description: "Near-perfect run",
      icon: "trophy",
    });
  }

  const priorCompleted = await prisma.gameAttempt.count({
    where: { userId, completedAt: { not: null } },
  });
  if (priorCompleted === 0) {
    rewards.push({
      type: "badge",
      name: "First Mission Complete",
      description: "You finished your first MindOrbit game",
      icon: "rocket",
    });
  }

  await prisma.$transaction(async (tx) => {
    await tx.gameAttempt.update({
      where: { id: attempt.id },
      data: {
        completedAt: new Date(),
        accuracy: acc,
        xpEarned: totalXp,
        weakConcepts: weak as unknown as Prisma.InputJsonValue,
        masteryDelta: masteryDelta as unknown as Prisma.InputJsonValue,
      },
    });

    for (const r of rewards) {
      await tx.gameReward.create({
        data: {
          userId,
          attemptId: attempt.id,
          type: r.type,
          name: r.name,
          description: r.description,
          icon: r.icon,
        },
      });
    }

    await tx.user.update({
      where: { id: userId },
      data: { xp: { increment: totalXp } },
    });
  });

  trackGame(userId, EVENT_TYPES.game_completed, {
    gameId,
    attemptId,
    gameMode: attempt.game.gameMode,
    score: state.score,
    xpEarned: totalXp,
    accuracy: acc,
    correctCount: state.correctCount,
    incorrectCount: state.incorrectCount,
  });

  const weakest = weak[0] ?? attempt.game.topic;
  const recommendation =
    weak.length > 0
      ? { type: "mission" as const, label: `Repair: ${weakest}`, href: "/missions" }
      : { type: "game" as const, label: "Try another game mode", href: "/games" };

  const savedRewards = await prisma.gameReward.findMany({
    where: { attemptId: attempt.id },
    orderBy: { createdAt: "asc" },
  });

  return {
    attemptId: attempt.id,
    score: state.score,
    xpEarned: totalXp,
    accuracy: acc,
    correctCount: state.correctCount,
    incorrectCount: state.incorrectCount,
    strongConcepts: strong,
    weakConcepts: weak,
    rewards: savedRewards,
    gameTitle: attempt.game.title,
    gameMode: attempt.game.gameMode,
    envelope,
    recommendation,
  };
}

async function applyMasteryForGame(
  userId: string,
  subjectId: string,
  primaryNodeId: string,
  conceptStats: Record<string, { correct: number; total: number }>,
  overallAccuracy: number
) {
  const entries = Object.entries(conceptStats);
  if (entries.length === 0) {
    const delta = overallAccuracy >= 80 ? 10 : overallAccuracy < 60 ? -6 : 3;
    const existing = await prisma.userNodeState.findUnique({
      where: { userId_subjectId_nodeId: { userId, subjectId, nodeId: primaryNodeId } },
    });
    const prev = existing?.mastery ?? 35;
    await LearningStateEngine.updateNodeState(userId, subjectId, primaryNodeId, {
      mastery: Math.max(0, Math.min(100, prev + delta)),
    });
    return;
  }

  for (const [conceptName, { correct, total }] of entries) {
    if (total === 0) continue;
    const a = (correct / total) * 100;
    let node = await prisma.conceptNode.findFirst({
      where: {
        subjectId,
        title: { contains: conceptName.slice(0, 40), mode: "insensitive" },
      },
    });
    const nodeId = node?.id ?? primaryNodeId;
    const existing = await prisma.userNodeState.findUnique({
      where: { userId_subjectId_nodeId: { userId, subjectId, nodeId } },
    });
    const prev = existing?.mastery ?? 35;
    let delta = 0;
    if (a >= 80) delta = Math.min(15, Math.round((a - 72) / 2));
    else if (a < 60) delta = -8;
    else delta = 2;
    await LearningStateEngine.updateNodeState(userId, subjectId, nodeId, {
      mastery: Math.max(0, Math.min(100, prev + delta)),
    });
  }
}
