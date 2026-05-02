"use client";

import { cn } from "@mindorbit/ui";

export function VisualDiagramRenderer({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[160px] items-center justify-center rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 text-sm text-zinc-500",
        className
      )}
    >
      {title ?? "Diagram preview"}
    </div>
  );
}
