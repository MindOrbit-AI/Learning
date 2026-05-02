"use client";

import { motion } from "framer-motion";
import { Award, Sparkles, Zap } from "lucide-react";
import { cn } from "@mindorbit/ui";

const icons: Record<string, typeof Zap> = {
  zap: Zap,
  trophy: Award,
  rocket: Sparkles,
};

export function RewardBadge({
  name,
  description,
  iconKey,
}: {
  name: string;
  description?: string | null;
  iconKey?: string | null;
}) {
  const Icon = (iconKey && icons[iconKey]) || Sparkles;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-zinc-900/80 p-4"
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-200">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-bold text-amber-100">{name}</p>
        {description ? <p className="mt-1 text-xs text-zinc-400">{description}</p> : null}
      </div>
    </motion.div>
  );
}
