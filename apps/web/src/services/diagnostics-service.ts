/**
 * Diagnostics Service - Diagnostic engine for knowledge gap detection
 */

import { prisma } from "@mindorbit/db";
import { LearningStateEngine } from "./learning-state-engine";
import { ReviewScheduler } from "./review-scheduler";
import { AnalyticsService, EVENT_TYPES } from "./analytics-service";
import { createMissionsForWeakNodes } from "@/lib/missions";
import { graphAlignmentService } from "@/services/graph-alignment-service";

export class NoDiagnosticQuestionsError extends Error {
  constructor() {
    super("NO_DIAGNOSTIC_QUESTIONS");
    this.name = "NoDiagnosticQuestionsError";
  }
}

export interface DiagnosticResponseInput {
  questionId: string;
  selectedAnswer: string;
  responseTimeMs?: number;
}

export interface SubmitResult {
  attemptId: string;
  overallScore: number;
  nodeStates: Array<{ nodeId: string; state: string; mastery: number }>;
  weakMissingNodes: number;
}

export const diagnosticsService = {
  async startDiagnostic(subjectId: string, userId: string) {
    let questions = await prisma.diagnosticQuestion.findMany({
      where: { subjectId },
      include: { node: true },
    });

    if (questions.length === 0) {
      await graphAlignmentService.ensureDiagnosticQuestionsForSubject(subjectId);
      questions = await prisma.diagnosticQuestion.findMany({
        where: { subjectId },
        include: { node: true },
      });
    }

    if (questions.length === 0) {
      throw new NoDiagnosticQuestionsError();
    }

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
      data: { userId, subjectId },
    });

    const selectedQuestions = await prisma.diagnosticQuestion.findMany({
      where: { id: { in: shuffled } },
      include: { node: true },
    });

    await AnalyticsService.track(userId, EVENT_TYPES.diagnostic_started, {
      attemptId: attempt.id,
      subjectId,
      questionCount: selectedQuestions.length,
    });

    return { attempt, questions: selectedQuestions };
  },

  async submitDiagnostic(
    attemptId: string,
    responses: DiagnosticResponseInput[]
  ): Promise<SubmitResult> {
    const attempt = await prisma.diagnosticAttempt.findUnique({
      where: { id: attemptId },
      include: { subject: true },
    });
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.completedAt) throw new Error("Already completed");

    const questions = await prisma.diagnosticQuestion.findMany({
      where: { id: { in: responses.map((r) => r.questionId) } },
    });
    const qMap = new Map(questions.map((q) => [q.id, q]));

    const responseRecords: Array<{
      attemptId: string;
      questionId: string;
      nodeId: string;
      selectedAnswer: string;
      isCorrect: boolean;
      responseTimeMs: number | null;
    }> = [];

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

    await prisma.diagnosticResponse.createMany({ data: responseRecords });

    const nodeScores = new Map<string, { correct: number; total: number }>();
    for (const r of responseRecords) {
      const cur = nodeScores.get(r.nodeId) ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (r.isCorrect) cur.correct += 1;
      nodeScores.set(r.nodeId, cur);
    }

    const totalCorrect = responseRecords.filter((r) => r.isCorrect).length;
    const overallScore =
      responseRecords.length > 0
        ? (totalCorrect / responseRecords.length) * 100
        : 0;

    const allNodes = await prisma.conceptNode.findMany({
      where: { subjectId: attempt.subjectId },
    });

    const nodeStates: Array<{ nodeId: string; state: string; mastery: number }> = [];
    let avgMastery = 0;

    for (const node of allNodes) {
      const score = nodeScores.get(node.id);
      let state = "untouched";
      let mastery = 0;
      if (score) {
        mastery = (score.correct / score.total) * 100;
        state = LearningStateEngine.assignNodeState(mastery);
      }
      nodeStates.push({ nodeId: node.id, state, mastery });
      avgMastery += mastery;
    }

    avgMastery = nodeStates.length > 0 ? avgMastery / nodeStates.length : 0;

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

    const now = new Date();
    for (const { nodeId, state, mastery } of nodeStates) {
      await LearningStateEngine.updateNodeState(
        attempt.userId,
        attempt.subjectId,
        nodeId,
        {
          mastery,
          confidence: mastery,
          stability: mastery,
          lastPracticedAt: now,
        }
      );
    }

    const weakMissing = nodeStates.filter(
      (n) => n.state === "weak" || n.state === "missing"
    );

    try {
      await createMissionsForWeakNodes(
        attempt.userId,
        attempt.subjectId,
        weakMissing.slice(0, 3).map((n) => n.nodeId)
      );
    } catch (missionErr) {
      console.error("Mission creation failed (non-blocking):", missionErr);
    }

    for (const { nodeId } of weakMissing) {
      await ReviewScheduler.scheduleReview(
        attempt.userId,
        attempt.subjectId,
        nodeId,
        { intervalIndex: 0 }
      );
    }

    await AnalyticsService.track(attempt.userId, EVENT_TYPES.diagnostic_completed, {
      attemptId,
      overallScore,
      weakMissingCount: weakMissing.length,
    });

    return {
      attemptId,
      overallScore,
      nodeStates,
      weakMissingNodes: weakMissing.length,
    };
  },
};
