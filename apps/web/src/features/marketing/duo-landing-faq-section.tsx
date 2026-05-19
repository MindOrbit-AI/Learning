import type { ReactNode } from "react";
import Link from "next/link";
import { ScrollReveal } from "./scroll-reveal";

const FAQ_ITEMS: readonly { question: string; answer: ReactNode }[] = [
  {
    question: "Is the diagnostic really free?",
    answer:
      "Yes. You can run a skill diagnostic and see a snapshot of your mastery map without paying or creating an account on the try flow.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Not to try the diagnostic. Sign up when you want to save progress, unlock the full map, and use unlimited training missions with Pro.",
  },
  {
    question: "How long does it take?",
    answer:
      "About 5 minutes—roughly fifteen questions depending on the subject. You get results on the next screen.",
  },
  {
    question: "What subjects are available?",
    answer:
      "Algebra, geometry, biology, chemistry, physics, computer science, world history, SAT math, and more. Pick your class on the homepage or diagnostic page.",
  },
  {
    question: "How is MindOrbit different?",
    answer:
      "MindOrbit starts with a gap-first diagnostic and a mastery map so you study what actually blocks the next topic—not just what's due tomorrow.",
  },
  {
    question: "Is it safe for students?",
    answer: (
      <>
        MindOrbit is built for middle and high school learners. Read our{" "}
        <Link
          href="/privacy"
          className="font-extrabold text-primary underline decoration-2 underline-offset-4 hover:opacity-90"
        >
          Privacy Policy
        </Link>{" "}
        for how we handle student data.
      </>
    ),
  },
];

export function DuoLandingFaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-border/60 bg-secondary/20 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">FAQ</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Common questions
          </h2>
        </ScrollReveal>

        <div className="mx-auto mt-10 max-w-2xl divide-y divide-border rounded-3xl border-2 border-border bg-card">
          {FAQ_ITEMS.map(({ question, answer }, i) => (
            <ScrollReveal key={question} delay={0.04 * i}>
              <details className="group px-5 py-4 sm:px-6">
                <summary className="cursor-pointer list-none text-base font-extrabold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {question}
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg font-extrabold leading-none text-primary transition group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </span>
                </summary>
                <div className="mt-3 text-sm font-semibold leading-relaxed text-muted-foreground">
                  {answer}
                </div>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
