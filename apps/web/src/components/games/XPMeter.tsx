"use client";

import { cn } from "@mindorbit/ui";
import { levelFromXp, xpThresholdForLevel } from "@mindorbit/lib";

export function XPMeter({ xp, className }: { xp: number; className?: string }) {
  const level = levelFromXp(xp);
  const floor = xpThresholdForLevel(level);
  const ceiling = xpThresholdForLevel(level + 1);
  const span = Math.max(1, ceiling - floor);
  const ratio = (xp - floor) / span;
  return (
    <div className={cn("w-full max-w-xs space-y-1", className)}>
      <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        <span>Level {level}</span>
        <span className="text-cyan-300">{xp} XP</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all"
          style={{ width: `${Math.min(100, ratio * 100)}%` }}
        />
      </div>
    </div>
  );
}
