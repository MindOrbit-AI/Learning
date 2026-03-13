"use client";

import { useState, useEffect } from "react";
import { PredictionCard } from "./PredictionCard";
import { cn } from "@mindorbit/ui";

interface MicroQuizOption {
  id: string;
  label: string;
}

interface MicroQuizContent {
  options?: MicroQuizOption[];
}

interface MicroQuizSceneProps {
  content: MicroQuizContent;
  correctAnswer?: string;
  initialAnswer?: string;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export function MicroQuizScene({
  content,
  initialAnswer,
  onAnswer,
  disabled = false,
}: MicroQuizSceneProps) {
  const [selected, setSelected] = useState<string | null>(initialAnswer ?? null);
  const options = content.options ?? [];

  // Sync with restored answer when navigating back to this scene
  useEffect(() => {
    if (initialAnswer !== undefined) setSelected(initialAnswer);
  }, [initialAnswer]);

  return (
    <div className="space-y-4">
      <PredictionCard
        options={options}
        selected={selected ?? undefined}
        onSelect={(id) => {
          setSelected(id);
          onAnswer(id);
        }}
        disabled={disabled}
      />
    </div>
  );
}
