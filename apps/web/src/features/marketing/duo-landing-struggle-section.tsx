import { ArrowRight } from "lucide-react";
import { DependencyCollapseVisual } from "./dependency-collapse-visual";
import { DuoPrimaryLink } from "./duo-primary-link";
import { ScrollReveal } from "./scroll-reveal";

const EXAMPLES = [
  {
    weak: "Fractions still shaky",
    collapse: "algebra starts falling apart",
  },
  {
    weak: "Reading comp. gaps",
    collapse: "science class feels impossible",
  },
] as const;

export function DuoLandingStruggleSection() {
  return (
    <section
      id="struggling"
      className="scroll-mt-24 border-b border-border/60 bg-card/30 py-16 sm:py-20"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Why it feels hard
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-[2.35rem] md:leading-tight">
            When one topic trips you up, others follow
          </h2>
          <p className="mt-4 text-base font-semibold text-muted-foreground sm:text-lg">
            Miss a foundation in 6th grade math or reading? Later classes stack on top—and it can
            feel like you&apos;re bad at the whole subject.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mx-auto mt-12 max-w-4xl" delay={0.06}>
          <DependencyCollapseVisual />
        </ScrollReveal>

        <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {EXAMPLES.map(({ weak, collapse }, i) => (
            <li key={weak}>
              <ScrollReveal delay={0.05 * i}>
                <div className="rounded-2xl border-2 border-border bg-card px-5 py-4 text-center shadow-sm">
                  <p className="text-sm font-extrabold text-red-500/90">{weak}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    →
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-foreground">{collapse}</p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>

        <ScrollReveal className="mx-auto mt-10 flex justify-center" delay={0.1}>
          <DuoPrimaryLink href="/try-diagnostic">
            GET STARTED
            <ArrowRight className="h-4 w-4" />
          </DuoPrimaryLink>
        </ScrollReveal>
      </div>
    </section>
  );
}
