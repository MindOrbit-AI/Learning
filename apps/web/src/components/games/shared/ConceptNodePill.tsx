"use client";

import { cn } from "@mindorbit/ui";

export function ConceptNodePill({ label, tone = "cyan" }: { label: string; tone?: "cyan" | "violet" | "amber" }) {
  const tones = {
    cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-100",
    violet: "border-violet-500/40 bg-violet-500/10 text-violet-100",
    amber: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", tones[tone])}>
      {label}
    </span>
  );
}
