"use client";

import { useState } from "react";

interface ReflectionSceneProps {
  prompt: string;
  onAnswer: (response: string) => void;
  disabled?: boolean;
}

export function ReflectionScene({
  prompt,
  onAnswer,
  disabled = false,
}: ReflectionSceneProps) {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">{prompt}</p>
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onAnswer(e.target.value);
        }}
        placeholder="Share your thoughts..."
        disabled={disabled}
        rows={4}
        className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
