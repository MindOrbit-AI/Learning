/**
 * Diagnostic Engine - Scoring and node state evaluation
 */

import { prisma } from "@mindorbit/db";
import type { NodeState } from "@mindorbit/types";
import { createMissionsForWeakNodes } from "./missions";

export async function startDiagnostic(subjectId: string, userId: string) {
  const questions = await prisma.diagnosticQuestion.findMany({
    where: { subjectId },
    include: { node: true },
  });

  const nodeIds = [...new Set(questions.map((q) => q.nodeId))];
  const selected: string[] = [];
  const perNode = Math.min(2, Math.ceil(15 / nodeIds.length));
  for (const nid of nodeIds) {
    const nodeQuestions = questions
      .filter((q) => q.nodeId === nid)
      .sort(() => Math.random() - 0.5)
      .slice(0, perNode);
    selected.push(...nodeQuestions.map((q) => q.id));
  }
  const shuffled = selected.sort(() => Math.random() - 0.5).slice(0, 15);

  const attempt = await prisma.diagnosticAttempt.create({
    data: {
      userId,
      subjectId,
    },
  });

  const selectedQuestions = await prisma.diagnosticQuestion.findMany({
    where: { id: { in: shuffled } },
    include: { node: true },
  });

  return { attempt, questions: selectedQuestions };
}

export async function submitDiagnostic(
  attemptId: string,
  responses: Array<{ questionId: string; selectedAnswer: string; responseTimeMs?: number }>
) {
  const attempt = await prisma.diagnosticAttempt.findUnique({
    where: { id: attemptId },
    include: { subject: true },
  });
  if (!attempt) throw new Error("Attempt not found");
  if (attempt.completedAt) throw new Error("Already completed");
  if (!attempt.userId) {
    throw new Error("Guest attempts must use diagnosticsService");
  }
  const userId = attempt.userId;

  const questions = await prisma.diagnosticQuestion.findMany({
    where: { id: { in: responses.map((r) => r.questionId) } },
  });
  const qMap = new Map(questions.map((q) => [q.id, q]));

  const responseRecords = [];
  for (const r of responses) {
    const q = qMap.get(r.questionId);
    if (!q) continue;
    const isCorrect =
      r.selectedAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
    responseRecords.push({
      attemptId,
      questionId: q.id,
      nodeId: q.nodeId,
      selectedAnswer: r.selectedAnswer,
      isCorrect,
      responseTimeMs: r.responseTimeMs ?? null,
    });
  }

  await prisma.diagnosticResponse.createMany({
    data: responseRecords,
  });

  const nodeScores = new Map<
    string,
    { correct: number; total: number }
  >();
  for (const r of responseRecords) {
    const cur = nodeScores.get(r.nodeId) ?? { correct: 0, total: 0 };
    cur.total += 1;
    if (r.isCorrect) cur.correct += 1;
    nodeScores.set(r.nodeId, cur);
  }

  const totalCorrect = responseRecords.filter((r) => r.isCorrect).length;
  const overallScore = responseRecords.length > 0
    ? (totalCorrect / responseRecords.length) * 100
    : 0;

  const nodeStates: Array<{ nodeId: string; state: NodeState; mastery: number }> = [];
  const allNodes = await prisma.conceptNode.findMany({
    where: { subjectId: attempt.subjectId },
  });

  for (const node of allNodes) {
    const score = nodeScores.get(node.id);
    let state: NodeState = "untouched";
    let mastery = 0;
    if (score) {
      const pct = (score.correct / score.total) * 100;
      mastery = pct;
      if (pct >= 80) state = "mastered";
      else if (pct >= 50) state = "weak";
      else state = "missing";
    }
    nodeStates.push({ nodeId: node.id, state, mastery });
  }

  const avgMastery =
    nodeStates.length > 0
      ? nodeStates.reduce((a, n) => a + n.mastery, 0) / nodeStates.length
      : 0;

  await prisma.diagnosticAttempt.update({
    where: { id: attemptId },
    data: {
      completedAt: new Date(),
      overallScore,
      masteryScore: avgMastery,
      confidenceScore: avgMastery,
      stabilityScore: avgMastery,
    },
  });

  for (const { nodeId, state, mastery } of nodeStates) {
    await prisma.userNodeState.upsert({
      where: {
        userId_subjectId_nodeId: {
          userId,
          subjectId: attempt.subjectId,
          nodeId,
        },
      },
      create: {
        userId,
        subjectId: attempt.subjectId,
        nodeId,
        state,
        mastery,
        confidence: mastery,
        stability: mastery,
      },
      update: {
        state,
        mastery,
        confidence: mastery,
        stability: mastery,
      },
    });
  }

  const weakMissing = nodeStates.filter((n) => n.state === "weak" || n.state === "missing");
  await createMissionsForWeakNodes(
    userId,
    attempt.subjectId,
    weakMissing.slice(0, 3).map((n) => n.nodeId)
  );

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + 1);
  for (const { nodeId } of weakMissing) {
    const existing = await prisma.reviewQueueItem.findFirst({
      where: { userId, subjectId: attempt.subjectId, nodeId },
    });
    if (existing) {
      await prisma.reviewQueueItem.update({
        where: { id: existing.id },
        data: { dueAt: nextReview },
      });
    } else {
      await prisma.reviewQueueItem.create({
        data: {
          userId,
          subjectId: attempt.subjectId,
          nodeId,
          dueAt: nextReview,
          priority: 1,
        },
      });
    }
  }

  return {
    attemptId,
    overallScore,
    nodeStates,
    weakMissingNodes: weakMissing.length,
  };
}
