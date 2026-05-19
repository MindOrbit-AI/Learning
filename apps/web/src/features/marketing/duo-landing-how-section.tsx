import {
  CartoonStepDiagnose,
  CartoonStepMap,
  CartoonStepReinforce,
  CartoonStepTrain,
} from "./home-cartoons";
import { ScrollReveal } from "./scroll-reveal";

const STEPS = [
  {
    n: "1",
    title: "Diagnose",
    body: "Find your gaps in minutes—before the test finds them for you",
    Cartoon: CartoonStepDiagnose,
  },
  {
    n: "2",
    title: "Map",
    body: "See your whole subject as a path you can follow",
    Cartoon: CartoonStepMap,
  },
  {
    n: "3",
    title: "Train",
    body: "Practice weak spots with missions built for you",
    Cartoon: CartoonStepTrain,
  },
  {
    n: "4",
    title: "Reinforce",
    body: "Review on a schedule so it sticks for quizzes and finals",
    Cartoon: CartoonStepReinforce,
  },
] as const;

export function DuoLandingHowSection() {
  return (
    <section
      id="how"
      className="scroll-mt-24 bg-gradient-to-b from-secondary/50 to-background py-16 sm:py-20"
    >
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Your learning loop
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Four steps. No more random studying.
          </h2>
        </ScrollReveal>
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
          {STEPS.map((step, i) => {
            const StepCartoon = step.Cartoon;
            return (
              <ScrollReveal key={step.n} delay={0.07 * i}>
                <div className="flex flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[0_10px_0_0_rgba(0,0,0,0.05)] sm:flex-row sm:items-stretch">
                  <div className="flex items-center justify-center bg-secondary/80 px-6 py-8 sm:w-36 sm:flex-none sm:py-6">
                    <StepCartoon className="h-24 w-24 sm:h-28 sm:w-28" />
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-6 pt-2 sm:pt-6">
                    <span className="font-mono text-3xl font-extrabold tabular-nums text-primary/35">
                      {step.n}
                    </span>
                    <p className="mt-1 text-xl font-extrabold text-foreground">{step.title}</p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
