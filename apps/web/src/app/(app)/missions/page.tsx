import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { MissionGoalsSummary } from "@/components/mission-goals-summary";
import { endOfUtcDay, startOfUtcDay, startOfUtcWeek } from "@/lib/utc-calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { Clock, Target } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MissionsPage() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  const now = new Date();
  const dayStart = startOfUtcDay(now);
  const dayEnd = endOfUtcDay(now);
  const weekStart = startOfUtcWeek(now);

  const [missions, userGoals, missionsToday, missionsThisWeek] = await Promise.all([
    prisma.mission.findMany({
      where: { userId: session.user.id },
      include: { node: true, tasks: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { streakCount: true, bestMissionStreak: true },
    }),
    prisma.mission.count({
      where: {
        userId: session.user.id,
        status: "completed",
        completedAt: { gte: dayStart, lt: dayEnd },
      },
    }),
    prisma.mission.count({
      where: {
        userId: session.user.id,
        status: "completed",
        completedAt: { gte: weekStart },
      },
    }),
  ]);

  const active = missions.filter((m) => m.status !== "completed");
  const completed = missions.filter((m) => m.status === "completed");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Missions</h1>
        <p className="text-muted-foreground">
          AI-generated learning missions for your weak and missing nodes
        </p>
      </div>

      {userGoals && (
        <MissionGoalsSummary
          missionStreak={userGoals.streakCount}
          bestMissionStreak={userGoals.bestMissionStreak}
          missionsToday={missionsToday}
          missionsThisWeek={missionsThisWeek}
        />
      )}

      {active.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active</CardTitle>
            <CardDescription>Missions to complete</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {active.map((m) => (
                <Link key={m.id} href={`/missions/${m.id}`}>
                  <div className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted">
                    <div className="flex items-center gap-4">
                      <Target className="h-10 w-10 text-primary" />
                      <div>
                        <p className="font-medium">{m.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {m.node.title} • {m.tasks.length} tasks
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        ~{m.estimatedMinutes} min
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          m.status === "in_progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30"
                            : "bg-muted"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {active.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="mb-4 h-16 w-16 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              No active missions. Take a diagnostic to get personalized missions.
            </p>
            <Link href="/subjects" className="mt-4 text-primary hover:underline">
              Browse subjects
            </Link>
          </CardContent>
        </Card>
      )}

      {completed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>Past missions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completed.slice(0, 5).map((m) => (
                <Link
                  key={m.id}
                  href={`/missions/${m.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm opacity-75 transition-colors hover:bg-muted"
                >
                  <span>{m.title}</span>
                  <span className="text-muted-foreground">{m.node.title}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
