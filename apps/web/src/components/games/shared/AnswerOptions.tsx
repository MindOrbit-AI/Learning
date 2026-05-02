"use client";

import { motion } from "framer-motion";
import { cn } from "@mindorbit/ui";

export function AnswerOptions({
  choices,
  selected,
  disabled,
  correctAnswer,
  reveal,
  onSelect,
}: {
  choices: string[];
  selected: string | null;
  disabled?: boolean;
  correctAnswer?: string;
  reveal?: boolean;
  onSelect: (c: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {choices.map((c, i) => {
        const isSel = selected === c;
        const isCorrect = reveal && correctAnswer === c;
        const isWrong = reveal && isSel && correctAnswer !== c;
        return (
          <motion.button
            key={`${c}-${i}`}
            type="button"
            layout
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            disabled={disabled}
            onClick={() => onSelect(c)}
            className={cn(
              "rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition-colors",
              "bg-zinc-900/80 text-zinc-100 border-zinc-700 hover:border-cyan-500/50 hover:bg-zinc-800/90",
              isSel && !reveal && "border-cyan-400 ring-2 ring-cyan-500/30",
              isCorrect && "border-emerald-500 bg-emerald-950/50 ring-emerald-500/30",
              isWrong && "border-rose-500 bg-rose-950/40"
            )}
          >
            {c}
          </motion.button>
        );
      })}
    </div>
  );
}
