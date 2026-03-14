"use client";

import { useState } from "react";
import { cn } from "@mindorbit/ui";
import { PredictionCard } from "@/components/mission-engine/scenes/PredictionCard";
import type { MultipleChoiceBlockConfig } from "@/features/lesson-blocks/types/block.types";

interface MultipleChoiceBlockProps {
  config: MultipleChoiceBlockConfig;
  onAnswerChange: (answer: string) => void;
  submittedAnswer?: string | null;
  validationResult?: import("@/features/lesson-blocks/types/validation.types").ValidationResult | null;
  disabled?: boolean;
}

export function MultipleChoiceBlock({
  config,
  onAnswerChange,
  submittedAnswer,
  validationResult,
  disabled = false,
}: MultipleChoiceBlockProps) {
  const [displayOptions] = useState(() =>
    config.shuffle
      ? [...config.options].sort(() => Math.random() - 0.5)
      : config.options
  );
  const [localSelection, setLocalSelection] = useState<string | null>(null);
  const selectedId =
    validationResult != null ? submittedAnswer ?? null : localSelection ?? submittedAnswer ?? null;

  return (
    <div className="space-y-3">
      <PredictionCard
        options={displayOptions}
        selected={selectedId ?? undefined}
        onSelect={(id) => {
          if (!disabled) {
            setLocalSelection(id);
            onAnswerChange(id);
          }
        }}
        disabled={disabled}
      />
      {validationResult && (
        <p
          className={cn(
            "text-sm font-medium",
            validationResult.isCorrect
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          )}
        >
          {validationResult.message}
        </p>
      )}
    </div>
  );
}
