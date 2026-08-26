import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import { Flame, TrendingUp, BookOpen, ChevronRight } from "lucide-react";
import { EarnedBadgeIcon } from "@/features/badges/earned-badge-icon";
import { TodaysPathCard } from "@/features/learning-loop/todays-path-card";
import { ProgressDigestBanner } from "@/features/learning-loop/progress-digest-banner";
import { getTodaysPath, countDueReviews } from "@/services/learning-path-service";
import { maybeCreateWeeklyDigest, getUnreadDigests } from "@/services/progress-digest-service";
import { subjectVisibilityWhere } from "@/lib/subject-visibility";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  await maybeCreateWeeklyDigest(session.user.id);

  const [user, pathData, digests, dueReviewCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { userBadges: { include: { badge: true } } },
    }),
    getTodaysPath(session.user.id),
    getUnreadDigests(session.user.id),
    countDueReviews(session.user.id),
  ]);

  const subjects = await prisma.subject.findMany({
    where: subjectVisibilityWhere(session.user.id),
    include: { _count: { select: { conceptNodes: true } } },
  });

  const totalNodes = subjects.reduce((a, s) => a + s._count.conceptNodes, 0);
  const masteredCount = await prisma.userNodeState.count({
    where: { userId: session.user.id, state: "mastered" },
  });
  const masteryPct = totalNodes > 0 ? Math.round((masteredCount / totalNodes) * 100) : 0;

  const weakNodes = await prisma.userNodeState.findMany({
    where: { userId: session.user.id, state: { in: ["weak", "learning"] } },
    include: { node: true },
    take: 5,
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold break-words sm:text-3xl">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {dueReviewCount > 0
            ? `${dueReviewCount} review${dueReviewCount > 1 ? "s" : ""} due · review streak ${user?.reviewStreakCount ?? 0} days`
            : "Here's your learning overview"}
        </p>
      </div>

      {digests.length > 0 && <ProgressDigestBanner notifications={digests} />}

      <TodaysPathCard
        steps={pathData.steps}
        decayAlerts={pathData.decayAlerts}
        suggestRediagnostic={pathData.suggestRediagnostic}
        rediagnosticHref={pathData.rediagnosticHref}
        nextActions={pathData.nextActions}
      />

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <Card className="rounded-3xl border-2 border-primary/10 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mastery</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">{masteryPct}%</div>
            <p className="text-xs text-muted-foreground">{masteredCount} nodes mastered</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-orange-200 shadow-lg transition-all hover:shadow-xl dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mission streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">{user?.streakCount ?? 0} days</div>
            <p className="text-xs text-muted-foreground">Best {user?.bestMissionStreak ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-primary/10 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Review streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">{user?.reviewStreakCount ?? 0} days</div>
            <p className="text-xs text-muted-foreground">
              {dueReviewCount > 0 ? `${dueReviewCount} due today` : "All caught up"}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-primary/10 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {(user?.userBadges ?? []).slice(0, 4).map((ub) => (
                <EarnedBadgeIcon
                  key={ub.badgeId}
                  size="sm"
                  badge={{
                    slug: ub.badge.slug,
                    icon: ub.badge.icon,
                    title: ub.badge.title,
                    description: ub.badge.description,
                  }}
                />
              ))}
              {(user?.userBadges?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">Complete missions to earn badges</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {weakNodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Focus areas</CardTitle>
            <CardDescription>Weak nodes from your mastery map</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {weakNodes.map((n) => (
                <Link
                  key={n.id}
                  href={`/mastery-map?node=${n.nodeId}`}
                  className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted"
                >
                  <span className="font-medium">{n.node.title}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pathData.steps.length <= 1 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="mb-4 text-muted-foreground">
              Take a diagnostic on any subject to unlock your personalized path
            </p>
            <Link href="/subjects">
              <Button>
                <BookOpen className="mr-2 h-4 w-4" />
                Browse subjects
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
