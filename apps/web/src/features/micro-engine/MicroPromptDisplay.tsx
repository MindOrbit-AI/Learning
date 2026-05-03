"use client";

import { cn } from "@mindorbit/ui";
import { stripMathTeachingLabel } from "@/features/visual-problem-solving/mathLabelDisplay";

type RowBlock = { rowLabel: string; cells: string[] };
type Segment = { type: "text"; value: string } | { type: "grid"; rows: RowBlock[] };

/** Split prompt into plain text + contiguous `1: [A, B]` row blocks for richer layout. */
function segmentPrompt(prompt: string): Segment[] {
  const matches = [...prompt.matchAll(/(\d+)\s*:\s*\[([^\]]+)\]/g)];
  if (matches.length === 0) return [{ type: "text", value: prompt }];

  const segments: Segment[] = [];
  let cursor = 0;
  let i = 0;

  while (i < matches.length) {
    const first = matches[i]!;
    const start = first.index ?? 0;
    if (start > cursor) {
      const t = prompt.slice(cursor, start);
      if (t.trim()) segments.push({ type: "text", value: t });
    }

    const rows: RowBlock[] = [];
    let j = i;
    while (j < matches.length) {
      const m = matches[j]!;
      if (j > i) {
        const prev = matches[j - 1]!;
        const between = prompt.slice((prev.index ?? 0) + prev[0].length, m.index ?? 0);
        if (!/^\s*$/.test(between)) break;
      }
      rows.push({
        rowLabel: String(m[1]),
        cells: String(m[2])
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      j++;
    }

    const last = matches[j - 1]!;
    segments.push({ type: "grid", rows });
    cursor = (last.index ?? 0) + last[0].length;
    i = j;
  }

  if (cursor < prompt.length) {
    const t = prompt.slice(cursor);
    if (t.trim()) segments.push({ type: "text", value: t });
  }

  return segments;
}

export function MicroPromptDisplay({
  text,
  className,
}: {
  text: string;
  /** Applied to each text segment (grid has its own card styles). */
  className?: string;
}) {
  const segments = segmentPrompt(text);
  if (segments.length === 1 && segments[0]!.type === "text") {
    return <p className={className}>{segments[0]!.value}</p>;
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {segments.map((s, idx) =>
        s.type === "text" ? (
          <p key={idx} className={cn("max-w-prose whitespace-pre-wrap text-center", className)}>
            {s.value}
          </p>
        ) : (
          <div
            key={idx}
            className="w-full max-w-lg rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.06] to-muted/30 px-4 py-4 shadow-inner"
          >
            <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-primary/80">Array</p>
            <div className="flex flex-col gap-3">
              {s.rows.map((row) => (
                <div key={row.rowLabel} className="flex min-w-0 items-stretch gap-2 sm:gap-3">
                  <div className="flex w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-black tabular-nums text-primary">
                    {row.rowLabel}
                  </div>
                  <div className="min-w-0 flex-1 overflow-x-auto rounded-xl border border-muted/60 bg-background/90 px-2 py-2">
                    <div className="flex w-max min-w-full gap-1.5 sm:gap-2">
                      {row.cells.map((cell, ci) => (
                        <span
                          key={ci}
                          className="flex min-h-[2.5rem] min-w-[2.25rem] items-center justify-center rounded-lg border border-muted bg-card px-2 py-1 text-center text-sm font-semibold shadow-sm sm:min-w-[2.5rem] sm:px-3 sm:text-base"
                        >
                          {stripMathTeachingLabel(cell)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
