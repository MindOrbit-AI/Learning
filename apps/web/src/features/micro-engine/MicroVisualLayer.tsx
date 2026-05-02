"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@mindorbit/ui";
import type { RuntimeMicroStep } from "./types";

export function MicroVisualLayer({
  step,
  phase,
}: {
  step: RuntimeMicroStep;
  phase: "idle" | "correct" | "wrong";
}) {
  const before = step.visualStateBefore;
  const after = step.visualStateAfter;
  const snippet =
    (after?.diagramSnippet as string) ??
    (before?.diagramSnippet as string) ??
    (step.interactionConfig.equation as string) ??
    null;
  if (!snippet) return null;

  const dim = phase === "idle" ? Boolean(before?.dim) : false;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id + phase}
        initial={{ opacity: 0.6, y: 4 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: phase === "correct" ? 1.02 : 1,
          boxShadow:
            phase === "correct"
              ? "0 0 24px rgba(34, 197, 94, 0.35)"
              : phase === "wrong"
                ? "0 0 0 rgba(0,0,0,0)"
                : "0 0 0 rgba(0,0,0,0)",
        }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={cn(
          "rounded-2xl border px-4 py-3 font-mono text-sm",
          dim ? "border-muted-foreground/30 bg-muted/40 text-muted-foreground" : "border-primary/30 bg-primary/5",
          phase === "correct" && "border-emerald-500/60 text-emerald-900 dark:text-emerald-100"
        )}
      >
        {snippet}
      </motion.div>
    </AnimatePresence>
  );
}
