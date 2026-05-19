import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PRO_PRICE_MONTHLY } from "@mindorbit/lib";
import { DuoPrimaryLink } from "./duo-primary-link";
import { ScrollReveal } from "./scroll-reveal";

export function DuoLandingPricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Simple. Transparent.
          </h2>
          <p className="mt-4 text-lg font-semibold text-muted-foreground">
            The diagnostic and snapshot map are always free. Pro unlocks the full subject map,
            unlimited missions, and deeper progress—for students or families who want the
            complete path.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <ScrollReveal>
            <div className="flex h-full flex-col rounded-3xl border-2 border-border bg-card p-8 shadow-[0_12px_0_0_rgba(0,0,0,0.06)]">
              <p className="text-xl font-extrabold">Free</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                Get clarity on what to learn first
              </p>
              <p className="mt-6 text-4xl font-extrabold">
                $0
                <span className="text-lg font-bold text-muted-foreground">/month</span>
              </p>
              <ul className="mt-8 flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
                <li className="flex gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                  Skill diagnostic
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                  Explore the map (limited topics)
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                  Practice sessions (limited)
                </li>
              </ul>
              <div className="mt-10">
                <Link
                  href="/auth/signup"
                  className="flex h-14 w-full items-center justify-center rounded-2xl border-[3px] border-[hsl(var(--duo-blue))] bg-background text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] transition hover:bg-[hsl(var(--duo-blue)_/_0.08)]"
                >
                  Continue with Free
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-b from-primary/10 to-card p-8 shadow-[0_12px_0_0_hsl(var(--primary)/0.35)]">
              <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground">
                Popular
              </div>
              <p className="text-xl font-extrabold">Pro</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                Full map, unlimited missions, deeper insights
              </p>
              <p className="mt-6 text-4xl font-extrabold">
                ${PRO_PRICE_MONTHLY.toFixed(2)}
                <span className="text-lg font-bold text-muted-foreground">/month</span>
              </p>
              <ul className="mt-8 flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
                <li className="flex gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                  Full mastery map across your subject
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                  Unlimited training missions
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                  Deeper progress and insights
                </li>
              </ul>
              <div className="mt-10">
                <DuoPrimaryLink href="/auth/signup" className="w-full">
                  Go Pro
                  <ArrowRight className="h-4 w-4" />
                </DuoPrimaryLink>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
