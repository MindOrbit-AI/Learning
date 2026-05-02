"use client";

import { motion } from "framer-motion";
import { cn } from "@mindorbit/ui";
import type { GameModeMeta } from "@/features/interactive-games/game-modes";

export function GameModeCard({
  meta,
  selected,
  onSelect,
}: {
  meta: GameModeMeta;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = meta.icon;
  return (
    <motion.button
      type="button"
      layout
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-gradient-to-br p-4 text-left shadow-lg transition-colors",
        meta.accent,
        selected ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-zinc-950" : "hover:border-cyan-500/40"
      )}
    >
      {!meta.implemented ? (
        <span className="absolute right-3 top-3 rounded-full bg-zinc-900/90 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-400">
          Soon
        </span>
      ) : null}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/30 text-cyan-100">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-base font-bold text-zinc-50">{meta.label}</h3>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{meta.cognitive}</p>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-zinc-400">{meta.description}</p>
    </motion.button>
  );
}
