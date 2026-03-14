"use client";

import { useState } from "react";
import { cn } from "@mindorbit/ui";
import type { TapHighlightBlockConfig } from "@/features/lesson-blocks/types/block.types";

interface TapHighlightBlockProps {
  config: TapHighlightBlockConfig;
  onAnswerChange: (answer: string[]) => void;
  submittedAnswer?: string[] | null;
  validationResult?: import("@/features/lesson-blocks/types/validation.types").ValidationResult | null;
  disabled?: boolean;
}

export function TapHighlightBlock({
  config,
  onAnswerChange,
  submittedAnswer,
  validationResult,
  disabled = false,
}: TapHighlightBlockProps) {
  const [selected, setSelected] = useState<string[]>(() => submittedAnswer ?? []);

  function toggle(id: string) {
    if (disabled) return;
    const next = config.highlightOrder
      ? selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
      : selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id];
    setSelected(next);
    onAnswerChange(next);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {config.highlightOrder
          ? "Tap elements in the correct order"
          : "Tap to highlight the relevant elements"}
      </p>
      <div className="flex flex-wrap gap-2">
        {config.targets.map((t, idx) => (
          <button
            key={t.id}
            type="button"
            onClick={() => toggle(t.id)}
            disabled={disabled}
            className={cn(
              "rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all",
              selected.includes(t.id)
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted hover:border-primary/50 hover:bg-accent/20",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {config.highlightOrder && selected.includes(t.id) && (
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs">
                {selected.indexOf(t.id) + 1}
              </span>
            )}
            {t.label}
          </button>
        ))}
      </div>
      {validationResult && (
        <p
          className={cn(
            "text-sm font-medium",
            validationResult.isCorrect ? "text-emerald-600" : "text-rose-600"
          )}
        >
          {validationResult.message}
        </p>
      )}
    </div>
  );
}
