import {
  Brain,
  Eye,
  Lightbulb,
  Repeat,
  Shapes,
  TrendingDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const PROFILES: readonly {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}[] = [
  {
    title: "Visual learner",
    description: "Charts and diagrams click for you—long blocks of text, not so much.",
    icon: Eye,
    accent: "bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]",
  },
  {
    title: "Conceptual learner",
    description: "You get the big idea fast, but quizzes want every step written down.",
    icon: Lightbulb,
    accent: "bg-[hsl(var(--duo-gold)_/_0.2)] text-[hsl(var(--duo-gold))]",
  },
  {
    title: "Pattern learner",
    description: "You spot the trick—until the question changes the rules.",
    icon: Shapes,
    accent: "bg-primary/15 text-primary",
  },
  {
    title: "Repetition dependent",
    description: "You need a few more reps to lock it in—and that's totally normal.",
    icon: Repeat,
    accent: "bg-[hsl(var(--duo-orange)_/_0.18)] text-[hsl(var(--duo-orange))]",
  },
  {
    title: "Confidence collapse zones",
    description: "You know it at home, then blank when the quiz or test starts.",
    icon: TrendingDown,
    accent: "bg-red-500/12 text-red-600 dark:text-red-400",
  },
];

export function DuoLandingCognitiveProfileSection() {
  return (
    <section
      id="profile"
      className="scroll-mt-24 border-b border-border/60 bg-gradient-to-b from-background to-secondary/25 py-16 sm:py-20"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Beyond scores
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your learning profile
          </h2>
          <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
            The diagnostic doesn&apos;t just flag gaps—it shows how you learn best, where study time
            gets wasted, and what to fix first.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROFILES.map(({ title, description, icon: Icon, accent }, i) => (
            <ScrollReveal
              key={title}
              delay={0.05 * i}
              className={i === PROFILES.length - 1 ? "sm:col-span-2 lg:col-span-1" : undefined}
            >
              <div className="flex h-full flex-col rounded-3xl border-2 border-border bg-card p-6 shadow-[0_8px_0_0_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent}`}
                >
                  <Icon className="h-7 w-7" strokeWidth={2.25} />
                </div>
                <p className="mt-5 text-lg font-extrabold text-foreground">{title}</p>
                <p className="mt-2 flex-1 text-sm font-semibold leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mx-auto mt-10 max-w-2xl text-center" delay={0.08}>
          <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary/25 bg-primary/8 px-5 py-3 text-sm font-semibold text-muted-foreground">
            <Brain className="h-5 w-5 shrink-0 text-primary" strokeWidth={2.25} />
            Your profile updates as you practice—so missions stay matched to you.
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
