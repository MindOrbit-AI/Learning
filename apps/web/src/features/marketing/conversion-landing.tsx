"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Check,
  GitBranch,
  Link2,
  Map,
  MessageCircle,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { MasteryMapVisual } from "./mastery-map-visual";
import { ScrollReveal } from "./scroll-reveal";

const SIGNUP = "/auth/signup";

function BlueCtaLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-14 min-w-[220px] items-center justify-center gap-2 rounded-2xl border-b-[4px] border-[#0d6ebd] bg-[hsl(var(--duo-blue))] px-6 text-center text-sm font-extrabold uppercase tracking-wide text-white shadow-sm transition hover:brightness-105 active:translate-y-px active:border-b-[3px] sm:px-8 sm:text-base ${className}`}
    >
      {children}
    </Link>
  );
}

function ConversionLandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:h-[4.25rem]">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight text-foreground"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 ring-2 ring-primary/25">
            <Brain className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </span>
          MindOrbit
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-bold text-muted-foreground md:flex">
          <a href="/#pain" className="transition-colors hover:text-foreground">
            The problem
          </a>
          <a href="/#product" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="/#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
          <a href="/#proof" className="transition-colors hover:text-foreground">
            Parents
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/auth/signin"
            className="hidden text-sm font-bold text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90 sm:inline"
          >
            I have an account
          </Link>
          <BlueCtaLink href={SIGNUP} className="hidden min-w-0 sm:inline-flex">
            Diagnosis — $29
          </BlueCtaLink>
          <Link href={SIGNUP} className="sm:hidden">
            <span className="inline-flex h-11 items-center justify-center rounded-2xl border-b-[3px] border-[#0d6ebd] bg-[hsl(var(--duo-blue))] px-4 text-xs font-extrabold uppercase text-white">
              $29
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

const TRUST_STRIP = [
  "Used by parents in competitive school districts",
  "Designed to replace trial-and-error tutoring",
  "Results in minutes, not months",
] as const;

const PAIN_LINES = [
  "They say they understand… until the test.",
  "You try tutors, videos, worksheets… nothing sticks.",
  "You don’t actually know what they’re missing.",
] as const;

const OUTPUT_ITEMS = [
  {
    icon: Brain,
    title: "Strength Map",
    body: "What they actually understand",
  },
  {
    icon: Target,
    title: "Weak Nodes",
    body: "Where they’re struggling",
  },
  {
    icon: Link2,
    title: "Root Cause Analysis",
    body: "Why it’s happening",
  },
  {
    icon: Map,
    title: "Action Plan",
    body: "What to fix first",
  },
] as const;

const COMPARE_ROWS = [
  ["Generic lessons", "Personalized diagnosis"],
  ["More content", "Precise gap detection"],
  ["Trial & error", "Root cause clarity"],
  ["Slow progress", "Immediate insight"],
] as const;

const TESTIMONIALS = [
  "We finally understand why he was struggling.",
  "Better than months of tutoring.",
  "This showed us exactly what to fix.",
] as const;

