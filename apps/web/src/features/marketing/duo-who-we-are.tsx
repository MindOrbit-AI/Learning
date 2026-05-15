import Link from "next/link";
import { ArrowRight, Brain, HeartHandshake, Microscope, Users } from "lucide-react";
import { DuoLandingFinalCta } from "./duo-landing-final-cta";
import { DuoLandingFooter } from "./duo-landing-footer";
import { DuoLandingHeader } from "./duo-landing-header";
import { ScrollReveal } from "./scroll-reveal";

const WHY_WE_STARTED = [
  "Students were working harder without gaining durable understanding",
  "Learning tools rewarded engagement and completion, not demonstrated capability",
  "AI made answers easy to access—but rarely made thinking easier to develop",
  "Educators lacked clear visibility into what learners actually understood",
] as const;

const WHO_WE_BUILD_FOR = [
  "Students who want structured understanding—not another content queue",
  "Educators who need diagnostic clarity on gaps, not just aggregate scores",
  "Institutions shifting from content delivery to cognitive development",
  "Lifelong learners preparing for an economy where reasoning is the advantage",
] as const;

const HOW_WE_BUILD = [
  "Diagnostic-first: we start with what is understood, not what was assigned",
  "Evidence-led: product decisions follow learning science, not trend cycles",
  "Capability over consumption: we optimize for mastery signals, not time-on-app",
  "AI as amplifier: technology should strengthen cognition, not replace it",
  "Long-term compounding: progress should accumulate across subjects and years",
] as const;

const COMMITMENTS = [
  "Make gaps visible before they become crises at exam time",
  "Turn insight into the next best step—not an overwhelming backlog",
  "Design interfaces that respect real schedules and real cognitive load",
  "Hold ourselves to the same rigor we ask of learners: clarity, honesty, follow-through",
] as const;

const TEAM_PILLARS = [
  {
    label: "Pillar I",
    title: "Learners at the center",
    icon: HeartHandshake,
    bubble: "bg-[hsl(var(--duo-orange)_/_0.18)] text-[hsl(var(--duo-orange))]",
    body: "We build for the student who wants to know what to fix first, practice until it sticks, and see progress compound—not for demos that look impressive in a slide deck.",
  },
  {
    label: "Pillar II",
    title: "Science in the product",
    icon: Microscope,
    bubble: "bg-[hsl(var(--duo-gold)_/_0.2)] text-[hsl(var(--duo-gold))]",
    body: "Diagnostics, spaced reinforcement, and mastery mapping are not marketing language here. They are the architecture—so every session moves understanding forward with intention.",
  },
  {
    label: "Pillar III",
    title: "Serious work, human tone",
    icon: Brain,
    bubble: "bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]",
    body: "We believe rigorous learning can still feel approachable. Warm copy and thoughtful UX sit on top of hard problems in cognition—not on top of shortcuts around them.",
  },
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

export function DuoWhoWeAre() {
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
                Who we are
              </p>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                A team building the Cognitive Operating System
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
                MindOrbit brings together educators, engineers, and learning scientists around one conviction: in an age of generated
                answers, the ability to think clearly is the decisive advantage.
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                We are not building another content library or homework helper. We are building infrastructure that maps understanding,
                surfaces gaps in reasoning, and helps capability compound over time.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <ScrollReveal>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]">
                  <Users className="h-8 w-8" strokeWidth={2.25} />
                </div>
                <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">Why we started</h2>
                <div className="mt-6 space-y-4 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                  <p>
                    We saw capable students invest enormous effort without gaining durable understanding—and tools that made the problem
                    harder to see, not easier to fix.
                  </p>
                  <p className="text-foreground">
                    MindOrbit exists to close that gap: to give learners and educators a system that shows what is truly understood and what
                    to do next.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.06} className="mt-14">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">What we observed</p>
                <h3 className="mt-3 text-xl font-extrabold text-foreground sm:text-2xl">The problems we set out to solve</h3>
                <ProseList items={WHY_WE_STARTED} />
              </ScrollReveal>

              <ScrollReveal
                delay={0.1}
                className="mt-12 rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_10px_0_0_rgba(0,0,0,0.05)]"
              >
                <p className="text-base font-extrabold leading-relaxed text-foreground sm:text-lg">
                  Our team is united by the belief that learning systems should develop capability—not merely deliver information—and that
                  technology should make thinking clearer, not optional.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Who we build for</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Learners and institutions serious about mastery
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                MindOrbit serves people who want honest feedback, structured progress, and practice that respects both time and cognition.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.06} className="mx-auto mt-14 max-w-3xl">
              <ProseList items={WHO_WE_BUILD_FOR} />
              <p className="mt-10 text-lg font-extrabold leading-relaxed text-foreground sm:text-xl">
                Whether you are catching up or pushing from good to great, the goal is the same: durable understanding you can demonstrate
                and build on.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">How we build</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">Principles you will feel in the product</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                Our culture and our codebase share the same standards: diagnostic clarity, evidence-led design, and respect for the
                learner&apos;s time.
              </p>
            </ScrollReveal>

            <div className="mx-auto mt-14 max-w-5xl space-y-16">
              {TEAM_PILLARS.map(({ label, title, icon: Icon, bubble, body }, index) => (
                <ScrollReveal key={title} delay={0.05 * index}>
                  <article className="rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.06)] sm:p-10">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${bubble}`}>
                        <Icon className="h-7 w-7" strokeWidth={2.25} />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">{label}</p>
                        <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{title}</h3>
                      </div>
                    </div>
                    <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">{body}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.12} className="mx-auto mt-14 max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Operating standards</p>
              <ProseList items={HOW_WE_BUILD} />
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Our commitments</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">What we hold ourselves to</h2>
              <p className="mt-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                Building a Cognitive Operating System is a long-term responsibility. These commitments guide how we ship, how we communicate,
                and how we measure success.
              </p>
              <ProseList items={COMMITMENTS} />
              <p className="mt-10 text-lg font-extrabold text-foreground">
                We are building for intellectual compounding—the kind of progress that strengthens with use and carries forward across
                subjects, years, and careers.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">Where we are headed</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">Our vision for what MindOrbit becomes</h2>
              <p className="mx-auto mt-6 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                Who we are today is inseparable from where we are going: a platform that maps human understanding, diagnoses gaps in reasoning,
                and develops durable intelligence at scale.
              </p>
              <Link
                href="/our-vision"
                className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
              >
                Read our vision
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        <DuoLandingFinalCta />
      </main>

      <DuoLandingFooter />
    </div>
  );
}
