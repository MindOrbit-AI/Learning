import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { levelFromXp, xpThresholdForLevel } from "@mindorbit/lib";
import { ensureReferralCode } from "@/services/referral-service";
import {
  buildMasteryShareSummary,
  getMasterySnapshotForUser,
} from "@/services/mastery-share-service";
import { getSiteUrl } from "@/lib/site-url";
import { GrowthSharePanel } from "./growth-share-panel";
import { Flame, Gift, Sparkles, TrendingUp, Users } from "lucide-react";

export default async function GrowthPage() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  const userId = session.user.id;
  const referralCode = await ensureReferralCode(userId);

  const [user, snapshot, inviteStats, referrals] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { bonusProUntil: true, planTier: true },
    }),
    getMasterySnapshotForUser(userId),
    prisma.referral.groupBy({
      by: ["status"],
      where: { referrerId: userId },
      _count: true,
    }),
    prisma.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        status: true,
        createdAt: true,
        qualifiedAt: true,
        referee: { select: { name: true, email: true } },
      },
    }),
  ]);

  const pending =
    inviteStats.find((g) => g.status === "pending")?._count ?? 0;
  const qualified =
    inviteStats.find((g) => g.status === "qualified")?._count ?? 0;

  const site = getSiteUrl();
  const inviteUrl = `${site}/auth/signup?ref=${referralCode}`;

  const summaryText = snapshot
    ? buildMasteryShareSummary(snapshot)
    : "Complete a mission to build your mastery summary.";

  const xp = snapshot?.xp ?? 0;
  const level = levelFromXp(xp);
  const prevThreshold = xpThresholdForLevel(level);
  const nextThreshold = xpThresholdForLevel(level + 1);
  const progress =
    nextThreshold > prevThreshold
      ? Math.min(100, Math.round(((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
      : 100;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Growth</h1>
        <p className="text-muted-foreground">
          Gamification, invites, and shareable progress — level up and bring friends.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Level & XP
            </CardTitle>
            <CardDescription>Lifetime XP sets your level</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              Level {level + 1}
              <span className="ml-2 text-lg font-normal text-muted-foreground">
                {xp.toLocaleString()} XP
              </span>
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {nextThreshold > xp
                ? `${(nextThreshold - xp).toLocaleString()} XP to level ${level + 2}`
                : "At the next band — keep earning XP!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-4 w-4 text-orange-500" />
              Streaks
            </CardTitle>
            <CardDescription>UTC calendar days with a completed mission</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{snapshot?.streakCount ?? 0} days</p>
            <p className="text-sm text-muted-foreground">
              Best streak {snapshot?.bestMissionStreak ?? 0} days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Referrals
          </CardTitle>
          <CardDescription>
            Share your link. When a friend finishes their first mission, you both earn XP — you also
            get {7} bonus Pro days (stackable).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium">Your code</p>
            <p className="font-mono text-lg font-bold tracking-wider">{referralCode}</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Invite link</p>
            <p className="break-all rounded-md border bg-muted/40 p-3 text-sm">{inviteUrl}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span>
              Pending (signed up): <strong>{pending}</strong>
            </span>
            <span>
              Qualified (first mission): <strong>{qualified}</strong>
            </span>
          </div>
          {user?.bonusProUntil && user.bonusProUntil > new Date() && (
            <p className="flex items-center gap-2 text-sm text-primary">
              <Sparkles className="h-4 w-4 shrink-0" />
              Bonus Pro active until {user.bonusProUntil.toLocaleString()}
              {user.planTier === "FREE" && " (subscription billing is still Free)"}
            </p>
          )}
          {referrals.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">Recent invites</p>
              <ul className="space-y-2 text-sm">
                {referrals.map((r) => (
                  <li
                    key={r.id}
                    className="flex justify-between gap-4 border-b border-border/60 py-2 last:border-0"
                  >
                    <span>{r.referee.name ?? r.referee.email}</span>
                    <span className="text-muted-foreground">
                      {r.status === "qualified" ? "Qualified" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <GrowthSharePanel initialSummary={summaryText} />

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="h-4 w-4" />
            Rewards recap
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1">
            <li>Referrer: +400 XP and +7 Pro days when an invite completes their first mission.</li>
            <li>Friend: +120 XP when they complete their first mission.</li>
            <li>Mission streaks and badges stack with your normal learning loop.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
