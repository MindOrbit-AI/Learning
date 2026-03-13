"use client";

import { ReactNode } from "react";

interface ManipulationCanvasProps {
  children: ReactNode;
  className?: string;
}

/** Container for interactive manipulation scenes (equation balance, coefficient edits, etc.) */
export function ManipulationCanvas({ children, className }: ManipulationCanvasProps) {
  return (
    <div
      className={`rounded-xl border-2 border-dashed border-muted bg-muted/20 p-6 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
