import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Beaker,
  Brain,
  Dna,
  FlaskConical,
  GitBranch,
  Grid3X3,
  Leaf,
  LineChart,
  MousePointerClick,
  Sparkles,
  Triangle,
  Zap,
} from "lucide-react";
import { DuoLandingFooter } from "./duo-landing-footer";
import { DuoLandingHeader } from "./duo-landing-header";
import { DuoPrimaryLink } from "./duo-primary-link";
import { ScrollReveal } from "./scroll-reveal";

const PRACTICE_LESSONS = [
  {
    id: "lesson-forces-free-body",
    title: "Forces & free-body basics",
    subject: "Physics",
    topic: "Forces",
    level: "Beginner",
    description:
      "Drag, plot, and model Newton's laws — balance forces, read F = ma graphs, and predict friction direction.",
    icon: Zap,
    accent: "from-amber-400/20 to-orange-500/10",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    interactions: ["Drag to reorder", "Plot on graphs", "Tap grids"],
  },
  {
    id: "lesson-dna-base-pairing",
    title: "DNA base pairing",
    subject: "Biology",
    topic: "DNA structure",
    level: "Beginner",
    description:
      "Build complementary strands, model helix rungs, and apply Chargaff's rules with hands-on visual steps.",
    icon: Dna,
    accent: "from-emerald-400/20 to-green-500/10",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    interactions: ["Match base pairs", "Shade ratio bars", "Order sequences"],
  },
  {
    id: "lesson-linear-equations-graph",
    title: "Linear equations from graphs",
    subject: "Math",
    topic: "Linear equations",
    level: "Beginner",
    description:
      "Place intercepts and slope points on grids, solve step-by-step, and write y = mx + b from what you see.",
    icon: LineChart,
    accent: "from-blue-400/20 to-indigo-500/10",
    badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
    interactions: ["Plot coordinates", "Mark number lines", "Reorder steps"],
  },
  {
    id: "lesson-punnett-square-basics",
    title: "Punnett square basics",
    subject: "Biology",
    topic: "Genetics",
    level: "Beginner",
    description:
      "Fill Punnett grids, predict 3:1 ratios, and calculate offspring probabilities for monohybrid crosses.",
    icon: GitBranch,
    accent: "from-violet-400/20 to-purple-500/10",
    badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
    interactions: ["Fill 2×2 grids", "Model ratios", "Count gametes"],
  },
  {
    id: "lesson-circuits-series-parallel",
    title: "Series vs parallel circuits",
    subject: "Physics",
    topic: "Electric circuits",
    level: "Beginner",
    description:
      "Compare one-path series loops to parallel branches — model current, voltage, and real household wiring.",
    icon: Atom,
    accent: "from-cyan-400/20 to-sky-500/10",
    badge: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
    interactions: ["Branch models", "Voltage scales", "Compare setups"],
  },
  {
    id: "lesson-periodic-trends-visual",
    title: "Periodic trends on the table",
    subject: "Chemistry",
    topic: "Periodic trends",
    level: "Beginner",
    description:
      "Track atomic radius, ionization energy, and electronegativity across periods and groups with visual models.",
    icon: FlaskConical,
    accent: "from-teal-400/20 to-emerald-500/10",
    badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
    interactions: ["Trend scales", "Order concepts", "Compare elements"],
  },
  {
    id: "lesson-chemical-bonding-basics",
    title: "Ionic vs covalent bonding",
    subject: "Chemistry",
    topic: "Chemical bonding",
    level: "Beginner",
    description:
      "Compare electron transfer and sharing, model bonding pairs, and classify bonds by electronegativity difference.",
    icon: Beaker,
    accent: "from-lime-400/20 to-green-500/10",
    badge: "bg-lime-600/15 text-lime-800 dark:text-lime-300",
    interactions: ["Electron transfer", "Shared pairs", "ΔEN scales"],
  },
  {
    id: "lesson-pythagorean-theorem",
    title: "Pythagorean theorem visual",
    subject: "Math",
    topic: "Right triangles",
    level: "Beginner",
    description:
      "Plot 3-4-5 triangles on grids, build a² + b² = c² step-by-step, and model squares on each side.",
    icon: Triangle,
    accent: "from-indigo-400/20 to-violet-500/10",
    badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
    interactions: ["Plot triangles", "Order formula steps", "Area grids"],
  },
  {
    id: "lesson-natural-selection",
    title: "Natural selection basics",
    subject: "Biology",
    topic: "Evolution",
    level: "Beginner",
    description:
      "Walk through variation, struggle, and differential survival — model camouflage and fitness over generations.",
    icon: Leaf,
    accent: "from-green-400/20 to-lime-500/10",
    badge: "bg-green-600/15 text-green-800 dark:text-green-300",
    interactions: ["Order Darwin's steps", "Camouflage grids", "Fitness ratios"],
  },
  {
    id: "lesson-work-energy-basics",
    title: "Work & energy basics",
    subject: "Physics",
    topic: "Work & energy",
    level: "Beginner",
    description:
      "Connect force and displacement to work, plot kinetic energy vs speed, and model energy conservation.",
    icon: Zap,
    accent: "from-yellow-400/20 to-amber-500/10",
    badge: "bg-yellow-600/15 text-yellow-800 dark:text-yellow-300",
    interactions: ["Energy conversion", "KE graphs", "PE scales"],
  },
] as const;

