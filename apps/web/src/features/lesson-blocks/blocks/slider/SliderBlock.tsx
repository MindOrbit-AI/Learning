"use client";

import { useState } from "react";
import { cn } from "@mindorbit/ui";
import type { SliderBlockConfig } from "@/features/lesson-blocks/types/block.types";

interface SliderBlockProps {
  config: SliderBlockConfig;
  onAnswerChange: (answer: number) => void;
  submittedAnswer?: number | null;
  validationResult?: import("@/features/lesson-blocks/types/validation.types").ValidationResult | null;
  disabled?: boolean;
}

export function SliderBlock({
  config,
  onAnswerChange,
  submittedAnswer,
  validationResult,
  disabled = false,
}: SliderBlockProps) {
  const [value, setValue] = useState(
    submittedAnswer ?? config.initialValue ?? (config.min + config.max) / 2
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{config.min}</span>
          <span className="font-mono font-medium">
            {value}
            {config.unit ? ` ${config.unit}` : ""}
          </span>
          <span className="text-muted-foreground">{config.max}</span>
        </div>
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setValue(v);
            onAnswerChange(v);
          }}
          disabled={disabled}
          className="h-3 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        />
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
