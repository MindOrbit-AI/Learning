"use client";

import { cn } from "@mindorbit/ui";

export function GameProgress({
  label,
  value,
  max,
  className,
}: {
  label: string;
  value: number;
  max: number;
  className?: string;
}) {
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span>
          {value} / {max}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
