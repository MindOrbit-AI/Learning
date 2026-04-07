import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";
import { k12Grades, demoHrefForTopic } from "@/features/learn-your-way/k12-curriculum";

export const metadata: Metadata = {
  title: "K–12 topics | MindOrbit Learn",
  description: "Browse topics by grade and subject, then open an AI-generated immersive lesson.",
};

export default function LearnSubjectsPage() {
  return (
    <div className="mx-auto min-h-screen max-w-[1100px] px-4 pb-16 pt-8 sm:px-6">
      <header className="mb-10 flex flex-col gap-4 border-b border-[#ebe4d8] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard"
              className="text-lg font-extrabold tracking-tight text-[#1f1f1f] hover:opacity-80"
            >
              MindOrbit
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#d9d4cc] bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b6560]">
              <Sparkles className="h-3 w-3" aria-hidden />
              Learn
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1f1f1f] sm:text-4xl">
            K–12 topics
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#5c574f]">
            Pick a grade, then a subject. Each topic opens the immersive demo and generates a lesson
            for that topic and grade level.
          </p>
        </div>
      </header>

      <nav
        className="mb-10 flex flex-wrap gap-2 rounded-3xl border border-[#ebe4d8] bg-white/70 p-3 shadow-sm"
        aria-label="Jump to grade"
      >
        {k12Grades.map((g) => (
          <a
            key={g.id}
            href={`#grade-${g.id}`}
            className="rounded-full border border-transparent bg-[#faf7f2] px-3 py-1.5 text-xs font-semibold text-[#5c574f] transition hover:border-[#dcd3c6] hover:bg-white"
          >
            {g.order === 0 ? "K" : g.label.replace("Grade ", "G")}
          </a>
        ))}
      </nav>

      <div className="space-y-14">
        {k12Grades.map((grade) => (
          <section
            key={grade.id}
            id={`grade-${grade.id}`}
            className="scroll-mt-24"
            aria-labelledby={`heading-grade-${grade.id}`}
          >
            <h2
              id={`heading-grade-${grade.id}`}
              className="mb-6 flex items-baseline gap-3 border-b border-[#ebe4d8] pb-3 text-xl font-extrabold text-[#1f1f1f]"
            >
              {grade.label}
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8a847a]">
                {grade.subjects.length} subjects
              </span>
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              {grade.subjects.map((subject) => (
                <div
                  key={`${grade.id}-${subject.id}`}
                  className="rounded-3xl border border-[#ebe4d8] bg-white/85 p-5 shadow-sm"
                >
                  <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#c45c26]">
                    {subject.name}
                  </h3>
                  <ul className="space-y-2">
                    {subject.topics.map((topic) => (
                      <li key={topic.id}>
                        <Link
                          href={demoHrefForTopic(grade.label, topic.title)}
                          className="block rounded-2xl border border-transparent px-3 py-2.5 text-sm font-semibold leading-snug text-[#2b2b2b] transition hover:border-[#e0d5c8] hover:bg-[#faf7f2]"
                        >
                          {topic.title}
                          <span className="mt-0.5 block text-[11px] font-medium text-[#8a847a]">
                            {grade.label}
                            <span aria-hidden> · </span>
                            Generate lesson →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
