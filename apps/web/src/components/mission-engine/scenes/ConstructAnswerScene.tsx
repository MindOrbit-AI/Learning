"use client";

import { useState } from "react";
import { Input } from "@mindorbit/ui";

interface ConstructAnswerContent {
  placeholder?: string;
  expectedFormat?: string;
}

interface ConstructAnswerSceneProps {
  content: ConstructAnswerContent;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export function ConstructAnswerScene({
  content,
  onAnswer,
  disabled = false,
}: ConstructAnswerSceneProps) {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onAnswer(e.target.value);
        }}
        placeholder={content.placeholder ?? "Type your answer..."}
        disabled={disabled}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {content.expectedFormat && (
        <p className="text-xs text-muted-foreground">Format: {content.expectedFormat}</p>
      )}
    </div>
  );
}
