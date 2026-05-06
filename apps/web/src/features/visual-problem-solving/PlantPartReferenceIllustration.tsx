"use client";

import { cn } from "@mindorbit/ui";
import { stripMathTeachingLabel } from "./mathLabelDisplay";

type Props = {
  totalParts: number;
  /** When set (expected shaded count &lt; totalParts), show only this many leaves for quantity cues; tap grid stays full. */
  referenceLeafCount?: number | null;
  cellLabels?: string[];
  gridCols?: number | null;
  className?: string;
};

/**
 * Read-only “plant” reference: leaf-shaped markers for the tap model — usually one per part, or fewer
 * when `referenceLeafCount` reflects “how many parts matter” while the grid below still has `totalParts` cells.
 */
export function PlantPartReferenceIllustration({
  totalParts,
  referenceLeafCount,
  cellLabels,
  gridCols,
  className,
}: Props) {
  const n = Math.max(1, Math.round(totalParts));
  const k =
    referenceLeafCount != null && Number.isFinite(referenceLeafCount)
      ? Math.min(n, Math.max(1, Math.round(Number(referenceLeafCount))))
      : n;
  const fixedCols = gridCols != null && gridCols > 0 ? Math.min(16, Math.round(gridCols)) : null;
  const dense = k > 24;
  const extraDense = k > 60;

  const labels: string[] = [];
  for (let i = 0; i < k; i++) {
    const raw = cellLabels?.[i];
    labels.push(raw != null && String(raw).trim() !== "" ? stripMathTeachingLabel(String(raw)) : String(i + 1));
  }

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-lg rounded-xl border border-muted bg-gradient-to-b from-emerald-50/90 to-background p-3 shadow-sm dark:from-emerald-950/40 dark:to-background",
        k > 36 && "max-h-[min(20rem,44vh)] overflow-y-auto overscroll-contain",
        className
      )}
      role="img"
      aria-label={
        k < n
          ? `Reference: ${k} participating leaves of ${n} parts; match by shading ${k} cells below.`
          : `Reference plant with ${n} labeled parts, same layout as the cells below.`
      }
    >
      <p className="mb-2 text-center text-[11px] font-medium leading-snug text-muted-foreground">
        {k < n ? (
          <>
            Shade <span className="font-semibold text-foreground">{k}</span> of{" "}
            <span className="font-semibold text-foreground">{n}</span> cells below to match the story.{" "}
            <span className="font-semibold text-foreground">{k}</span> leaves here mark that count (labels follow the
            same reading order as the grid).
          </>
        ) : (
          <>
            {n} part{n === 1 ? "" : "s"} — same order as the cells below (rows, left to right).
          </>
        )}
      </p>
      <div
        className={cn(
          "grid gap-2",
          fixedCols == null && extraDense && "grid-cols-10",
          fixedCols == null && dense && !extraDense && "grid-cols-6 sm:grid-cols-8",
          fixedCols == null && !dense && "grid-cols-4 sm:grid-cols-6"
        )}
        style={
          fixedCols != null
            ? { gridTemplateColumns: `repeat(${Math.min(fixedCols, k)}, minmax(0, 1fr))` }
            : undefined
        }
      >
        {Array.from({ length: k }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-full max-w-[3.25rem] rounded-[100%_100%_70%_70%] border border-emerald-800/25 bg-gradient-to-b from-green-400 to-green-700 shadow-sm",
                extraDense && "h-8 max-w-[2rem]",
                dense && !extraDense && "h-11 max-w-[2.75rem]",
                !dense && "h-14"
              )}
              aria-hidden
            />
            <span
              className={cn(
                "max-w-full truncate text-center font-semibold leading-tight text-foreground",
                extraDense && "text-[9px]",
                dense && !extraDense && "text-[10px]",
                !dense && "text-[11px]"
              )}
              title={labels[i]}
            >
              {labels[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
