import { ScrollReveal } from "./scroll-reveal";

const TESTIMONIALS = [
  {
    quote:
      "I stopped re-reading the same chapter—the map showed me the one thing I was missing for the unit test.",
    attribution: "Early user · Grade 9 · Algebra",
  },
  {
    quote:
      "For the first time we knew what to focus on at home instead of 'study more math' with no plan.",
    attribution: "Parent · Grade 7 · Pre-algebra",
  },
  {
    quote:
      "The diagnostic was short enough that students actually finished it—and the map made the gaps obvious.",
    attribution: "Tutor · Middle school math",
  },
] as const;

export function DuoLandingSocialProof() {
  return (
    <section
      id="stories"
      className="scroll-mt-24 border-y border-border/60 bg-[hsl(var(--duo-blue)_/_0.08)] py-14 sm:py-16"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Early feedback
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Students and families feel less stuck
          </h2>
          <p className="mt-4 text-sm font-semibold text-muted-foreground sm:text-base">
            We&apos;re in beta—feedback from students, parents, and tutors trying MindOrbit early.
          </p>
        </ScrollReveal>

        <ul className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {TESTIMONIALS.map(({ quote, attribution }, i) => (
            <li key={attribution}>
              <ScrollReveal delay={0.06 * i} className="h-full">
                <blockquote className="flex h-full flex-col rounded-3xl border-2 border-border bg-card p-6 text-left shadow-sm">
                  <p className="text-base font-extrabold leading-snug text-foreground">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <footer className="mt-4 text-xs font-bold text-muted-foreground">
                    {attribution}
                  </footer>
                </blockquote>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
