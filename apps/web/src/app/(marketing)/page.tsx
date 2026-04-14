import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@mindorbit/ui";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  CircleDot,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { PRO_PRICE_MONTHLY } from "@mindorbit/lib";
import { LandingPricingSection } from "@/features/marketing/landing-pricing-section";
import { LandingHero } from "@/features/marketing/landing-hero";
import { ScrollReveal } from "@/features/marketing/scroll-reveal";
import { ProductDemoSection } from "@/features/marketing/product-demo-section";

export const metadata: Metadata = {
  title: "MindOrbit — Build a Mind That Compounds",
  description:
    "The Cognitive Operating System that diagnoses gaps, maps your path, and trains you to master anything—fast.",
};

const PAIN_POINTS = [
  "No clear structure",
  "Don’t know what to focus on",
  "Forget what they learned",
  "No real improvement",
] as const;

const STEPS = [
  {
    n: "1",
    title: "Diagnose",
    body: "Identify exactly what you don’t know in minutes",
  },
  {
    n: "2",
    title: "Map",
    body: "Visualize your path with a mastery map",
  },
  {
    n: "3",
    title: "Train",
    body: "Target weak points with AI-generated missions",
  },
  {
    n: "4",
    title: "Reinforce",
    body: "Lock knowledge in with smart review cycles",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[560px] w-[780px] rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute -right-1/4 top-48 h-[520px] w-[680px] rounded-full bg-emerald-500/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/75 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
              <Brain className="h-5 w-5 text-primary" />
            </span>
            MindOrbit
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#problem" className="transition-colors hover:text-foreground">
              Problem
            </a>
            <a href="#solution" className="transition-colors hover:text-foreground">
              System
            </a>
            <a href="#demo" className="transition-colors hover:text-foreground">
              Product
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/signin" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Sign in
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="sm" className="gap-1.5">
                Start Free Diagnostic
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <LandingHero />

        <ScrollReveal>
          <section id="problem" className="scroll-mt-24 border-y border-white/[0.06] py-16 sm:py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  The hook
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.5rem] md:leading-tight">
                  Most people waste time learning things they already know.
                </h2>
              </div>
              <ul className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-2">
                {PAIN_POINTS.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-zinc-950/40 px-4 py-3 text-left text-sm text-muted-foreground backdrop-blur-sm"
                  >
                    <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mx-auto mt-12 max-w-xl text-center text-lg font-medium text-foreground">
                That’s why most people never reach mastery.
              </p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <section id="solution" className="scroll-mt-24 py-16 sm:py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-2xl text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Your system
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Outcome, clarity, speed—on repeat
                </h2>
              </div>
              <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
                {STEPS.map((step) => (
                  <div
                    key={step.n}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-zinc-950/90 to-zinc-900/40 p-6 shadow-lg transition hover:border-primary/25"
                  >
                    <span className="font-mono text-4xl font-bold tabular-nums text-primary/25 transition group-hover:text-primary/40">
                      {step.n}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <section id="demo" className="scroll-mt-24 border-y border-white/[0.06] bg-zinc-950/30 py-16 sm:py-24">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-2xl text-center">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Product demo
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  This sells the system—not a content library
                </h2>
              </div>
              <div className="mx-auto mt-12 max-w-5xl">
                <ProductDemoSection />
                <p className="mx-auto mt-10 max-w-lg text-center text-lg font-medium text-muted-foreground">
                  Not content. Not courses.{" "}
                  <span className="text-foreground">A system that builds real understanding.</span>
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <section className="py-14 sm:py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-primary/[0.07] via-transparent to-emerald-500/[0.05] px-6 py-10 text-center sm:px-12">
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/50 px-3 py-1">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Used by high-performing students
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/50 px-3 py-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Improving faster than traditional study methods
                  </span>
                </div>
                <blockquote className="mx-auto max-w-2xl text-balance text-lg font-medium leading-relaxed text-foreground">
                  “I finally stopped guessing what to review—the map showed me exactly where I was weak.”
                </blockquote>
                <p className="text-sm text-muted-foreground">Beta learner</p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <LandingPricingSection proPrice={PRO_PRICE_MONTHLY} />

        <ScrollReveal>
          <section className="container mx-auto px-4 py-20 sm:py-28">
            <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.12] via-zinc-950/80 to-background px-6 py-14 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:px-12">
              <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
              <CheckCircle2 className="relative mx-auto h-10 w-10 text-primary" />
              <h2 className="relative mt-6 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Stop guessing what to learn.
                <br />
                Start mastering what matters.
              </h2>
              <div className="relative mt-10">
                <Link href="/onboarding">
                  <Button size="lg" className="h-12 min-w-[220px] gap-2 px-8">
                    Start Free Diagnostic
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <footer className="border-t border-white/[0.06] py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Brain className="h-5 w-5 text-primary" />
            MindOrbit
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="#problem" className="hover:text-foreground">
              Problem
            </a>
            <a href="#solution" className="hover:text-foreground">
              System
            </a>
            <a href="#demo" className="hover:text-foreground">
              Product
            </a>
            <a href="#pricing" className="hover:text-foreground">
              Pricing
            </a>
            <Link href="/auth/signin" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
          <p>© {new Date().getFullYear()} MindOrbit</p>
        </div>
      </footer>
    </div>
  );
}
