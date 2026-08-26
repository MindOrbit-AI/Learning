/**
 * Unified learning path — today's steps, next-best-action, decay alerts, re-diagnose triggers.
 */

import { prisma } from "@mindorbit/db";
import { LearningStateEngine, isPracticePriorityNodeState } from "./learning-state-engine";

export type PathStepKind = "diagnostic" | "mission" | "review" | "expand";
export type PathStepStatus = "done" | "current" | "upcoming";

export interface TodaysPathStep {
  kind: PathStepKind;
  title: string;
  description: string;
  href: string;
  status: PathStepStatus;
}

export interface DecayAlert {
  nodeId: string;
  nodeTitle: string;
  subjectId: string;
  mastery: number;
  retention: number;
}

export type NextActionKind =
  | "repair"
  | "prerequisite"
  | "challenge"
  | "cross_subject"
  | "review"
  | "rediagnose";

export interface NextBestAction {
  kind: NextActionKind;
  nodeId: string;
  nodeTitle: string;
  subjectId: string;
  subjectTitle: string;
  subjectSlug: string;
  score: number;
  reason: string;
  missionId?: string;
  href: string;
}

const GOAL_WEIGHTS: Record<string, { repair: number; challenge: number; crossSubject: number }> = {
  "Improve grades": { repair: 1.3, challenge: 0.9, crossSubject: 1.0 },
  "Prepare for a test": { repair: 1.4, challenge: 0.8, crossSubject: 0.9 },
  "SAT / ACT prep": { repair: 1.2, challenge: 1.1, crossSubject: 0.7 },
  "Build deep understanding": { repair: 1.0, challenge: 1.3, crossSubject: 1.2 },
  "Catch up on missed topics": { repair: 1.5, challenge: 0.7, crossSubject: 1.0 },
};

const EXAM_SUBJECT_SLUGS: Record<string, string[]> = {
  SAT: ["sat-math"],
  ACT: ["sat-math", "algebra"],
};

function goalMultiplier(studyGoal: string | null | undefined, kind: NextActionKind): number {
  const weights = GOAL_WEIGHTS[studyGoal ?? ""] ?? { repair: 1, challenge: 1, crossSubject: 1 };
  if (kind === "repair" || kind === "prerequisite") return weights.repair;
  if (kind === "challenge") return weights.challenge;
  if (kind === "cross_subject") return weights.crossSubject;
  return 1;
}

export async function getDecayAlerts(userId: string): Promise<DecayAlert[]> {
  const states = await prisma.userNodeState.findMany({
    where: { userId, state: { in: ["mastered", "learning"] } },
    include: { node: true },
  });

  const alerts: DecayAlert[] = [];
  const now = new Date();

  for (const uns of states) {
    const metrics = await LearningStateEngine.getNodeState(userId, uns.nodeId);
    if (!metrics) continue;
    if (metrics.state === "weak" && uns.state === "mastered") {
      alerts.push({
        nodeId: uns.nodeId,
        nodeTitle: uns.node.title,
        subjectId: uns.subjectId,
        mastery: metrics.mastery,
        retention: 1 - metrics.decay,
      });
    } else if (metrics.decay > 0.3) {
      const retention = LearningStateEngine.computeRetention(
        uns.lastPracticedAt,
        uns.stability > 0 ? uns.stability : 7,
        now
      );
      if (retention < 0.75 && uns.mastery >= 70) {
        alerts.push({
          nodeId: uns.nodeId,
          nodeTitle: uns.node.title,
          subjectId: uns.subjectId,
          mastery: metrics.mastery,
          retention,
        });
      }
    }
  }

  return alerts.sort((a, b) => a.retention - b.retention).slice(0, 5);
}

