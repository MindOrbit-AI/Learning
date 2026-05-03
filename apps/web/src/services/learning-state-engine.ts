/**
 * LearningStateEngine - Tracks cognitive mastery at the concept-node level
 * retention = e^(-time_since_last_review / stability)
 */

import { prisma } from "@mindorbit/db";
import type { NodeState } from "@mindorbit/types";

/** DB may still return legacy `missing` until migrations run; treat as `weak`. */
function coerceStoredNodeState(raw: string): NodeState {
  if (raw === "missing") return "weak";
  if (raw === "mastered" || raw === "weak" || raw === "learning" || raw === "untouched") return raw;
  return "untouched";
}

const MASTERED_THRESHOLD = 85;
/** Mastery strictly below this → `weak`; from here up to (but not including) mastered → `learning`. */
const WEAK_MAX_EXCLUSIVE = 30;
const RETENTION_THRESHOLD = 0.8;
const DEFAULT_STABILITY = 7; // days

/** True when the learner should see this node as needing practice (not mastered / not untouched). */
export function isPracticePriorityNodeState(state: NodeState | string): boolean {
  return state === "weak" || state === "learning";
}

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
   * Assign node state from mastery percentage (0–100).
   * mastered ≥ 85; learning for 30–84; weak for under 30.
   */
  static assignNodeState(mastery: number): NodeState {
    if (mastery >= MASTERED_THRESHOLD) return "mastered";
    if (mastery < WEAK_MAX_EXCLUSIVE) return "weak";
    return "learning";
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
    let state = resolveDisplayNodeState(uns.mastery, uns.state as string | undefined);

    if (
      state === "mastered" &&
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

/**
 * State shown on maps/sidebars: derive from mastery when present so the label always matches
 * the displayed % (e.g. 20% → `weak`), and never surface removed enum values like `missing`.
 */
export function resolveDisplayNodeState(
  mastery: number | null | undefined,
  stored: string | undefined
): NodeState {
  if (mastery != null && Number.isFinite(Number(mastery))) {
    return LearningStateEngine.assignNodeState(Number(mastery));
  }
  return coerceStoredNodeState(String(stored ?? "untouched"));
}