const HOW_IT_WORKS = [
  {
    icon: MousePointerClick,
    title: "Manipulate first",
    body: "Every lesson starts with visuals you drag, tap, plot, or reorder — not passive reading.",
  },
  {
    icon: Grid3X3,
    title: "Check understanding",
    body: "Each scene validates your work instantly with feedback tied to what you did on screen.",
  },
  {
    icon: Sparkles,
    title: "Lock in mastery",
    body: "A final visual checkpoint confirms you can transfer the idea — progress syncs when you sign in.",
  },
] as const;

function lessonHref(lessonId: string) {
  return `/lesson/${lessonId}`;
}

export function PracticeLessonsLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[hsl(var(--duo-gold)_/_0.25)] blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[hsl(var(--duo-blue)_/_0.2)] blur-3xl" />
        <div className="absolute bottom-32 left-1/3 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <DuoLandingHeader />

      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 pb-12 pt-10 sm:pt-16">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                <FlaskConical className="h-4 w-4" />
                Interactive practice lessons
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Learn by doing — not by watching
              </h1>
              <p className="mt-5 text-lg font-medium text-muted-foreground sm:text-xl">
                Ten hands-on lessons across physics, biology, chemistry, and math. Drag molecules,
                plot graphs, fill Punnett squares, and wire circuits — then prove you understand
                with a visual mastery check.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <DuoPrimaryLink href={lessonHref(PRACTICE_LESSONS[0].id)}>
                  START FIRST LESSON
                  <ArrowRight className="h-4 w-4" />
                </DuoPrimaryLink>
                <Link
                  href="#lessons"
                  className="text-sm font-bold text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
                >
                  BROWSE ALL TEN
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Stats strip */}
        <section className="border-y border-border/60 bg-muted/30">
          <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:py-10">
            {[
              { value: "10", label: "Interactive lessons" },
              { value: "60+", label: "Hands-on scenes" },
              { value: "4", label: "Subjects" },
              { value: "70%+", label: "Visual interactions" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-bold text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 py-16 sm:py-20">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Brilliant-style learning, built in
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Each lesson follows the same visual-first flow: manipulate, get feedback, master.
            </p>
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.08}>
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <step.icon className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Lesson cards */}
        <section id="lessons" className="container mx-auto px-4 pb-16 sm:pb-24">
          <ScrollReveal>
            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Ten lessons to explore
                </h2>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  No account needed — jump in and start learning. Sign up anytime to save progress.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--duo-gold)_/_0.2)] px-4 py-1.5 text-sm font-bold text-foreground">
                <Beaker className="h-4 w-4" />
                ~10 min each
              </span>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {PRACTICE_LESSONS.map((lesson, i) => (
              <ScrollReveal key={lesson.id} delay={i * 0.06}>
                <article
                  className={`group relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br ${lesson.accent} bg-card p-6 shadow-sm transition hover:shadow-md sm:p-8`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background/80 shadow-sm ring-1 ring-border/60">
                      <lesson.icon className="h-7 w-7 text-primary" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ${lesson.badge}`}
                        >
                          {lesson.subject}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground">{lesson.level}</span>
                      </div>
                      <h3 className="mt-2 text-xl font-extrabold text-foreground">{lesson.title}</h3>
                      <p className="mt-1 text-sm font-medium text-muted-foreground">{lesson.topic}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-medium leading-relaxed text-foreground/90">
                    {lesson.description}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {lesson.interactions.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-xl bg-background/60 px-2.5 py-1 text-xs font-bold text-muted-foreground ring-1 ring-border/50"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Link
                      href={lessonHref(lesson.id)}
                      className="inline-flex h-12 items-center gap-2 rounded-2xl border-b-[3px] border-[#43a005] bg-[#58cc02] px-6 text-sm font-extrabold uppercase tracking-wide text-white transition hover:brightness-105 active:translate-y-px"
                    >
                      Try this lesson
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border/60 bg-muted/20">
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl rounded-3xl border border-border/80 bg-card p-8 text-center shadow-sm sm:p-12">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
                  <Brain className="h-8 w-8 text-primary" strokeWidth={2.5} />
                </span>
                <h2 className="mt-6 text-2xl font-extrabold text-foreground sm:text-3xl">
                  Ready to build real learning intuition?
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Start with any lesson above, or take our free diagnostic to find your personalized
                  mastery path across every subject.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <DuoPrimaryLink href={lessonHref(PRACTICE_LESSONS[0].id)}>
                    START LEARNING FREE
                    <ArrowRight className="h-4 w-4" />
                  </DuoPrimaryLink>
                  <Link
                    href="/try-diagnostic"
                    className="text-sm font-bold text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
                  >
                    TAKE THE GAP SCAN
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <DuoLandingFooter />
    </div>
  );
}
