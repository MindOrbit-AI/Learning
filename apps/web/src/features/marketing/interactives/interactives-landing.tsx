"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Brain,
  MousePointerClick,
  Sparkles,
  Grid3X3,
  Play,
} from "lucide-react";
import { cn } from "@mindorbit/lib";
import { DuoLandingFooter } from "../duo-landing-footer";
import { DuoLandingHeader } from "../duo-landing-header";
import { DuoPrimaryLink } from "../duo-primary-link";
import { ScrollReveal } from "../scroll-reveal";
import {
  INTERACTIVE_CATALOG,
  ENGINE_PRIMITIVE_COUNT,
  SUBJECT_META,
  countBySubject,
  engineLabel,
  interactivesForSubject,
  lessonHref,
  type InteractiveSubject,
  type SubjectFilter,
} from "./catalog";
import { ENGINE_PRIMITIVE_META } from "./engine-catalog";
import { EngineDemoGrid } from "./interactive-demos";
import { ENGINE_PRIMITIVES, type EnginePrimitive } from "@/types/interactive-engine";

const SUBJECT_TABS: { id: SubjectFilter; label: string }[] = [
  { id: "All", label: "All subjects" },
  { id: "Math", label: "Math" },
  { id: "Physics", label: "Physics" },
  { id: "Biology", label: "Biology" },
  { id: "Chemistry", label: "Chemistry" },
];

const ENGINE_TABS: { id: EnginePrimitive | "All"; label: string }[] = [
  { id: "All", label: "All primitives" },
  ...ENGINE_PRIMITIVES.map((p) => ({
    id: p,
    label: ENGINE_PRIMITIVE_META[p].label,
  })),
];

const HOW_IT_WORKS = [
  {
    icon: MousePointerClick,
    title: "LESSON JSON drives scenes",
    body: "Each scene in a lesson picks an engine primitive — Drag, Tiles, Graph, and 11 more — with validation and feedback.",
  },
  {
    icon: Grid3X3,
    title: "Instant feedback",
    body: "Every primitive validates your work on screen so you know exactly where the gap is.",
  },
  {
    icon: Sparkles,
    title: "Build intuition",
    body: "Scenes chain together until the concept clicks — manipulate first, master last.",
  },
] as const;

