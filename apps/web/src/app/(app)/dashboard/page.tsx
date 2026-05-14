import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { subjectVisibilityWhere } from "@/lib/subject-visibility";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import {
  Target,
  Flame,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { formatRelativeTime } from "@mindorbit/lib";
import { EarnedBadgeIcon } from "@/features/badges/earned-badge-icon";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { userBadges: { include: { badge: true } } },
  });

  const todayMission = await prisma.mission.findFirst({
    where: { userId: session.user.id, status: { in: ["not_started", "in_progress"] } },
    include: { node: true },
    orderBy: { createdAt: "desc" },
  });

  const dueReviews = await prisma.reviewQueueItem.findMany({
    where: {
      userId: session.user.id,
      status: "pending",
      dueAt: { lte: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    },
    include: { node: true },
    take: 5,
  });

  const weakNodes = await prisma.userNodeState.findMany({
    where: { userId: session.user.id, state: { in: ["weak", "learning"] } },
    include: { node: true },
    take: 5,
  });

  const recentResources = await prisma.resource.findMany({
    where: { nodeId: { in: weakNodes.map((n) => n.nodeId) } },
    include: { user: { select: { name: true } } },
    take: 3,
  });

  const subjects = await prisma.subject.findMany({
    where: subjectVisibilityWhere(session.user.id),
    include: {
      _count: { select: { conceptNodes: true } },
    },
  });

  const totalNodes = subjects.reduce((a, s) => a + s._count.conceptNodes, 0);
  const masteredCount = await prisma.userNodeState.count({
    where: { userId: session.user.id, state: "mastered" },
  });
  const masteryPct = totalNodes > 0 ? Math.round((masteredCount / totalNodes) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold break-words sm:text-3xl">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Here&apos;s your learning overview
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <Card className="rounded-3xl border-2 border-primary/10 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mastery</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">{masteryPct}%</div>
            <p className="text-xs text-muted-foreground">
              {masteredCount} nodes mastered
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-orange-200 shadow-lg transition-all hover:shadow-xl dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">{user?.streakCount ?? 0} days</div>
            <p className="text-xs text-muted-foreground">
              UTC days with a mission · best {user?.bestMissionStreak ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-2 border-primary/10 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">{user?.xp ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total experience</p>
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

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Today&apos;s Mission</CardTitle>
            <CardDescription>
              {todayMission
                ? `Continue or start: ${todayMission.node.title}`
                : "Take a diagnostic to get your first mission"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayMission ? (
              <Link href={`/missions/${todayMission.id}`}>
                <div className="flex items-start justify-between gap-3 rounded-xl border p-4 transition-colors hover:bg-muted">
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                    <Target className="h-9 w-9 shrink-0 text-primary sm:h-10 sm:w-10" />
                    <div className="min-w-0">
                      <p className="font-medium">{todayMission.title}</p>
                      <p className="break-words text-sm text-muted-foreground">
                        {todayMission.node.title} • ~{todayMission.estimatedMinutes} min
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                </div>
              </Link>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <p className="mb-4 text-muted-foreground">
                  Take a diagnostic on any subject to unlock personalized missions
                </p>
                <Link href="/subjects">
                  <Button>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse subjects
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Due Reviews</CardTitle>
            <CardDescription>Reinforce weak nodes</CardDescription>
          </CardHeader>
          <CardContent>
            {dueReviews.length > 0 ? (
              <div className="space-y-2">
                {dueReviews.map((r) => (
                  <Link
                    key={r.id}
                    href={`/review?node=${r.nodeId}`}
                    className="block rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
                  >
                    <p className="font-medium">{r.node.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {formatRelativeTime(r.dueAt)}
                    </p>
                  </Link>
                ))}
                <Link href="/review">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews due today. Great job!</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weak Nodes</CardTitle>
          <CardDescription>Focus areas to improve</CardDescription>
        </CardHeader>
        <CardContent>
          {weakNodes.length > 0 ? (
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
          ) : (
            <p className="text-muted-foreground">
              Take a diagnostic to identify weak areas
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
