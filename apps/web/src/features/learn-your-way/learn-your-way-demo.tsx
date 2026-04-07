"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AudioLines,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Info,
  Loader2,
  Mail,
  Network,
  Play,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@mindorbit/ui";
import type { ImmersiveLessonContent, ImmersiveLessonSection } from "@mindorbit/ai";
import { demoModes } from "./demo-lesson";

const modeIcons = {
  source: FileText,
  immersive: BookOpen,
  slides: Play,
  audio: AudioLines,
  mindmap: Network,
} as const;

const accent = "text-[#c45c26]";
const accentBg = "bg-[#c45c26]";
const accentRing = "ring-[#c45c26]";

const DEFAULT_TOPIC = "Latitude, longitude, and how we map Earth and the sky";
const DEFAULT_GRADE = "Grade 10";

function clampSectionCount(n: number | undefined): number | undefined {
  if (n == null || Number.isNaN(n)) return undefined;
  return Math.min(8, Math.max(2, Math.floor(n)));
}

function normalizeInitialString(v: string | string[] | undefined): string | undefined {
  if (v == null) return undefined;
  const s = Array.isArray(v) ? v[0] : v;
  const t = typeof s === "string" ? s.trim() : "";
  return t.length > 0 ? t : undefined;
}

function pickQueryString(
  fromUrl: string | null,
  fromProps: string | undefined,
  fallback: string,
  maxLen: number
): string {
  const u = fromUrl?.trim();
  if (u) return u.slice(0, maxLen);
  const p = fromProps?.trim();
  if (p) return p.slice(0, maxLen);
  return fallback.slice(0, maxLen);
}

/**
 * Prefer the browser URL on the client — `useSearchParams()` can be empty during
 * static/hydration edge cases while `window.location` already has `?topic=…`.
 */
function useLessonUrlParams(): {
  topicQs: string | null;
  gradeQs: string | null;
  sectionsQs: string | null;
} {
  const pathname = usePathname();
  const sp = useSearchParams();
  const spKey = sp.toString();

  // spKey serializes the query string so this memo updates when params change.
  return useMemo(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search);
      return {
        topicQs: q.get("topic"),
        gradeQs: q.get("grade") ?? q.get("gradeLevel"),
        sectionsQs: q.get("sections"),
      };
    }
    return {
      topicQs: sp.get("topic"),
      gradeQs: sp.get("grade") ?? sp.get("gradeLevel"),
      sectionsQs: sp.get("sections"),
    };
  }, [pathname, spKey, sp]);
}

