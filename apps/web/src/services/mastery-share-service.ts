import { randomBytes } from "crypto";
import { prisma } from "@mindorbit/db";
import { levelFromXp } from "@mindorbit/lib";

export interface MasterySnapshot {
  displayName: string;
  xp: number;
  level: number;
  streakCount: number;
  bestMissionStreak: number;
  missionsCompleted: number;
  nodesMastered: number;
}

export async function getMasterySnapshotForUser(userId: string): Promise<MasterySnapshot | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      xp: true,
      streakCount: true,
      bestMissionStreak: true,
    },
  });
  if (!user) return null;

  const [missionsCompleted, nodesMastered] = await Promise.all([
    prisma.mission.count({ where: { userId, status: "completed" } }),
    prisma.userNodeState.count({ where: { userId, state: "mastered" } }),
  ]);

  const xp = user.xp;
  return {
    displayName: user.name?.trim() || user.email?.split("@")[0] || "Learner",
    xp,
    level: levelFromXp(xp),
    streakCount: user.streakCount,
    bestMissionStreak: user.bestMissionStreak,
    missionsCompleted,
    nodesMastered,
  };
}

export function buildMasteryShareSummary(s: MasterySnapshot): string {
  const lv = s.level + 1;
  return (
    `${s.displayName} on MindOrbit Learn — Level ${lv}, ${s.xp.toLocaleString()} XP. ` +
    `${s.missionsCompleted} missions completed, ${s.nodesMastered} concepts mastered, ` +
    `${s.streakCount}-day mission streak (best ${s.bestMissionStreak}).`
  );
}

export async function createMasteryShareToken(userId: string): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  await prisma.masteryShareToken.create({
    data: { userId, token },
  });
  return token;
}

export async function getSnapshotByShareToken(
  token: string
): Promise<{ snapshot: MasterySnapshot } | null> {
  const row = await prisma.masteryShareToken.findUnique({
    where: { token },
    select: {
      expiresAt: true,
      userId: true,
    },
  });
  if (!row) return null;
  if (row.expiresAt && row.expiresAt < new Date()) return null;

  const snapshot = await getMasterySnapshotForUser(row.userId);
  if (!snapshot) return null;
  return { snapshot };
}
