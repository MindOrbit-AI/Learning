import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import { User, Flame, Star, Award } from "lucide-react";
import { EarnedBadgeIcon } from "@/features/badges/earned-badge-icon";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      userBadges: { include: { badge: true } },
      _count: { select: { resources: true } },
    },
  });

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Your learning stats and settings.{" "}
          <Link href="/growth" className="text-primary underline-offset-4 hover:underline">
            Growth &amp; invites
          </Link>
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-6 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name ?? "Student"}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            {user.bio && (
              <p className="mt-2 text-sm">{user.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Star className="h-4 w-4" />
              XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user.xp}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Flame className="h-4 w-4" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user.streakCount} days</p>
            <p className="text-xs text-muted-foreground">
              Mission streak · best {user.bestMissionStreak}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Award className="h-4 w-4" />
              Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{user._count.resources}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Earned achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {(user.userBadges ?? []).map((ub) => (
              <div
                key={ub.badgeId}
                className="flex flex-col items-center rounded-xl border p-4"
                title={ub.badge.description}
              >
                <EarnedBadgeIcon
                  size="lg"
                  badge={{
                    slug: ub.badge.slug,
                    icon: ub.badge.icon,
                    title: ub.badge.title,
                    description: ub.badge.description,
                  }}
                />
                <span className="mt-3 text-sm font-medium">{ub.badge.title}</span>
              </div>
            ))}
            {(user.userBadges?.length ?? 0) === 0 && (
              <p className="text-muted-foreground">Complete missions to earn badges</p>
            )}
          </div>
        </CardContent>
      </Card>

      {user.gradeLevel && (
        <Card>
          <CardHeader>
            <CardTitle>Onboarding</CardTitle>
            <CardDescription>Your setup</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Grade: {user.gradeLevel}</p>
            {user.studyGoal && <p>Goal: {user.studyGoal}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
