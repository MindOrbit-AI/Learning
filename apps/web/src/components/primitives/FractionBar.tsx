"use client";

import { motion } from "framer-motion";
import { cn } from "@mindorbit/lib";

export type FractionBarProps = {
  totalParts: number;
  selectedParts: number[];
  onChange: (indices: number[]) => void;
  className?: string;
};

export function FractionBar({ totalParts, selectedParts, onChange, className }: FractionBarProps) {
  const set = new Set(selectedParts);
  const toggle = (i: number) => {
    const next = new Set(set);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    onChange([...next].sort((a, b) => a - b));
  };

  return (
    <div className={cn("flex w-full max-w-xl flex-col gap-4", className)}>
      <div className="flex gap-1.5 sm:gap-2">
        {Array.from({ length: totalParts }, (_, i) => {
          const on = set.has(i);
          return (
            <motion.button
              key={i}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(i)}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "relative h-28 flex-1 rounded-2xl border-2 transition-colors sm:h-32",
                on
                  ? "border-amber-300/80 bg-gradient-to-b from-amber-400/90 to-orange-500/90 shadow-lg shadow-amber-500/30"
                  : "border-white/15 bg-zinc-800/80 hover:border-violet-400/40 hover:bg-zinc-800",
              )}
            >
              <span className="sr-only">Part {i + 1}</span>
            </motion.button>
          );
        })}
      </div>
      <p className="text-center text-sm text-zinc-400">
        {selectedParts.length} of {totalParts} shaded
      </p>
    </div>
  );
}
