/**
 * LearningStateEngine - Tracks cognitive mastery at the concept-node level
 * retention = e^(-time_since_last_review / stability)
 */

import { prisma } from "@mindorbit/db";
import type { NodeState } from "@mindorbit/types";

const MASTERED_THRESHOLD = 85;
const WEAK_THRESHOLD = 60;
const RETENTION_THRESHOLD = 0.8;
const DEFAULT_STABILITY = 7; // days

export interface NodeStateMetrics {
  mastery: number;
  confidence: number;
  stability: number;
  decay: number;
  lastPracticedAt: Date | null;
  nextReviewAt: Date | null;
  state: NodeState;
}

export class LearningStateEngine {
  /**
   * Compute retention from last practice
   * retention = e^(-time_since_last_review / stability)
   */
  static computeRetention(
    lastPracticedAt: Date | null,
    stability: number,
    now: Date = new Date()
  ): number {
    if (!lastPracticedAt || stability <= 0) return 0;
    const hoursSince = (now.getTime() - lastPracticedAt.getTime()) / (1000 * 60 * 60);
    const stabilityHours = stability * 24;
    return Math.exp(-hoursSince / stabilityHours);
  }

  /**
   * Assign node state from mastery percentage
   * mastered >= 85, weak 60-84, missing < 60
   */
  static assignNodeState(mastery: number): NodeState {
    if (mastery >= MASTERED_THRESHOLD) return "mastered";
    if (mastery >= WEAK_THRESHOLD) return "weak";
    return "missing";
  }

  /**
   * Get current state for a user's node, with retention and decay
   */
  static async getNodeState(
    userId: string,
    nodeId: string
  ): Promise<NodeStateMetrics | null> {
    const uns = await prisma.userNodeState.findFirst({
      where: { userId, nodeId },
      include: { node: true },
    });
    if (!uns) return null;

    const now = new Date();
    const stability = uns.stability > 0 ? uns.stability : DEFAULT_STABILITY;
    const retention = this.computeRetention(uns.lastPracticedAt, stability, now);

    const decay = 1 - retention;
    let state = uns.state;

    if (
      uns.state === "mastered" &&
      retention < RETENTION_THRESHOLD &&
      uns.nextReviewAt &&
      now >= uns.nextReviewAt
    ) {
      state = "weak";
    }

    return {
      mastery: uns.mastery,
      confidence: uns.confidence,
      stability: uns.stability,
      decay,
      lastPracticedAt: uns.lastPracticedAt,
      nextReviewAt: uns.nextReviewAt,
      state,
    };
  }

  /**
   * Update node state after diagnostic or practice
   */
  static async updateNodeState(
    userId: string,
    subjectId: string,
    nodeId: string,
    metrics: {
      mastery: number;
      confidence?: number;
      stability?: number;
      lastPracticedAt?: Date;
    }
  ): Promise<void> {
    const state = this.assignNodeState(metrics.mastery);

    await prisma.userNodeState.upsert({
      where: {
        userId_subjectId_nodeId: { userId, subjectId, nodeId },
      },
      create: {
        userId,
        subjectId,
        nodeId,
        state,
        mastery: metrics.mastery,
        confidence: metrics.confidence ?? metrics.mastery,
        stability: metrics.stability ?? DEFAULT_STABILITY,
        decay: 0,
        lastPracticedAt: metrics.lastPracticedAt ?? new Date(),
      },
      update: {
        state,
        mastery: metrics.mastery,
        confidence: metrics.confidence ?? metrics.mastery,
        stability: metrics.stability ?? undefined,
        lastPracticedAt: metrics.lastPracticedAt ?? new Date(),
      },
    });
  }

  /**
   * Check if retention has dropped below threshold for review
   */
  static shouldScheduleReview(
    lastPracticedAt: Date | null,
    nextReviewAt: Date | null,
    stability: number,
    now: Date = new Date()
  ): boolean {
    if (!lastPracticedAt) return false;
    const retention = this.computeRetention(lastPracticedAt, stability, now);
    return retention < RETENTION_THRESHOLD || (nextReviewAt !== null && now >= nextReviewAt);
  }
}
