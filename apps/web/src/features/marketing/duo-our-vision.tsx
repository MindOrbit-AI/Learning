import {
  ArrowRight,
  BookOpen,
  Compass,
  GitBranch,
  Layers,
  LineChart,
  Map,
  Orbit,
  RefreshCw,
  ScanSearch,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { DuoLandingFinalCta } from "./duo-landing-final-cta";
import { DuoLandingFooter } from "./duo-landing-footer";
import { DuoLandingHeader } from "./duo-landing-header";
import { DuoPrimaryLink } from "./duo-primary-link";
import { ScrollReveal } from "./scroll-reveal";

const LEARNING_LOOP = [
  {
    stage: "Diagnose",
    body: "Find what's missing in minutes — before the test does.",
    icon: ScanSearch,
    iconClass: "bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]",
  },
  {
    stage: "Map",
    body: "See the whole subject as a living graph of strengths, gaps, and prerequisites.",
    icon: Map,
    iconClass: "bg-[hsl(var(--duo-gold)_/_0.2)] text-[hsl(var(--duo-gold))]",
  },
  {
    stage: "Learn",
    body: "Get targeted instruction on the exact concept that needs work — not a random lesson.",
    icon: BookOpen,
    iconClass: "bg-primary/10 text-primary",
  },
  {
    stage: "Practice",
    body: "Build competence with missions, visual problems, and reps on weak spots.",
    icon: Target,
    iconClass: "bg-[hsl(var(--duo-orange)_/_0.18)] text-[hsl(var(--duo-orange))]",
  },
  {
    stage: "Master",
    body: "Watch nodes move from weak to mastered — visible proof, not guesswork.",
    icon: Trophy,
    iconClass: "bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]",
  },
  {
    stage: "Retain",
    body: "Review on a schedule so knowledge survives quizzes, finals, and summer.",
    icon: RefreshCw,
    iconClass: "bg-primary/10 text-primary",
  },
  {
    stage: "Expand",
    body: "Unlock the next concept, subject, or challenge — guided by what the map says is ready.",
    icon: GitBranch,
    iconClass: "bg-[hsl(var(--duo-gold)_/_0.2)] text-[hsl(var(--duo-gold))]",
  },
] as const;

const FOUR_PROMISES = [
  {
    title: "Know",
    body: "A live model of what your child has actually mastered — not just which lesson they finished.",
  },
  {
    title: "Gap",
    body: "What's missing, with dependency context: weak here because a prerequisite never solidified.",
  },
  {
    title: "Why",
    body: "Misconception patterns, not just wrong or right — so practice fixes the root cause.",
  },
  {
    title: "Next",
    body: "One clear action now — not an endless content library to wander through.",
  },
] as const;

const COMPETITOR_GAPS = [
  { name: "IXL", strength: "Practice volume", gap: "No map of reasoning or why errors happen" },
  { name: "Khan Academy", strength: "Content breadth", gap: "Linear paths, no live per-child gap model" },
  { name: "Brilliant", strength: "Visual learn-by-doing", gap: "No longitudinal mastery graph" },
  { name: "Duolingo", strength: "Habit and spaced review", gap: "No subject depth or diagnostic depth" },
  { name: "AI tutors", strength: "Answers anything", gap: "No guaranteed progression or standards alignment" },
] as const;

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
    <ul className="mt-6 space-y-3 text-base font-semibold text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
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
                See what&apos;s missing. Fix that — not everything.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
                Five minutes to see what your child knows, what they&apos;re missing, why they&apos;re struggling, and exactly what to
                practice next — with a map that updates every time they learn.
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                MindOrbit combines the best parts of diagnostic practice, visual learning, spaced review, and AI — into one closed loop
                none of them fully provides on their own. AI lives inside the graph, not as a blank chat tutor.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <DuoPrimaryLink href="/try-diagnostic">
                  Try the free diagnostic
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </DuoPrimaryLink>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">The product loop</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Seven stages. One continuously updating map.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                Every session feeds the map. The map tells you what to do next. That&apos;s the habit — and the moat.
              </p>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LEARNING_LOOP.map((step, i) => {
                const Icon = step.icon;
                return (
                  <ScrollReveal key={step.stage} delay={0.05 * i}>
                    <div className="flex h-full flex-col rounded-[1.5rem] border-2 border-border bg-card p-6 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${step.iconClass}`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={2.25} />
                        </div>
                        <span className="font-mono text-sm font-extrabold tabular-nums text-primary/40">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <p className="mt-4 text-lg font-extrabold text-foreground">{step.stage}</p>
                      <p className="mt-2 flex-1 text-sm font-semibold leading-relaxed text-muted-foreground">{step.body}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            <ScrollReveal delay={0.2} className="mx-auto mt-10 max-w-2xl text-center">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Then the loop repeats</p>
              <p className="mt-2 text-base font-semibold text-muted-foreground">
                Expand leads back to Diagnose — the map stays live as your child grows.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">What none of them fully provide</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                IXL + Khan + Brilliant + Duolingo + an AI tutor — without the gaps
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                Each platform excels at one piece. MindOrbit&apos;s job is to close the loop between them.
              </p>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
              {FOUR_PROMISES.map((promise, i) => (
                <ScrollReveal key={promise.title} delay={0.05 * i}>
                  <div className="rounded-[1.5rem] border-2 border-primary/20 bg-primary/5 p-6">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">{promise.title}</p>
                    <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground">{promise.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.15} className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[2rem] border-2 border-border bg-card shadow-[0_8px_0_0_rgba(0,0,0,0.06)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/40">
                      <th className="px-5 py-4 font-extrabold text-foreground">Platform</th>
                      <th className="px-5 py-4 font-extrabold text-foreground">Strength</th>
                      <th className="px-5 py-4 font-extrabold text-foreground">What MindOrbit adds</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPETITOR_GAPS.map((row) => (
                      <tr key={row.name} className="border-b border-border/60 last:border-0">
                        <td className="px-5 py-4 font-extrabold text-foreground">{row.name}</td>
                        <td className="px-5 py-4 font-semibold text-muted-foreground">{row.strength}</td>
                        <td className="px-5 py-4 font-semibold text-muted-foreground">{row.gap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">Strategic context</h2>
                <div className="mt-6 space-y-4 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                  <p>The internet expanded access to information. Artificial intelligence expands access to generated answers.</p>
                  <p className="text-foreground">
                    Neither, on its own, teaches people how to think. That gap is the problem MindOrbit is built to address.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.06} className="mt-14">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">The current landscape</p>
                <h3 className="mt-3 text-xl font-extrabold text-foreground sm:text-2xl">Fragmentation in learning systems</h3>
                <ProseList items={LEARNING_GAPS} />
              </ScrollReveal>

              <ScrollReveal
                delay={0.1}
                className="mt-12 rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_10px_0_0_rgba(0,0,0,0.05)]"
              >
                <p className="text-base font-extrabold leading-relaxed text-foreground sm:text-lg">
                  MindOrbit is architected from first principles to reverse these dynamics—placing structured understanding, diagnostic
                  clarity, and long-term mastery at the center of the learning experience.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.12} className="mt-14">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Guiding principles</p>
                <ProseList items={PRINCIPLES} />
                <p className="mt-8 text-lg font-extrabold leading-relaxed text-foreground sm:text-xl">
                  In practice, MindOrbit serves as the system layer between human curiosity and demonstrable mastery.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Platform direction</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">What MindOrbit becomes</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                Our long-term product vision rests on three interconnected capabilities.
              </p>
            </ScrollReveal>

            <div className="mx-auto mt-14 max-w-5xl space-y-16">
              <ScrollReveal>
                <article className="rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.06)] sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]">
                      <Layers className="h-7 w-7" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Pillar I</p>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                        The Cognitive Operating System
                      </h3>
                    </div>
                  </div>
                  <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
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
                        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{example}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-lg font-extrabold text-foreground">MindOrbit organizes human understanding.</p>
                  <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Core capabilities</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {PLATFORM_CAPABILITIES.map((capability) => (
                      <li
                        key={capability}
                        className="rounded-2xl border border-border/80 bg-secondary/40 px-4 py-3 text-sm font-semibold text-muted-foreground"
                      >
                        {capability}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Continuous diagnostics</p>
                  <ProseList items={DIAGNOSTIC_QUESTIONS} />
                </article>
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <article className="rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.06)] sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--duo-gold)_/_0.2)] text-[hsl(var(--duo-gold))]">
                      <Compass className="h-7 w-7" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Pillar II</p>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                        A living map of human knowledge
                      </h3>
                    </div>
                  </div>
                  <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                    MindOrbit transforms education from static content delivery into dynamic intelligence infrastructure. Every subject is
                    structured to be visual, connected, interactive, diagnostic-first, and personalized.
                  </p>
                  <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Every subject becomes</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SUBJECT_ATTRIBUTES.map((trait) => (
                      <span
                        key={trait}
                        className="inline-flex rounded-full border-2 border-primary/25 bg-primary/10 px-4 py-2 text-sm font-extrabold text-primary"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  <p className="mt-8 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                    Rather than isolated lessons, learners navigate interconnected systems of understanding—making knowledge explorable,
                    coherent, and actionable at scale.
                  </p>
                </article>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <article className="rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.06)] sm:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <BookOpen className="h-7 w-7" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">Pillar III</p>
                      <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                        From content delivery to cognitive development
                      </h3>
                    </div>
                  </div>
                  <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-border/80 bg-secondary/30 p-6">
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
                        Conventional education technology
                      </p>
                      <ul className="mt-4 space-y-2 text-sm font-semibold text-muted-foreground">
                        <li>Volume of video and media content</li>
                        <li>Breadth of static learning materials</li>
                        <li>Speed of AI-generated answers</li>
                        <li>Efficiency of homework assistance</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6">
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">MindOrbit</p>
                      <ul className="mt-4 space-y-2 text-sm font-semibold text-foreground">
                        <li>Retention and recall</li>
                        <li>Reasoning quality</li>
                        <li>Transfer across contexts</li>
                        <li>Durable mental models</li>
                        <li>Cognitive durability</li>
                        <li>Structured understanding</li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-8 text-base font-extrabold leading-relaxed sm:text-lg text-foreground">
                    Our objective is not consumption. It is intellectual compounding—the accumulation of capability that strengthens with
                    use.
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
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Long-term mission</p>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                    Developing minds that compound over time
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.06} className="mt-8">
                <p className="text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                  A learner engaged with MindOrbit over years should demonstrate measurable improvement across the following dimensions:
                </p>
                <ProseList items={LONG_TERM_OUTCOMES} />
                <p className="mt-10 text-base font-extrabold leading-relaxed sm:text-lg text-foreground">
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
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--duo-orange)_/_0.18)] text-[hsl(var(--duo-orange))]">
                <Sparkles className="h-7 w-7" strokeWidth={2.25} />
              </div>
              <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">Strategic importance</h2>
              <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                Artificial intelligence will widen the economic and professional gap between individuals who think deeply and those who
                depend entirely on generated outputs without independent judgment.
              </p>
              <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">The future belongs to</p>
              <ul className="mt-4 space-y-2 text-base font-semibold text-foreground">
                <li>Systems thinking</li>
                <li>Adaptive learning</li>
                <li>Rapid synthesis across domains</li>
                <li>Durable, transferable mental models</li>
              </ul>
              <p className="mt-8 text-lg font-extrabold text-foreground">
                MindOrbit is infrastructure for developing these capabilities at scale.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
              <ScrollReveal>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">Category definition</p>
                <p className="mt-4 text-sm font-extrabold uppercase tracking-[0.14em] text-muted-foreground">MindOrbit is not</p>
                <ul className="mt-4 space-y-2 text-base font-semibold text-muted-foreground">
                  {NOT_CATEGORY.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ScrollReveal>
              <ScrollReveal delay={0.06}>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Our category</p>
                <p className="mt-4 text-2xl font-extrabold leading-snug text-foreground sm:text-3xl">
                  The Cognitive Operating System for the AI era
                </p>
                <p className="mt-5 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
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
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Long-term outlook</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                A credential for how you think and learn
              </h2>
              <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                We envision a future in which a learner&apos;s MindOrbit profile carries the same professional weight as a résumé, portfolio,
                GitHub repository, or LinkedIn profile—a trusted representation of capability, not merely credentials completed.
              </p>
              <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.14em] text-primary">A MindOrbit profile will communicate</p>
              <ProseList items={FUTURE_PROFILE_ATTRIBUTES} />
              <p className="mt-8 text-lg font-extrabold text-foreground">
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
