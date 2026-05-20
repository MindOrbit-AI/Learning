import {
  Award,
  BarChart3,
  Brain,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const OUTCOMES: readonly {
  label: string;
  detail: string;
  icon: LucideIcon;
  tag: string;
}[] = [
  {
    label: "Mastery growth",
    detail: "Watch topics go from shaky to solid on your map.",
    icon: BarChart3,
    tag: "On your map",
  },
  {
    label: "Retention improvement",
    detail: "Review hits what you're about to forget—not what you already know.",
    icon: Brain,
    tag: "Spaced review",
  },
  {
    label: "Confidence score",
    detail: "See where test stress hits—even when homework answers look fine.",
    icon: Sparkles,
    tag: "Per topic",
  },
  {
    label: "Weak node elimination",
    detail: "Red weak spots on your map turn green as you fix the basics.",
    icon: Target,
    tag: "Gap-first",
  },
  {
    label: "Topics stabilized",
    detail: "Skills that hold up on quizzes and finals—not just homework.",
    icon: ShieldCheck,
    tag: "Exam-ready",
  },
];

export function DuoLandingOutcomesSection() {
  return (
    <section
      id="outcomes"
      className="scroll-mt-24 border-b border-border/60 bg-background py-16 sm:py-20"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Measurable progress
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Progress you can actually see
          </h2>
          <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
            Every mission updates your map—so you know what&apos;s improving, what&apos;s sticking,
            and what to hit before the next test.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OUTCOMES.map(({ label, detail, icon: Icon, tag }, i) => (
            <ScrollReveal
              key={label}
              delay={0.05 * i}
              className={i === OUTCOMES.length - 1 ? "sm:col-span-2 lg:col-span-1" : undefined}
            >
              <div className="flex h-full flex-col rounded-3xl border-2 border-border bg-card p-6 shadow-[0_8px_0_0_rgba(0,0,0,0.05)]">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="h-6 w-6" strokeWidth={2.25} />
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
                    {tag}
                  </span>
                </div>
                <p className="mt-4 text-lg font-extrabold text-foreground">{label}</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                  {detail}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mx-auto mt-10 flex justify-center" delay={0.1}>
          <div className="flex items-center gap-2 text-sm font-extrabold text-muted-foreground">
            <Award className="h-5 w-5 text-[hsl(var(--duo-gold))]" strokeWidth={2.25} />
            Built for real progress, not just “study harder.”
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
