import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Compass,
  Flame,
  GitBranch,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { DuoLandingFooter } from "@/features/marketing/duo-landing-footer";
import { DuoLandingHeader } from "@/features/marketing/duo-landing-header";
import { DuoPrimaryLink } from "@/features/marketing/duo-primary-link";
import { MasteryMapVisual } from "@/features/marketing/mastery-map-visual";
import { ScrollReveal } from "@/features/marketing/scroll-reveal";

export const metadata: Metadata = {
  title: { absolute: "MindOrbit - From hidden gaps to visible progress" },
  description:
    "MindOrbit turns scattered studying into a clear learning path with diagnostics, mastery maps, targeted missions, and reinforcement that sticks.",
  openGraph: {
    title: "MindOrbit - From hidden gaps to visible progress",
    description:
      "Move from guessing what is wrong to knowing exactly what to fix next.",
    url: "/transformation",
  },
  twitter: {
    title: "MindOrbit - From hidden gaps to visible progress",
    description:
      "Move from guessing what is wrong to knowing exactly what to fix next.",
  },
};

const BEFORE_POINTS = [
  "Vague study plans that feel too big to start",
  "Reviewing what already feels comfortable",
  "Hidden weak spots that make new lessons break",
  "Hours of effort that do not show up on tests",
] as const;

const AFTER_POINTS = [
  "A ranked map of exactly what needs attention",
  "Missions built around weak spots, not busywork",
  "Reinforcement timed so concepts stay available",
  "Progress students and parents can actually see",
] as const;

const OUTCOMES = [
  {
    title: "Clarity",
    body: "A quick diagnostic turns vague worry into a precise picture of what the student knows and what is missing.",
    Icon: Compass,
  },
  {
    title: "Momentum",
    body: "Clear next steps replace wheel-spinning, so every session starts with the highest-value move.",
    Icon: Zap,
  },
  {
    title: "Mastery",
    body: "Targeted practice and spaced reinforcement help knowledge become reliable when exams arrive.",
    Icon: Trophy,
  },
] as const;

const LOOP = [
  {
    step: "01",
    title: "Diagnose the gaps",
    body: "Find the hidden nodes that are making the subject feel harder than it should.",
  },
  {
    step: "02",
    title: "Map the subject",
    body: "Turn a messy class into a visible path of foundations, dependencies, and priority fixes.",
  },
  {
    step: "03",
    title: "Train the weak spots",
    body: "Practice with missions focused on the concepts that will move grades and confidence.",
  },
  {
    step: "04",
    title: "Reinforce what matters",
    body: "Bring concepts back on schedule so students stop relearning the same material.",
  },
] as const;

const PRODUCT_OUTPUTS = [
  "Strength map",
  "Weak nodes",
  "Root cause analysis",
  "Action plan",
] as const;

