"use client";

import { useState, useCallback } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@mindorbit/ui";
import type { DragSequenceBlockConfig } from "@/features/lesson-blocks/types/block.types";

interface DragSequenceBlockProps {
  config: DragSequenceBlockConfig;
  onAnswerChange: (answer: string[]) => void;
  submittedAnswer?: string[] | null;
  validationResult?: import("@/features/lesson-blocks/types/validation.types").ValidationResult | null;
  disabled?: boolean;
}

export function DragSequenceBlock({
  config,
  onAnswerChange,
  submittedAnswer,
  disabled = false,
}: DragSequenceBlockProps) {
  const [order, setOrder] = useState<string[]>(() => {
    if (submittedAnswer?.length === config.items.length) return [...submittedAnswer];
    return config.items.map((i) => i.id);
  });

  const itemMap = Object.fromEntries(config.items.map((i) => [i.id, i.label]));

  const move = useCallback(
    (index: number, dir: "up" | "down") => {
      if (disabled) return;
      const next = [...order];
      const swap = dir === "up" ? index - 1 : index + 1;
      if (swap < 0 || swap >= next.length) return;
      const a = next[index];
      const b = next[swap];
      if (a == null || b == null) return;
      next[index] = b;
      next[swap] = a;
      setOrder(next);
      onAnswerChange(next);
    },
    [order, disabled, onAnswerChange]
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Arrange in the correct order</p>
      <div className="space-y-2">
        {order.map((id, idx) => (
          <div
            key={id}
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-card px-4 py-3",
              !disabled && "hover:border-primary/30"
            )}
          >
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => move(idx, "up")}
                disabled={disabled || idx === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Move up"
              >
                <GripVertical className="h-4 w-4 -rotate-90" />
              </button>
              <button
                type="button"
                onClick={() => move(idx, "down")}
                disabled={disabled || idx === order.length - 1}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Move down"
              >
                <GripVertical className="h-4 w-4 rotate-90" />
              </button>
            </div>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {idx + 1}
            </span>
            <span className="flex-1">{itemMap[id] ?? id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
