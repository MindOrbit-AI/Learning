"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@mindorbit/lib";

type Props = {
  hint?: string;
  open: boolean;
  onToggle: () => void;
  className?: string;
};

export function HintPanel({ hint, open, onToggle, className }: Props) {
  if (!hint) return null;
  return (
    <div className={cn("mt-4", className)}>
      <Button type="button" variant="ghost" size="sm" onClick={onToggle} className="text-violet-200">
        {open ? "Hide hint" : "Show hint"}
      </Button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 overflow-hidden rounded-xl border border-violet-500/25 bg-violet-950/40 px-4 py-3 text-sm text-violet-100"
          >
            {hint}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
