import { BookOpen, Compass, Layers, LineChart, Orbit, Sparkles } from "lucide-react";
import { DuoLandingFinalCta } from "./duo-landing-final-cta";
import { DuoLandingFooter } from "./duo-landing-footer";
import { DuoLandingHeader } from "./duo-landing-header";
import { ScrollReveal } from "./scroll-reveal";

const LEARNING_GAPS = [
  "Students memorize content rather than develop durable understanding",
  "Knowledge is seldom retained beyond formal assessment",
  "Reliance on AI shortcuts can reduce depth of reasoning",
  "Institutions measure performance by grades, not cognitive capability",
  "Most platforms optimize for engagement rather than mastery",
] as const;

const PRINCIPLES = [
  "Intelligence can be systematically mapped",
  "Understanding has underlying structure",
  "Mastery compounds over time",
  "Learning should adapt to the individual",
  "AI should strengthen cognition, not replace it",
] as const;

const PLATFORM_CAPABILITIES = [
  "Living mastery maps",
  "Knowledge dependency graphs",
  "Real-time gap detection",
  "Adaptive reinforcement systems",
  "AI-generated learning pathways",
  "Long-term cognitive progression",
] as const;

const DIAGNOSTIC_QUESTIONS = [
  "What does the learner truly understand?",
  "Where are the critical gaps?",
  "What should be learned next?",
  "Which knowledge is at risk of decay?",
  "What unlocks the greatest growth?",
] as const;

const SUBJECT_ATTRIBUTES = [
  "Visual",
  "Connected",
  "Interactive",
  "Diagnostic-first",
  "Personalized",
] as const;

const LONG_TERM_OUTCOMES = [
  "Accelerated learning velocity",
  "Clearer analytical reasoning",
  "Greater capacity for complex problem-solving",
  "Durable retention of knowledge",
  "Cross-disciplinary synthesis of ideas",
  "Rapid adaptation to emerging technologies",
  "Resilience in an AI-mediated economy",
] as const;

const NOT_CATEGORY = [
  "An AI tutoring product",
  "A homework assistance application",
  "A flashcard or drill platform",
  "A generic study tool",
  "A course marketplace",
] as const;

const FUTURE_PROFILE_ATTRIBUTES = [
  "Demonstrated knowledge",
  "Depth of understanding",
  "Patterns of reasoning",
  "Rate of learning",
  "Trajectory for continued growth",
] as const;

