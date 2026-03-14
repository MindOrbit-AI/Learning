"use client";

import { useState } from "react";
import type { ConstructAnswerBlockConfig } from "@/features/lesson-blocks/types/block.types";

interface ConstructAnswerBlockProps {
  config: ConstructAnswerBlockConfig;
  onAnswerChange: (answer: string) => void;
  submittedAnswer?: string | null;
  validationResult?: import("@/features/lesson-blocks/types/validation.types").ValidationResult | null;
  disabled?: boolean;
}

export function ConstructAnswerBlock({
  config,
  onAnswerChange,
  submittedAnswer,
  validationResult,
  disabled = false,
}: ConstructAnswerBlockProps) {
  const [value, setValue] = useState(submittedAnswer ?? "");

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          onAnswerChange(v);
        }}
        placeholder={config.placeholder ?? "Type your answer..."}
        disabled={disabled}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {config.expectedFormat && (
        <p className="text-xs text-muted-foreground">Format: {config.expectedFormat}</p>
      )}
      {validationResult && (
        <p
          className={`text-sm font-medium ${
            validationResult.isCorrect ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {validationResult.message}
        </p>
      )}
    </div>
  );
}
