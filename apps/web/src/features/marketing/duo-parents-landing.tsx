import Link from "next/link";
import {
  ArrowRight,
  Check,
  Eye,
  GitBranch,
  Map,
  Navigation,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { PRO_PRICE_MONTHLY } from "@mindorbit/lib";
import { DependencyCollapseVisual } from "./dependency-collapse-visual";
import { DuoLandingFooter } from "./duo-landing-footer";
import { DuoLandingHeader } from "./duo-landing-header";
import { DuoPrimaryLink } from "./duo-primary-link";
import { MasteryMapVisual } from "./mastery-map-visual";
import { ScrollReveal } from "./scroll-reveal";

const DIAGNOSTIC_CTA = "/try-diagnostic";

const TARGET_PARENTS = [
  "Perform well in some areas but struggle unpredictably",
  "Have hidden foundational gaps",
  "Lack confidence or study inefficiently",
  "Live in competitive school districts",
  "Spend—or are considering spending—$200–$800 per month on tutoring",
  "Want evidence of progress, not more screen time",
] as const;

const TRIGGERING_MOMENTS = [
  "A disappointing test result",
  "Homework taking too long",
  'A teacher saying, "Your child needs more practice"',
  "Preparing for algebra",
  "Paying for tutoring without measurable improvement",
  "Summer learning loss",
  "Transitioning into middle school",
] as const;

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Discover the gaps",
    body: "Complete a five-minute adaptive diagnostic.",
  },
  {
    step: "2",
    title: "See the connections",
    body: "Reveal a visual map of strengths, gaps, and prerequisites.",
  },
  {
    step: "3",
    title: "Follow the shortest path",
    body: "Complete one personalized mastery mission at a time.",
  },
  {
    step: "4",
    title: "Verify that learning lasts",
    body: "MindOrbit checks understanding, application, and retention.",
  },
] as const;

const GAP_SCAN_INCLUDES = [
  "Current mastery estimate",
  "Three strongest concepts",
  "Three critical knowledge gaps",
  "Prerequisite connections",
  "A visual Mastery Map",
  "The first recommended mission",
  "Estimated path to the selected goal",
] as const;

const FREE_FEATURES = [
  "Five-minute diagnostic",
  "Initial Mastery Map",
  "Three gap discoveries",
  "Limited daily missions",
  "Weekly progress summary",
] as const;

const PRO_FEATURES = [
  "Complete Mastery Map",
  "Unlimited diagnostics and missions",
  "AI microlessons",
  "Interactive practice",
  "Adaptive explanations",
  "Retention and reinforcement scheduling",
  "Detailed parent insights",
  "Unlimited subject creation",
] as const;

const TRUST_STACK = [
  {
    title: "Explain the diagnosis",
    body: "Show exactly why MindOrbit believes a gap exists.",
    icon: Eye,
  },
  {
    title: "Show the learning connection",
    body: "Example: weak fraction equivalence → difficulty with ratios → future algebra risk.",
    icon: GitBranch,
  },
  {
    title: "Verify mastery",
    body: "Don't mark a concept mastered because the learner answered one familiar question correctly.",
    icon: ShieldCheck,
  },
  {
    title: "Test retention",
    body: "Revisit concepts later and require successful application in different contexts.",
    icon: Target,
  },
  {
    title: "Show parent-visible progress",
    body: "Translate learning activity into understandable outcomes.",
    icon: Sparkles,
  },
] as const;

const PARENT_OUTCOMES = [
  "Three gaps closed",
  "Two prerequisite connections repaired",
  "Eight concepts retained",
  "Algebra-readiness increased from 68% to 81%",
] as const;

