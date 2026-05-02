"use client";

import { cn } from "@mindorbit/lib";

export type SliderControlProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

export function SliderControl({
  min,
  max,
  step,
  value,
  onChange,
  disabled,
  label,
  className,
}: SliderControlProps) {
  return (
    <div className={cn("flex w-full max-w-xl flex-col gap-3", className)}>
      {label ? <p className="text-center text-sm text-zinc-400">{label}</p> : null}
      <div className="flex items-center gap-4">
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-zinc-500">{min}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-violet-500",
            disabled && "cursor-not-allowed opacity-50",
          )}
        />
        <span className="w-10 shrink-0 text-left text-xs tabular-nums text-zinc-500">{max}</span>
      </div>
      <p className="text-center text-sm font-medium tabular-nums text-violet-200">{value}</p>
    </div>
  );
}
