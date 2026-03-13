"use client";

import { useState, useMemo } from "react";
import { cn } from "@mindorbit/ui";

/** Fallback for linear function point-on-line verification (e.g. y = 2x + 5, point (2, 8)) */
const LINEAR_POINT_VERIFY_STATEMENTS = [
  { id: "1", text: "Substitute x = 2 into y = 2x + 5: y = 2(2) + 5 = 9", hasError: false },
  { id: "2", text: "Since 9 = 8, the point (2, 8) is on the line", hasError: true },
];

/** Generic fallback when AI omits statements */
const GENERIC_STATEMENTS = [
  { id: "1", text: "First step of the solution", hasError: false },
  { id: "2", text: "Second step (contains an error)", hasError: true },
];

interface Statement {
  id: string;
  text: string;
  hasError?: boolean;
}

interface FindErrorSceneProps {
  content: Record<string, unknown>;
  onAnswer: (selectedId: string) => void;
  disabled?: boolean;
}

function normalizeStatements(raw: unknown, prompt?: string): Statement[] {
  const arr = Array.isArray(raw) ? raw : [];
  const withText = arr.filter((s) => {
    const t = typeof s === "string" ? s : (s as Record<string, unknown>)?.text ?? (s as Record<string, unknown>)?.content;
    return t && String(t).trim().length > 0;
  });
  if (withText.length === 0) {
    const lower = (prompt ?? "").toLowerCase();
    if (lower.includes("linear") || lower.includes("point") || lower.includes("on the line") || lower.includes("y = ")) {
      return LINEAR_POINT_VERIFY_STATEMENTS;
    }
    return GENERIC_STATEMENTS;
  }
  return withText.map((s, i) => {
    if (typeof s === "string") return { id: `stmt-${i}`, text: s, hasError: false };
    const obj = s as Record<string, unknown>;
    return {
      id: String(obj.id ?? `stmt-${i}`),
      text: String(obj.text ?? obj.content ?? obj.step ?? s),
      hasError: Boolean(obj.hasError),
    };
  });
}

export function FindErrorScene({
  content,
  onAnswer,
  disabled = false,
}: FindErrorSceneProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const prompt = content.prompt as string | undefined;
  const rawStatements = content.statements ?? content.steps ?? [];
  const statements = useMemo(() => normalizeStatements(rawStatements, prompt), [rawStatements, prompt]);

  function select(id: string) {
    if (disabled) return;
    setSelected(id);
    onAnswer(id);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Tap the step that contains the error</p>
      <div className="space-y-2">
        {statements.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => select(s.id)}
            disabled={disabled}
            className={cn(
              "block w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors",
              selected === s.id
                ? "border-primary bg-primary/10"
                : "border-muted hover:border-primary/50 hover:bg-accent/20",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span className="font-medium text-muted-foreground">Step {idx + 1}:</span> {s.text}
          </button>
        ))}
      </div>
    </div>
  );
}
