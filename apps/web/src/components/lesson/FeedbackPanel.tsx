"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { cn } from "@mindorbit/lib";

type Props = {
  open: boolean;
  isCorrect: boolean;
  message: string;
  className?: string;
};

export function FeedbackPanel({ open, isCorrect, message, className }: Props) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={cn("mt-6", className)}
        >
          <Card
            className={cn(
              "border-2",
              isCorrect
                ? "border-emerald-400/40 bg-emerald-950/40 shadow-emerald-500/20"
                : "border-rose-400/35 bg-rose-950/35 shadow-rose-500/15",
            )}
          >
            <p className="text-sm font-semibold text-white">{isCorrect ? "Nice work" : "Not quite"}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-200">{message}</p>
          </Card>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
