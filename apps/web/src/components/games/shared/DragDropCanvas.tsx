"use client";

import { cn } from "@mindorbit/ui";

/** Minimal canvas shell for graph builders — extend with dnd-kit later. */
export function DragDropCanvas({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-h-[220px] rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/50 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
