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
  Search,
  X,
  ChevronRight,
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
  interactivesForMathTrack,
  filterByCurriculumLevel,
  groupCatalogByCurriculumLevel,
  searchCatalogItems,
  levelOptionsForTrack,
  MATH_TRACK_META,
  FRACTION_LEVEL_THEMES,
  ALGEBRA_LEVEL_THEMES,
  NEGATIVE_NUMBERS_LEVEL_THEMES,
  COORDINATE_PLANE_LEVEL_THEMES,
  PERCENTS_LEVEL_THEMES,
  PROPORTIONAL_REASONING_LEVEL_THEMES,
  curriculumThemesForTrack,
  curriculumTrackBadge,
  lessonHref,
  type CurriculumTrack,
  type CurriculumLevelFilter,
  type MathTrackFilter,
  type InteractiveSubject,
  type InteractiveCatalogItem,
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
    title: "Manipulate first",
    body: "Each scene puts you in control — drag, shade, plot, and reorder until the idea makes sense.",
  },
  {
    icon: Grid3X3,
    title: "Instant feedback",
    body: "Your work is checked on screen so you know exactly where the gap is.",
  },
  {
    icon: Sparkles,
    title: "Build intuition",
    body: "Scenes chain together until the concept clicks — manipulate first, master last.",
  },
] as const;

function InteractiveCard({ item }: { item: InteractiveCatalogItem }) {
  return (
    <article
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
  );
}

