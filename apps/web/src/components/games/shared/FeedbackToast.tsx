"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@mindorbit/ui";

export function FeedbackToast({
  message,
  variant = "info",
}: {
  message: string | null;
  variant?: "success" | "error" | "info";
}) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg",
            variant === "success" && "border-emerald-500/40 bg-emerald-950/60 text-emerald-50",
            variant === "error" && "border-rose-500/40 bg-rose-950/60 text-rose-50",
            variant === "info" && "border-cyan-500/40 bg-cyan-950/50 text-cyan-50"
          )}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
