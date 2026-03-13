"use client";

import { useState } from "react";
import type { SceneContentBase } from "@mindorbit/types";
import { cn } from "@mindorbit/ui";

interface TransferChallengeSceneProps {
  content: SceneContentBase;
  options?: Array<{ id: string; label: string }>;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

/** Applies learned concept to a new scenario - transfer of knowledge */
export function TransferChallengeScene({
  content,
  options = [],
  onAnswer,
  disabled = false,
}: TransferChallengeSceneProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Apply what you learned to this new scenario
      </p>
      {content.visual && (
        <div className="rounded-xl border bg-muted/30 p-4 text-center">
          <span className="text-2xl">{content.visual as string}</span>
        </div>
      )}
      {options.length > 0 ? (
        <div className="grid gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setSelected(opt.id);
                onAnswer(opt.id);
              }}
              disabled={disabled}
              className={cn(
                "rounded-xl border px-4 py-3 text-left transition-colors",
                selected === opt.id
                  ? "border-primary bg-primary/10"
                  : "border-muted hover:border-primary/50 hover:bg-accent/20",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <input
          type="text"
          placeholder="Your answer..."
          onChange={(e) => onAnswer(e.target.value)}
          disabled={disabled}
          className="w-full rounded-xl border px-4 py-3"
        />
      )}
    </div>
  );
}
