import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import { BarChart3, Map, Target } from "lucide-react";

export default async function DiagnosticResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ subjectSlug: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user?.id) redirect("/auth/signin");

  const { subjectSlug } = await params;
  const sp = await searchParams;
  const attemptId = sp.attemptId;

  if (!attemptId) redirect(`/subjects/${subjectSlug}`);

  const attempt = await prisma.diagnosticAttempt.findUnique({
    where: { id: attemptId },
    include: { subject: true },
  });

  if (!attempt || attempt.userId !== session.user.id) {
    redirect(`/subjects/${subjectSlug}`);
  }

  const nodeStates = await prisma.userNodeState.findMany({
    where: {
      userId: session.user.id,
      subjectId: attempt.subjectId,
    },
    include: { node: true },
  });

  const weakMissing = nodeStates.filter((n) => n.state === "weak" || n.state === "missing");
  const mastered = nodeStates.filter((n) => n.state === "mastered");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Diagnostic Complete</h1>
        <p className="text-muted-foreground">{attempt.subject.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Score</CardTitle>
          <CardDescription>Overall mastery from this diagnostic</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">
              {Math.round(attempt.overallScore ?? 0)}%
            </div>
            <p className="mt-2 text-muted-foreground">
              {mastered.length} mastered • {weakMissing.length} to improve
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={`/mastery-map?subject=${attempt.subjectId}`}>
          <Card className="transition-shadow hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <Map className="h-12 w-12 text-primary" />
              <div>
                <h3 className="font-semibold">View Mastery Map</h3>
                <p className="text-sm text-muted-foreground">
                  See your concept graph
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/missions?subject=${attempt.subjectId}`}>
          <Card className="transition-shadow hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <Target className="h-12 w-12 text-primary" />
              <div>
                <h3 className="font-semibold">Start Missions</h3>
                <p className="text-sm text-muted-foreground">
                  {weakMissing.length} recommended
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {weakMissing.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Focus Areas</CardTitle>
            <CardDescription>Concepts to strengthen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weakMissing.slice(0, 8).map((n) => (
                <Link
                  key={n.id}
                  href={`/mastery-map?node=${n.nodeId}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <span>{n.node.title}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      n.state === "weak"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30"
                    }`}
                  >
                    {n.state}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-4">
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
        <Link href={`/subjects/${subjectSlug}`}>
          <Button variant="outline">Back to Subject</Button>
        </Link>
      </div>
    </div>
  );
}
