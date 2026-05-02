"use client";

import { motion } from "framer-motion";
import { cn } from "@mindorbit/lib";

export type GridModelProps = {
  rows: number;
  columns: number;
  selectedCells: number[];
  onChange: (indices: number[]) => void;
  className?: string;
};

export function GridModel({ rows, columns, selectedCells, onChange, className }: GridModelProps) {
  const set = new Set(selectedCells);
  const total = rows * columns;

  const toggle = (idx: number) => {
    const next = new Set(set);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    onChange([...next].sort((a, b) => a - b));
  };

  return (
    <div className={cn("mx-auto w-full max-w-md", className)}>
      <div
        className="grid gap-1.5 p-2 sm:gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }, (_, idx) => {
          const on = set.has(idx);
          return (
            <motion.button
              key={idx}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(idx)}
              whileTap={{ scale: 0.92 }}
              className={cn(
                "aspect-square rounded-xl border transition-colors",
                on
                  ? "border-cyan-300/70 bg-gradient-to-br from-cyan-400/90 to-blue-600/90 shadow-md shadow-cyan-500/25"
                  : "border-white/10 bg-zinc-800/80 hover:border-violet-400/35",
              )}
            />
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm text-zinc-400">
        {selectedCells.length} of {total} cells shaded
      </p>
    </div>
  );
}
