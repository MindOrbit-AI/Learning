import { Compass, Heart, Lightbulb, Sparkles, Users } from "lucide-react";
import { DuoLandingFinalCta } from "./duo-landing-final-cta";
import { DuoLandingFooter } from "./duo-landing-footer";
import { DuoLandingHeader } from "./duo-landing-header";
import { ScrollReveal } from "./scroll-reveal";

const VALUES = [
  {
    title: "Students first",
    body: "We build for real schedules, real anxiety, and the gap between effort and results—not demos that look good in a pitch deck.",
    icon: Heart,
    bubble: "bg-[hsl(var(--duo-orange)_/_0.18)] text-[hsl(var(--duo-orange))]",
  },
  {
    title: "Evidence-led practice",
    body: "Diagnostics and spaced reinforcement turn “I feel behind” into a clear next step you can act on tonight.",
    icon: Lightbulb,
    bubble: "bg-[hsl(var(--duo-gold)_/_0.2)] text-[hsl(var(--duo-gold))]",
  },
  {
    title: "Friendly, not fluffy",
    body: "Warm copy and playful UI sit on top of serious learning science—so progress feels good without pretending exams are easy.",
    icon: Sparkles,
    bubble: "bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]",
  },
] as const;

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
                Our story
              </p>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                We are here for
                <span className="text-primary"> the grind</span>—and the breakthrough.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
                MindOrbit exists because studying harder is not the same as studying smarter. We help you see what actually needs work,
                then turn that into missions you can finish—not another endless queue.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-b border-border/60 bg-secondary/20 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
              <ScrollReveal>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--duo-blue)_/_0.15)] text-[hsl(var(--duo-blue))]">
                  <Compass className="h-8 w-8" strokeWidth={2.25} />
                </div>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                  Why we built MindOrbit
                </h2>
                <p className="mt-4 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
                  Too many tools stop at content delivery. We focus on the loop: find gaps, pick the next best step, practice until it sticks,
                  and make progress visible so motivation comes from momentum—not guilt.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <div className="rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_10px_0_0_rgba(0,0,0,0.05)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Users className="h-6 w-6" strokeWidth={2.25} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary">Who it is for</p>
                      <p className="mt-2 text-base font-semibold leading-relaxed text-muted-foreground">
                        Students who want honest feedback, a clear path, and practice that respects their time—whether you are catching up
                        or pushing from good to great.
                      </p>
                    </div>
                  </div>
                  <ul className="mt-8 space-y-3 text-sm font-semibold text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        •
                      </span>
                      <span>Diagnostics that rank what to fix first—not everything at once.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        •
                      </span>
                      <span>Missions and review that line up with how memory actually works.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        •
                      </span>
                      <span>A tone that cheers you on without pretending the work is optional.</span>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="border-b border-border/60 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">What we believe</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Principles you will feel in the product
              </h2>
            </ScrollReveal>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
              {VALUES.map(({ title, body, icon: Icon, bubble }, i) => (
                <ScrollReveal key={title} delay={0.06 * i}>
                  <div className="h-full rounded-3xl border-2 border-border bg-card p-6 text-center shadow-[0_8px_0_0_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5">
                    <div
                      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${bubble}`}
                    >
                      <Icon className="h-8 w-8" strokeWidth={2.25} />
                    </div>
                    <p className="mt-5 text-lg font-extrabold text-foreground">{title}</p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <DuoLandingFinalCta />
      </main>

      <DuoLandingFooter />
    </div>
  );
}
