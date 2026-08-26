"use client";

import { useEffect, useState } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@mindorbit/ui";

const STATE_COLORS: Record<string, string> = {
  weak: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  learning: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  mastered: "text-green-600 bg-green-100 dark:bg-green-900/30",
  untouched: "text-muted-foreground bg-muted",
};

const STATE_LABELS: Record<string, string> = {
  weak: "Needs work",
  learning: "In progress",
  mastered: "Mastered",
  untouched: "Not assessed",
};

export function MasteryStateChange({
  nodeTitle,
  stateBefore,
  stateAfter,
  masteryBefore,
  masteryAfter,
  animate = true,
}: {
  nodeTitle: string;
  stateBefore: string;
  stateAfter: string;
  masteryBefore: number;
  masteryAfter: number;
  animate?: boolean;
}) {
  const [show, setShow] = useState(!animate);
  const improved = masteryAfter > masteryBefore || stateAfter !== stateBefore;

  useEffect(() => {
    if (!animate) return;
    const t = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(t);
  }, [animate]);

  return (
    <div
      className={cn(
        "rounded-xl border bg-card/60 p-4 transition-all duration-700",
        show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        improved ? "border-green-500/30" : "border-border"
      )}
    >
      <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-primary">
        <TrendingUp className="h-4 w-4" />
        Mastery update · {nodeTitle}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div className="text-center">
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-0.5 text-xs font-bold",
              STATE_COLORS[stateBefore] ?? STATE_COLORS.untouched
            )}
          >
            {STATE_LABELS[stateBefore] ?? stateBefore}
          </span>
          <p className="mt-1 text-lg font-bold tabular-nums">{Math.round(masteryBefore)}%</p>
        </div>

        <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />

        <div className="text-center">
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-0.5 text-xs font-bold",
              STATE_COLORS[stateAfter] ?? STATE_COLORS.untouched
            )}
          >
            {STATE_LABELS[stateAfter] ?? stateAfter}
          </span>
          <p className="mt-1 text-lg font-bold tabular-nums text-primary">
            {Math.round(masteryAfter)}%
          </p>
        </div>
      </div>
    </div>
  );
}
