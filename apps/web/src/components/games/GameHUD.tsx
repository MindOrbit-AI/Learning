"use client";

import { motion } from "framer-motion";
import { XPMeter } from "@/components/games/XPMeter";

export function GameHUD({
  title,
  subtitle,
  score,
  sessionXp,
  userXp,
}: {
  title: string;
  subtitle?: string;
  score: number;
  sessionXp: number;
  userXp?: number;
}) {
  return (
    <motion.header
      layout
      className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400/90">MindOrbit Engine</p>
        <h1 className="mt-1 text-xl font-black text-zinc-50 md:text-2xl">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-xl text-sm text-zinc-400">{subtitle}</p> : null}
      </div>
      <div className="flex flex-col items-stretch gap-3 md:items-end">
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Score</p>
            <p className="text-2xl font-black text-emerald-300">{Math.round(score)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Session XP</p>
            <p className="text-2xl font-black text-cyan-300">+{sessionXp}</p>
          </div>
        </div>
        {userXp != null ? <XPMeter xp={userXp} /> : null}
      </div>
    </motion.header>
  );
}
