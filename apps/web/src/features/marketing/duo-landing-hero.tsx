import { ArrowRight } from "lucide-react";
import { CartoonHeroPlanet, CartoonHeroStar } from "./home-cartoons";
import { MasteryMapVisual } from "./mastery-map-visual";
import { DuoPrimaryLink } from "./duo-primary-link";
import { ScrollReveal } from "./scroll-reveal";

export function DuoLandingHero() {
  return (
    <section className="relative border-b border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background pb-16 pt-10 sm:pb-24 sm:pt-14">
      {/* <div className="pointer-events-none absolute left-[max(0.5rem,3vw)] top-[18%] hidden opacity-90 sm:block md:left-[max(1rem,5vw)]">
        <CartoonHeroPlanet className="h-20 w-20 md:h-24 md:w-24" />
      </div> */}
      <div className="pointer-events-none absolute right-[max(0.5rem,3vw)] top-[28%] hidden opacity-90 sm:block md:right-[max(1rem,5vw)]">
        <CartoonHeroStar className="h-[4.5rem] w-[4.5rem] md:h-24 md:w-24" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <ScrollReveal className="min-w-0">
            <p className="inline-flex items-center rounded-full border-2 border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Gaps · Next step · Lock it in
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Light practice.
              <span className="text-primary"> Real gains.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
              Know what to fix, what to study next, and how to retain it—focused on what moves your grades.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <DuoPrimaryLink href="/auth/signup">
                Start free
                <ArrowRight className="h-4 w-4" />
              </DuoPrimaryLink>
              <a
                href="#how"
                className="inline-flex h-14 items-center justify-center rounded-2xl border-[3px] border-[hsl(var(--duo-blue))] bg-background px-8 text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] shadow-sm transition hover:bg-[hsl(var(--duo-blue)_/_0.08)] sm:text-base"
              >
                How it works
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal className="relative mx-auto w-full min-w-0 max-w-lg" delay={0.1}>
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-[hsl(var(--duo-blue)_/_0.15)] blur-2xl" />
            <MasteryMapVisual />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
