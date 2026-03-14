/**
 * Review Scheduler - Spaced repetition with intervals: 1d, 3d, 7d, 14d
 */

import { prisma } from "@mindorbit/db";

const INTERVALS_DAYS = [1, 3, 7, 14] as const;

export class ReviewScheduler {
  /**
   * Get next due date based on interval index (0 = first review, 1 = second, etc.)
   */
  static getNextDueDate(intervalIndex: number, from: Date = new Date()): Date {
    const days = INTERVALS_DAYS[Math.min(intervalIndex, INTERVALS_DAYS.length - 1)] ?? 1;
    const next = new Date(from);
    next.setDate(next.getDate() + days);
    return next;
  }

  /**
   * Schedule or reschedule a review item
   */
  static async scheduleReview(
    userId: string,
    subjectId: string,
    nodeId: string,
    options?: { intervalIndex?: number; priority?: number }
  ): Promise<string> {
    const intervalIndex = options?.intervalIndex ?? 0;
    const dueAt = this.getNextDueDate(intervalIndex);
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

  /**
   * Complete a review and schedule next interval
   */
  static async completeReview(
    itemId: string,
    userId: string,
    correct: boolean
  ): Promise<void> {
    const item = await prisma.reviewQueueItem.findUnique({
      where: { id: itemId },
      include: { node: true },
    });

    if (!item || item.userId !== userId) {
      throw new Error("Review item not found");
    }

    const subjectId = item.subjectId;
    const nodeId = item.nodeId;

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
        state: correct ? "mastered" : "weak",
        mastery: correct ? 90 : 65,
        confidence: correct ? 85 : 60,
        stability: correct ? 14 : 7,
        lastPracticedAt: now,
        nextReviewAt: null,
      },
      update: {
        lastPracticedAt: now,
        mastery: correct
          ? Math.min(100, (uns?.mastery ?? 0) + 5)
          : Math.max(0, (uns?.mastery ?? 0) - 10),
        stability: correct
          ? Math.min(30, (uns?.stability ?? 7) + 3)
          : Math.max(1, (uns?.stability ?? 7) - 2),
      },
    });

    if (correct) {
      const reviewCount = await prisma.reviewQueueItem.count({
        where: { userId, subjectId, nodeId, status: "completed" },
      });
      await this.scheduleReview(userId, subjectId, nodeId, {
        intervalIndex: Math.min(reviewCount, INTERVALS_DAYS.length - 1),
      });
    } else {
      await this.scheduleReview(userId, subjectId, nodeId, { intervalIndex: 0 });
    }
  }
}