function ProseList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 space-y-3 text-base font-semibold text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2.5} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DuoParentsLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[hsl(var(--duo-gold)_/_0.25)] blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[hsl(var(--duo-blue)_/_0.2)] blur-3xl" />
        <div className="absolute bottom-32 left-1/3 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <DuoLandingHeader />

      <main>
        {/* Hero */}
        <section className="relative border-b border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background pb-16 pt-10 sm:pb-24 sm:pt-14">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
              <ScrollReveal className="min-w-0">
                <p className="inline-flex items-center rounded-full border-2 border-[hsl(var(--duo-blue)_/_0.35)] bg-[hsl(var(--duo-blue)_/_0.1)] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[hsl(var(--duo-blue))]">
                  For parents · Grades 6–8
                </p>
                <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  Your child doesn&apos;t need more practice.
                  <span className="mt-2 block text-primary">They need the right path.</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
                  MindOrbit discovers hidden learning gaps, shows how they&apos;re connected, and
                  creates the shortest daily path to lasting mastery.
                </p>
                <p className="mt-4 max-w-xl text-base font-extrabold leading-relaxed text-foreground sm:text-lg">
                  MindOrbit is the mastery system that discovers why your child is struggling and
                  builds the shortest path to fixing it.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <DuoPrimaryLink href={DIAGNOSTIC_CTA}>
                    Find My Child&apos;s Learning Gaps
                    <ArrowRight className="h-4 w-4" />
                  </DuoPrimaryLink>
                  <a
                    href="#how-it-works"
                    className="inline-flex h-14 items-center justify-center rounded-2xl border-[3px] border-[hsl(var(--duo-blue))] bg-background px-8 text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] shadow-sm transition hover:bg-[hsl(var(--duo-blue)_/_0.08)] sm:text-base"
                  >
                    See how it works
                  </a>
                </div>
                <p className="mt-4 text-sm font-semibold text-muted-foreground">
                  Free five-minute diagnostic. No credit card required.
                </p>
              </ScrollReveal>

              <ScrollReveal className="relative mx-auto w-full min-w-0 max-w-lg" delay={0.1}>
                <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-[hsl(var(--duo-blue)_/_0.15)] blur-2xl" />
                <MasteryMapVisual variant="hero" />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Category */}
        <section className="border-b border-border/60 bg-secondary/20 py-14 sm:py-16">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                The real problem
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                The enemy isn&apos;t insufficient practice. It is invisible knowledge gaps.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-extrabold text-foreground">
                Your child doesn&apos;t need more practice. They need to know what&apos;s holding
                them back.
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                MindOrbit finds hidden learning gaps, shows how they are connected, and creates the
                shortest daily path to lasting mastery.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Audience */}
        <section id="audience" className="scroll-mt-24 border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Built for you
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Parents of capable but inconsistent middle-school students
              </h2>
              <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
                You know your child is capable—but you can&apos;t understand why their performance
                is unpredictable. That&apos;s the moment MindOrbit is built for.
              </p>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2">
              <ScrollReveal>
                <div className="flex h-full flex-col rounded-3xl border-2 border-border bg-card p-8 shadow-[0_10px_0_0_rgba(0,0,0,0.05)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Users className="h-6 w-6" strokeWidth={2.25} />
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-foreground">
                    If this sounds like your child
                  </h3>
                  <ProseList items={TARGET_PARENTS} />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.06}>
                <div className="flex h-full flex-col rounded-3xl border-2 border-border bg-card p-8 shadow-[0_10px_0_0_rgba(0,0,0,0.05)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--duo-orange)_/_0.18)] text-[hsl(var(--duo-orange))]">
                    <Sparkles className="h-6 w-6" strokeWidth={2.25} />
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-foreground">
                    Parent triggering moments
                  </h3>
                  <ul className="mt-6 space-y-3 text-base font-semibold text-muted-foreground">
                    {TRIGGERING_MOMENTS.map((moment) => (
                      <li key={moment} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--duo-orange))]" aria-hidden />
                        <span>{moment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal className="mx-auto mt-10 max-w-2xl text-center" delay={0.1}>
              <p className="text-base font-extrabold leading-relaxed text-foreground sm:text-lg">
                Stop watching your capable child lose confidence because of gaps no one can see.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Problem */}
        <section id="problem" className="scroll-mt-24 border-b border-border/60 bg-card/30 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Why capable children struggle
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Capable children can struggle for reasons no one can see
              </h2>
              <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
                One missing prerequisite can affect everything that comes after it. More worksheets
                may reinforce frustration without fixing the underlying problem.
              </p>
              <p className="mt-4 text-base font-extrabold text-foreground sm:text-lg">
                MindOrbit identifies the root gap before recommending what your child should do
                next.
              </p>
            </ScrollReveal>

            <ScrollReveal className="mx-auto mt-12 max-w-4xl" delay={0.06}>
              <DependencyCollapseVisual />
            </ScrollReveal>

            <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
              <ScrollReveal delay={0.05}>
                <div className="rounded-2xl border-2 border-border bg-card px-5 py-4 text-center shadow-sm">
                  <p className="text-sm font-extrabold text-red-500/90">Weak fraction equivalence</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">→</p>
                  <p className="mt-1 text-sm font-extrabold text-foreground">Difficulty with ratios</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <div className="rounded-2xl border-2 border-border bg-card px-5 py-4 text-center shadow-sm">
                  <p className="text-sm font-extrabold text-red-500/90">Difficulty with ratios</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">→</p>
                  <p className="mt-1 text-sm font-extrabold text-foreground">Future algebra risk</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Category message — GPS for learning */}
        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollReveal>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
                  What others say
                </p>
                <p className="mt-4 text-2xl font-extrabold text-muted-foreground/70 line-through decoration-2 sm:text-3xl">
                  AI-powered personalized learning
                </p>
                <p className="mt-4 text-sm font-semibold text-muted-foreground">
                  Sounds like IXL, Khan Academy, Quizlet, and dozens of AI tutors.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.06}>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]">
                    <Navigation className="h-7 w-7" strokeWidth={2.25} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                      MindOrbit is the GPS for learning
                    </p>
                    <p className="mt-4 text-2xl font-extrabold leading-snug text-foreground sm:text-3xl">
                      You choose the destination. MindOrbit calculates the learning route.
                    </p>
                    <p className="mt-5 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                      Where IXL presents thousands of skills to practice, MindOrbit shows the
                      shortest path from where your child is to where they need to be.
                    </p>
                    <p className="mt-5 text-base font-extrabold text-foreground">
                      In five minutes, see what your child understands, what they&apos;re missing,
                      and what they should learn next.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-24 bg-gradient-to-b from-secondary/50 to-background py-16 sm:py-20"
        >
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                How it works
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                From hidden gaps to verified mastery
              </h2>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
              {HOW_IT_WORKS.map((step, i) => (
                <ScrollReveal key={step.step} delay={0.07 * i}>
                  <div className="flex h-full flex-col rounded-3xl border-2 border-border bg-card p-6 shadow-[0_10px_0_0_rgba(0,0,0,0.05)]">
                    <span className="font-mono text-3xl font-extrabold tabular-nums text-primary/35">
                      {step.step}
                    </span>
                    <p className="mt-2 text-xl font-extrabold text-foreground">{step.title}</p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Gap Scan offer */}
        <section id="offer" className="scroll-mt-24 border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                The MindOrbit Learning Gap Scan
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                A valuable result before you pay
              </h2>
              <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
                In five minutes, discover the hidden gaps affecting your child and receive a
                personalized mastery path.
              </p>
            </ScrollReveal>

            <ScrollReveal className="mx-auto mt-12 max-w-3xl" delay={0.06}>
              <div className="rounded-[2rem] border-2 border-primary/30 bg-gradient-to-b from-primary/10 to-card p-8 shadow-[0_10px_0_0_hsl(var(--primary)/0.25)] sm:p-10">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <Map className="h-7 w-7" strokeWidth={2.25} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground sm:text-2xl">
                      Your free Learning Gap Report includes
                    </h3>
                    <ProseList items={GAP_SCAN_INCLUDES} />
                  </div>
                </div>
                <p className="mt-8 text-center text-sm font-extrabold text-muted-foreground">
                  See your child&apos;s Learning Gap Report before deciding whether to subscribe.
                </p>
                <div className="mt-6 flex justify-center">
                  <DuoPrimaryLink href={DIAGNOSTIC_CTA}>
                    Find My Child&apos;s Learning Gaps
                    <ArrowRight className="h-4 w-4" />
                  </DuoPrimaryLink>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Plans
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Start free. Upgrade when you see the evidence.
              </h2>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
              <ScrollReveal>
                <div className="flex h-full flex-col rounded-3xl border-2 border-border bg-card p-8 shadow-[0_12px_0_0_rgba(0,0,0,0.06)]">
                  <p className="text-xl font-extrabold">Free</p>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    See what&apos;s holding your child back
                  </p>
                  <p className="mt-6 text-4xl font-extrabold">
                    $0
                    <span className="text-lg font-bold text-muted-foreground">/month</span>
                  </p>
                  <ul className="mt-8 flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
                    {FREE_FEATURES.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <Link
                      href={DIAGNOSTIC_CTA}
                      className="flex h-14 w-full items-center justify-center rounded-2xl border-[3px] border-[hsl(var(--duo-blue))] bg-background text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] transition hover:bg-[hsl(var(--duo-blue)_/_0.08)]"
                    >
                      Find My Child&apos;s Learning Gaps
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-b from-primary/10 to-card p-8 shadow-[0_12px_0_0_hsl(var(--primary)/0.35)]">
                  <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground">
                    Full path
                  </div>
                  <p className="text-xl font-extrabold">MindOrbit Pro</p>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    Unlock the complete mastery route
                  </p>
                  <p className="mt-6 text-4xl font-extrabold">
                    ${PRO_PRICE_MONTHLY.toFixed(2)}
                    <span className="text-lg font-bold text-muted-foreground">/month</span>
                  </p>
                  <ul className="mt-8 flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
                    {PRO_FEATURES.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <DuoPrimaryLink href="/auth/signup" className="w-full">
                      Unlock the Complete Mastery Path
                      <ArrowRight className="h-4 w-4" />
                    </DuoPrimaryLink>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Trust */}
        <section id="trust" className="scroll-mt-24 border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Trust through evidence
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Every mastery decision is backed by evidence you can inspect
              </h2>
              <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
                MindOrbit is new—we earn trust through transparency, not scale.
              </p>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TRUST_STACK.map(({ title, body, icon: Icon }, i) => (
                <ScrollReveal
                  key={title}
                  delay={0.05 * i}
                  className={i === TRUST_STACK.length - 1 ? "sm:col-span-2 lg:col-span-1" : undefined}
                >
                  <div className="flex h-full flex-col rounded-3xl border-2 border-border bg-card p-6 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <Icon className="h-6 w-6" strokeWidth={2.25} />
                    </span>
                    <p className="mt-4 text-lg font-extrabold text-foreground">{title}</p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="mx-auto mt-12 max-w-3xl" delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/80 bg-muted/40 p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                    Instead of
                  </p>
                  <p className="mt-3 text-base font-semibold text-muted-foreground line-through decoration-2">
                    Emma answered 124 questions.
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                    Show parents
                  </p>
                  <p className="mt-3 text-base font-extrabold text-foreground">
                    Emma closed her fraction-equivalence gap and is now ready to begin ratio
                    reasoning.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Outcomes */}
        <section id="outcomes" className="scroll-mt-24 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Outcomes
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Know exactly what changed
              </h2>
              <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
                See which gaps were closed, which concepts were mastered, what your child retained,
                and what they should learn next.
              </p>
            </ScrollReveal>

            <ScrollReveal className="mx-auto mt-12 max-w-3xl" delay={0.06}>
              <div className="overflow-hidden rounded-[1.75rem] border-2 border-border bg-card shadow-[0_12px_0_0_rgba(0,0,0,0.06)]">
                <div className="border-b border-border bg-muted/70 px-6 py-4">
                  <p className="text-sm font-extrabold text-foreground">Weekly mastery report</p>
                  <p className="text-xs font-semibold text-muted-foreground">Example parent view</p>
                </div>
                <ul className="divide-y divide-border p-6">
                  {PARENT_OUTCOMES.map((outcome) => (
                    <li key={outcome} className="flex gap-3 py-3 text-sm font-semibold text-muted-foreground first:pt-0 last:pb-0">
                      <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={2.5} />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal className="mx-auto mt-10 flex justify-center" delay={0.1}>
              <DuoPrimaryLink href={DIAGNOSTIC_CTA}>
                Reveal My Child&apos;s Mastery Map
                <ArrowRight className="h-4 w-4" />
              </DuoPrimaryLink>
            </ScrollReveal>
          </div>
        </section>

        {/* Complete offer summary */}
        <section className="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary text-center">
                The complete MindOrbit offer
              </p>
              <div className="mt-10 space-y-8 rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_10px_0_0_rgba(0,0,0,0.05)] sm:p-10">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Audience</p>
                  <p className="mt-2 text-base font-semibold text-muted-foreground">
                    Parents of capable but inconsistent middle-school students.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Problem</p>
                  <p className="mt-2 text-base font-semibold text-muted-foreground">
                    Hidden prerequisite gaps are causing frustration, wasted practice, and declining
                    confidence.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Promise</p>
                  <p className="mt-2 text-base font-extrabold text-foreground">
                    Find what&apos;s holding your child back and follow the shortest path to mastery.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Mechanism</p>
                  <p className="mt-2 text-base font-semibold text-muted-foreground">
                    MindOrbit&apos;s diagnostic and prerequisite knowledge graph identify missing
                    foundations, calculate the correct learning sequence, and verify that mastery
                    lasts.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Offer</p>
                  <p className="mt-2 text-base font-semibold text-muted-foreground">
                    Get a free five-minute Learning Gap Scan, visual Mastery Map, and first
                    personalized mission.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Proof</p>
                  <p className="mt-2 text-base font-semibold text-muted-foreground">
                    See the evidence behind every detected gap and every mastery decision.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 pb-20 pt-4 sm:pb-28">
          <ScrollReveal className="relative overflow-hidden rounded-[2rem] border-2 border-primary/30 bg-gradient-to-br from-primary/15 via-secondary/40 to-[hsl(var(--duo-blue)_/_0.12)] px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[hsl(var(--duo-gold)_/_0.35)] blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
            <h2 className="relative text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              Find My Child&apos;s Learning Gaps
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-base font-semibold text-muted-foreground sm:text-lg">
              Take the free five-minute diagnostic. No credit card required.
            </p>
            <div className="relative mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <DuoPrimaryLink href={DIAGNOSTIC_CTA}>
                Find My Child&apos;s Learning Gaps
                <ArrowRight className="h-4 w-4" />
              </DuoPrimaryLink>
              <Link
                href={DIAGNOSTIC_CTA}
                className="text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
              >
                No credit card required
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <DuoLandingFooter />
    </div>
  );
}
