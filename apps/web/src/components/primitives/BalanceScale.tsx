"use client";

import { motion } from "framer-motion";
import { cn } from "@mindorbit/lib";

export type BalanceScaleProps = {
  /** Weights the learner can place on either pan. */
  availableWeights: number[];
  leftWeights: number[];
  rightWeights: number[];
  onChange: (next: { leftWeights: number[]; rightWeights: number[] }) => void;
  /** Indices in leftWeights/rightWeights that cannot be removed (from fixedLeft/fixedRight). */
  lockedLeftCount?: number;
  lockedRightCount?: number;
  unit?: string;
  disabled?: boolean;
  className?: string;
};

function sum(weights: number[]) {
  return weights.reduce((a, b) => a + b, 0);
}

function WeightChip({
  value,
  side,
  locked,
  onRemove,
  disabled,
}: {
  value: number;
  side: "left" | "right";
  locked?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.span
      layout
      className={cn(
        "inline-flex min-w-[2.25rem] items-center justify-center rounded-lg px-2 py-1 text-xs font-bold tabular-nums",
        side === "left"
          ? "bg-amber-500/90 text-white shadow-md shadow-amber-500/20"
          : "bg-cyan-500/90 text-white shadow-md shadow-cyan-500/20",
        locked && "ring-2 ring-white/30",
      )}
    >
      {value}
      {!locked && onRemove && !disabled ? (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 text-[10px] opacity-70 hover:opacity-100"
          aria-label="Remove weight"
        >
          ×
        </button>
      ) : null}
    </motion.span>
  );
}

export function BalanceScale({
  availableWeights,
  leftWeights,
  rightWeights,
  onChange,
  lockedLeftCount = 0,
  lockedRightCount = 0,
  unit = "",
  disabled,
  className,
}: BalanceScaleProps) {
  const leftSum = sum(leftWeights);
  const rightSum = sum(rightWeights);
  const tilt = leftSum === rightSum ? 0 : leftSum > rightSum ? -6 : 6;

  const addWeight = (w: number, side: "left" | "right") => {
    if (disabled) return;
    if (side === "left") onChange({ leftWeights: [...leftWeights, w], rightWeights });
    else onChange({ leftWeights, rightWeights: [...rightWeights, w] });
  };

  const removeAt = (side: "left" | "right", index: number) => {
    if (disabled) return;
    if (side === "left") {
      if (index < lockedLeftCount) return;
      onChange({ leftWeights: leftWeights.filter((_, i) => i !== index), rightWeights });
    } else {
      if (index < lockedRightCount) return;
      onChange({ leftWeights, rightWeights: rightWeights.filter((_, i) => i !== index) });
    }
  };

  const used = [...leftWeights, ...rightWeights];

  const countAvailable = (w: number) => {
    const total = availableWeights.filter((x) => x === w).length;
    const onScale = used.filter((x) => x === w).length;
    return total - onScale;
  };

  const uniqueWeights = [...new Set(availableWeights)];

  return (
    <div className={cn("mx-auto w-full max-w-md space-y-5", className)}>
      <motion.div
        animate={{ rotate: tilt }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative mx-auto flex items-end justify-center gap-6 pt-4"
      >
        <div className="flex w-28 flex-col items-center gap-2">
          <div className="flex min-h-[3.5rem] min-w-full flex-wrap justify-center gap-1 rounded-xl border border-white/15 bg-zinc-800/90 p-2">
            {leftWeights.length === 0 ? (
              <span className="text-[10px] text-zinc-500">Left pan</span>
            ) : (
              leftWeights.map((w, i) => (
                <WeightChip
                  key={`l-${i}-${w}`}
                  value={w}
                  side="left"
                  locked={i < lockedLeftCount}
                  onRemove={() => removeAt("left", i)}
                  disabled={disabled}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col items-center pb-1">
          <div className="h-3 w-3 rounded-full bg-zinc-500 ring-2 ring-zinc-400" />
          <div className="h-1 w-36 bg-gradient-to-r from-zinc-600 via-zinc-400 to-zinc-600" />
          <p className="mt-2 text-center text-xs tabular-nums text-zinc-400">
            {leftSum}
            {unit ? ` ${unit}` : ""} = {rightSum}
            {unit ? ` ${unit}` : ""}
          </p>
        </div>

        <div className="flex w-28 flex-col items-center gap-2">
          <div className="flex min-h-[3.5rem] min-w-full flex-wrap justify-center gap-1 rounded-xl border border-white/15 bg-zinc-800/90 p-2">
            {rightWeights.length === 0 ? (
              <span className="text-[10px] text-zinc-500">Right pan</span>
            ) : (
              rightWeights.map((w, i) => (
                <WeightChip
                  key={`r-${i}-${w}`}
                  value={w}
                  side="right"
                  locked={i < lockedRightCount}
                  onRemove={() => removeAt("right", i)}
                  disabled={disabled}
                />
              ))
            )}
          </div>
        </div>
      </motion.div>

      <div className="space-y-2">
        <p className="text-center text-xs font-medium text-zinc-500">Tap a weight, then choose a pan</p>
        <div className="flex flex-wrap justify-center gap-2">
          {uniqueWeights.map((w) => {
            const count = countAvailable(w);
            if (count <= 0) return null;
            return (
              <div key={w} className="flex gap-1">
                {Array.from({ length: count }, (_, i) => (
                  <button
                    key={`${w}-${i}`}
                    type="button"
                    disabled={disabled}
                    onClick={() => addWeight(w, leftSum <= rightSum ? "left" : "right")}
                    className="rounded-lg border border-white/15 bg-zinc-800 px-3 py-1.5 text-xs font-bold tabular-nums text-zinc-200 transition hover:border-violet-400/40 hover:bg-zinc-700"
                  >
                    +{w}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              const w = uniqueWeights.find((x) => countAvailable(x) > 0);
              if (w !== undefined) addWeight(w, "left");
            }}
            className="rounded-lg px-2 py-1 text-[10px] font-bold text-violet-300 hover:bg-white/5"
          >
            Add to left
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              const w = uniqueWeights.find((x) => countAvailable(x) > 0);
              if (w !== undefined) addWeight(w, "right");
            }}
            className="rounded-lg px-2 py-1 text-[10px] font-bold text-violet-300 hover:bg-white/5"
          >
            Add to right
          </button>
        </div>
      </div>
    </div>
  );
}
