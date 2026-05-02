"use client";

import { cn } from "@mindorbit/ui";

export function HealthBar({
  label,
  value,
  max = 100,
  colorClass = "from-emerald-500 to-cyan-400",
}: {
  label: string;
  value: number;
  max?: number;
  colorClass?: string;
}) {
  const ratio = Math.max(0, Math.min(1, value / max));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium text-zinc-400">
        <span>{label}</span>
        <span>
          {Math.round(value)} / {max}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-300", colorClass)}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
