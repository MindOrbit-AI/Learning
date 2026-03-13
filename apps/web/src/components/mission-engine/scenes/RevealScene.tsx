"use client";

import { useState } from "react";
import { Button } from "@mindorbit/ui";
import { Eye } from "lucide-react";

interface RevealSceneProps {
  content: string;
  label?: string;
}

export function RevealScene({ content, label = "Reveal" }: RevealSceneProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-4">
      {!revealed ? (
        <Button
          variant="outline"
          onClick={() => setRevealed(true)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          {label}
        </Button>
      ) : (
        <div className="rounded-xl border bg-accent/20 p-4">
          <p className="text-sm">{content}</p>
        </div>
      )}
    </div>
  );
}
