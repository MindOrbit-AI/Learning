"use client";

import { useState } from "react";
import type { SliderContent } from "@mindorbit/types";
import { cn } from "@mindorbit/ui";

interface SliderExperimentSceneProps {
  content: SliderContent;
  onAnswer: (value: number) => void;
  disabled?: boolean;
}

export function SliderExperimentScene({
  content,
  onAnswer,
  disabled = false,
}: SliderExperimentSceneProps) {
  const [value, setValue] = useState(
    content.initialValue ?? (content.min + content.max) / 2
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{content.labels?.left ?? String(content.min)}</span>
          <span className="font-mono font-medium">
            {value}
            {content.unit ? ` ${content.unit}` : ""}
          </span>
          <span className="text-muted-foreground">{content.labels?.right ?? String(content.max)}</span>
        </div>
        <input
          type="range"
          min={content.min}
          max={content.max}
          step={content.step}
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setValue(v);
            onAnswer(v);
          }}
          disabled={disabled}
          className="h-3 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        />
      </div>
    </div>
  );
}
