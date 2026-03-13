"use client";

import { useState, useMemo } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@mindorbit/ui";

/** Steps to construct linear equation from slope and y-intercept */
const LINEAR_EQUATION_STEPS = [
  { id: "1", label: "Identify the slope (m) and y-intercept (b) from the given information", correctOrder: 0 },
  { id: "2", label: "Write the equation in the form y = mx + b", correctOrder: 1 },
  { id: "3", label: "Substitute the values of m and b into the equation", correctOrder: 2 },
  { id: "4", label: "Simplify the equation if necessary", correctOrder: 3 },
];

/** Generic fallback when AI omits items */
const GENERIC_STEPS = [
  { id: "1", label: "Step 1", correctOrder: 0 },
  { id: "2", label: "Step 2", correctOrder: 1 },
  { id: "3", label: "Step 3", correctOrder: 2 },
];

interface SortItem {
  id: string;
  label: string;
  correctOrder?: number;
}

interface SortSequenceSceneProps {
  content: Record<string, unknown>;
  onAnswer: (order: string[]) => void;
  disabled?: boolean;
}

function normalizeItems(raw: unknown, prompt?: string): SortItem[] {
  const arr = Array.isArray(raw) ? raw : [];
  if (arr.length === 0) {
    const lower = (prompt ?? "").toLowerCase();
    if (lower.includes("linear") || lower.includes("slope") || lower.includes("y-intercept")) {
      return LINEAR_EQUATION_STEPS;
    }
    return GENERIC_STEPS;
  }
  return arr.map((item, i) => {
    if (typeof item === "string") {
      return { id: `opt-${i}`, label: item, correctOrder: i };
    }
    const obj = item as Record<string, unknown>;
    return {
      id: String(obj.id ?? `opt-${i}`),
      label: String(obj.label ?? obj.text ?? obj.step ?? item),
      correctOrder: Number(obj.correctOrder ?? obj.correctPosition ?? i),
    };
  });
}

export function SortSequenceScene({
  content,
  onAnswer,
  disabled = false,
}: SortSequenceSceneProps) {
  const prompt = content.prompt as string | undefined;
  const rawItems = content.items ?? content.steps ?? [];
  const items = useMemo(() => normalizeItems(rawItems, prompt), [rawItems, prompt]);

  const [order, setOrder] = useState<string[]>(() =>
    [...items]
      .sort(() => Math.random() - 0.5)
      .map((i) => i.id)
  );
  const itemMap = Object.fromEntries(items.map((i) => [i.id, i.label]));

  function move(index: number, dir: "up" | "down") {
    if (disabled) return;
    const next = [...order];
    const swap = dir === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    setOrder(next);
    onAnswer(next);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Arrange the steps in the correct order</p>
      <div className="space-y-2">
        {order.map((id, idx) => (
          <div
            key={id}
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-card px-4 py-3",
              !disabled && "hover:border-primary/30"
            )}
          >
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => move(idx, "up")}
                disabled={disabled || idx === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Move up"
              >
                <GripVertical className="h-4 w-4 -rotate-90" />
              </button>
              <button
                type="button"
                onClick={() => move(idx, "down")}
                disabled={disabled || idx === order.length - 1}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                aria-label="Move down"
              >
                <GripVertical className="h-4 w-4 rotate-90" />
              </button>
            </div>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {idx + 1}
            </span>
            <span className="flex-1">{itemMap[id] ?? id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
