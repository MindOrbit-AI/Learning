"use client";

import { useState } from "react";
import { Button } from "@mindorbit/ui";
import { Eye } from "lucide-react";
import type { RevealBlockConfig } from "@/features/lesson-blocks/types/block.types";

interface RevealBlockProps {
  config: RevealBlockConfig;
  onAnswerChange: (answer: string) => void;
  submittedAnswer?: string | null;
  disabled?: boolean;
}

/** Emit "viewed" when user clicks reveal so step can advance */
export function RevealBlock({
  config,
  onAnswerChange,
}: RevealBlockProps) {
  const [revealed, setRevealed] = useState(false);

  function handleReveal() {
    setRevealed(true);
    onAnswerChange("viewed");
  }

  return (
    <div className="space-y-4">
      {!revealed ? (
        <Button variant="outline" onClick={handleReveal} className="gap-2">
          <Eye className="h-4 w-4" />
          {config.label ?? "Reveal"}
        </Button>
      ) : (
        <div className="rounded-xl border bg-accent/20 p-4">
          <p className="text-sm">{config.content}</p>
        </div>
      )}
    </div>
  );
}
