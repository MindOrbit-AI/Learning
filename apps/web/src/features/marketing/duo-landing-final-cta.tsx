import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DuoPrimaryLink } from "./duo-primary-link";
import { ScrollReveal } from "./scroll-reveal";

export function DuoLandingFinalCta() {
  return (
    <section className="container mx-auto px-4 pb-20 pt-4 sm:pb-28">
      <ScrollReveal className="relative overflow-hidden rounded-[2rem] border-2 border-primary/30 bg-gradient-to-br from-primary/15 via-secondary/40 to-[hsl(var(--duo-blue)_/_0.12)] px-6 py-14 text-center sm:px-12">
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[hsl(var(--duo-gold)_/_0.35)] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
        <h2 className="relative text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Find your gaps in 5 minutes.
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-base font-semibold text-muted-foreground sm:text-lg">
          Run the free diagnostic and get a mastery map with the smartest order to study.
        </p>
        <div className="relative mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <DuoPrimaryLink href="/try-diagnostic">
            Run Free Diagnostic
            <ArrowRight className="h-4 w-4" />
          </DuoPrimaryLink>
          <Link
            href="/try-diagnostic"
            className="text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
          >
            No signup needed
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
