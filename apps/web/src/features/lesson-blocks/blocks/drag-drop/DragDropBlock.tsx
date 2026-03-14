"use client";

import { useState } from "react";
import { cn } from "@mindorbit/ui";
import type { DragDropBlockConfig } from "@/features/lesson-blocks/types/block.types";

interface DragDropBlockProps {
  config: DragDropBlockConfig;
  onAnswerChange: (answer: Record<string, string>) => void;
  submittedAnswer?: Record<string, string> | null;
  validationResult?: import("@/features/lesson-blocks/types/validation.types").ValidationResult | null;
  disabled?: boolean;
}

export function DragDropBlock({
  config,
  onAnswerChange,
  submittedAnswer,
  validationResult,
  disabled = false,
}: DragDropBlockProps) {
  const [slots, setSlots] = useState<Record<string, string>>(() => submittedAnswer ?? {});

  function handleDrop(slotId: string, itemId: string) {
    if (disabled) return;
    const next = { ...slots, [slotId]: itemId };
    setSlots(next);
    onAnswerChange(next);
  }

  function handleRemove(slotId: string) {
    if (disabled) return;
    const next = { ...slots };
    delete next[slotId];
    setSlots(next);
    onAnswerChange(next);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Items</p>
          <div className="flex flex-wrap gap-2">
            {config.items
              .filter((it) => !Object.values(slots).includes(it.id))
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {}}
                  disabled={disabled}
                  className={cn(
                    "rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors",
                    "hover:border-primary hover:bg-accent/50",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {item.label}
                </button>
              ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Drop zones</p>
          <div className="grid gap-2">
            {config.slots.map((slot) => {
              const itemId = slots[slot.id];
              const itemLabel = itemId ? config.items.find((i) => i.id === itemId)?.label : undefined;
              const nextItem = config.items.find((i) => !Object.values(slots).includes(i.id));
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => (itemId ? handleRemove(slot.id) : nextItem && handleDrop(slot.id, nextItem.id))}
                  disabled={disabled}
                  className={cn(
                    "min-h-[44px] rounded-xl border-2 border-dashed px-4 py-3 text-left transition-colors",
                    itemId
                      ? "border-primary/50 bg-primary/5"
                      : "border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/20",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {itemId ? (
                    <span className="font-medium">{itemLabel ?? itemId}</span>
                  ) : (
                    <span className="text-muted-foreground">{slot.label ?? "Drop here"}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Click an item to place it in a slot. Click the slot again to remove.
      </p>
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