export default function TransformationLandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[hsl(var(--duo-gold)_/_0.24)] blur-3xl" />
        <div className="absolute -right-20 top-48 h-72 w-72 rounded-full bg-[hsl(var(--duo-blue)_/_0.18)] blur-3xl" />
        <div className="absolute bottom-40 left-1/3 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <DuoLandingHeader />

      <main>
        <section className="relative border-b border-border/60 bg-gradient-to-b from-secondary/50 via-background to-background pb-16 pt-10 sm:pb-24 sm:pt-14">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
              <ScrollReveal className="min-w-0">
                <p className="inline-flex items-center gap-2 rounded-full border-2 border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                  <Brain className="h-4 w-4" strokeWidth={2.5} />
                  The MindOrbit transformation
                </p>
                <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  From hidden gaps to
                  <span className="text-primary"> visible progress.</span>
                </h1>
                <p className="mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
                  MindOrbit turns scattered studying into a clear learning path, helping students move from
                  confusion and wasted effort to confident, compounding mastery.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <DuoPrimaryLink href="/auth/signup">
                    Start free
                    <ArrowRight className="h-4 w-4" />
                  </DuoPrimaryLink>
                  <Link
                    href="/try-diagnostic"
                    className="inline-flex h-14 items-center justify-center rounded-2xl border-[3px] border-[hsl(var(--duo-blue))] bg-background px-8 text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] shadow-sm transition hover:bg-[hsl(var(--duo-blue)_/_0.08)] sm:text-base"
                  >
                    Try a diagnostic
                  </Link>
                </div>
                <p className="mt-5 max-w-xl text-sm font-semibold leading-relaxed text-muted-foreground">
                  The promise is simple: stop guessing what is wrong, know what to fix next, and lock it in
                  before it counts.
                </p>
              </ScrollReveal>

              <ScrollReveal className="relative mx-auto w-full min-w-0 max-w-lg" delay={0.1}>
                <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-[hsl(var(--duo-blue)_/_0.15)] blur-2xl" />
                <MasteryMapVisual />
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 bg-card/35 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Before and after
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                The product changes the shape of studying.
              </h2>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
              <ScrollReveal>
                <div className="h-full rounded-3xl border-2 border-border bg-background p-6 shadow-[0_10px_0_0_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                      <Target className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                        Before
                      </p>
                      <h3 className="text-xl font-extrabold text-foreground">Studying by guesswork</h3>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {BEFORE_POINTS.map((point) => (
                      <li key={point} className="flex gap-3 text-sm font-semibold leading-relaxed text-muted-foreground">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/45" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <div className="h-full rounded-3xl border-2 border-primary/30 bg-primary/5 p-6 shadow-[0_10px_0_0_rgba(88,204,2,0.16)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                        After
                      </p>
                      <h3 className="text-xl font-extrabold text-foreground">Learning with a map</h3>
                    </div>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {AFTER_POINTS.map((point) => (
                      <li key={point} className="flex gap-3 text-sm font-semibold leading-relaxed text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2.5} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <ScrollReveal>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  The shift
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Learning is not linear. It is a map.
                </h2>
                <div className="mt-6 space-y-4 text-lg font-semibold leading-relaxed text-muted-foreground">
                  <p>Every subject is a network of concepts.</p>
                  <p>If one node is weak, everything built on top feels unstable.</p>
                  <p className="text-foreground">
                    MindOrbit shows the network, highlights the weak nodes, and gives students the next best
                    move.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <div className="rounded-3xl border-2 border-border bg-gradient-to-br from-secondary/80 to-card p-6 shadow-[0_14px_0_0_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-2 text-[hsl(var(--duo-blue))]">
                    <GitBranch className="h-6 w-6" strokeWidth={2.25} />
                    <span className="text-sm font-extrabold uppercase tracking-wider">What MindOrbit produces</span>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {PRODUCT_OUTPUTS.map((output) => (
                      <div key={output} className="rounded-2xl border border-border bg-background/85 p-4">
                        <p className="text-sm font-extrabold text-foreground">{output}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-sm font-semibold leading-relaxed text-muted-foreground">
                    The outcome is not more content. It is a prioritized path through the content that matters.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/35 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                The learning loop
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Four steps. Zero wheel-spinning.
              </h2>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-4">
              {LOOP.map((item, index) => (
                <ScrollReveal key={item.step} delay={index * 0.06}>
                  <div className="h-full rounded-3xl border-2 border-border bg-card p-6 shadow-[0_9px_0_0_rgba(0,0,0,0.05)]">
                    <span className="font-mono text-4xl font-extrabold tabular-nums text-primary/35">
                      {item.step}
                    </span>
                    <h3 className="mt-5 text-xl font-extrabold text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm font-semibold leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                What changes
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Students do not just practice more. They practice with direction.
              </h2>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
              {OUTCOMES.map(({ title, body, Icon }, index) => (
                <ScrollReveal key={title} delay={index * 0.06}>
                  <div className="h-full rounded-3xl border-2 border-border bg-card p-6 text-center shadow-[0_8px_0_0_rgba(0,0,0,0.06)]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <Icon className="h-8 w-8" strokeWidth={2.25} />
                    </div>
                    <h3 className="mt-5 text-lg font-extrabold text-foreground">{title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-background to-secondary/50 py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-4xl rounded-[2rem] border-2 border-border bg-card p-8 text-center shadow-[0_14px_0_0_rgba(0,0,0,0.05)] sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Flame className="h-8 w-8" strokeWidth={2.25} />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Build a mind that compounds.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold leading-relaxed text-muted-foreground">
                Start with one diagnostic. Leave with a map, a first mission, and a better answer to the
                question: what should I study next?
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <DuoPrimaryLink href="/auth/signup">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </DuoPrimaryLink>
                <Link
                  href="/try-diagnostic"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-[3px] border-[hsl(var(--duo-blue))] bg-background px-8 text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] shadow-sm transition hover:bg-[hsl(var(--duo-blue)_/_0.08)] sm:text-base"
                >
                  Try sample diagnostic
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <DuoLandingFooter />
    </div>
  );
}
