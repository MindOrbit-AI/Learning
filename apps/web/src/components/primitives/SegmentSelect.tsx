"use client";

import { motion } from "framer-motion";
import { cn } from "@mindorbit/lib";

export type SegmentItem = { id: string; label: string };

export type SegmentSelectProps = {
  segments: SegmentItem[];
  choice: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  className?: string;
};

export function SegmentSelect({ segments, choice, onChange, disabled, className }: SegmentSelectProps) {
  if (!segments.length) {
    return <p className="text-center text-sm text-zinc-500">No segments configured.</p>;
  }

  return (
    <div className={cn("flex w-full max-w-2xl flex-wrap justify-center gap-2", className)}>
      {segments.map((s) => {
        const on = choice === s.id;
        return (
          <motion.button
            key={s.id}
            type="button"
            disabled={disabled}
            aria-pressed={on}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => onChange(s.id)}
            className={cn(
              "min-h-[3.25rem] min-w-[5rem] flex-1 rounded-xl border-2 px-3 py-2 text-center text-sm font-medium transition-colors sm:min-w-[6rem]",
              on
                ? "border-violet-400/80 bg-violet-500/25 text-violet-100 shadow-lg shadow-violet-500/20"
                : "border-white/15 bg-zinc-800/80 text-zinc-200 hover:border-violet-400/35",
            )}
          >
            {s.label}
          </motion.button>
        );
      })}
    </div>
  );
}
