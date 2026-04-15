import { Sparkles } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";

export function DuoLandingQuoteSection() {
  return (
    <section className="border-y border-border/60 bg-[hsl(var(--duo-blue)_/_0.08)] py-14 sm:py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Sparkles className="h-10 w-10 text-[hsl(var(--duo-blue))]" strokeWidth={2} />
          <blockquote className="text-balance text-xl font-extrabold leading-snug text-foreground sm:text-2xl">
            “I finally stopped guessing what to review—the map showed me exactly where I was
            weak.”
          </blockquote>
          <p className="text-sm font-bold text-muted-foreground">Early learner, beta</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
