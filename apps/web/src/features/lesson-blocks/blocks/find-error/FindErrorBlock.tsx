"use client";

import { useState } from "react";
import { cn } from "@mindorbit/ui";
import type { FindErrorBlockConfig } from "@/features/lesson-blocks/types/block.types";

interface FindErrorBlockProps {
  config: FindErrorBlockConfig;
  onAnswerChange: (answer: string) => void;
  submittedAnswer?: string | null;
  validationResult?: import("@/features/lesson-blocks/types/validation.types").ValidationResult | null;
  disabled?: boolean;
}

export function FindErrorBlock({
  config,
  onAnswerChange,
  submittedAnswer,
  validationResult,
  disabled = false,
}: FindErrorBlockProps) {
  const [selected, setSelected] = useState<string | null>(submittedAnswer ?? null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Tap the step that contains the error</p>
      <div className="space-y-2">
        {config.statements.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              if (!disabled) {
                setSelected(s.id);
                onAnswerChange(s.id);
              }
            }}
            disabled={disabled}
            className={cn(
              "block w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors",
              selected === s.id ? "border-primary bg-primary/10" : "border-muted hover:border-primary/50 hover:bg-accent/20",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span className="font-medium text-muted-foreground">Step {idx + 1}:</span> {s.text}
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