function LessonGrid({ items }: { items: InteractiveCatalogItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <InteractiveCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function SubjectSection({
  subject,
  items,
}: {
  subject: InteractiveSubject;
  items: InteractiveCatalogItem[];
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

      <LessonGrid items={items} />
    </section>
  );
}

function LevelGroupSection({
  level,
  theme,
  items,
  trackAccent,
}: {
  level: number;
  theme: string;
  items: InteractiveCatalogItem[];
  trackAccent: string;
}) {
  return (
    <div className="scroll-mt-28" id={`level-${level}`}>
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <h3 className="text-lg font-extrabold text-foreground sm:text-xl">
            Level {level}
            <span className="ml-2 font-bold text-muted-foreground">· {theme}</span>
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {items.length} lesson{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <span
          className={cn(
            "hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase sm:inline-flex",
            trackAccent,
          )}
        >
          Level {level}
        </span>
      </div>
      <LessonGrid items={items} />
    </div>
  );
}

function MathTrackPicker({
  active,
  onChange,
}: {
  active: MathTrackFilter;
  onChange: (track: MathTrackFilter) => void;
}) {
  const tracks: { id: MathTrackFilter; label: string; description: string; count: number }[] = [
    {
      id: "All",
      label: "All math",
      description: "Browse every math lesson — tracks and featured picks.",
      count: interactivesForMathTrack("All").length,
    },
    {
      id: "Fractions",
      label: MATH_TRACK_META.Fractions.label,
      description: MATH_TRACK_META.Fractions.description,
      count: interactivesForMathTrack("Fractions").length,
    },
    {
      id: "Algebra",
      label: MATH_TRACK_META.Algebra.label,
      description: MATH_TRACK_META.Algebra.description,
      count: interactivesForMathTrack("Algebra").length,
    },
    {
      id: "NegativeNumbers",
      label: MATH_TRACK_META.NegativeNumbers.label,
      description: MATH_TRACK_META.NegativeNumbers.description,
      count: interactivesForMathTrack("NegativeNumbers").length,
    },
    {
      id: "CoordinatePlane",
      label: MATH_TRACK_META.CoordinatePlane.label,
      description: MATH_TRACK_META.CoordinatePlane.description,
      count: interactivesForMathTrack("CoordinatePlane").length,
    },
    {
      id: "Percents",
      label: MATH_TRACK_META.Percents.label,
      description: MATH_TRACK_META.Percents.description,
      count: interactivesForMathTrack("Percents").length,
    },
    {
      id: "ProportionalReasoning",
      label: MATH_TRACK_META.ProportionalReasoning.label,
      description: MATH_TRACK_META.ProportionalReasoning.description,
      count: interactivesForMathTrack("ProportionalReasoning").length,
    },
    {
      id: "Featured",
      label: MATH_TRACK_META.Featured.label,
      description: MATH_TRACK_META.Featured.description,
      count: interactivesForMathTrack("Featured").length,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8">
      {tracks.map((track) => {
        const selected = active === track.id;
        const style =
          track.id === "All"
            ? { accent: "from-blue-400/15 to-indigo-500/5", border: "border-primary" }
            : {
                accent: MATH_TRACK_META[track.id as Exclude<MathTrackFilter, "All">].accent,
                border: MATH_TRACK_META[track.id as Exclude<MathTrackFilter, "All">].border,
              };

        return (
          <button
            key={track.id}
            type="button"
            onClick={() => onChange(track.id)}
            className={cn(
              "flex flex-col rounded-2xl border bg-gradient-to-br p-4 text-left transition hover:shadow-md",
              style.accent,
              selected ? cn("ring-2 ring-primary/30 shadow-sm", style.border) : "border-border/80 hover:border-primary/30",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-extrabold text-foreground">{track.label}</span>
              <span className="shrink-0 rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-bold tabular-nums text-muted-foreground ring-1 ring-border/50">
                {track.count}
              </span>
            </div>
            <p className="mt-1.5 flex-1 text-xs font-medium leading-relaxed text-muted-foreground">
              {track.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function MathTrackOverview({
  onSelectTrack,
}: {
  onSelectTrack: (track: Exclude<MathTrackFilter, "All">) => void;
}) {
  const previews: {
    track: Exclude<MathTrackFilter, "All">;
    levels: number;
    themeSample: string;
  }[] = [
    { track: "Fractions", levels: 5, themeSample: FRACTION_LEVEL_THEMES[1] },
    { track: "Algebra", levels: 13, themeSample: ALGEBRA_LEVEL_THEMES[1] },
    { track: "NegativeNumbers", levels: 8, themeSample: NEGATIVE_NUMBERS_LEVEL_THEMES[1] },
    { track: "CoordinatePlane", levels: 5, themeSample: COORDINATE_PLANE_LEVEL_THEMES[1] },
    { track: "Percents", levels: 5, themeSample: PERCENTS_LEVEL_THEMES[1] },
    { track: "ProportionalReasoning", levels: 7, themeSample: PROPORTIONAL_REASONING_LEVEL_THEMES[1] },
    { track: "Featured", levels: 0, themeSample: "Gears, quadratics & more" },
  ];

  return (
    <div className="space-y-10">
      {previews.map(({ track, levels, themeSample }) => {
        const meta = MATH_TRACK_META[track];
        const items = interactivesForMathTrack(track);
        const preview = items.slice(0, 3);

        return (
          <div key={track} className="rounded-3xl border border-border/80 bg-muted/20 p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-foreground">{meta.label}</h3>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{meta.description}</p>
                {levels > 0 ? (
                  <p className="mt-2 text-xs font-bold text-muted-foreground">
                    {levels} levels · starts with {themeSample}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onSelectTrack(track)}
                className="inline-flex w-fit items-center gap-1 rounded-xl border border-border/80 bg-card px-4 py-2 text-sm font-extrabold text-primary transition hover:border-primary/40 hover:bg-primary/5"
              >
                View all {items.length}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <LessonGrid items={preview} />
          </div>
        );
      })}
    </div>
  );
}

function MathBrowseContent({
  items,
  mathTrack,
  curriculumLevel,
  onSelectTrack,
}: {
  items: InteractiveCatalogItem[];
  mathTrack: MathTrackFilter;
  curriculumLevel: CurriculumLevelFilter;
  onSelectTrack: (track: Exclude<MathTrackFilter, "All">) => void;
}) {
  if (items.length === 0) return null;

  if (mathTrack === "All") {
    return <MathTrackOverview onSelectTrack={onSelectTrack} />;
  }

  if (mathTrack === "Featured") {
    return <LessonGrid items={items} />;
  }

  const track = mathTrack as CurriculumTrack;
  const levelGroups = groupCatalogByCurriculumLevel(items);

  if (curriculumLevel !== "All" || levelGroups.length <= 1) {
    return <LessonGrid items={items} />;
  }

  const themes = curriculumThemesForTrack(track);
  const trackBadge = curriculumTrackBadge(track);

  return (
    <div className="space-y-10">
      {levelGroups.map(([level, levelItems]) => (
        <LevelGroupSection
          key={level}
          level={level}
          theme={themes[level as keyof typeof themes] ?? ""}
          items={levelItems}
          trackAccent={trackBadge}
        />
      ))}
    </div>
  );
}

function CatalogSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative mx-auto max-w-xl">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search lessons by title or topic…"
        className="w-full rounded-2xl border border-border/80 bg-card py-3 pl-10 pr-10 text-sm font-medium text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export function InteractivesLanding() {
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("All");
  const [engineFilter, setEngineFilter] = useState<EnginePrimitive | "All">("All");
  const [mathTrackFilter, setMathTrackFilter] = useState<MathTrackFilter>("All");
  const [curriculumLevelFilter, setCurriculumLevelFilter] = useState<CurriculumLevelFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let items = interactivesForSubject(subjectFilter);

    if (subjectFilter === "All" || subjectFilter === "Math") {
      if (mathTrackFilter !== "All") {
        items = interactivesForMathTrack(mathTrackFilter).filter((item) =>
          subjectFilter === "All" ? true : item.subject === "Math",
        );
      }
      if (
        (mathTrackFilter === "Fractions" ||
          mathTrackFilter === "Algebra" ||
          mathTrackFilter === "NegativeNumbers" ||
          mathTrackFilter === "CoordinatePlane" ||
          mathTrackFilter === "Percents" ||
          mathTrackFilter === "ProportionalReasoning") &&
        curriculumLevelFilter !== "All"
      ) {
        items = filterByCurriculumLevel(items, mathTrackFilter, curriculumLevelFilter);
      }
    }

    return searchCatalogItems(items, searchQuery);
  }, [subjectFilter, mathTrackFilter, curriculumLevelFilter, searchQuery]);

  const isSearchMode = searchQuery.trim().length > 0;
  const isMathBrowse = subjectFilter === "All" || subjectFilter === "Math";
  const showMathTracks = isMathBrowse && !isSearchMode;
  const showLevelSelect =
    showMathTracks &&
    (mathTrackFilter === "Fractions" ||
      mathTrackFilter === "Algebra" ||
      mathTrackFilter === "NegativeNumbers" ||
      mathTrackFilter === "CoordinatePlane" ||
      mathTrackFilter === "Percents" ||
      mathTrackFilter === "ProportionalReasoning");

  const groupedBySubject = useMemo(() => {
    if (isSearchMode) {
      const subjects =
        subjectFilter === "All"
          ? (["Math", "Physics", "Biology", "Chemistry"] as InteractiveSubject[])
          : [subjectFilter];
      return subjects
        .map((subject) => ({
          subject,
          items: filtered.filter((i) => i.subject === subject),
        }))
        .filter((g) => g.items.length > 0);
    }

    if (isMathBrowse && subjectFilter === "Math") {
      return [];
    }

    const subjects =
      subjectFilter === "All"
        ? (["Math", "Physics", "Biology", "Chemistry"] as InteractiveSubject[])
        : [subjectFilter];
    return subjects
      .map((subject) => ({
        subject,
        items: filtered.filter((i) => i.subject === subject),
      }))
      .filter((g) => g.items.length > 0 && g.subject !== "Math");
  }, [subjectFilter, filtered, isSearchMode, isMathBrowse]);

  const mathItems = useMemo(() => {
    if (!isMathBrowse || isSearchMode) return [];
    return filtered.filter((i) => i.subject === "Math");
  }, [filtered, isMathBrowse, isSearchMode]);

  const hasActiveFilters =
    subjectFilter !== "All" ||
    mathTrackFilter !== "All" ||
    curriculumLevelFilter !== "All" ||
    searchQuery.trim().length > 0;

  const clearFilters = () => {
    setSubjectFilter("All");
    setMathTrackFilter("All");
    setCurriculumLevelFilter("All");
    setSearchQuery("");
  };

  const handleSubjectChange = (id: SubjectFilter) => {
    setSubjectFilter(id);
    if (id !== "Math" && id !== "All") {
      setMathTrackFilter("All");
      setCurriculumLevelFilter("All");
    }
  };

  const handleMathTrackChange = (track: MathTrackFilter) => {
    setMathTrackFilter(track);
    setCurriculumLevelFilter("All");
  };

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
                Pick a subject, explore a math track, or search — jump straight to what you want to master.
              </p>
            </div>
          </ScrollReveal>

          <div className="mb-6">
            <CatalogSearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Subject tabs */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {SUBJECT_TABS.map((tab) => {
              const count = tab.id === "All" ? totalCount : countBySubject(tab.id);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSubjectChange(tab.id)}
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

          {showMathTracks ? (
            <div className="mb-8 space-y-4">
              <p className="text-center text-sm font-bold text-muted-foreground">Math tracks</p>
              <MathTrackPicker active={mathTrackFilter} onChange={handleMathTrackChange} />

              {showLevelSelect ? (
                <div className="mx-auto flex max-w-md flex-col gap-2 pt-2">
                  <label htmlFor="curriculum-level" className="text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Filter by level
                  </label>
                  <select
                    id="curriculum-level"
                    value={curriculumLevelFilter === "All" ? "All" : String(curriculumLevelFilter)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCurriculumLevelFilter(val === "All" ? "All" : Number(val));
                    }}
                    className="w-full rounded-xl border border-border/80 bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="All">
                      All levels ({interactivesForMathTrack(mathTrackFilter).length} lessons)
                    </option>
                    {levelOptionsForTrack(mathTrackFilter as CurriculumTrack).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          ) : null}

          {hasActiveFilters ? (
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="font-bold text-muted-foreground">
                {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </span>
              {searchQuery.trim() ? (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground">
                  “{searchQuery.trim()}”
                </span>
              ) : null}
              {subjectFilter !== "All" ? (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground">
                  {subjectFilter}
                </span>
              ) : null}
              {mathTrackFilter !== "All" ? (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground">
                  {MATH_TRACK_META[mathTrackFilter as Exclude<MathTrackFilter, "All">].label}
                </span>
              ) : null}
              {curriculumLevelFilter !== "All" ? (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-foreground">
                  Level {curriculumLevelFilter}
                </span>
              ) : null}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-extrabold text-primary underline underline-offset-2 hover:opacity-80"
              >
                Clear filters
              </button>
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No lessons match your search. Try different keywords or clear filters.
            </p>
          ) : null}

          {isMathBrowse && mathItems.length > 0 ? (
            <ScrollReveal>
              {subjectFilter === "All" ? (
                <section id="math" className="scroll-mt-24 mb-14">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400/20 to-indigo-500/10 shadow-sm ring-1 ring-border/60">
                        <SUBJECT_META.Math.icon className="h-7 w-7 text-primary" strokeWidth={2.5} />
                      </span>
                      <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Math</h2>
                        <p className="mt-1 max-w-xl text-sm font-medium text-muted-foreground">
                          {SUBJECT_META.Math.description}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex w-fit rounded-full bg-blue-500/15 px-3 py-1 text-xs font-extrabold uppercase text-blue-700 dark:text-blue-300">
                      {mathItems.length} shown
                    </span>
                  </div>
                  <MathBrowseContent
                    items={mathItems}
                    mathTrack={mathTrackFilter}
                    curriculumLevel={curriculumLevelFilter}
                    onSelectTrack={(track) => {
                      handleMathTrackChange(track);
                      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                </section>
              ) : (
                <MathBrowseContent
                  items={mathItems}
                  mathTrack={mathTrackFilter}
                  curriculumLevel={curriculumLevelFilter}
                  onSelectTrack={handleMathTrackChange}
                />
              )}
            </ScrollReveal>
          ) : null}

          <div className="space-y-14">
            {groupedBySubject.map(({ subject, items }) => (
              <ScrollReveal key={subject}>
                <SubjectSection subject={subject} items={items} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        
      </main>

      <DuoLandingFooter />
    </div>
  );
}
