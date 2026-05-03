import Link from "next/link";
import { AlertTriangle, Lightbulb } from "lucide-react";
import { Button, Card, CardTitle } from "@mindorbit/ui";

export type GuestWeakConcept = {
  title: string;
  state: "weak" | "learning";
};

type Props = {
  subjectTitle: string;
  scorePercent: number;
  weakConcepts: GuestWeakConcept[];
  insight: string;
  signupHref: string;
};

function severityLabel(state: GuestWeakConcept["state"]): string {
  if (state === "weak") return "Critical gap";
  return "Needs practice";
}

/**
 * High-intent guest diagnostic results: pain → tease → promise → CTA → insight.
 */
export function GuestDiagnosticResultsMaskedReport({
  subjectTitle,
  scorePercent,
  weakConcepts,
  insight,
  signupHref,
}: Props) {
  const gapPercent = Math.max(0, Math.min(100, 100 - scorePercent));
  const topCap = 7;
  const ranked = weakConcepts.slice(0, topCap);
  const topN = ranked.length > 0 ? Math.min(ranked.length, topCap) : 0;
  const teaseRows = ranked.slice(0, 2);
  const moreLocked = Math.max(0, ranked.length - teaseRows.length);

  const painHeadline =
    weakConcepts.length > 0
      ? `You're missing ${gapPercent}% of ${subjectTitle} fundamentals`
      : `You're at ${scorePercent}% mastery in ${subjectTitle}`;

  const painSub =
    weakConcepts.length > 0
      ? "This will slow you down on every topic that builds on these skills—unless you close the gaps now."
      : "Solid baseline—still worth locking in before harder units add new layers on top.";

  const painExtra =
    scorePercent < 55
      ? "Students at your level often struggle when problems mix several ideas at once—because a few core skills are still shaky."
      : scorePercent < 80
        ? "At your level, small gaps turn into wrong turns under time pressure. Tightening them early saves hours later."
        : "Even strong scores hide a few brittle spots. Knowing exactly which concepts to rehearse keeps your edge.";

  return (
    <section>
      <Card className="overflow-hidden border-2 border-destructive/25 bg-gradient-to-b from-card via-destructive/[0.03] to-muted/20 shadow-lg">
        {/* 1. Pain */}
        <div className="space-y-4 border-b border-border/80 bg-gradient-to-br from-destructive/[0.06] to-transparent p-6 sm:p-8">
          <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-destructive sm:text-left">
            The gap
          </p>
          <h2 className="text-balance text-center text-2xl font-extrabold tracking-tight text-foreground sm:text-left sm:text-3xl md:text-4xl">
            {painHeadline}
          </h2>
          <p className="text-center text-base font-semibold leading-relaxed text-muted-foreground sm:text-left sm:text-lg">
            {painSub}
          </p>
          <p className="text-center text-sm font-medium leading-relaxed text-muted-foreground sm:text-left sm:text-base">
            {painExtra}
          </p>
        </div>

        {/* Stakes */}
        <div className="flex gap-3 border-b border-border/60 bg-muted/40 px-6 py-4 sm:px-8">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500"
            aria-hidden
          />
          <p className="text-sm font-semibold leading-snug text-foreground">
            If these gaps aren&apos;t fixed, the next topics in this subject keep stacking on shaky ground—and
            multi-step work gets exhausting fast. You&apos;re not &quot;bad at the subject&quot;; you&apos;re
            missing a few load-bearing skills.
          </p>
        </div>

        {/* 2. Hidden value tease */}
        <div className="border-b border-border/60 px-6 py-6 sm:px-8">
          <div className="rounded-2xl border-2 border-dashed border-primary/35 bg-primary/[0.04] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg" aria-hidden>
                🔒
              </span>
              <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">
                {topN === 0
                  ? "Your personalized weak spots (hidden)"
                  : topN === 1
                    ? "Your #1 weak concept (hidden)"
                    : `Your top ${topN} weak concepts (hidden)`}
              </h3>
            </div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Names and order are from this diagnostic—we only reveal the full list after you sign up on this
              browser.
            </p>

            {teaseRows.length > 0 ? (
              <ul className="mt-5 space-y-3" aria-label="Concept titles hidden until you create an account">
                {teaseRows.map((w, i) => (
                  <li
                    key={`${w.title}-${i}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/80 px-4 py-3"
                  >
                    <span className="font-mono text-sm font-extrabold text-muted-foreground">#{i + 1}</span>
                    <span className="min-w-0 flex-1 select-none text-left text-sm font-semibold blur-[10px]">
                      {w.title}
                    </span>
                    <span className="shrink-0 rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-bold text-destructive">
                      {severityLabel(w.state)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                No urgent weak spots were flagged this run. Unlock your full breakdown and next-step missions with
                a free account anyway—so nothing slips when the next unit hits.
              </p>
            )}

            {moreLocked > 0 && (
              <p className="mt-4 text-center text-sm font-extrabold text-primary">
                +{moreLocked} more locked — unlock to see the full ranked list
              </p>
            )}
          </div>
        </div>

        {/* 3. Time-to-outcome promise */}
        <div className="border-b border-border/60 bg-gradient-to-r from-primary/[0.08] to-transparent px-6 py-5 sm:px-8">
          <p className="text-center text-base font-extrabold leading-snug text-foreground sm:text-left sm:text-lg">
            Fix these gaps first → most students see roughly{" "}
            <span className="text-primary">20–40% mastery gains within two weeks</span> when they practice their
            flagged concepts.
          </p>
          <p className="mt-2 text-center text-sm font-semibold text-muted-foreground sm:text-left">
            Tight, targeted reps can move your score meaningfully in as little as{" "}
            <span className="font-extrabold text-foreground">7 days</span>—if you know exactly what to fix.
          </p>
        </div>

        {/* 4. CTA */}
        <div className="flex flex-col items-center gap-2 border-b border-border/60 px-6 py-8 sm:px-8">
          <Button asChild size="lg" className="h-12 min-w-[240px] px-8 text-base font-extrabold sm:h-14 sm:text-lg">
            <Link href={signupHref}>Unlock my weak spots →</Link>
          </Button>
          <p className="max-w-md text-center text-xs font-medium text-muted-foreground">
            Free account · same browser · links this run to your profile
          </p>
        </div>

        {/* 5. Insight (supporting proof) */}
        <div className="px-4 py-6 sm:px-6 sm:py-8">
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-4 shadow-sm dark:bg-amber-500/[0.08] sm:p-5">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <Lightbulb className="h-5 w-5 shrink-0" aria-hidden />
              <CardTitle className="text-lg font-bold">Coach insight</CardTitle>
            </div>
            <p className="mt-3 text-pretty text-sm font-medium leading-relaxed text-foreground sm:text-base">
              {insight}
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}
