import Link from "next/link";
import { Lock } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mindorbit/ui";

type Props = {
  scorePercent: number;
  signupHref: string;
};

function SkeletonLine({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? "h-4 w-full"}`} />;
}

/**
 * Guest marketing results: shows the real overall score, with insight / focus
 * placeholders and a register overlay until the user signs up.
 */
export function GuestDiagnosticResultsMaskedReport({ scorePercent, signupHref }: Props) {
  return (
    <section className="space-y-4">
      <Card className="border-2 border-primary/25 bg-gradient-to-br from-primary/[0.06] to-card shadow-md">
        <CardHeader>
          <CardTitle>Your score</CardTitle>
          <CardDescription>Estimated mastery from this run—not a grade, a compass.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-5xl font-bold tabular-nums text-primary">{scorePercent}%</div>
            <p className="mt-2 text-sm text-muted-foreground">Guest run — insight and focus list unlock with a free account</p>
          </div>
        </CardContent>
      </Card>

      <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-b from-card to-muted/30 shadow-lg">
        <div
          className="pointer-events-none select-none space-y-6 p-4 opacity-[0.35] blur-[7px] sm:p-6"
          aria-hidden="true"
        >
        <Card className="border-amber-500/15 bg-amber-500/[0.04] shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Insight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <SkeletonLine className="h-4 w-full" />
            <SkeletonLine className="h-4 w-[92%]" />
            <SkeletonLine className="h-4 w-[88%]" />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Focus here first</CardTitle>
            <CardDescription>Concepts to prioritize from this diagnostic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3">
                <SkeletonLine className="h-4 flex-1 max-w-[70%]" />
                <SkeletonLine className="h-6 w-16 shrink-0 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/80 p-6 text-center backdrop-blur-sm sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/40 bg-primary/10 text-primary shadow-sm">
          <Lock className="h-7 w-7" strokeWidth={2.5} aria-hidden />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-balance text-xl font-extrabold tracking-tight sm:text-2xl">
            Register to unlock insight and focus areas
          </h2>
          <p className="text-pretty text-sm font-medium text-muted-foreground sm:text-base">
            Your overall score is already visible above. Create a free account (same browser) to reveal your
            personalized insight, which concepts to prioritize, and to save this run to your profile.
          </p>
        </div>
        <div className="flex w-full max-w-md justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={signupHref}>Create free account</Link>
          </Button>
        </div>
        </div>
      </div>
    </section>
  );
}
