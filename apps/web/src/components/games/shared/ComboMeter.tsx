"use client";

import { motion, AnimatePresence } from "framer-motion";

export function ComboMeter({ combo }: { combo: number }) {
  if (combo < 2) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1 text-center text-xs font-bold uppercase tracking-widest text-amber-200"
      >
        Combo ×{combo}
      </motion.div>
    </AnimatePresence>
  );
}
