"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, ClipboardList, Network } from "lucide-react";

const DEMOS: {
  title: string;
  icon: typeof ClipboardList;
  bars: number[];
}[] = [
  {
    title: "Diagnostic",
    icon: ClipboardList,
    bars: [0.35, 0.55, 0.4, 0.7, 0.45],
  },
  {
    title: "Mastery map",
    icon: Network,
    bars: [0.5, 0.5, 0.5, 0.5, 0.5],
  },
  {
    title: "Training session",
    icon: Activity,
    bars: [0.6, 0.75, 0.5, 0.85, 0.55],
  },
  {
    title: "Progress",
    icon: BarChart3,
    bars: [0.45, 0.5, 0.65, 0.72, 0.8],
  },
];

export function ProductDemoSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {DEMOS.map(({ title, icon: Icon, bars }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900/50 shadow-lg"
        >
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-zinc-950/80 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
            <span className="h-2 w-2 rounded-full bg-zinc-700" />
            <Icon className="ml-auto h-3.5 w-3.5 text-zinc-600" aria-hidden />
          </div>
          <div className="space-y-3 p-4">
            <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              {title}
            </p>
            <div className="flex h-24 items-end justify-between gap-1.5">
              {bars.map((h, j) => (
                <motion.div
                  key={j}
                  className="w-full rounded-sm bg-gradient-to-t from-primary/20 to-primary/80"
                  initial={{ height: "8%" }}
                  whileInView={{ height: `${Math.round(h * 100)}%` }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.15 + j * 0.06 + i * 0.05,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.04] transition group-hover:ring-primary/20" />
        </motion.div>
      ))}
    </div>
  );
}
