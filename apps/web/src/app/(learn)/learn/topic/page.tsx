import type { Metadata } from "next";
import { Suspense } from "react";
import { LearnYourWayDemo } from "@/features/learn-your-way/learn-your-way-demo";

/** Next may pass `string | string[]` for repeated keys. */
function firstQueryValue(v: string | string[] | undefined): string | undefined {
  if (v == null) return undefined;
  const s = Array.isArray(v) ? v[0] : v;
  const t = typeof s === "string" ? s.trim() : "";
  return t.length > 0 ? t : undefined;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI immersive reader | MindOrbit Learn",
  description: "Multi-format lesson shell with AI-generated sections, objectives, and reading content.",
};

export default async function LearnDemoPage({
  searchParams,
}: {
  searchParams: Promise<{
    topic?: string | string[];
    grade?: string | string[];
    gradeLevel?: string | string[];
    sections?: string | string[];
  }>;
}) {
  const sp = await searchParams;
  const sectionsStr = firstQueryValue(sp.sections);
  const sectionsRaw = sectionsStr != null ? Number.parseInt(sectionsStr, 10) : undefined;
  const initialSectionCount =
    sectionsRaw != null && !Number.isNaN(sectionsRaw) ? sectionsRaw : undefined;
  const initialTopic = firstQueryValue(sp.topic);
  const initialGrade =
    firstQueryValue(sp.grade) ?? firstQueryValue(sp.gradeLevel) ?? undefined;

  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center px-4 pt-24 text-sm font-medium text-[#5c574f]">
          Loading lesson…
        </div>
      }
    >
      <LearnYourWayDemo
        initialTopic={initialTopic}
        initialGrade={initialGrade}
        initialSectionCount={initialSectionCount}
      />
    </Suspense>
  );
}
