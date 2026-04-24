import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@mindorbit/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@mindorbit/ui";
import { PRO_PRICE_MONTHLY } from "@mindorbit/lib";
import { Check, Crown, Sparkles } from "lucide-react";
import {
  GuestDiagnosticResultsMaskedReport,
  type GuestWeakConcept,
} from "@/features/diagnostics/guest-diagnostic-results-masked-report";
import { PrimeGuestClaimCookie } from "@/features/diagnostics/prime-guest-claim-cookie";
import { LearningStateEngine } from "@/services/learning-state-engine";

function guestMarketingInsight(
  subjectTitle: string,
  weakMissing: { node: { title: string }; state: string }[]
): string {
  if (weakMissing.length === 0) {
    return `Strong baseline in ${subjectTitle} on this run. Create an account to track progress and turn this into guided missions.`;
  }
  const names = weakMissing.slice(0, 2).map((n) => n.node.title);
  const head = names.join(" and ");
  const rest =
    weakMissing.length > 2
      ? ` — plus ${weakMissing.length - 2} more area${weakMissing.length > 3 ? "s" : ""}`
      : "";
  return `Your clearest opportunities are ${head}${rest}. Fixing these first usually gives the fastest gains.`;
}

type Props = {
  params: Promise<{ subjectSlug: string }>;
  searchParams: Promise<{ attemptId?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectSlug } = await params;
  const subject = await prisma.subject.findFirst({
    where: { slug: subjectSlug, createdById: null, status: "published" },
    select: { title: true },
  });
  if (!subject) return { title: "Results" };
  return { title: `${subject.title} — diagnostic results` };
}

export default async function MarketingDiagnosticResultsPage({ params, searchParams }: Props) {
  const { subjectSlug } = await params;
  const sp = await searchParams;
  const attemptId = sp.attemptId;

  if (!attemptId) redirect(`/try-diagnostic/${subjectSlug}`);

  const subject = await prisma.subject.findFirst({
    where: { slug: subjectSlug, createdById: null, status: "published" },
  });
  if (!subject) notFound();

  const attempt = await prisma.diagnosticAttempt.findFirst({
    where: {
      id: attemptId,
      userId: null,
      subjectId: subject.id,
    },
    include: {
      subject: true,
      responses: { include: { node: true } },
    },
  });

  if (!attempt || !attempt.completedAt) {
    redirect(`/try-diagnostic/${subjectSlug}`);
  }

  const nodeAgg = new Map<string, { correct: number; total: number; title: string }>();
  for (const r of attempt.responses) {
    const cur = nodeAgg.get(r.nodeId) ?? { correct: 0, total: 0, title: r.node.title };
    cur.total += 1;
    if (r.isCorrect) cur.correct += 1;
    nodeAgg.set(r.nodeId, cur);
  }

  const weakMissing: { node: { title: string }; state: string }[] = [];
  for (const [, { correct, total, title }] of nodeAgg) {
    const mastery = total > 0 ? (correct / total) * 100 : 0;
    const state = LearningStateEngine.assignNodeState(mastery);
    if (state === "weak" || state === "missing") {
      weakMissing.push({ node: { title }, state });
    }
  }

  const insight = guestMarketingInsight(attempt.subject.title, weakMissing);

  const weakConcepts: GuestWeakConcept[] = weakMissing.map((w) => ({
    title: w.node.title,
    state: w.state as GuestWeakConcept["state"],
  }));

  const signupSaveHref = `/auth/signup?callbackUrl=${encodeURIComponent(`/subjects/${subjectSlug}`)}`;
  const signupProHref = `/auth/signup?callbackUrl=${encodeURIComponent("/pricing")}`;
  const scoreRounded = Math.round(attempt.overallScore ?? 0);

  const proOutcomeBullets = [
    "Unlimited diagnostics so you can prove you’re improving—not guessing",
    "Missions that hit your exact weak spots instead of generic drills",
    "A clear view of what’s still holding you back as you level up",
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-6">
      <PrimeGuestClaimCookie attemptId={attemptId} subjectSlug={subjectSlug} />

      <div className="text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Diagnostic complete</p>
        <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
          Here&apos;s what&apos;s slowing you down in {attempt.subject.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base font-semibold text-muted-foreground sm:text-lg">
          The card below turns your score into a gap, shows what&apos;s hidden, and gives you a time-to-improvement
          path. Same browser signup links this run to your account. Pro is there when you want to compress the
          timeline.
        </p>
      </div>

      <GuestDiagnosticResultsMaskedReport
        subjectTitle={attempt.subject.title}
        scorePercent={scoreRounded}
        weakConcepts={weakConcepts}
        insight={insight}
        signupHref={signupSaveHref}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-primary/25 bg-gradient-to-br from-primary/[0.07] to-muted/15 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5 shrink-0" />
              <CardTitle className="text-xl">Turn this run into a study plan</CardTitle>
            </div>
            <CardDescription className="text-base font-medium leading-relaxed">
              Free account: reveal your ranked weak concepts, save this diagnostic to your profile, and start missions
              tied to what you missed. Use the same browser when you sign up so we can link this guest run
              automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2.5 text-sm font-semibold text-muted-foreground">
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                Full ranked list + next steps—not a one-off score
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                Streaks and history so improvement compounds
              </li>
            </ul>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={signupSaveHref}>Unlock my weak spots</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 border-primary/40 bg-gradient-to-b from-primary/12 to-card shadow-[0_10px_0_0_hsl(var(--primary)/0.2)]">
          <div className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground">
            Pro
          </div>
          <CardHeader className="pr-20">
            <div className="flex items-center gap-2 text-primary">
              <Crown className="h-5 w-5 shrink-0" />
              <CardTitle className="text-xl">Go from {scoreRounded}% → 80%+ mastery faster</CardTitle>
            </div>
            <CardDescription className="text-base font-medium leading-relaxed">
              Pro is for learners who want the gap to shrink on a faster clock: more reps on what actually broke,
              fewer wasted hours on stuff you already own.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-extrabold tabular-nums">
              ${PRO_PRICE_MONTHLY.toFixed(2)}
              <span className="text-base font-bold text-muted-foreground">/month</span>
            </p>
            <ul className="space-y-2 text-sm font-semibold text-muted-foreground">
              {proOutcomeBullets.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={signupProHref}>Compress my timeline — go Pro</Link>
            </Button>
            <p className="text-center text-xs font-medium text-muted-foreground">
              <Link href="/#pricing" className="underline underline-offset-4 hover:text-foreground">
                Compare Free vs Pro on the homepage
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-dashed border-primary/30 bg-muted/30">
        <CardContent className="flex flex-col items-center gap-3 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="max-w-md text-sm font-medium text-muted-foreground">
            Want the fastest path? Free account first to see what you&apos;re missing—then Pro if you want unlimited
            diagnostics and gap-closing at full speed.
          </p>
          <div className="flex shrink-0 flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href={signupSaveHref}>See what I&apos;m missing</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={signupProHref}>Fix my gaps faster (Pro)</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