export async function shouldSuggestRediagnostic(userId: string): Promise<{
  suggest: boolean;
  reason?: string;
  subjectSlug?: string;
  subjectId?: string;
}> {
  const [completedMissions, lastDiagnostic, plateauNodes] = await Promise.all([
    prisma.mission.count({ where: { userId, status: "completed" } }),
    prisma.diagnosticAttempt.findFirst({
      where: { userId, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      include: { subject: true },
    }),
    prisma.userNodeState.count({
      where: {
        userId,
        state: "learning",
        mastery: { gte: 40, lte: 55 },
      },
    }),
  ]);

  if (completedMissions >= 5 && completedMissions % 5 === 0) {
    return {
      suggest: true,
      reason: `You've completed ${completedMissions} missions — a quick re-check keeps your map accurate.`,
      subjectSlug: lastDiagnostic?.subject.slug,
      subjectId: lastDiagnostic?.subjectId,
    };
  }

  if (plateauNodes >= 3) {
    return {
      suggest: true,
      reason: "Several concepts are stuck in progress — a fresh diagnostic can reveal hidden gaps.",
      subjectSlug: lastDiagnostic?.subject.slug,
      subjectId: lastDiagnostic?.subjectId,
    };
  }

  if (lastDiagnostic?.completedAt) {
    const daysSince =
      (Date.now() - lastDiagnostic.completedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince >= 30) {
      return {
        suggest: true,
        reason: "It's been over a month since your last diagnostic — time to refresh your map.",
        subjectSlug: lastDiagnostic.subject.slug,
        subjectId: lastDiagnostic.subjectId,
      };
    }
  }

  return { suggest: false };
}

export async function getNextBestActions(userId: string, limit = 5): Promise<NextBestAction[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { studyGoal: true, targetExams: true },
  });

  const [weakStates, dueReviews, missions, subjects, edges] = await Promise.all([
    prisma.userNodeState.findMany({
      where: { userId, state: { in: ["weak", "learning"] } },
      include: { node: true },
      orderBy: [{ state: "asc" }, { mastery: "asc" }],
      take: 20,
    }),
    prisma.reviewQueueItem.findMany({
      where: { userId, status: "pending", dueAt: { lte: new Date() } },
      include: { node: true },
      take: 5,
    }),
    prisma.mission.findMany({
      where: { userId, status: { in: ["not_started", "in_progress"] } },
      select: { id: true, nodeId: true },
    }),
    prisma.subject.findMany({
      select: { id: true, title: true, slug: true },
    }),
    prisma.conceptEdge.findMany({
      where: { relationshipType: "prerequisite" },
      select: { subjectId: true, sourceNodeId: true, targetNodeId: true },
    }),
  ]);

  const subjectMap = new Map(subjects.map((s) => [s.id, s]));
  const missionByNode = new Map(missions.map((m) => [m.nodeId, m.id]));
  const actions: NextBestAction[] = [];

  for (const review of dueReviews) {
    const subject = subjectMap.get(review.subjectId);
    actions.push({
      kind: "review",
      nodeId: review.nodeId,
      nodeTitle: review.node.title,
      subjectId: review.subjectId,
      subjectTitle: subject?.title ?? "Subject",
      subjectSlug: subject?.slug ?? "",
      score: 100 * goalMultiplier(user?.studyGoal, "review"),
      reason: "Due for spaced review — retrieval now prevents decay.",
      href: `/review?session=${review.id}`,
    });
  }

  for (const uns of weakStates) {
    const subject = subjectMap.get(uns.subjectId);
    if (!subject) continue;

    let kind: NextActionKind = uns.state === "weak" ? "repair" : "challenge";
    let reason =
      uns.state === "weak"
        ? "Critical gap — fixing this first gives the fastest gains."
        : "In progress — a few more reps should move this to mastered.";

    const weakPrereqs = edges.filter(
      (e) =>
        e.targetNodeId === uns.nodeId &&
        weakStates.some((w) => w.nodeId === e.sourceNodeId && w.state === "weak")
    );
    if (weakPrereqs.length > 0) {
      kind = "prerequisite";
      reason = "A prerequisite gap is blocking progress here — strengthen the foundation first.";
    }

    const examBoost =
      user?.targetExams?.some((exam) =>
        EXAM_SUBJECT_SLUGS[exam]?.includes(subject.slug)
      ) ?? false;

    actions.push({
      kind,
      nodeId: uns.nodeId,
      nodeTitle: uns.node.title,
      subjectId: uns.subjectId,
      subjectTitle: subject.title,
      subjectSlug: subject.slug,
      score:
        (uns.state === "weak" ? 90 : 70) *
        goalMultiplier(user?.studyGoal, kind) *
        (examBoost ? 1.15 : 1),
      reason,
      missionId: missionByNode.get(uns.nodeId),
      href: missionByNode.get(uns.nodeId)
        ? `/missions/${missionByNode.get(uns.nodeId)}`
        : `/mastery-map?subject=${uns.subjectId}&node=${uns.nodeId}`,
    });
  }

  const userSubjectIds = new Set(weakStates.map((s) => s.subjectId));
  for (const subject of subjects) {
    if (userSubjectIds.has(subject.id)) continue;
    if (weakStates.length === 0) {
      actions.push({
        kind: "cross_subject",
        nodeId: "",
        nodeTitle: subject.title,
        subjectId: subject.id,
        subjectTitle: subject.title,
        subjectSlug: subject.slug,
        score: 40 * goalMultiplier(user?.studyGoal, "cross_subject"),
        reason: "Expand to a new subject — start with a diagnostic to map your baseline.",
        href: `/diagnostics/${subject.slug}/run`,
      });
    }
  }

  const rediag = await shouldSuggestRediagnostic(userId);
  if (rediag.suggest && rediag.subjectSlug) {
    actions.push({
      kind: "rediagnose",
      nodeId: "",
      nodeTitle: "Refresh your map",
      subjectId: rediag.subjectId ?? "",
      subjectTitle: "",
      subjectSlug: rediag.subjectSlug,
      score: 60,
      reason: rediag.reason ?? "Time for a re-check.",
      href: `/diagnostics/${rediag.subjectSlug}/run`,
    });
  }

  return actions.sort((a, b) => b.score - a.score).slice(0, limit);
}

