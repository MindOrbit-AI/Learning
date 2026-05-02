import type { PrismaClient } from "@mindorbit/db";
import type { Scene } from "@/types/scene";
import type { MasteryUpdatePayload } from "@/types/progress";
import type { VisualLesson } from "@/types/lesson";

const XP_CORRECT = 12;
const XP_WRONG = 2;

export function computeMasteryUpdate(isCorrect: boolean): MasteryUpdatePayload {
  if (isCorrect) {
    return {
      deltaMastery: 0.08,
      deltaConfidence: 0.05,
      xpGained: XP_CORRECT,
      reviewQueued: false,
    };
  }
  return {
    deltaMastery: -0.02,
    deltaConfidence: -0.06,
    xpGained: XP_WRONG,
    reviewQueued: true,
    misconceptionStored: true,
  };
}

/** Resolve `conceptNodeId` when it is stored as a ConceptNode slug (not a cuid). */
export async function resolveConceptNodeId(
  prisma: PrismaClient,
  subjectId: string | null | undefined,
  conceptNodeIdOrSlug: string,
): Promise<string | null> {
  const byId = await prisma.conceptNode.findUnique({ where: { id: conceptNodeIdOrSlug } });
  if (byId) return byId.id;
  if (!subjectId) return null;
  const bySlug = await prisma.conceptNode.findFirst({
    where: { subjectId, slug: conceptNodeIdOrSlug },
  });
  return bySlug?.id ?? null;
}

export async function persistMasterySideEffects(
  prisma: PrismaClient,
  args: {
    userId: string;
    subjectId: string | null | undefined;
    scene: Scene;
    lesson: VisualLesson;
    isCorrect: boolean;
    misconceptionLabel?: string;
  },
): Promise<void> {
  const { userId, subjectId, scene, isCorrect, misconceptionLabel } = args;
  const nodeId = await resolveConceptNodeId(prisma, subjectId, scene.masteryTarget.conceptNodeId);
  if (!nodeId || !subjectId) return;

  const existing = await prisma.userNodeState.findUnique({
    where: { userId_subjectId_nodeId: { userId, subjectId, nodeId } },
  });
  const baseMastery = existing?.mastery ?? 0;
  const baseConfidence = existing?.confidence ?? 0;
  const { deltaMastery, deltaConfidence } = computeMasteryUpdate(isCorrect);

  await prisma.userNodeState.upsert({
    where: { userId_subjectId_nodeId: { userId, subjectId, nodeId } },
    create: {
      userId,
      subjectId,
      nodeId,
      mastery: Math.min(1, Math.max(0, baseMastery + deltaMastery)),
      confidence: Math.min(1, Math.max(0, baseConfidence + deltaConfidence)),
      state: isCorrect ? "learning" : "weak",
      misconceptionJson: !isCorrect && misconceptionLabel ? { label: misconceptionLabel } : undefined,
      lastPracticedAt: new Date(),
    },
    update: {
      mastery: Math.min(1, Math.max(0, baseMastery + deltaMastery)),
      confidence: Math.min(1, Math.max(0, baseConfidence + deltaConfidence)),
      state: isCorrect ? (baseMastery + deltaMastery >= 0.85 ? "mastered" : "learning") : "weak",
      misconceptionJson:
        !isCorrect && misconceptionLabel ? { label: misconceptionLabel } : undefined,
      lastPracticedAt: new Date(),
    },
  });

  const u = computeMasteryUpdate(isCorrect);
  await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: u.xpGained } },
  });

  if (!isCorrect && u.reviewQueued) {
    try {
      await prisma.reviewQueueItem.create({
        data: {
          userId,
          subjectId,
          nodeId,
          dueAt: new Date(Date.now() + 24 * 3600 * 1000),
          priority: 2,
          status: "pending",
        },
      });
    } catch {
      // Non-fatal: duplicate or constraint noise should not block the learner path.
    }
  }
}

export function buildEasierFollowUpScene(scene: Scene): Scene {
  if (scene.type === "fraction_bar") {
    const total = typeof scene.data.totalParts === "number" ? scene.data.totalParts : 8;
    const easierTotal = Math.max(4, Math.min(8, total));
    return {
      ...scene,
      id: `${scene.id}-easier`,
      title: "Warm-up",
      prompt: `Let's try a smaller bar first — shade the same idea on fewer parts.`,
      data: { ...scene.data, totalParts: easierTotal },
      validation: { type: "count_match", expectedCount: Math.min(3, easierTotal - 1) },
      feedback: {
        correct: "Nice — same idea, smaller model.",
        incorrect: "Count the shaded parts again; tap slices one at a time.",
        hint: scene.feedback.hint,
      },
    };
  }
  return {
    ...scene,
    id: `${scene.id}-retry`,
    prompt: `${scene.prompt} (Try once more with the hint in mind.)`,
  };
}
