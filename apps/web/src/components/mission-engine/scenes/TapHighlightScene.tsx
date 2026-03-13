"use client";

import { useState } from "react";
import type { TapHighlightContent } from "@mindorbit/types";
import { cn } from "@mindorbit/ui";

interface TapHighlightSceneProps {
  content: TapHighlightContent;
  onAnswer: (selectedIds: string[]) => void;
  disabled?: boolean;
  highlightOrder?: boolean;
}

export function TapHighlightScene({
  content,
  onAnswer,
  disabled = false,
  highlightOrder = false,
}: TapHighlightSceneProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const targets = content.targets ?? [];

  function toggle(id: string) {
    if (disabled) return;
    const next = highlightOrder
      ? selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
      : selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id];
    setSelected(next);
    onAnswer(next);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {highlightOrder
          ? "Tap elements in the correct order"
          : "Tap to highlight the relevant elements"}
      </p>
      <div className="flex flex-wrap gap-2">
        {targets.map((t, idx) => (
          <button
            key={t.id}
            type="button"
            onClick={() => toggle(t.id)}
            disabled={disabled}
            className={cn(
              "rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all",
              selected.includes(t.id)
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted hover:border-primary/50 hover:bg-accent/20",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {highlightOrder && selected.includes(t.id) && (
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs">
                {selected.indexOf(t.id) + 1}
              </span>
            )}
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
