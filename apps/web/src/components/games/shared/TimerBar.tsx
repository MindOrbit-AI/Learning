"use client";

import { cn } from "@mindorbit/ui";

export function TimerBar({
  remainingRatio,
  className,
}: {
  /** 1 = full time left, 0 = empty */
  remainingRatio: number;
  className?: string;
}) {
  const r = Math.max(0, Math.min(1, remainingRatio));
  return (
    <div className={cn("h-3 w-full overflow-hidden rounded-full bg-zinc-800", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-200",
          r > 0.35 ? "bg-gradient-to-r from-cyan-500 to-emerald-400" : "bg-gradient-to-r from-amber-500 to-rose-500"
        )}
        style={{ width: `${r * 100}%` }}
      />
    </div>
  );
}
