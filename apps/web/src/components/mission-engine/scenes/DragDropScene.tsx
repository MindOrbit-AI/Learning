"use client";

import { useState } from "react";
import type { DragDropContent } from "@mindorbit/types";
import { cn } from "@mindorbit/ui";

interface DragDropSceneProps {
  content: DragDropContent;
  correctAnswer?: number[] | string[];
  onAnswer: (answer: Record<string, string>) => void;
  disabled?: boolean;
}

export function DragDropScene({
  content,
  correctAnswer,
  onAnswer,
  disabled = false,
}: DragDropSceneProps) {
  const [slots, setSlots] = useState<Record<string, string>>({});
  const items = content.items ?? [];
  const slotList = content.slots ?? [];

  function handleDrop(slotId: string, itemId: string) {
    if (disabled) return;
    setSlots((prev) => ({ ...prev, [slotId]: itemId }));
    onAnswer({ ...slots, [slotId]: itemId });
  }

  function handleRemove(slotId: string) {
    if (disabled) return;
    const next = { ...slots };
    delete next[slotId];
    setSlots(next);
    onAnswer(next);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Items</p>
          <div className="flex flex-wrap gap-2">
            {items
              .filter((it) => !Object.values(slots).includes(it.id))
              .map((item) => (
                <DraggableItem
                  key={item.id}
                  label={item.label}
                  onDrag={() => {}}
                  disabled={disabled}
                />
              ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Drop zones</p>
          <div className="grid gap-2">
            {slotList.map((slot) => (
              <DropSlot
                key={slot.id}
                label={slot.label}
                value={slots[slot.id]}
                itemLabel={slots[slot.id] ? items.find((i) => i.id === slots[slot.id])?.label : undefined}
                onDrop={() => {
                  const nextItem = items.find((i) => !Object.values(slots).includes(i.id));
                  if (nextItem) handleDrop(slot.id, nextItem.id);
                }}
                onRemove={slots[slot.id] ? () => handleRemove(slot.id) : undefined}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Click an item to place it in a slot. Click the slot again to remove.
      </p>
    </div>
  );
}

function DraggableItem({
  label,
  onDrag,
  disabled,
}: {
  label: string;
  onDrag: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onDrag}
      disabled={disabled}
      className={cn(
        "rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors",
        "hover:border-primary hover:bg-accent/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {label}
    </button>
  );
}

function DropSlot({
  label,
  value,
  itemLabel,
  onDrop,
  onRemove,
  disabled,
}: {
  label?: string;
  value?: string;
  itemLabel?: string;
  onDrop: () => void;
  onRemove?: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={value ? onRemove : onDrop}
      disabled={disabled}
      className={cn(
        "min-h-[44px] rounded-xl border-2 border-dashed px-4 py-3 text-left transition-colors",
        value
          ? "border-primary/50 bg-primary/5"
          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/20",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {value ? (
        <span className="font-medium">{itemLabel ?? value}</span>
      ) : (
        <span className="text-muted-foreground">{label ?? "Drop here"}</span>
      )}
    </button>
  );
}
