import { BookOpen, Compass, Layers, LineChart, Orbit, Sparkles } from "lucide-react";
import { DuoLandingFinalCta } from "./duo-landing-final-cta";
import { DuoLandingFooter } from "./duo-landing-footer";
import { DuoLandingHeader } from "./duo-landing-header";
import { ScrollReveal } from "./scroll-reveal";

const FRAGMENTED_ITEMS = [
  "Students memorize instead of understand",
  "Knowledge disappears after tests",
  "AI shortcuts reduce deep thinking",
  "Schools measure grades, not cognition",
  "Most platforms optimize engagement, not mastery",
] as const;

const BELIEFS = [
  "Intelligence can be mapped",
  "Understanding has structure",
  "Mastery compounds",
  "Learning should adapt to the individual",
  "AI should strengthen cognition, not replace it",
] as const;

const COS_FEATURES = [
  "A living Mastery Map",
  "Knowledge dependency graphs",
  "Real-time gap detection",
  "Reinforcement systems",
  "AI-generated training paths",
  "Long-term cognitive progression",
] as const;

const PLATFORM_QUESTIONS = [
  "What do you truly understand?",
  "What are you missing?",
  "What should you learn next?",
  "What is decaying?",
  "What unlocks the biggest growth?",
] as const;

const MAP_TRAITS = ["Visual", "Connected", "Interactive", "Diagnostic-first", "Personalized"] as const;

const MISSION_OUTCOMES = [
  "Learn faster",
  "Think more clearly",
  "Solve harder problems",
  "Retain knowledge longer",
  "Connect ideas across disciplines",
  "Adapt to new technologies rapidly",
  "Become increasingly antifragile in an AI-driven world",
] as const;

const NOT_CATEGORY = [
  "an AI tutor",
  "a homework app",
  "a flashcard platform",
  "a study tool",
  "a course marketplace",
] as const;

