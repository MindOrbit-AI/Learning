import { CircleDot, Flame, Target, Trophy } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

const PAIN_POINTS = [
  "Your study plan is vague or overwhelming",
  "You are not sure what deserves your time tonight",
  "You forget material right when it counts",
  "Hours of effort do not show up in results",
] as const;

const WHY = [
  {
    title: "Know what to fix",
    body: "A quick diagnostic turns vague worry into a ranked list of gaps.",
    icon: Target,
    bubble: "bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]",
  },
  {
    title: "Stay motivated",
    body: "Clear missions and visible progress feel rewarding—without the fluff.",
    icon: Flame,
    bubble: "bg-[hsl(var(--duo-orange)_/_0.18)] text-[hsl(var(--duo-orange))]",
  },
  {
    title: "Earn real mastery",
    body: "Spaced reinforcement targets what exams actually test.",
    icon: Trophy,
    bubble: "bg-[hsl(var(--duo-gold)_/_0.2)] text-[hsl(var(--duo-gold))]",
  },
] as const;

export function DuoLandingWhySection() {
  return (
    <section id="why" className="scroll-mt-24 border-b border-border/60 bg-background py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Sound familiar?
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-[2.35rem] md:leading-tight">
            You review what you already know—while the hard parts stay fuzzy.
          </h2>
        </ScrollReveal>
        <ul className="mx-auto mt-12 grid max-w-2xl gap-3 sm:grid-cols-2">
          {PAIN_POINTS.map((line, i) => (
            <li key={line}>
              <ScrollReveal delay={0.04 * i} className="h-full">
                <div className="flex h-full items-start gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3 text-left text-sm font-semibold text-muted-foreground shadow-sm">
                  <CircleDot className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2.5} />
                  {line}
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-16 max-w-5xl">
          <ScrollReveal className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Why students stick with it
            </p>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Friendly on the surface. Serious underneath.
            </h3>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {WHY.map(({ title, body, icon: Icon, bubble }, i) => (
              <ScrollReveal key={title} delay={0.06 * i}>
                <div className="rounded-3xl border-2 border-border bg-card p-6 text-center shadow-[0_8px_0_0_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5">
                  <div
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${bubble}`}
                  >
                    <Icon className="h-8 w-8" strokeWidth={2.25} />
                  </div>
                  <p className="mt-5 text-lg font-extrabold text-foreground">{title}</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