export async function getTodaysPath(userId: string): Promise<{
  steps: TodaysPathStep[];
  decayAlerts: DecayAlert[];
  suggestRediagnostic: boolean;
  rediagnosticHref?: string;
  nextActions: NextBestAction[];
}> {
  const [lastDiagnostic, todayMission, dueReview, nextActions, decayAlerts, rediag] =
    await Promise.all([
      prisma.diagnosticAttempt.findFirst({
        where: { userId, completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        include: { subject: true },
      }),
      prisma.mission.findFirst({
        where: { userId, status: { in: ["not_started", "in_progress"] } },
        include: { node: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.reviewQueueItem.findFirst({
        where: {
          userId,
          status: "pending",
          dueAt: { lte: new Date(Date.now() + 24 * 60 * 60 * 1000) },
        },
        include: { node: true },
        orderBy: { dueAt: "asc" },
      }),
      getNextBestActions(userId, 3),
      getDecayAlerts(userId),
      shouldSuggestRediagnostic(userId),
    ]);

  const steps: TodaysPathStep[] = [];
  let currentAssigned = false;

  const pushStep = (step: Omit<TodaysPathStep, "status"> & { forceCurrent?: boolean }) => {
    let status: PathStepStatus = "upcoming";
    if (step.forceCurrent || !currentAssigned) {
      status = currentAssigned ? "upcoming" : "current";
      if (status === "current") currentAssigned = true;
    }
    if (lastDiagnostic && step.kind === "diagnostic") status = "done";
    if (todayMission?.status === "completed" && step.kind === "mission") status = "done";
    steps.push({ ...step, status });
  };

  if (lastDiagnostic) {
    steps.push({
      kind: "diagnostic",
      title: `${lastDiagnostic.subject.title} diagnostic`,
      description: `Score: ${Math.round(lastDiagnostic.overallScore ?? 0)}% — map updated`,
      href: `/diagnostics/${lastDiagnostic.subject.slug}/results?attemptId=${lastDiagnostic.id}`,
      status: "done",
    });
  } else {
    pushStep({
      kind: "diagnostic",
      title: "Take a diagnostic",
      description: "Five minutes to see what's missing",
      href: "/subjects",
      forceCurrent: true,
    });
  }

  if (todayMission) {
    pushStep({
      kind: "mission",
      title: todayMission.title,
      description: `${todayMission.node.title} · ~${todayMission.estimatedMinutes} min`,
      href: `/missions/${todayMission.id}`,
    });
  } else if (lastDiagnostic) {
    pushStep({
      kind: "mission",
      title: "Start your first mission",
      description: "Practice your weakest concept",
      href: "/missions",
    });
  }

  if (dueReview) {
    pushStep({
      kind: "review",
      title: `Review: ${dueReview.node.title}`,
      description: "Retrieval practice to lock in memory",
      href: `/review?session=${dueReview.id}`,
    });
  }

  const expand = nextActions.find((a) => a.kind !== "review" && a.kind !== "repair");
  if (expand) {
    pushStep({
      kind: "expand",
      title: expand.nodeTitle || expand.subjectTitle,
      description: expand.reason,
      href: expand.href,
    });
  }

  return {
    steps,
    decayAlerts,
    suggestRediagnostic: rediag.suggest,
    rediagnosticHref: rediag.subjectSlug ? `/diagnostics/${rediag.subjectSlug}/run` : undefined,
    nextActions,
  };
}

export async function getMissionCompletionExpand(
  userId: string,
  completedNodeId: string,
  subjectId: string
): Promise<{
  stateBefore: string;
  stateAfter: string;
  masteryBefore: number;
  masteryAfter: number;
  unlockedNodes: Array<{ nodeId: string; title: string; state: string }>;
  nextAction: NextBestAction | null;
}> {
  const conceptEdges = await prisma.conceptEdge.findMany({
    where: { subjectId, sourceNodeId: completedNodeId },
    include: { targetNode: true },
  });

  const [nodeStates, nextActions] = await Promise.all([
    prisma.userNodeState.findMany({
      where: {
        userId,
        nodeId: { in: [completedNodeId, ...conceptEdges.map((e) => e.targetNodeId)] },
      },
    }),
    getNextBestActions(userId, 3),
  ]);

  const completedState = nodeStates.find((s) => s.nodeId === completedNodeId);
  const nextAction = nextActions.find((a) => a.nodeId !== completedNodeId) ?? nextActions[0] ?? null;

  const unlockedNodes = conceptEdges
    .map((e) => {
      const ts = nodeStates.find((s) => s.nodeId === e.targetNodeId);
      return {
        nodeId: e.targetNodeId,
        title: e.targetNode.title,
        state: ts?.state ?? "untouched",
      };
    })
    .filter((n) => n.state === "untouched" || isPracticePriorityNodeState(n.state));

  return {
    stateBefore: "learning",
    stateAfter: completedState?.state ?? "learning",
    masteryBefore: Math.max(0, (completedState?.mastery ?? 0) - 15),
    masteryAfter: completedState?.mastery ?? 0,
    unlockedNodes: unlockedNodes.slice(0, 4),
    nextAction,
  };
}

export async function countDueReviews(userId: string): Promise<number> {
  return prisma.reviewQueueItem.count({
    where: {
      userId,
      status: "pending",
      dueAt: { lte: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    },
  });
}
