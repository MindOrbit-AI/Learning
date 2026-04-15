import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@mindorbit/ui";
import { Lightbulb, Map, Target } from "lucide-react";
import { DiagnosticPostPaywall } from "@/features/diagnostics/diagnostic-post-paywall";
import { effectivePlanTier } from "@mindorbit/lib";

function diagnosticInsight(
  subjectTitle: string,
  weakMissing: { node: { title: string }; state: string }[]
): string {
  if (weakMissing.length === 0) {
    return `Strong baseline in ${subjectTitle}. Keep reinforcing with missions so nothing slips.`;
  }
  const names = weakMissing.slice(0, 2).map((n) => n.node.title);
  const head = names.join(" and ");
  const rest =
    weakMissing.length > 2 ? ` — plus ${weakMissing.length - 2} more area${weakMissing.length > 3 ? "s" : ""}` : "";
  return `Your clearest opportunities are ${head}${rest}. Fixing these first usually gives the fastest score gains.`;
}

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

  const [attempt, user] = await Promise.all([
    prisma.diagnosticAttempt.findUnique({
      where: { id: attemptId },
      include: { subject: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { planTier: true, bonusProUntil: true },
    }),
  ]);

  if (!attempt || attempt.userId !== session.user.id) {
    redirect(`/subjects/${subjectSlug}`);
  }

  const planTier = effectivePlanTier({
    planTier: user?.planTier ?? "FREE",
    bonusProUntil: user?.bonusProUntil,
  });

  const nodeStates = await prisma.userNodeState.findMany({
    where: {
      userId: session.user.id,
      subjectId: attempt.subjectId,
    },
    include: { node: true },
  });

  const weakMissing = nodeStates.filter((n) => n.state === "weak" || n.state === "missing");
  const mastered = nodeStates.filter((n) => n.state === "mastered");
  const insight = diagnosticInsight(attempt.subject.title, weakMissing);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Diagnostic complete</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Here&apos;s your snapshot</h1>
        <p className="mt-2 text-muted-foreground">{attempt.subject.title}</p>
      </div>

      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle>Your score</CardTitle>
          <CardDescription>Estimated mastery from this run—not a grade, a compass.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold tabular-nums text-primary">
              {Math.round(attempt.overallScore ?? 0)}%
            </div>
            <p className="mt-2 text-muted-foreground">
              {mastered.length} strong • {weakMissing.length} to improve
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-500/20 bg-amber-500/[0.06] dark:bg-amber-500/[0.08]">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Lightbulb className="h-5 w-5 shrink-0" />
            <CardTitle className="text-lg">Insight</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-pretty leading-relaxed text-foreground">{insight}</p>
        </CardContent>
      </Card>

      {weakMissing.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s wrong (focus here first)</CardTitle>
            <CardDescription>Concepts that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weakMissing.slice(0, 8).map((n) => (
                <Link
                  key={n.id}
                  href={`/mastery-map?subject=${attempt.subjectId}&node=${n.nodeId}`}
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

      {planTier === "FREE" && (
        <DiagnosticPostPaywall
          subjectTitle={attempt.subject.title}
          subjectId={attempt.subjectId}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={`/mastery-map?subject=${attempt.subjectId}`}>
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <Map className="h-12 w-12 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Mastery map</h3>
                <p className="text-sm text-muted-foreground">
                  {planTier === "FREE" ? "Limited on Free — Pro unlocks full graph" : "See your full concept graph"}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href={`/missions?subject=${attempt.subjectId}`}>
          <Card className="h-full transition-shadow hover:shadow-lg">
            <CardContent className="flex items-center gap-4 p-6">
              <Target className="h-12 w-12 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Training missions</h3>
                <p className="text-sm text-muted-foreground">
                  {weakMissing.length} recommended to start
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pb-4">
        <Link href="/dashboard">
          <Button>Go to dashboard</Button>
        </Link>
        <Link href={`/subjects/${subjectSlug}`}>
          <Button variant="outline">Back to subject</Button>
        </Link>
      </div>
    </div>
  );
}