function SubjectSection({
  subject,
  items,
}: {
  subject: InteractiveSubject;
  items: typeof INTERACTIVE_CATALOG;
}) {
  const meta = SUBJECT_META[subject];
  const SubjectIcon = meta.icon;

  return (
    <section id={meta.slug} className="scroll-mt-24">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm ring-1 ring-border/60",
              meta.accent,
            )}
          >
            <SubjectIcon className="h-7 w-7 text-primary" strokeWidth={2.5} />
          </span>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{subject}</h2>
            <p className="mt-1 max-w-xl text-sm font-medium text-muted-foreground">{meta.description}</p>
          </div>
        </div>
        <span className={cn("inline-flex w-fit rounded-full px-3 py-1 text-xs font-extrabold uppercase", meta.badge)}>
          {items.length} interactives
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className={cn(
              "group flex flex-col rounded-2xl border border-border/80 bg-gradient-to-br bg-card p-5 shadow-sm transition hover:shadow-md",
              item.accent,
            )}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/80 ring-1 ring-border/50">
                <item.icon className="h-5 w-5 text-primary" strokeWidth={2.5} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-muted-foreground">{item.topic}</p>
                <h3 className="mt-0.5 text-base font-extrabold leading-snug text-foreground">{item.title}</h3>
              </div>
            </div>

            <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-foreground/85">{item.description}</p>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {item.primitives.slice(0, 3).map((tag) => (
                <li
                  key={tag}
                  className="rounded-lg bg-background/60 px-2 py-0.5 text-[11px] font-bold text-muted-foreground ring-1 ring-border/40"
                >
                  {engineLabel(tag)}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-muted-foreground">~{item.durationMin} min</span>
              <Link
                href={lessonHref(item.id)}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border-b-[3px] border-[#43a005] bg-[#58cc02] px-4 text-xs font-extrabold uppercase tracking-wide text-white transition hover:brightness-105 active:translate-y-px"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Try it
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function InteractivesLanding() {
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("All");
  const [engineFilter, setEngineFilter] = useState<EnginePrimitive | "All">("All");

  const filtered = useMemo(() => {
    let items = interactivesForSubject(subjectFilter);
    if (engineFilter !== "All") {
      items = items.filter((item) => item.primitives.includes(engineFilter));
    }
    return items;
  }, [subjectFilter, engineFilter]);

  const groupedBySubject = useMemo(() => {
    const subjects = subjectFilter === "All"
      ? (["Math", "Physics", "Biology", "Chemistry"] as InteractiveSubject[])
      : [subjectFilter];
    return subjects
      .map((subject) => ({
        subject,
        items: filtered.filter((i) => i.subject === subject),
      }))
      .filter((g) => g.items.length > 0);
  }, [subjectFilter, filtered]);

  const totalCount = INTERACTIVE_CATALOG.length;
  const subjectCount = Object.keys(SUBJECT_META).length;

  return (
    <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[hsl(var(--duo-gold)_/_0.25)] blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[hsl(var(--duo-blue)_/_0.2)] blur-3xl" />
        <div className="absolute bottom-32 left-1/3 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <DuoLandingHeader />

      <main>
        {/* Hero — Brilliant-style "learn by doing" */}
        <section className="container mx-auto px-4 pb-10 pt-10 sm:pt-16">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                MindOrbit Interactive Engine
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                LESSON JSON drives {ENGINE_PRIMITIVE_COUNT} interactive primitives
              </h1>
              <p className="mt-5 text-lg font-medium text-muted-foreground sm:text-xl">
                {totalCount} hands-on lessons across {subjectCount} subjects — each scene picks Drag, Tiles,
                Graph, or another engine primitive. No login required.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <DuoPrimaryLink href="#try-demo">
                  TRY A DEMO
                  <ArrowRight className="h-4 w-4" />
                </DuoPrimaryLink>
                <Link
                  href="#catalog"
                  className="text-sm font-bold text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
                >
                  BROWSE BY SUBJECT
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Stats */}
        <section className="border-y border-border/60 bg-muted/30">
          <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:py-10">
            {[
              { value: String(totalCount), label: "Interactives" },
              { value: "120+", label: "Hands-on scenes" },
              { value: String(subjectCount), label: "Subjects" },
              { value: String(ENGINE_PRIMITIVE_COUNT), label: "Engine primitives" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-bold text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Engine architecture */}
        <section id="engine" className="container mx-auto px-4 pb-14">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                MindOrbit Interactive Engine
              </h2>
              <p className="mt-3 text-center text-muted-foreground">
                Every visual lesson is JSON. Each scene selects a primitive — the runtime renders it,
                validates input, and returns feedback.
              </p>
              <pre className="mt-8 overflow-x-auto rounded-2xl border border-border/80 bg-zinc-950 p-5 text-left text-xs leading-relaxed text-zinc-300 sm:text-sm">
                <code>{`                 ┌─ Drag
                 ├─ Drop Zone
                 ├─ Slider
                 ├─ Number Line
                 ├─ Graph
                 ├─ Coordinate Plane
                 ├─ Tiles
LESSON JSON ────►├─ Balance Scale
                 ├─ Geometry Canvas
                 ├─ Simulation
                 ├─ Matching
                 ├─ Sequence Builder
                 ├─ Math Input
                 ├─ Multiple Choice
                 └─ Gear`}</code>
              </pre>
            </div>
          </ScrollReveal>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 py-14 sm:py-18">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              How the engine works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Every lesson is visual and interactive. You manipulate concepts until they click, with
              feedback at every step.
            </p>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.08}>
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <step.icon className="h-6 w-6" strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Live demos */}
        <section id="try-demo" className="scroll-mt-24 border-y border-border/60 bg-zinc-950 py-14 sm:py-18">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Try every engine primitive
                </h2>
                <p className="mt-3 text-zinc-400">
                  {ENGINE_PRIMITIVE_COUNT} primitives power every lesson. Pick one and play — no account
                  needed.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-8 -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              <div className="flex min-w-max flex-wrap justify-center gap-2 sm:min-w-0">
                {ENGINE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setEngineFilter(tab.id)}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide transition",
                      engineFilter === tab.id
                        ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <EngineDemoGrid activePrimitive={engineFilter} />
            </div>
          </div>
        </section>

        {/* Categorized catalog */}
        <section id="catalog" className="scroll-mt-24 container mx-auto px-4 py-14 sm:py-18">
          <ScrollReveal>
            <div className="mb-8 text-center sm:mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Browse by subject
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Like Brilliant&apos;s course catalog — organized by discipline so you can jump straight to
                what you want to master.
              </p>
            </div>
          </ScrollReveal>

          {/* Subject tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {SUBJECT_TABS.map((tab) => {
              const count = tab.id === "All" ? totalCount : countBySubject(tab.id);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSubjectFilter(tab.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold transition",
                    subjectFilter === tab.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {tab.label}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-14">
            {groupedBySubject.map(({ subject, items }) => (
              <ScrollReveal key={subject}>
                <SubjectSection subject={subject} items={items} />
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No interactives match this filter. Try a different subject or engine primitive.
            </p>
          ) : null}
        </section>

        {/* CTA */}
        <section className="border-t border-border/60 bg-muted/20">
          <div className="container mx-auto px-4 py-16 sm:py-20">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl rounded-3xl border border-border/80 bg-card p-8 text-center shadow-sm sm:p-12">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
                  <Brain className="h-8 w-8 text-primary" strokeWidth={2.5} />
                </span>
                <h2 className="mt-6 text-2xl font-extrabold text-foreground sm:text-3xl">
                  Ready for your personalized path?
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Start any interactive above, or take our free diagnostic to find gaps and get a
                  mastery map tailored to you.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <DuoPrimaryLink href={lessonHref(INTERACTIVE_CATALOG[0]?.id ?? "lesson-fractions-parts-of-whole")}>
                    START LEARNING FREE
                    <ArrowRight className="h-4 w-4" />
                  </DuoPrimaryLink>
                  <Link
                    href="/try-diagnostic"
                    className="text-sm font-bold text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
                  >
                    TAKE THE GAP SCAN
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <DuoLandingFooter />
    </div>
  );
}
