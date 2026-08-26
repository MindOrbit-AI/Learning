/**
 * Review Scheduler - Adaptive spaced repetition
 */

import { prisma } from "@mindorbit/db";

const BASE_INTERVALS_DAYS = [1, 3, 7, 14, 30] as const;

export class ReviewScheduler {
  /**
   * Adaptive interval based on mastery, stability, and session performance.
   */
  static getAdaptiveIntervalDays(
    intervalIndex: number,
    options?: { mastery?: number; stability?: number; correctRate?: number }
  ): number {
    const base =
      BASE_INTERVALS_DAYS[Math.min(intervalIndex, BASE_INTERVALS_DAYS.length - 1)] ?? 1;
    const mastery = options?.mastery ?? 50;
    const stability = options?.stability ?? 7;
    const correctRate = options?.correctRate ?? 0.7;

    let multiplier = 1;
    if (mastery >= 85) multiplier *= 1.3;
    else if (mastery < 40) multiplier *= 0.7;

    if (stability >= 14) multiplier *= 1.2;
    else if (stability < 5) multiplier *= 0.8;

    if (correctRate >= 0.9) multiplier *= 1.25;
    else if (correctRate < 0.6) multiplier *= 0.65;

    return Math.max(1, Math.round(base * multiplier));
  }

  static getNextDueDate(
    intervalIndex: number,
    from: Date = new Date(),
    options?: { mastery?: number; stability?: number; correctRate?: number }
  ): Date {
    const days = this.getAdaptiveIntervalDays(intervalIndex, options);
    const next = new Date(from);
    next.setDate(next.getDate() + days);
    return next;
  }

  static async scheduleReview(
    userId: string,
    subjectId: string,
    nodeId: string,
    options?: { intervalIndex?: number; priority?: number; mastery?: number; stability?: number }
  ): Promise<string> {
    const intervalIndex = options?.intervalIndex ?? 0;
    const dueAt = this.getNextDueDate(intervalIndex, new Date(), {
      mastery: options?.mastery,
      stability: options?.stability,
    });
    const priority = options?.priority ?? 1;

    const existing = await prisma.reviewQueueItem.findFirst({
      where: { userId, subjectId, nodeId, status: "pending" },
    });

    if (existing) {
      await prisma.reviewQueueItem.update({
        where: { id: existing.id },
        data: { dueAt, priority },
      });
      return existing.id;
    }

    const item = await prisma.reviewQueueItem.create({
      data: {
        userId,
        subjectId,
        nodeId,
        dueAt,
        priority,
        status: "pending",
      },
    });
    return item.id;
  }

  static async applyReviewStreak(userId: string, completedAt: Date = new Date()): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { reviewStreakCount: true, bestReviewStreak: true, lastReviewCompletedAt: true },
    });
    if (!user) return;

    let streak = user.reviewStreakCount;
    const last = user.lastReviewCompletedAt;
    if (last) {
      const lastUtc = Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate());
      const nowUtc = Date.UTC(
        completedAt.getUTCFullYear(),
        completedAt.getUTCMonth(),
        completedAt.getUTCDate()
      );
      const diffDays = Math.round((nowUtc - lastUtc) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        // same day — keep streak
      } else if (diffDays === 1) {
        streak += 1;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        reviewStreakCount: streak,
        bestReviewStreak: Math.max(user.bestReviewStreak, streak),
        lastReviewCompletedAt: completedAt,
      },
    });
  }

  /**
   * Complete a retrieval-based review session.
   */
  static async completeReviewSession(
    itemId: string,
    userId: string,
    results: { correct: number; total: number }
  ): Promise<{ passed: boolean; correctRate: number }> {
    const item = await prisma.reviewQueueItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.userId !== userId) {
      throw new Error("Review item not found");
    }

    const correctRate = results.total > 0 ? results.correct / results.total : 0;
    const passed = correctRate >= 0.6;

    const { subjectId, nodeId } = item;

    await prisma.reviewQueueItem.update({
      where: { id: itemId },
      data: { status: "completed" },
    });

    const uns = await prisma.userNodeState.findFirst({
      where: { userId, subjectId, nodeId },
    });

    const now = new Date();
    await prisma.userNodeState.upsert({
      where: {
        userId_subjectId_nodeId: { userId, subjectId, nodeId },
      },
      create: {
        userId,
        subjectId,
        nodeId,
        state: passed ? "mastered" : "weak",
        mastery: passed ? 90 : 65,
        confidence: passed ? 85 : 60,
        stability: passed ? 14 : 7,
        lastPracticedAt: now,
        nextReviewAt: null,
      },
      update: {
        lastPracticedAt: now,
        mastery: passed
          ? Math.min(100, (uns?.mastery ?? 0) + 5)
          : Math.max(0, (uns?.mastery ?? 0) - 10),
        stability: passed
          ? Math.min(30, (uns?.stability ?? 7) + 3)
          : Math.max(1, (uns?.stability ?? 7) - 2),
      },
    });

    if (passed) {
      const reviewCount = await prisma.reviewQueueItem.count({
        where: { userId, subjectId, nodeId, status: "completed" },
      });
      await this.scheduleReview(userId, subjectId, nodeId, {
        intervalIndex: Math.min(reviewCount, BASE_INTERVALS_DAYS.length - 1),
        mastery: uns?.mastery,
        stability: uns?.stability,
      });
      await this.applyReviewStreak(userId, now);
    } else {
      await this.scheduleReview(userId, subjectId, nodeId, {
        intervalIndex: 0,
        mastery: uns?.mastery,
        stability: uns?.stability,
      });
    }

    return { passed, correctRate };
  }

  /** @deprecated Use completeReviewSession for retrieval-based reviews */
  static async completeReview(
    itemId: string,
    userId: string,
    correct: boolean
  ): Promise<void> {
    await this.completeReviewSession(itemId, userId, {
      correct: correct ? 1 : 0,
      total: 1,
    });
  }
}
