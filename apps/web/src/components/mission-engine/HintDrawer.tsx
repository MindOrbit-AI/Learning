"use client";

import { useState } from "react";
import { Button, Card, CardContent } from "@mindorbit/ui";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

interface HintDrawerProps {
  hintLevel1?: string | null;
  hintLevel2?: string | null;
  hintLevel3?: string | null;
  onHintReveal?: (level: number) => void;
}

export function HintDrawer({
  hintLevel1,
  hintLevel2,
  hintLevel3,
  onHintReveal,
}: HintDrawerProps) {
  const [revealedLevel, setRevealedLevel] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const hints = [
    hintLevel1,
    hintLevel2,
    hintLevel3,
  ].filter((h): h is string => Boolean(h));

  if (hints.length === 0) return null;

  function revealNext() {
    if (revealedLevel < hints.length) {
      const next = revealedLevel + 1;
      setRevealedLevel(next);
      onHintReveal?.(next);
      setExpanded(true);
    }
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-200/60 p-2 dark:bg-amber-800/30">
            <Lightbulb className="h-5 w-5 text-amber-700 dark:text-amber-400" />
          </div>
          <div className="flex-1 space-y-2">
            {hints.slice(0, revealedLevel).map((hint, i) => (
              <p
                key={i}
                className="text-sm text-amber-900 dark:text-amber-100"
              >
                <span className="font-medium">Hint {i + 1}:</span> {hint}
              </p>
            ))}
            {revealedLevel < hints.length && (
              <Button
                variant="outline"
                size="sm"
                onClick={revealNext}
                className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/30"
              >
                {revealedLevel === 0 ? (
                  <>Show hint</>
                ) : (
                  <>Show another hint {revealedLevel < hints.length && `(${hints.length - revealedLevel} left)`}</>
                )}
              </Button>
            )}
          </div>
          {hints.length > 1 && revealedLevel > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={expanded ? "Collapse hints" : "Expand hints"}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
