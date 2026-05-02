"use client";

import { motion } from "framer-motion";
import { cn } from "@mindorbit/lib";

/** Stable ids for `choice_match` validation. */
export type VennTwoRegionId = "onlyA" | "onlyB" | "intersection" | "outside";

export type VennTwoProps = {
  labelA: string;
  labelB: string;
  choice: VennTwoRegionId | "";
  onChange: (region: VennTwoRegionId) => void;
  disabled?: boolean;
  className?: string;
};

const OPTIONS: { id: VennTwoRegionId; title: string; subtitle: string }[] = [
  { id: "onlyA", title: "A only", subtitle: "Left only" },
  { id: "onlyB", title: "B only", subtitle: "Right only" },
  { id: "intersection", title: "A ∩ B", subtitle: "Both" },
  { id: "outside", title: "Neither", subtitle: "Outside both" },
];

export function VennTwo({ labelA, labelB, choice, onChange, disabled, className }: VennTwoProps) {
  return (
    <div className={cn("flex w-full max-w-xl flex-col items-center gap-6", className)}>
      <svg viewBox="0 0 280 160" className="h-40 w-full max-w-sm text-zinc-100" aria-hidden>
        <circle cx="108" cy="88" r="62" className="fill-violet-500/25 stroke-violet-400/70" strokeWidth="2" />
        <circle cx="172" cy="88" r="62" className="fill-cyan-500/20 stroke-cyan-400/70" strokeWidth="2" />
        <text x="72" y="92" className="fill-zinc-200 text-[13px] font-medium">
          {labelA}
        </text>
        <text x="196" y="92" className="fill-zinc-200 text-[13px] font-medium">
          {labelB}
        </text>
      </svg>
      <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
        {OPTIONS.map((opt) => {
          const on = choice === opt.id;
          return (
            <motion.button
              key={opt.id}
              type="button"
              disabled={disabled}
              aria-pressed={on}
              whileTap={{ scale: disabled ? 1 : 0.97 }}
              onClick={() => onChange(opt.id)}
              className={cn(
                "rounded-xl border-2 px-2 py-3 text-center text-sm transition-colors",
                on
                  ? "border-amber-300/80 bg-amber-500/20 text-amber-100"
                  : "border-white/15 bg-zinc-800/80 text-zinc-300 hover:border-violet-400/40",
              )}
            >
              <span className="block font-medium">{opt.title}</span>
              <span className="mt-0.5 block text-xs text-zinc-500">{opt.subtitle}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