export function LearnYourWayDemo({
  initialTopic,
  initialGrade,
  initialSectionCount,
}: {
  initialTopic?: string | string[];
  initialGrade?: string | string[];
  initialSectionCount?: number;
}) {
  const { topicQs, gradeQs, sectionsQs } = useLessonUrlParams();
  const topicProp = normalizeInitialString(initialTopic);
  const gradeProp = normalizeInitialString(initialGrade);

  const requestPayload = useMemo(() => {
    const topic = pickQueryString(topicQs, topicProp, DEFAULT_TOPIC, 240);
    const gradeLevel = pickQueryString(gradeQs, gradeProp, DEFAULT_GRADE, 60);
    const parsedSections =
      sectionsQs != null && sectionsQs !== ""
        ? Number.parseInt(sectionsQs, 10)
        : undefined;
    const fromQuery = clampSectionCount(parsedSections);
    const sectionCount =
      fromQuery !== undefined ? fromQuery : clampSectionCount(initialSectionCount);
    return { topic, gradeLevel, sectionCount };
  }, [topicQs, gradeQs, sectionsQs, topicProp, gradeProp, initialSectionCount]);

  const [activeMode, setActiveMode] = useState<(typeof demoModes)[number]["id"]>("immersive");
  const [sectionIndex, setSectionIndex] = useState(0);
  /** Block index within current section for quick-check dialog */
  const [hintBlockIndex, setHintBlockIndex] = useState<number | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [lesson, setLesson] = useState<ImmersiveLessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLesson = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/learn/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: requestPayload.topic,
          gradeLevel: requestPayload.gradeLevel,
          ...(requestPayload.sectionCount != null
            ? { sectionCount: requestPayload.sectionCount }
            : {}),
        }),
      });
      const data = (await res.json()) as ImmersiveLessonContent | { error?: string };
      if (!res.ok) {
        const msg =
          typeof (data as { error?: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Could not generate lesson";
        throw new Error(msg);
      }
      if (!("sections" in data) || !Array.isArray((data as ImmersiveLessonContent).sections)) {
        throw new Error("Invalid response from server");
      }
      setLesson(data as ImmersiveLessonContent);
    } catch (e) {
      setLesson(null);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [requestPayload.topic, requestPayload.gradeLevel, requestPayload.sectionCount]);

  useEffect(() => {
    void loadLesson();
  }, [loadLesson]);

  useEffect(() => {
    setSectionIndex(0);
  }, [lesson]);

  const sections = lesson?.sections ?? [];
  const section: ImmersiveLessonSection | undefined = sections[sectionIndex] ?? sections[0];
  const total = sections.length;

  const modePlaceholder = useMemo(() => {
    const m = demoModes.find((x) => x.id === activeMode);
    return m?.label ?? "This view";
  }, [activeMode]);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col px-4 pb-10 pt-6 sm:px-6">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard"
            className="text-lg font-extrabold tracking-tight text-[#1f1f1f] hover:opacity-80"
          >
            MindOrbit
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#d9d4cc] bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b6560]">
            <Sparkles className="h-3 w-3" aria-hidden />
            AI lesson
          </span>
          <Link
            href="/learn/subjects"
            className="text-xs font-semibold text-[#c45c26] underline-offset-2 hover:underline"
          >
            K–12 topics
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:flex-1">
          <div className="flex items-center gap-2 rounded-full border border-[#e8e2d6] bg-white/90 px-4 py-2 text-sm font-semibold shadow-sm">
            <span className="text-[#5c574f]">Interest</span>
            <span aria-hidden>{lesson?.interestEmoji ?? "…"}</span>
            <span className="max-w-[140px] truncate text-[#2b2b2b] sm:max-w-[200px]">
              {lesson?.interestLabel ?? "Generating…"}
            </span>
            <span className="text-[#5c574f]">·</span>
            <span>{lesson?.gradeLabel ?? requestPayload.gradeLevel}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-[#d9d4cc] bg-white/90 text-xs font-semibold text-[#5c574f]"
            disabled={loading}
            onClick={() => void loadLesson()}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Regenerate
          </Button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full border-[#d9d4cc] bg-white/80"
            aria-label="Messages"
          >
            <Mail className="h-4 w-4 text-[#5c574f]" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full border-[#d9d4cc] bg-white/80"
            aria-label="About this lesson"
            title={`Topic: ${requestPayload.topic}`}
          >
            <Info className="h-4 w-4 text-[#5c574f]" />
          </Button>
        </div>
      </header>

      {error ? (
        <div
          className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          <p className="font-semibold">Could not load AI content</p>
          <p className="mt-1 text-red-800">{error}</p>
          <Button type="button" variant="outline" size="sm" className="mt-3 rounded-xl" onClick={() => void loadLesson()}>
            Try again
          </Button>
        </div>
      ) : null}

      <p className="mb-4 text-center text-xs text-[#8a847a] sm:text-left">
        <span className="font-medium text-[#5c574f]">Topic:</span> {requestPayload.topic}
        {lesson ? (
          <span className="ml-2 hidden sm:inline">
            ({lesson.interestLabel} {lesson.interestEmoji})
          </span>
        ) : null}
      </p>

      <nav
        className="mb-6 flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-[#ebe4d8] bg-white/70 p-2 shadow-sm"
        aria-label="Lesson format"
      >
        {demoModes.map((mode) => {
          const Icon = modeIcons[mode.id];
          const active = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              className={`flex min-w-[100px] flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-center text-xs font-semibold transition sm:min-w-0 sm:flex-none ${
                active
                  ? `${accent} bg-[#fff5ed] ring-2 ring-offset-2 ${accentRing} ring-offset-[#f7f3ec]`
                  : "text-[#6b6560] hover:bg-[#f3eee6]"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="leading-tight">{mode.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:w-[280px]">
          <div className="rounded-3xl border border-[#ebe4d8] bg-white/80 p-3 shadow-sm">
            <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wide text-[#8a847a]">
              Sections
            </p>
            {loading && !lesson ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-[#8a847a]">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Generating outline…
              </div>
            ) : (
              <ul className="space-y-1">
                {sections.map((s, i) => {
                  const selected = i === sectionIndex;
                  return (
                    <li key={`${s.id}-${i}`}>
                      <div
                        className={`rounded-2xl transition ${
                          selected ? "bg-[#f0e8dc]" : "hover:bg-[#f7f2ea]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSectionIndex(i)}
                          className="w-full rounded-2xl px-3 py-2.5 text-left"
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                selected ? "border-[#c45c26] bg-white" : "border-[#d9d4cc] bg-white"
                              }`}
                              aria-hidden
                            />
                            <span className="text-sm font-semibold leading-snug text-[#2b2b2b]">
                              {s.title}
                            </span>
                          </div>
                        </button>
                        {s.quizPending && selected ? (
                          <div className="px-3 pb-2.5 pl-10">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-full border-[#e0d5c8] bg-white text-xs font-semibold text-[#5c574f]"
                              onClick={() => setQuizOpen(true)}
                            >
                              <HelpCircle className="h-3.5 w-3.5" />
                              Take quiz to complete
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <article className="rounded-[28px] border border-[#ebe4d8] bg-white/90 p-6 shadow-sm sm:p-8">
            {loading && !lesson ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#c45c26]" aria-hidden />
                <p className="max-w-md text-sm font-medium text-[#5c574f]">
                  Generating your lesson with AI… This may take a few seconds.
                </p>
              </div>
            ) : !section ? (
              <p className="text-center text-sm text-[#8a847a]">No sections available.</p>
            ) : activeMode !== "immersive" ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#dcd3c6] bg-[#faf7f2] p-8 text-center">
                <p className="text-sm font-semibold text-[#5c574f]">{modePlaceholder}</p>
                <p className="max-w-md text-sm text-[#7a7369]">
                  This preview only includes the immersive reading layout. Other formats would plug
                  into the same shell.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setActiveMode("immersive")}
                >
                  Back to Immersive Text
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#1f1f1f] sm:text-3xl">
                    {section.title}
                  </h1>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-[#5c574f]"
                      disabled={sectionIndex <= 0}
                      onClick={() => setSectionIndex((idx) => Math.max(0, idx - 1))}
                      aria-label="Previous section"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-[#5c574f]"
                      disabled={sectionIndex >= total - 1}
                      onClick={() => setSectionIndex((idx) => Math.min(total - 1, idx + 1))}
                      aria-label="Next section"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <section className="mb-8">
                  <h2 className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[#1f1f1f]">
                    Learning objectives
                  </h2>
                  <p className="mb-2 text-sm text-[#5c574f]">
                    By the end of this section, you will be able to:
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#2b2b2b]">
                    {section.objectives.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </section>

                <div className="space-y-4">
                  {section.blocks.map((block, idx) => {
                    const key = `${section.id}-${idx}`;
                    if (block.type === "h2") {
                      return (
                        <h3 key={key} className="pt-2 text-lg font-bold text-[#1f1f1f]">
                          {block.text}
                        </h3>
                      );
                    }
                    return (
                      <div key={key} className="flex gap-3">
                        <p className="flex-1 text-sm leading-7 text-[#2b2b2b] sm:text-[15px] sm:leading-8">
                          {block.text}
                        </p>
                        {block.hint ? (
                          <button
                            type="button"
                            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${accentBg} hover:opacity-90`}
                            aria-label="Quick check"
                            onClick={() => setHintBlockIndex(idx)}
                          >
                            <span className="text-sm font-bold">?</span>
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </article>
        </main>
      </div>

      {hintBlockIndex != null && section ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hint-title"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#ebe4d8] bg-white p-6 shadow-lg">
            <h2 id="hint-title" className="text-lg font-bold text-[#1f1f1f]">
              Quick check
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5c574f]">
              Pause and restate the main idea of this paragraph in your own words. What claim or
              definition is it making, and what evidence or reasoning supports it?
            </p>
            {(() => {
              const blk = section.blocks[hintBlockIndex];
              const snippet =
                blk?.type === "p"
                  ? blk.text.slice(0, 280) + (blk.text.length > 280 ? "…" : "")
                  : null;
              return snippet ? (
                <blockquote className="mt-3 rounded-xl border border-[#ebe4d8] bg-[#faf7f2] p-3 text-sm italic text-[#2b2b2b]">
                  {snippet}
                </blockquote>
              ) : null;
            })()}
            <button
              type="button"
              className={`mt-5 w-full rounded-2xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 ${accentBg}`}
              onClick={() => setHintBlockIndex(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {quizOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-title"
        >
          <div className="w-full max-w-md rounded-3xl border border-[#ebe4d8] bg-white p-6 shadow-lg">
            <h2 id="quiz-title" className="text-lg font-bold text-[#1f1f1f]">
              Section quiz
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5c574f]">
              Hook this button to your mission engine or assessment service. The reading content
              above was generated by AI for this preview.
            </p>
            <div className="mt-5 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => setQuizOpen(false)}
              >
                Later
              </Button>
              <button
                type="button"
                className={`flex-1 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 ${accentBg}`}
                onClick={() => setQuizOpen(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
