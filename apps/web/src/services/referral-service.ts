/**
 * Referrals: invite codes, first-mission qualification, XP + bonus Pro rewards.
 */

import { randomBytes } from "crypto";
import { prisma } from "@mindorbit/db";
import { AnalyticsService, EVENT_TYPES } from "./analytics-service";

const REFERRER_QUALIFY_XP = 400;
const REFEREE_QUALIFY_XP = 120;
const REFERRER_BONUS_PRO_DAYS = 7;

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export async function ensureReferralCode(userId: string): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (existing?.referralCode) return existing.referralCode;

  for (let i = 0; i < 8; i++) {
    const code = randomReferralCode();
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
      });
      return code;
    } catch {
      /* unique collision — retry */
    }
  }
  throw new Error("Could not allocate referral code");
}

function randomReferralCode(): string {
  const bytes = randomBytes(12);
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length];
  }
  return s;
}

/** Allocate a unique referral code for a new account row. */
export async function allocateUniqueReferralCode(): Promise<string> {
  for (let i = 0; i < 12; i++) {
    const code = randomReferralCode();
    const clash = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });
    if (!clash) return code;
  }
  throw new Error("Could not allocate referral code");
}

function normalizeRefCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/**
 * After creating a user row, optionally attach a pending referral from a ref code.
 */
export async function attachReferralFromCode(newUserId: string, refCode: string | null | undefined): Promise<void> {
  const code = refCode ? normalizeRefCode(refCode) : "";
  if (code.length < 4) return;

  const referrer = await prisma.user.findFirst({
    where: { referralCode: code },
    select: { id: true },
  });
  if (!referrer || referrer.id === newUserId) return;

  try {
    await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        refereeId: newUserId,
        status: "pending",
      },
    });
  } catch {
    return;
  }

  await AnalyticsService.track(newUserId, EVENT_TYPES.referral_signup, {
    referrerId: referrer.id,
  });
}

/**
 * When a referred user completes their first mission, qualify the referral and grant rewards.
 */
export async function maybeQualifyReferralAfterMission(
  refereeUserId: string,
  completedMissionId: string
): Promise<void> {
  const completedCount = await prisma.mission.count({
    where: { userId: refereeUserId, status: "completed" },
  });
  if (completedCount !== 1) return;

  const referral = await prisma.referral.findUnique({
    where: { refereeId: refereeUserId },
  });
  if (!referral || referral.status !== "pending") return;

  const now = new Date();
  const referrer = await prisma.user.findUnique({
    where: { id: referral.referrerId },
    select: { bonusProUntil: true },
  });
  const previousEnd = referrer?.bonusProUntil;
  const base =
    previousEnd && previousEnd > now ? previousEnd : now;
  const newBonusEnd = new Date(base.getTime() + REFERRER_BONUS_PRO_DAYS * 86400000);

  await prisma.$transaction([
    prisma.referral.update({
      where: { id: referral.id },
      data: { status: "qualified", qualifiedAt: now },
    }),
    prisma.user.update({
      where: { id: referral.referrerId },
      data: {
        xp: { increment: REFERRER_QUALIFY_XP },
        bonusProUntil: newBonusEnd,
      },
    }),
    prisma.user.update({
      where: { id: refereeUserId },
      data: { xp: { increment: REFEREE_QUALIFY_XP } },
    }),
  ]);

  await AnalyticsService.track(refereeUserId, EVENT_TYPES.referral_qualified, {
    missionId: completedMissionId,
    referrerId: referral.referrerId,
    referrerXp: REFERRER_QUALIFY_XP,
    refereeXp: REFEREE_QUALIFY_XP,
    bonusProDays: REFERRER_BONUS_PRO_DAYS,
  });
}
