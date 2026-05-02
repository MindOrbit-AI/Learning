"use client";

import { Reorder } from "framer-motion";
import { cn } from "@mindorbit/lib";

export type DragDropSortProps = {
  items: string[];
  onChange: (order: string[]) => void;
  className?: string;
};

export function DragDropSort({ items, onChange, className }: DragDropSortProps) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onChange}
      className={cn("flex flex-col gap-2", className)}
    >
      {items.map((id) => (
        <Reorder.Item
          key={id}
          value={id}
          className="cursor-grab rounded-2xl border border-white/10 bg-zinc-800/90 px-4 py-3 text-left text-sm font-medium text-white shadow-md active:cursor-grabbing"
        >
          {id}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
