"use client";

import { cn } from "@mindorbit/lib";
import { motion } from "framer-motion";

type ProgressProps = {
  value: number;
  max?: number;
  className?: string;
};

export function Progress({ value, max = 1, className }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={cn(
        "h-3 w-full overflow-hidden rounded-full bg-zinc-800 ring-1 ring-inset ring-white/10",
        className,
      )}
    >
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-300"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