export function ConversionLanding() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[hsl(var(--duo-gold)_/_0.22)] blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[hsl(var(--duo-blue)_/_0.18)] blur-3xl" />
        <div className="absolute bottom-32 left-1/3 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <ConversionLandingHeader />

      <main>
        {/* Hero */}
        <section className="relative border-b border-border/60 bg-gradient-to-b from-secondary/50 via-background to-background pb-14 pt-10 sm:pb-20 sm:pt-12">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14">
              <ScrollReveal className="min-w-0">
                <p className="inline-flex items-center rounded-full border-2 border-[hsl(var(--duo-blue)_/_0.35)] bg-[hsl(var(--duo-blue)_/_0.1)] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[hsl(var(--duo-blue))]">
                  Learning intelligence for parents
                </p>
                <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-5xl md:text-[3.25rem] lg:text-6xl">
                  Build a mind that compounds
                </h1>
                <p className="mt-6 max-w-xl text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
                  Most students don’t struggle because they’re not smart. They struggle because no one shows them
                  where they’re stuck.
                </p>
                <p className="mt-3 text-lg font-extrabold text-foreground sm:text-xl">
                  MindOrbit finds the exact gaps — in 15 minutes.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <BlueCtaLink href={SIGNUP}>
                    Get Your Child’s Learning Diagnosis — $29
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </BlueCtaLink>
                  <a
                    href="#product"
                    className="inline-flex h-14 items-center justify-center rounded-2xl border-[3px] border-[hsl(var(--duo-blue))] bg-background px-8 text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] shadow-sm transition hover:bg-[hsl(var(--duo-blue)_/_0.08)] sm:text-base"
                  >
                    See How It Works
                  </a>
                </div>
                <ul className="mt-10 flex flex-col gap-2.5 text-sm font-semibold text-muted-foreground sm:text-[0.9375rem]">
                  {TRUST_STRIP.map((line) => (
                    <li key={line} className="flex gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={2.5} />
                      {line}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
              <ScrollReveal className="relative mx-auto w-full min-w-0 max-w-lg" delay={0.08}>
                <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-[hsl(var(--duo-blue)_/_0.12)] blur-2xl" />
                <MasteryMapVisual />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Pain */}
        <section id="pain" className="scroll-mt-24 border-b border-border/60 bg-card/40 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-[2.5rem]">
                You’re not paying for tutoring.
                <span className="block text-[hsl(var(--duo-blue))]">You’re paying for guessing.</span>
              </h2>
              <ul className="mx-auto mt-10 max-w-xl space-y-4 text-left text-lg font-semibold text-muted-foreground">
                {PAIN_LINES.map((line) => (
                  <li key={line} className="flex gap-3 border-l-4 border-[hsl(var(--duo-blue)_/_0.45)] pl-4">
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mx-auto mt-10 max-w-2xl text-xl font-extrabold leading-snug text-foreground sm:text-2xl">
                Because the real problem isn’t effort — it’s hidden gaps.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Shift */}
        <section id="shift" className="scroll-mt-24 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
              <ScrollReveal>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">The shift</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Learning isn’t linear. It’s a map.
                </h2>
                <div className="mt-6 space-y-4 text-lg font-semibold leading-relaxed text-muted-foreground">
                  <p>Every subject is a network of concepts.</p>
                  <p>If one node is weak, everything built on top breaks.</p>
                  <p className="text-foreground">
                    MindOrbit maps what your child knows — and what they don’t.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.06}>
                <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-gradient-to-br from-secondary/80 to-card p-8 shadow-[0_14px_0_0_rgba(0,0,0,0.05)]">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
                  <div className="flex items-center gap-2 text-[hsl(var(--duo-blue))]">
                    <GitBranch className="h-6 w-6" strokeWidth={2.25} />
                    <span className="text-sm font-extrabold uppercase tracking-wider">Concept network</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-relaxed text-muted-foreground">
                    Strong foundations support new skills. A single hidden gap can make homework feel impossible —
                    even when effort is high.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {["Foundations", "Dependencies", "False confidence", "Priority fixes"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-bold text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Product — 3 steps */}
        <section
          id="product"
          className="scroll-mt-24 border-y border-border/60 bg-gradient-to-b from-secondary/35 to-background py-16 sm:py-20"
        >
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">The product</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                A 15-minute diagnostic that reveals everything
              </h2>
            </ScrollReveal>
            <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Take the Diagnostic",
                  icon: MessageCircle,
                  lines: ["Smart, adaptive questions", "Feels like a conversation, not a test"],
                },
                {
                  step: "2",
                  title: "We Map Their Understanding",
                  icon: Sparkles,
                  lines: ["Identify weak nodes", "Detect missing foundations", "Find false confidence"],
                },
                {
                  step: "3",
                  title: "Get a Clear Plan",
                  icon: Zap,
                  lines: ["Exact gaps", "Root causes", "What to fix first"],
                },
              ].map(({ step, title, icon: Icon, lines }, i) => (
                <ScrollReveal key={title} delay={i * 0.07}>
                  <div className="relative flex h-full flex-col rounded-3xl border-2 border-border bg-card p-7 shadow-[0_12px_0_0_rgba(0,0,0,0.05)]">
                    <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsl(var(--duo-blue)_/_0.12)] text-lg font-extrabold text-[hsl(var(--duo-blue))]">
                      {step}
                    </span>
                    <Icon className="h-8 w-8 text-primary" strokeWidth={2.25} />
                    <h3 className="mt-4 text-xl font-extrabold">{title}</h3>
                    <ul className="mt-4 flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
                      {lines.map((line) => (
                        <li key={line} className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Output */}
        <section id="output" className="scroll-mt-24 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">The output</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Not a score. A diagnosis.</h2>
            </ScrollReveal>
            <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
              {OUTPUT_ITEMS.map(({ icon: Icon, title, body }, i) => (
                <ScrollReveal key={title} delay={i * 0.05}>
                  <div className="flex gap-4 rounded-2xl border-2 border-border bg-card p-6">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <Icon className="h-6 w-6" strokeWidth={2.25} />
                    </span>
                    <div>
                      <h3 className="text-lg font-extrabold">{title}</h3>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">{body}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal className="mx-auto mt-12 max-w-3xl text-center" delay={0.1}>
              <p className="rounded-2xl border-2 border-dashed border-[hsl(var(--duo-blue)_/_0.4)] bg-[hsl(var(--duo-blue)_/_0.06)] px-6 py-6 text-lg font-extrabold leading-snug text-foreground sm:text-xl">
                “Your child isn’t bad at math. They’re missing 2–3 key concepts no one identified.”
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 border-t border-border/60 bg-secondary/25 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">One session. Lifetime clarity.</h2>
            </ScrollReveal>
            <ScrollReveal className="mx-auto mt-12 max-w-lg" delay={0.06}>
              <div className="relative overflow-hidden rounded-3xl border-2 border-primary/35 bg-gradient-to-b from-primary/12 to-card p-8 shadow-[0_14px_0_0_hsl(var(--primary)/0.35)] sm:p-10">
                <div className="absolute right-4 top-4 rounded-full bg-[hsl(var(--duo-blue))] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Intro offer
                </div>
                <p className="text-sm font-extrabold uppercase tracking-[0.15em] text-muted-foreground">
                  MindOrbit Diagnostic™
                </p>
                <ul className="mt-6 flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                    15-minute adaptive assessment
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                    Full Learning Intelligence Report
                  </li>
                  <li className="flex gap-2">
                    <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={3} />
                    Personalized roadmap
                  </li>
                </ul>
                <div className="mt-8 flex flex-wrap items-end gap-3">
                  <span className="text-2xl font-extrabold text-muted-foreground line-through decoration-2">
                    $79
                  </span>
                  <span className="text-4xl font-extrabold text-foreground">$29</span>
                  <span className="pb-1 text-sm font-bold text-muted-foreground">today</span>
                </div>
                <div className="mt-8">
                  <BlueCtaLink href={SIGNUP} className="w-full">
                    Get Diagnosis Now
                    <ArrowRight className="h-4 w-4" />
                  </BlueCtaLink>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Authority */}
        <section id="why" className="scroll-mt-24 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Why this works (and everything else doesn’t)
              </h2>
            </ScrollReveal>
            <ScrollReveal className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border-2 border-border bg-card" delay={0.05}>
              <div className="grid grid-cols-2 border-b-2 border-border bg-muted/50 text-xs font-extrabold uppercase tracking-wider text-muted-foreground sm:text-sm">
                <div className="px-4 py-3 sm:px-6">Traditional learning</div>
                <div className="border-l-2 border-border bg-[hsl(var(--duo-blue)_/_0.08)] px-4 py-3 text-[hsl(var(--duo-blue))] sm:px-6">
                  MindOrbit
                </div>
              </div>
              {COMPARE_ROWS.map(([left, right]) => (
                <div key={left} className="grid grid-cols-2 border-b border-border last:border-b-0">
                  <div className="px-4 py-4 text-sm font-semibold text-muted-foreground sm:px-6 sm:text-base">
                    {left}
                  </div>
                  <div className="border-l border-border bg-[hsl(var(--duo-blue)_/_0.04)] px-4 py-4 text-sm font-bold text-foreground sm:px-6 sm:text-base">
                    {right}
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        {/* Social proof */}
        <section id="proof" className="scroll-mt-24 border-t border-border/60 bg-card/30 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">What parents are saying</h2>
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                Early families — real reactions we hear in onboarding.
              </p>
            </ScrollReveal>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((quote, i) => (
                <ScrollReveal key={quote} delay={i * 0.06}>
                  <blockquote className="flex h-full flex-col rounded-2xl border-2 border-border bg-background p-6 shadow-sm">
                    <p className="text-lg font-bold leading-snug text-foreground">&ldquo;{quote}&rdquo;</p>
                    <footer className="mt-4 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                      — Parent, MindOrbit
                    </footer>
                  </blockquote>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final close */}
        <section id="close" className="scroll-mt-24 border-t-2 border-border bg-gradient-to-b from-[hsl(var(--duo-blue)_/_0.1)] to-background py-16 sm:py-24">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                Stop guessing. Start knowing.
              </h2>
              <p className="mt-6 text-lg font-semibold text-muted-foreground sm:text-xl">
                You don’t need another tutor.
                <span className="mt-2 block font-extrabold text-foreground">You need clarity.</span>
              </p>
              <div className="mt-10 flex justify-center">
                <BlueCtaLink href={SIGNUP}>
                  Get Your Child’s Diagnosis — $29
                  <ArrowRight className="h-4 w-4" />
                </BlueCtaLink>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-border bg-secondary/30 py-10">
        <div className="container mx-auto flex flex-col gap-8 px-4">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <Link href="/" className="flex items-center gap-2 font-extrabold text-foreground">
              <Brain className="h-5 w-5 text-primary" strokeWidth={2.5} />
              MindOrbit
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
              <a href="/#pain" className="hover:text-foreground">
                The problem
              </a>
              <a href="/#product" className="hover:text-foreground">
                How it works
              </a>
              <a href="/#pricing" className="hover:text-foreground">
                Pricing
              </a>
              <Link href="/who-we-are" className="hover:text-foreground">
                Who we are
              </Link>
              <Link href="/auth/signin" className="hover:text-foreground">
                Sign in
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border/80 pt-6 text-xs font-semibold text-muted-foreground sm:flex-row">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 sm:justify-start">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </div>
            <p>© {new Date().getFullYear()} MindOrbit</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
