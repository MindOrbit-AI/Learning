"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@mindorbit/lib";

export type DragDropMatchItem = { id: string; label: string };
export type DragDropMatchSlot = { id: string; label: string };

export type DragDropMatchProps = {
  items: DragDropMatchItem[];
  slots: DragDropMatchSlot[];
  /** slotId → itemId */
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  disabled?: boolean;
  className?: string;
};

export function DragDropMatch({
  items,
  slots,
  value,
  onChange,
  disabled,
  className,
}: DragDropMatchProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const used = new Set(Object.values(value));

  const place = (slotId: string, itemId: string) => {
    if (disabled) return;
    const next = { ...value };
    for (const [sid, iid] of Object.entries(next)) {
      if (iid === itemId && sid !== slotId) delete next[sid];
    }
    next[slotId] = itemId;
    onChange(next);
    setSelectedItem(null);
  };

  const clearSlot = (slotId: string) => {
    if (disabled) return;
    const next = { ...value };
    delete next[slotId];
    onChange(next);
  };

  return (
    <div className={cn("mx-auto w-full max-w-lg space-y-5", className)}>
      <div className="space-y-2">
        <p className="text-center text-xs font-bold uppercase tracking-wide text-zinc-500">
          Drag cards into slots
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {items.map((item) => {
            const inSlot = used.has(item.id);
            const isSelected = selectedItem === item.id;
            return (
              <motion.button
                key={item.id}
                type="button"
                disabled={disabled || inSlot}
                whileTap={{ scale: disabled || inSlot ? 1 : 0.97 }}
                onClick={() => {
                  if (inSlot) return;
                  setSelectedItem(isSelected ? null : item.id);
                }}
                className={cn(
                  "rounded-xl border-2 px-3 py-2 text-sm font-semibold transition",
                  inSlot && "cursor-default border-white/5 bg-zinc-900/50 text-zinc-600 opacity-60",
                  !inSlot &&
                    isSelected &&
                    "border-violet-400/80 bg-violet-500/20 text-violet-100 ring-2 ring-violet-400/30",
                  !inSlot &&
                    !isSelected &&
                    "cursor-grab border-white/15 bg-zinc-800/90 text-zinc-200 hover:border-violet-400/40 active:cursor-grabbing",
                )}
              >
                {item.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-3",
          slots.length === 1 ? "grid-cols-1" : slots.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
        )}
      >
        {slots.map((slot) => {
          const itemId = value[slot.id];
          const item = itemId ? items.find((i) => i.id === itemId) : undefined;
          const highlight = selectedItem && !itemId;
          return (
            <button
              key={slot.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (itemId) {
                  clearSlot(slot.id);
                  return;
                }
                if (selectedItem) place(slot.id, selectedItem);
              }}
              className={cn(
                "min-h-[4.75rem] rounded-xl border-2 border-dashed px-3 py-3 text-center transition",
                item
                  ? "border-violet-400/50 bg-violet-500/10"
                  : highlight
                    ? "border-violet-400/60 bg-violet-500/5"
                    : "border-white/20 bg-zinc-800/50",
              )}
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">{slot.label}</p>
              <p className="mt-1 text-sm font-semibold text-zinc-100">
                {item?.label ?? (selectedItem ? "Tap to place" : "Select a card")}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
