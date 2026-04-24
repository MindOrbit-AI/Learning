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
import { PRO_FEATURES } from "@/features/pricing/pricing-data";
import { GuestDiagnosticResultsMaskedReport } from "@/features/diagnostics/guest-diagnostic-results-masked-report";
import { PrimeGuestClaimCookie } from "@/features/diagnostics/prime-guest-claim-cookie";

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
    select: {
      id: true,
      completedAt: true,
      overallScore: true,
      subject: { select: { title: true } },
    },
  });

  if (!attempt || !attempt.completedAt) {
    redirect(`/try-diagnostic/${subjectSlug}`);
  }

  const signupSaveHref = `/auth/signup?callbackUrl=${encodeURIComponent(`/subjects/${subjectSlug}`)}`;
  const signupProHref = `/auth/signup?callbackUrl=${encodeURIComponent("/pricing")}`;
  const proFeatureBullets = PRO_FEATURES.slice(0, 4);

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-6">
      <PrimeGuestClaimCookie attemptId={attemptId} subjectSlug={subjectSlug} />

      <div className="text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Diagnostic complete</p>
        <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your report is ready—unlock it with a free account
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base font-semibold text-muted-foreground sm:text-lg">
          Your overall score is shown below. Register (same browser) to unlock personalized insight and focus
          areas, save this run to your profile, and keep learning. Upgrade to MindOrbit Pro anytime for unlimited
          diagnostics and the full mastery map.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{attempt.subject.title}</p>
      </div>

      <GuestDiagnosticResultsMaskedReport
        scorePercent={Math.round(attempt.overallScore ?? 0)}
        signupHref={signupSaveHref}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-primary/25 bg-gradient-to-br from-primary/[0.07] to-muted/15 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5 shrink-0" />
              <CardTitle className="text-xl">Step 1 — Create your account</CardTitle>
            </div>
            <CardDescription className="text-base font-medium leading-relaxed">
              Free. Saves this diagnostic to your subject so you can pick up where you left off. Use the same
              browser when you sign up so we can link this guest run automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2.5 text-sm font-semibold text-muted-foreground">
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                Mastery map and missions for this subject
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                Streaks and history instead of one-off scores
              </li>
            </ul>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={signupSaveHref}>Create free account</Link>
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
              <CardTitle className="text-xl">Step 2 — MindOrbit Pro</CardTitle>
            </div>
            <CardDescription className="text-base font-medium leading-relaxed">
              Premium tier for learners who want the full path: unlimited diagnostics, every cluster, and
              advanced insights—after you have an account, checkout takes a minute.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-extrabold tabular-nums">
              ${PRO_PRICE_MONTHLY.toFixed(2)}
              <span className="text-base font-bold text-muted-foreground">/month</span>
            </p>
            <ul className="space-y-2 text-sm font-semibold text-muted-foreground">
              {proFeatureBullets.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={signupProHref}>Sign up to see Pro checkout</Link>
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
            Ready to commit? Create your account first, then choose Pro from pricing whenever you want unlimited
            practice.
          </p>
          <div className="flex shrink-0 flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href={signupSaveHref}>Create free account</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={signupProHref}>Go Pro</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/try-diagnostic">
          <Button variant="ghost">Other subjects</Button>
        </Link>
      </div>
    </div>
  );
}
