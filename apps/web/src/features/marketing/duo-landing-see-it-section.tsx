import { ArrowRight } from "lucide-react";
import { MasteryMapVisual } from "./mastery-map-visual";
import { DuoPrimaryLink } from "./duo-primary-link";
import { ScrollReveal } from "./scroll-reveal";

export function DuoLandingSeeItSection() {
  return (
    <section
      id="see-it"
      aria-labelledby="see-it-heading"
      className="scroll-mt-24 border-b border-border/60 bg-gradient-to-b from-background to-secondary/20 py-16 sm:py-20"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            See it in action
          </p>
          <h2 id="see-it-heading" className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your mastery map, live in the app.
          </h2>
          <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
            Concepts link like a path—so you always know what to tackle next.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-12 max-w-3xl" delay={0.08}>
          <div className="overflow-hidden rounded-[1.75rem] border-2 border-border bg-card shadow-[0_12px_0_0_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 border-b border-border bg-muted/70 px-3 py-2.5 sm:px-4">
              <span className="flex shrink-0 gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/90" />
              </span>
              <div className="min-w-0 flex-1 flex justify-center">
                <span className="truncate rounded-lg bg-background/90 px-3 py-1 font-mono text-[10px] text-muted-foreground shadow-sm sm:text-[11px]">
                  mindorbit.app/subjects/chemistry
                </span>
              </div>
            </div>
            <div className="p-3 sm:p-5">
              <MasteryMapVisual />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-10 flex justify-center" delay={0.12}>
          <DuoPrimaryLink href="/auth/signup">
            Try it free
            <ArrowRight className="h-4 w-4" />
          </DuoPrimaryLink>
        </ScrollReveal>
      </div>
    </section>
  );
}
