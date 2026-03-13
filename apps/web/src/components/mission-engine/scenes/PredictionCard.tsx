"use client";

import { cn } from "@mindorbit/ui";

interface PredictionOption {
  id?: string;
  label?: unknown;
}

interface PredictionCardProps {
  options: Array<PredictionOption | string>;
  selected?: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

/** Safely extract display string from option (AI may use label, text, value, expression, etc.) */
function toDisplayLabel(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object") {
    const o = val as Record<string, unknown>;
    const s = o.label ?? o.text ?? o.value ?? o.expression ?? o.content ?? o.title;
    if (s != null && typeof s === "string") return s;
    if (s != null && typeof s === "number") return String(s);
  }
  return "";
}

export function PredictionCard({
  options,
  selected,
  onSelect,
  disabled = false,
}: PredictionCardProps) {
  // Normalize options: ensure each has a unique id and string label (AI may use various shapes)
  const normalizedOptions = options.map((opt, i) => {
    if (typeof opt === "string") return { id: `opt-${i}`, label: opt };
    const o = opt as Record<string, unknown>;
    const label = toDisplayLabel(o.label ?? o.text ?? o.value ?? o.expression ?? o) || `Option ${i + 1}`;
    return { id: String(o.id ?? `opt-${i}`), label };
  });

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {normalizedOptions.map((opt) => {
        const isSelected = selected != null && selected !== "" && selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => !disabled && onSelect(opt.id)}
            disabled={disabled}
            className={cn(
              "rounded-xl border-2 p-4 text-left transition-all",
              isSelected
                ? "border-primary bg-primary/10"
                : "border-muted hover:border-primary/50 hover:bg-accent/20",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