function ProseList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 space-y-3 text-base leading-relaxed text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DuoOurVision() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[hsl(var(--duo-gold)_/_0.15)] blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[hsl(var(--duo-blue)_/_0.12)] blur-3xl" />
      </div>

      <DuoLandingHeader />

      <main>
        <section className="border-b border-border/60 py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Company vision
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Help humanity think better in the age of AI
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                MindOrbit exists to help people think more clearly, reason more rigorously, and learn with lasting depth as AI reshapes how
                information is accessed and applied.
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                We are building a Cognitive Operating System for the next generation: a platform that maps how individuals understand the
                world, surfaces gaps in reasoning, and develops durable intelligence over time. Where most AI systems generate answers,
                MindOrbit is designed to develop capability.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/15 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <ScrollReveal>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--duo-orange)_/_0.12)] text-[hsl(var(--duo-orange))]">
                  <Orbit className="h-6 w-6" strokeWidth={2} />
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Strategic context</h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>The internet expanded access to information. Artificial intelligence expands access to generated answers.</p>
                  <p className="text-foreground">
                    Neither, on its own, teaches people how to think. That gap is the problem MindOrbit is built to address.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.06} className="mt-14">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">The current landscape</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">Fragmentation in learning systems</h3>
                <ProseList items={LEARNING_GAPS} />
              </ScrollReveal>

              <ScrollReveal
                delay={0.1}
                className="mt-12 rounded-2xl border border-border bg-card px-8 py-7 shadow-sm"
              >
                <p className="text-base leading-relaxed text-foreground">
                  MindOrbit is architected from first principles to reverse these dynamics—placing structured understanding, diagnostic
                  clarity, and long-term mastery at the center of the learning experience.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.12} className="mt-14">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Guiding principles</p>
                <ProseList items={PRINCIPLES} />
                <p className="mt-8 text-base font-medium leading-relaxed text-foreground">
                  In practice, MindOrbit serves as the system layer between human curiosity and demonstrable mastery.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Platform direction</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">What MindOrbit becomes</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Our long-term product vision rests on three interconnected capabilities.
              </p>
            </ScrollReveal>

            <div className="mx-auto mt-14 max-w-5xl space-y-12">
              <ScrollReveal>
                <article className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--duo-blue)_/_0.12)] text-[hsl(var(--duo-blue))]">
                      <Layers className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Pillar I</p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        The Cognitive Operating System
                      </h3>
                    </div>
                  </div>
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    MindOrbit becomes the personalized intelligence layer for every learner—a system that organizes human understanding with
                    the same clarity that established platforms bring to other domains of work.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Geography", example: "Google Maps" },
                      { label: "Software", example: "GitHub" },
                      { label: "Design", example: "Figma" },
                    ].map(({ label, example }) => (
                      <div key={label} className="rounded-xl border border-border/80 bg-secondary/30 px-4 py-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{example}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-base font-medium text-foreground">MindOrbit organizes human understanding.</p>
                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-primary">Core capabilities</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {PLATFORM_CAPABILITIES.map((capability) => (
                      <li
                        key={capability}
                        className="rounded-xl border border-border/60 bg-secondary/25 px-4 py-3 text-sm text-muted-foreground"
                      >
                        {capability}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.12em] text-primary">Continuous diagnostics</p>
                  <ProseList items={DIAGNOSTIC_QUESTIONS} />
                </article>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <article className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--duo-gold)_/_0.15)] text-[hsl(var(--duo-gold))]">
                      <Compass className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Pillar II</p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        A living map of human knowledge
                      </h3>
                    </div>
                  </div>
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    MindOrbit transforms education from static content delivery into dynamic intelligence infrastructure. Every subject is
                    structured to be visual, connected, interactive, diagnostic-first, and personalized.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {SUBJECT_ATTRIBUTES.map((trait) => (
                      <span
                        key={trait}
                        className="inline-flex rounded-md border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    Rather than isolated lessons, learners navigate interconnected systems of understanding—making knowledge explorable,
                    coherent, and actionable at scale.
                  </p>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <article className="rounded-2xl border border-border bg-card p-8 shadow-sm sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <BookOpen className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Pillar III</p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        From content delivery to cognitive development
                      </h3>
                    </div>
                  </div>
                  <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-border/80 bg-secondary/20 p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Conventional education technology
                      </p>
                      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                        <li>Volume of video and media content</li>
                        <li>Breadth of static learning materials</li>
                        <li>Speed of AI-generated answers</li>
                        <li>Efficiency of homework assistance</li>
                      </ul>
                    </div>
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">MindOrbit</p>
                      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground">
                        <li>Retention and recall</li>
                        <li>Reasoning quality</li>
                        <li>Transfer across contexts</li>
                        <li>Durable mental models</li>
                        <li>Cognitive durability</li>
                        <li>Structured understanding</li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-8 text-base font-medium leading-relaxed text-foreground">
                    Our objective is not consumption. It is intellectual compounding—the accumulation of capability that strengthens with
                    use.
                  </p>
                </article>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/15 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <ScrollReveal className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--duo-blue)_/_0.12)] text-[hsl(var(--duo-blue))]">
                  <LineChart className="h-6 w-6" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Long-term mission</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Developing minds that compound over time
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.06} className="mt-8">
                <p className="text-base leading-relaxed text-muted-foreground">
                  A learner engaged with MindOrbit over years should demonstrate measurable improvement across the following dimensions:
                </p>
                <ProseList items={LONG_TERM_OUTCOMES} />
                <p className="mt-10 text-base font-medium leading-relaxed text-foreground">
                  MindOrbit is not designed to optimize for short-term assessment outcomes. It is designed to prepare individuals for a
                  future in which intellectual capability is the decisive advantage.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--duo-orange)_/_0.12)] text-[hsl(var(--duo-orange))]">
                <Sparkles className="h-6 w-6" strokeWidth={2} />
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Strategic importance</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Artificial intelligence will widen the economic and professional gap between individuals who think deeply and those who
                depend entirely on generated outputs without independent judgment.
              </p>
              <p className="mt-6 text-sm font-semibold text-foreground">The advantage will accrue to those who demonstrate:</p>
              <ul className="mt-4 space-y-2 text-base leading-relaxed text-muted-foreground">
                <li>Systems thinking</li>
                <li>Adaptive learning</li>
                <li>Rapid synthesis across domains</li>
                <li>Durable, transferable mental models</li>
              </ul>
              <p className="mt-8 text-base font-medium text-foreground">
                MindOrbit is infrastructure for developing these capabilities at scale.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/15 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollReveal>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Category definition</p>
                <p className="mt-3 text-sm font-medium text-muted-foreground">MindOrbit is not positioned as:</p>
                <ul className="mt-4 space-y-2 text-base leading-relaxed text-muted-foreground">
                  {NOT_CATEGORY.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ScrollReveal>
              <ScrollReveal delay={0.06}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Our category</p>
                <p className="mt-4 text-2xl font-semibold leading-snug text-foreground sm:text-[1.75rem]">
                  The Cognitive Operating System for the AI era
                </p>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  A system that continuously maps, diagnoses, and strengthens human understanding—serving as the foundation for lifelong
                  cognitive development.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Long-term outlook</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                A credential for how you think and learn
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                We envision a future in which a learner&apos;s MindOrbit profile carries the same professional weight as a résumé, portfolio,
                GitHub repository, or LinkedIn profile—a trusted representation of capability, not merely credentials completed.
              </p>
              <p className="mt-6 text-sm font-semibold text-foreground">A MindOrbit profile will communicate:</p>
              <ProseList items={FUTURE_PROFILE_ATTRIBUTES} />
              <p className="mt-8 text-base font-medium text-foreground">
                In that future, MindOrbit becomes a living record of human potential—transparent, verifiable, and continuously evolving.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <DuoLandingFinalCta />
      </main>

      <DuoLandingFooter />
    </div>
  );
}
