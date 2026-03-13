"use client";

import { cn } from "@mindorbit/ui";

interface MissionProgressBarProps {
  current: number;
  total: number;
  completedIndices?: Set<number>;
  className?: string;
}

export function MissionProgressBar({
  current,
  total,
  completedIndices = new Set(),
  className,
}: MissionProgressBarProps) {
  if (total <= 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Step {current + 1} of {total}</span>
        <span>{Math.round((Math.max(completedIndices.size, current + 1) / total) * 100)}%</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i < current
                ? "bg-primary"
                : i === current
                  ? "bg-primary/80"
                  : completedIndices.has(i)
                    ? "bg-primary/60"
                    : "bg-muted"
            )}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
