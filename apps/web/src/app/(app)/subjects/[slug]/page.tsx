import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { canViewSubject } from "@/lib/subject-visibility";
import { AddSubjectToLibraryButton } from "@/features/subjects/add-subject-to-library-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import { Play, Map, ChevronRight, Lock } from "lucide-react";
import { PLAN_LIMITS, effectivePlanTier } from "@mindorbit/lib";
import type { NodeState } from "@mindorbit/types";
import { resolveDisplayNodeState } from "@/services/learning-state-engine";

function prettyNodeState(s: NodeState): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession();
  const subject = await prisma.subject.findUnique({
    where: { slug },
    include: {
      clusters: {
        include: {
          _count: { select: { conceptNodes: true } },
          conceptNodes: { orderBy: { orderIndex: "asc" } },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!subject) notFound();

  const userId = session?.user?.id;
  const libraryAdd =
    userId && subject.createdById && subject.createdById !== userId
      ? await prisma.userSubjectAdd.findUnique({
          where: { userId_subjectId: { userId, subjectId: subject.id } },
          select: { id: true },
        })
      : null;
  const hasAdded = !!libraryAdd;

  if (!canViewSubject(subject, userId, { hasAdded })) notFound();

  const showAddToLibrary =
    userId &&
    subject.createdById &&
    subject.createdById !== userId &&
    subject.status === "published";

  const userNodeStates = session?.user?.id
    ? await prisma.userNodeState.findMany({
        where: {
          userId: session.user.id,
          subjectId: subject.id,
        },
      })
    : [];
  const nodeUiById = Object.fromEntries(
    userNodeStates.map((s) => {
      const displayState = resolveDisplayNodeState(s.mastery, s.state as string | undefined);
      return [s.nodeId, { displayState, mastery: s.mastery }] as const;
    })
  ) as Record<string, { displayState: NodeState; mastery: number }>;

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { planTier: true, bonusProUntil: true },
      })
    : null;
  const planTier = effectivePlanTier({
    planTier: user?.planTier ?? "FREE",
    bonusProUntil: user?.bonusProUntil,
  });
  const maxClusters = PLAN_LIMITS[planTier].maxClustersVisible;
  const visibleClusters =
    maxClusters != null ? subject.clusters.slice(0, maxClusters) : subject.clusters;
  const hiddenCount = subject.clusters.length - visibleClusters.length;

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${subject.color}20` }}
          >
            {subject.icon}
          </span>
          <h1 className="text-2xl font-bold">{subject.title}</h1>
        </div>
        <p className="text-muted-foreground">{subject.description}</p>
      </div>

      {showAddToLibrary && (
        <AddSubjectToLibraryButton subjectId={subject.id} initiallyAdded={hasAdded} />
      )}

      <div className="flex flex-wrap gap-4">
        <Link href={`/diagnostics/${subject.slug}`}>
          <Button size="lg">
            <Play className="mr-2 h-4 w-4" />
            Start 5-min Diagnostic
          </Button>
        </Link>
        <Link href={`/mastery-map?subject=${subject.id}`}>
          <Button variant="outline" size="lg">
            <Map className="mr-2 h-4 w-4" />
            View Mastery Map
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Clusters & Concepts</h2>
        {visibleClusters.map((cluster) => (
          <Card key={cluster.id}>
            <CardHeader>
              <CardTitle>{cluster.title}</CardTitle>
              <CardDescription>{cluster.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {cluster.conceptNodes.map((node) => {
                  const ui = nodeUiById[node.id];
                  const displayState = ui?.displayState ?? "untouched";
                  const masteryVal = ui?.mastery;
                  const hasMastery = masteryVal != null && Number.isFinite(Number(masteryVal));
                  const pillText = hasMastery
                    ? `${Math.round(Number(masteryVal))}% · ${prettyNodeState(displayState)}`
                    : prettyNodeState(displayState);
                  return (
                    <Link
                      key={node.id}
                      href={`/mastery-map?node=${node.id}`}
                      className="flex min-w-0 items-center justify-between gap-2 rounded-xl border p-3 transition-colors hover:bg-muted"
                    >
                      <span className="min-w-0 flex-1 truncate">{node.title}</span>
                      <span
                        className={`max-w-[min(12rem,46%)] truncate rounded-full px-2 py-0.5 text-center text-xs tabular-nums ${
                          displayState === "mastered"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : displayState === "weak"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : displayState === "learning"
                                ? "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
                                : displayState === "untouched"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {pillText}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
        {hiddenCount > 0 && (
          <Card className="border-2 border-dashed border-muted">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-4">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 font-semibold">{hiddenCount} more cluster{hiddenCount !== 1 ? "s" : ""} locked</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upgrade to Pro to view all clusters and concepts
              </p>
              <Link href="/pricing">
                <Button className="mt-4">Upgrade to Pro</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
