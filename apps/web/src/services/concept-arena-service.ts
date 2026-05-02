import { prisma } from "@mindorbit/db";
import { QuestionStatus, QuestionType } from "@prisma/client";
import {
  categoryToSubjectSlugs,
  getFallbackPool,
  type ArenaCategory,
} from "@/features/concept-arena/arena-fallback-questions";
import { LearningStateEngine } from "@/services/learning-state-engine";

export type ArenaQuestionDTO = {
  id: string;
  subjectId: string | null;
  nodeId: string | null;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

const WEAK_MASTERY = 70;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const ai = a[i] as T;
    const aj = a[j] as T;
    a[i] = aj;
    a[j] = ai;
  }
  return a;
}

function weightedPick<T>(items: T[], weights: number[]): T | null {
  const w = weights.map((x) => Math.max(0, x));
  const sum = w.reduce((a, b) => a + b, 0);
  if (sum <= 0 || items.length === 0) return null;
  let r = Math.random() * sum;
  for (let i = 0; i < items.length; i++) {
    r -= w[i] ?? 0;
    if (r <= 0) return items[i] as T;
  }
  return items[items.length - 1] as T;
}

export async function fetchArenaQuestions(
  userId: string,
  category: ArenaCategory,
  count: number
): Promise<ArenaQuestionDTO[]> {
  const slugs = categoryToSubjectSlugs(category);
  const subjects =
    slugs.length > 0
      ? await prisma.subject.findMany({
          where: { slug: { in: slugs }, status: "published" },
          select: { id: true, slug: true },
        })
      : [];

  const subjectIds = subjects.map((s) => s.id);
  const masteryByNode = new Map<string, { mastery: number; subjectId: string }>();

  if (subjectIds.length > 0) {
    const states = await prisma.userNodeState.findMany({
      where: { userId, subjectId: { in: subjectIds } },
      select: { nodeId: true, mastery: true, subjectId: true },
    });
    for (const s of states) {
      masteryByNode.set(s.nodeId, { mastery: s.mastery, subjectId: s.subjectId });
    }
  }

  const dbQuestions =
    subjectIds.length > 0
      ? await prisma.diagnosticQuestion.findMany({
          where: {
            subjectId: { in: subjectIds },
            status: QuestionStatus.published,
            type: QuestionType.multiple_choice,
            optionsJson: { not: null },
          },
          select: {
            id: true,
            subjectId: true,
            nodeId: true,
            prompt: true,
            optionsJson: true,
            correctAnswer: true,
            explanation: true,
          },
        })
      : [];

  const parsed: Array<
    Omit<ArenaQuestionDTO, "options"> & { options: string[] | null }
  > = [];
  for (const q of dbQuestions) {
    try {
      const opts = q.optionsJson ? (JSON.parse(q.optionsJson) as string[]) : null;
      if (!opts || opts.length < 2) continue;
      const shuffled = shuffle(opts);
      parsed.push({
        id: q.id,
        subjectId: q.subjectId,
        nodeId: q.nodeId,
        prompt: q.prompt,
        options: shuffled,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      });
    } catch {
      continue;
    }
  }

  const picked: typeof parsed = [];
  const usedIds = new Set<string>();
  const pool = [...parsed];

  while (picked.length < count && pool.length > 0) {
    const weights = pool.map((q) => {
      const m = masteryByNode.get(q.nodeId ?? "");
      const mastery = m?.mastery ?? 35;
      return Math.max(5, WEAK_MASTERY + 30 - mastery);
    });
    const next = weightedPick(pool, weights);
    if (!next) break;
    const idx = pool.indexOf(next);
    pool.splice(idx, 1);
    if (!usedIds.has(next.id)) {
      usedIds.add(next.id);
      picked.push(next);
    }
  }

  const fallback = getFallbackPool(category);
  let fbIndex = 0;
  while (picked.length < count && fbIndex < fallback.length * 4 && fallback.length > 0) {
    const q = fallback[fbIndex % fallback.length]!;
    fbIndex++;
    const id = `fallback-${category}-${fbIndex}-${Math.random().toString(36).slice(2, 8)}`;
    if (usedIds.has(id)) continue;
    usedIds.add(id);
    picked.push({
      id,
      subjectId: subjects[0]?.id ?? null,
      nodeId: null,
      prompt: q.prompt,
      options: shuffle([...q.options]),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
  }

  return shuffle(picked.slice(0, count)).map((q) => ({
    id: q.id,
    subjectId: q.subjectId,
    nodeId: q.nodeId,
    prompt: q.prompt,
    options: q.options as string[],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));
}

export type ArenaMatchResultRow = {
  nodeId: string;
  subjectId: string;
  correct: boolean;
};

export async function applyArenaMasteryAndStats(params: {
  userId: string;
  won: boolean;
  maxCombo: number;
  totalDamageDealt: number;
  results: ArenaMatchResultRow[];
}): Promise<{ xpAwarded: number }> {
  const { userId, won, maxCombo, totalDamageDealt, results } = params;

  const CORRECT_DELTA = 4;
  const WRONG_DELTA = 2;

  for (const row of results) {
    if (!row.nodeId || !row.subjectId) continue;

    const existing = await prisma.userNodeState.findUnique({
      where: {
        userId_subjectId_nodeId: {
          userId,
          subjectId: row.subjectId,
          nodeId: row.nodeId,
        },
      },
    });

    const delta = row.correct ? CORRECT_DELTA : -WRONG_DELTA;
    const newMastery = Math.min(100, Math.max(0, (existing?.mastery ?? 40) + delta));
    const newState = LearningStateEngine.assignNodeState(newMastery);

    await prisma.userNodeState.upsert({
      where: {
        userId_subjectId_nodeId: {
          userId,
          subjectId: row.subjectId,
          nodeId: row.nodeId,
        },
      },
      create: {
        userId,
        subjectId: row.subjectId,
        nodeId: row.nodeId,
        state: newState,
        mastery: newMastery,
        confidence: row.correct ? 0.08 : 0,
        stability: 7,
        lastPracticedAt: new Date(),
      },
      update: {
        state: newState,
        mastery: newMastery,
        confidence: row.correct ? { increment: 0.05 } : undefined,
        lastPracticedAt: new Date(),
      },
    });
  }

  const xpAwarded = won ? 15 + Math.min(30, maxCombo * 2) : 5;

  await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: xpAwarded } },
  });

  const prevStat = await prisma.conceptArenaStat.findUnique({ where: { userId } });
  const nextBestCombo = Math.max(prevStat?.bestCombo ?? 0, maxCombo);
  await prisma.conceptArenaStat.upsert({
    where: { userId },
    create: {
      userId,
      wins: won ? 1 : 0,
      losses: won ? 0 : 1,
      totalDamageDealt,
      bestCombo: maxCombo,
      matchesPlayed: 1,
    },
    update: {
      wins: won ? { increment: 1 } : undefined,
      losses: won ? undefined : { increment: 1 },
      totalDamageDealt: { increment: totalDamageDealt },
      bestCombo: nextBestCombo,
      matchesPlayed: { increment: 1 },
    },
  });

  return { xpAwarded };
}

export async function getArenaLeaderboard(limit: number) {
  const rows = await prisma.conceptArenaStat.findMany({
    take: limit,
    orderBy: [{ wins: "desc" }, { totalDamageDealt: "desc" }],
    include: {
      user: { select: { name: true, image: true, id: true } },
    },
  });
  return rows.map((r: (typeof rows)[number], i: number) => ({
    rank: i + 1,
    userId: r.userId,
    name: r.user.name ?? "Learner",
    image: r.user.image,
    wins: r.wins,
    losses: r.losses,
    totalDamageDealt: r.totalDamageDealt,
    bestCombo: r.bestCombo,
    matchesPlayed: r.matchesPlayed,
  }));
}