export function DuoOurVision() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[hsl(var(--duo-gold)_/_0.25)] blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[hsl(var(--duo-blue)_/_0.2)] blur-3xl" />
        <div className="absolute bottom-32 left-1/3 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <DuoLandingHeader />

      <main>
        <section className="border-b border-border/60 py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center rounded-full border-2 border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                Our vision
              </p>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Help humanity think better in the age of AI
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
                MindOrbit exists to help humanity think better in the age of AI.
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                We are building the Cognitive Operating System for the next generation — a platform that maps how people understand the
                world, identifies gaps in reasoning, and trains durable intelligence over time.
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                While most AI tools generate answers, MindOrbit develops minds.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <ScrollReveal>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--duo-orange)_/_0.18)] text-[hsl(var(--duo-orange))]">
                  <Orbit className="h-8 w-8" strokeWidth={2.25} />
                </div>
                <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">The Big Vision</h2>
                <div className="mt-6 space-y-4 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                  <p>The internet gave humanity access to information.</p>
                  <p>AI gives humanity access to infinite answers.</p>
                  <p className="text-foreground">But neither teaches people how to think.</p>
                  <p className="text-foreground">That is the problem MindOrbit solves.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.06} className="mt-12">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Today</p>
                <h3 className="mt-3 text-xl font-extrabold text-foreground sm:text-2xl">Learning is fragmented</h3>
                <ul className="mt-6 space-y-3 text-base font-semibold text-muted-foreground">
                  {FRAGMENTED_ITEMS.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={0.1} className="mt-12 rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_10px_0_0_rgba(0,0,0,0.05)]">
                <p className="text-base font-extrabold leading-relaxed text-foreground sm:text-lg">
                  MindOrbit is designed from first principles to reverse this.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.12} className="mt-12">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">We believe</p>
                <ul className="mt-6 space-y-3 text-base font-semibold text-muted-foreground">
                  {BELIEFS.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span className="text-primary" aria-hidden>
                        ✓
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-lg font-extrabold leading-relaxed text-foreground sm:text-xl">
                  MindOrbit becomes the system layer between human curiosity and human mastery.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">What MindOrbit becomes</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">Three pillars</h2>
            </ScrollReveal>

            <div className="mx-auto mt-14 max-w-5xl space-y-16">
              <ScrollReveal>
                <article className="rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.06)] sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]">
                      <Layers className="h-7 w-7" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">1</p>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                        The Cognitive Operating System
                      </h3>
                    </div>
                  </div>
                  <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                    MindOrbit becomes the personalized intelligence layer for every learner.
                  </p>
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Just like</p>
                  <ul className="mt-3 space-y-2 text-base font-semibold text-foreground">
                    <li>Google Maps organizes geography</li>
                    <li>GitHub organizes code</li>
                    <li>Figma organizes design</li>
                  </ul>
                  <p className="mt-6 text-lg font-extrabold text-foreground">MindOrbit organizes human understanding.</p>
                  <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Every user gets</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {COS_FEATURES.map((f) => (
                      <li
                        key={f}
                        className="rounded-2xl border border-border/80 bg-secondary/40 px-4 py-3 text-sm font-semibold text-muted-foreground"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">
                    The platform continuously answers
                  </p>
                  <ul className="mt-4 space-y-2 text-base font-semibold text-muted-foreground">
                    {PLATFORM_QUESTIONS.map((q) => (
                      <li key={q} className="flex gap-2">
                        <span className="text-primary" aria-hidden>
                          ?
                        </span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <article className="rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.06)] sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--duo-gold)_/_0.2)] text-[hsl(var(--duo-gold))]">
                      <Compass className="h-7 w-7" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">2</p>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                        A Living Map of Human Knowledge
                      </h3>
                    </div>
                  </div>
                  <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                    MindOrbit transforms education from static content into dynamic intelligence infrastructure.
                  </p>
                  <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Every subject becomes</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {MAP_TRAITS.map((t) => (
                      <span
                        key={t}
                        className="inline-flex rounded-full border-2 border-primary/25 bg-primary/10 px-4 py-2 text-sm font-extrabold text-primary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-8 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                    Instead of isolated lessons, users navigate interconnected systems of understanding.
                  </p>
                  <p className="mt-4 text-lg font-extrabold text-foreground">Knowledge becomes explorable like a universe.</p>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <article className="rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.06)] sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <BookOpen className="h-7 w-7" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">3</p>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                        The Shift From Content → Cognition
                      </h3>
                    </div>
                  </div>
                  <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-border/80 bg-secondary/30 p-6">
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
                        Most education companies compete on
                      </p>
                      <ul className="mt-4 space-y-2 text-sm font-semibold text-muted-foreground">
                        <li>More videos</li>
                        <li>More content</li>
                        <li>More AI answers</li>
                        <li>Faster homework help</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">MindOrbit competes on</p>
                      <ul className="mt-4 space-y-2 text-sm font-semibold text-foreground">
                        <li>Retention</li>
                        <li>Reasoning</li>
                        <li>Transferability</li>
                        <li>Mental models</li>
                        <li>Cognitive durability</li>
                        <li>Structured understanding</li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-8 text-base font-extrabold text-foreground sm:text-lg">
                    The goal is not consumption. The goal is intellectual compounding.
                  </p>
                </article>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <ScrollReveal className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]">
                  <LineChart className="h-7 w-7" strokeWidth={2.25} />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">The long-term mission</p>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">Build minds that compound</h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.06} className="mt-8">
                <p className="text-base font-semibold text-muted-foreground sm:text-lg">
                  A student using MindOrbit for years should:
                </p>
                <ul className="mt-6 space-y-3 text-base font-semibold text-muted-foreground">
                  {MISSION_OUTCOMES.map((o) => (
                    <li key={o} className="flex gap-3">
                      <span className="text-primary" aria-hidden>
                        →
                      </span>
                      {o}
                    </li>
                  ))}
                </ul>
                <p className="mt-10 text-lg font-extrabold leading-relaxed text-foreground sm:text-xl">
                  MindOrbit is not preparing people for tests. It is preparing people for the future of intelligence.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--duo-orange)_/_0.18)] text-[hsl(var(--duo-orange))]">
                <Sparkles className="h-7 w-7" strokeWidth={2.25} />
              </div>
              <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">Why this matters</h2>
              <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                AI will dramatically increase the value gap between people who can think deeply and people who rely entirely on generated
                outputs.
              </p>
              <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">The future belongs to</p>
              <ul className="mt-4 space-y-2 text-base font-semibold text-foreground">
                <li>systems thinkers</li>
                <li>adaptive learners</li>
                <li>fast synthesizers</li>
                <li>people with durable mental models</li>
              </ul>
              <p className="mt-8 text-lg font-extrabold text-foreground">
                MindOrbit is infrastructure for creating those people at scale.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:gap-14">
              <ScrollReveal>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">MindOrbit is not</p>
                <ul className="mt-4 space-y-2 text-base font-semibold text-muted-foreground">
                  {NOT_CATEGORY.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ScrollReveal>
              <ScrollReveal delay={0.06}>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">MindOrbit is</p>
                <p className="mt-4 text-2xl font-extrabold leading-snug text-foreground sm:text-3xl">
                  The Cognitive Operating System for the AI Era.
                </p>
                <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground">
                  A system that continuously maps, diagnoses, and upgrades human understanding.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Future narrative</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">“Show me your MindOrbit”</h2>
              <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                One day, saying “Show me your MindOrbit” could become as normal as showing a résumé, sharing a portfolio, linking a GitHub,
                or sharing a LinkedIn profile.
              </p>
              <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Because your MindOrbit represents</p>
              <ul className="mt-4 space-y-2 text-base font-semibold text-muted-foreground">
                <li>what you know</li>
                <li>how deeply you understand it</li>
                <li>how you think</li>
                <li>how fast you learn</li>
                <li>where you are growing next</li>
              </ul>
              <p className="mt-8 text-lg font-extrabold text-foreground">It becomes a living representation of human potential.</p>
            </ScrollReveal>
          </div>
        </section>

        <DuoLandingFinalCta />
      </main>

      <DuoLandingFooter />
    </div>
  );
}
