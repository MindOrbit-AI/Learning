import { ArrowRight } from "lucide-react";
import { CartoonHeroStar } from "./home-cartoons";
import { MasteryMapVisual } from "./mastery-map-visual";
import { DuoPrimaryLink } from "./duo-primary-link";
import { ScrollReveal } from "./scroll-reveal";

export function DuoLandingHero() {
  return (
    <section className="relative border-b border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background pb-16 pt-10 sm:pb-24 sm:pt-14">
      <div className="pointer-events-none absolute right-[max(0.5rem,3vw)] top-[28%] hidden opacity-90 sm:block md:right-[max(1rem,5vw)]">
        <CartoonHeroStar className="h-[4.5rem] w-[4.5rem] md:h-24 md:w-24" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <ScrollReveal className="min-w-0">
            <p className="inline-flex items-center rounded-full border-2 border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Learning Platform
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Find the gap before the test does
            </h1>
            <p className="mt-6 max-w-xl text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
              Take a free diagnostic (~5 min, ~15 questions). Get a mastery map that shows
              what&apos;s weak, what depends on it, and what to study first—no signup.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <DuoPrimaryLink href="/try-diagnostic">
                GET STARTED
                <ArrowRight className="h-4 w-4" />
              </DuoPrimaryLink>
              <a
                href="#struggling"
                className="inline-flex h-14 items-center justify-center rounded-2xl border-[3px] border-[hsl(var(--duo-blue))] bg-background px-8 text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] shadow-sm transition hover:bg-[hsl(var(--duo-blue)_/_0.08)] sm:text-base"
              >
                See why topics stack
              </a>
            </div>
            <p className="mt-4 text-sm font-semibold text-muted-foreground">
              No account required · Results on the next screen
            </p>
          </ScrollReveal>

          <ScrollReveal className="relative mx-auto w-full min-w-0 max-w-lg" delay={0.1}>
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-[hsl(var(--duo-blue)_/_0.15)] blur-2xl" />
            <MasteryMapVisual variant="hero" />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}