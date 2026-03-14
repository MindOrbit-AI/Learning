"use client";

import { useEffect } from "react";
import type { ObserveBlockConfig } from "@/features/lesson-blocks/types/block.types";
import { NumberLineGraph } from "./NumberLineGraph";

interface ObserveBlockProps {
  config: ObserveBlockConfig;
  onAnswerChange: (answer: string) => void;
  submittedAnswer?: string | null;
  disabled?: boolean;
}

/** Passive block: emit "viewed" so step can advance without validation */
export function ObserveBlock({
  config,
  onAnswerChange,
}: ObserveBlockProps) {
  useEffect(() => {
    onAnswerChange("viewed");
  }, [onAnswerChange]);

  const imageUrl =
    typeof config.imageUrl === "string" ? config.imageUrl : undefined;
  const hasImageUrl =
    imageUrl &&
    (imageUrl.startsWith("http") ||
      imageUrl.startsWith("/") ||
      imageUrl.startsWith("data:"));

  const descriptionRefersToImage =
    config.description &&
    /\b(image|illustrates?|diagram|figure|chart|graph)\b/i.test(
      config.description
    );
  const isPlaceholderText = (v: string) =>
    /URL_|placeholder|INSERT_|TODO|\[image\]|\*\*.*image.*\*\*/i.test(v.replace(/\*/g, ""));
  const effectiveVisual =
    config.visual && !isPlaceholderText(config.visual) ? config.visual : undefined;
  const needsPlaceholder =
    descriptionRefersToImage && !config.numberLine && !hasImageUrl && !effectiveVisual;

  return (
    <div className="space-y-4">
      {config.numberLine && (
        <div className="rounded-xl border bg-muted/30 p-6 flex justify-center">
          <NumberLineGraph data={config.numberLine} />
        </div>
      )}
      {hasImageUrl && imageUrl && (
        <div className="rounded-xl border bg-muted/30 p-4 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="w-full h-auto max-h-64 object-contain"
          />
        </div>
      )}
      {(effectiveVisual || needsPlaceholder) && !config.numberLine && !hasImageUrl && (
        <div className="rounded-xl border bg-muted/30 p-6 text-center">
          <span className="text-4xl">{effectiveVisual ?? "📊"}</span>
        </div>
      )}
      {config.description && (
        <p className="text-muted-foreground">{config.description}</p>
      )}
    </div>
  );
}
