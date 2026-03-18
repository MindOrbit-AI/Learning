import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { canViewSubject } from "@/lib/subject-visibility";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import { Play, Map, ChevronRight } from "lucide-react";

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
  if (!canViewSubject(subject, session?.user?.id as string | undefined)) notFound();

  const userNodeStates = session?.user?.id
    ? await prisma.userNodeState.findMany({
        where: {
          userId: session.user.id,
          subjectId: subject.id,
        },
      })
    : [];
  const stateMap = Object.fromEntries(userNodeStates.map((s) => [s.nodeId, s.state]));

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
        {subject.clusters.map((cluster) => (
          <Card key={cluster.id}>
            <CardHeader>
              <CardTitle>{cluster.title}</CardTitle>
              <CardDescription>{cluster.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {cluster.conceptNodes.map((node) => {
                  const state = stateMap[node.id];
                  return (
                    <Link
                      key={node.id}
                      href={`/mastery-map?node=${node.id}`}
                      className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-muted"
                    >
                      <span>{node.title}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          state === "mastered"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : state === "weak"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : state === "missing"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {state ?? "—"}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
