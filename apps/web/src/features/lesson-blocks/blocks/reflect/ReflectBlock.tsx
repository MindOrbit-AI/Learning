"use client";

import { useState } from "react";
import type { ReflectBlockConfig } from "@/features/lesson-blocks/types/block.types";

interface ReflectBlockProps {
  config: ReflectBlockConfig;
  onAnswerChange: (answer: string) => void;
  submittedAnswer?: string | null;
  validationResult?: import("@/features/lesson-blocks/types/validation.types").ValidationResult | null;
  disabled?: boolean;
}

export function ReflectBlock({
  config,
  onAnswerChange,
  submittedAnswer,
  validationResult,
  disabled = false,
}: ReflectBlockProps) {
  const [value, setValue] = useState(submittedAnswer ?? "");

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">{config.prompt}</p>
      <textarea
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          onAnswerChange(v);
        }}
        placeholder="Share your thoughts..."
        disabled={disabled}
        rows={4}
        className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
      />
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
