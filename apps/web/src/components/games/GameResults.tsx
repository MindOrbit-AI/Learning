"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@mindorbit/ui";
import { RewardBadge } from "@/components/games/RewardBadge";

export type GameResultSummary = {
  score: number;
  xpEarned: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  strongConcepts: string[];
  weakConcepts: string[];
  rewards: Array<{ id?: string; type: string; name: string; description: string | null; icon: string | null }>;
  recommendation: { type: string; label: string; href: string };
  gameTitle: string;
};

export function GameResults({ summary }: { summary: GameResultSummary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl space-y-8"
    >
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">Mission debrief</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-50">{summary.gameTitle}</h1>
        <p className="mt-2 text-zinc-400">Here is how your cognition shifted this session.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { k: "Score", v: Math.round(summary.score) },
          { k: "XP earned", v: `+${summary.xpEarned}` },
          { k: "Accuracy", v: `${Math.round(summary.accuracy)}%` },
        ].map((x) => (
          <div
            key={x.k}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-center shadow-inner"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{x.k}</p>
            <p className="mt-2 text-2xl font-black text-zinc-50">{x.v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-4">
          <p className="text-xs font-bold uppercase text-emerald-300">Strong signals</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-200">
            {summary.strongConcepts.length ? (
              summary.strongConcepts.map((c) => <li key={c}>· {c}</li>)
            ) : (
              <li className="text-zinc-500">Keep practicing — strengths will surface.</li>
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-rose-500/25 bg-rose-950/20 p-4">
          <p className="text-xs font-bold uppercase text-rose-300">Growth edges</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-200">
            {summary.weakConcepts.length ? (
              summary.weakConcepts.map((c) => <li key={c}>· {c}</li>)
            ) : (
              <li className="text-zinc-500">No weak nodes flagged this run.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-200">Rewards</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {summary.rewards.map((r, i) => (
            <RewardBadge
              key={r.id ?? `${r.name}-${i}`}
              name={r.name}
              description={r.description}
              iconKey={r.icon}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5">
        <p className="text-xs font-bold uppercase text-cyan-200">Recommended next</p>
        <p className="mt-2 text-lg font-semibold text-zinc-50">{summary.recommendation.label}</p>
        <Button asChild className="mt-4 rounded-xl bg-cyan-600 hover:bg-cyan-500">
          <Link href={summary.recommendation.href}>Continue</Link>
        </Button>
      </div>

      <div className="flex justify-center gap-3">
        <Button asChild variant="outline" className="rounded-xl border-zinc-700">
          <Link href="/games">New game</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl border-zinc-700">
          <Link href="/mastery-map">Mastery Map</Link>
        </Button>
      </div>
    </motion.div>
  );
}
