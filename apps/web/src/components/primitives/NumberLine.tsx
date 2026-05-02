"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@mindorbit/lib";

export type NumberLineProps = {
  min: number;
  max: number;
  step: number;
  /** Primary draggable values on the axis (e.g. one learner marker). */
  userPoints: number[];
  onChange: (values: number[]) => void;
  /** Optional reference ticks (read-only). */
  targetPoints?: number[];
  className?: string;
};

export function NumberLine({
  min,
  max,
  step,
  userPoints,
  onChange,
  targetPoints = [],
  className,
}: NumberLineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const primary = userPoints[0] ?? (min + max) / 2;

  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let v = min; v <= max + 1e-9; v += step) {
      out.push(Number(v.toFixed(6)));
    }
    return out;
  }, [min, max, step]);

  const toFrac = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return primary;
      const r = el.getBoundingClientRect();
      const t = (clientX - r.left) / r.width;
      const raw = min + t * (max - min);
      const snapped = Math.round((raw - min) / step) * step + min;
      return Math.min(max, Math.max(min, Number(snapped.toFixed(4))));
    },
    [max, min, primary, step],
  );

  const pct = (primary - min) / (max - min || 1);

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    onChange([toFrac(e.clientX)]);
  };

  return (
    <div className={cn("w-full max-w-xl space-y-4", className)}>
      <div
        ref={trackRef}
        className="relative h-14 rounded-2xl bg-zinc-800/90 ring-1 ring-inset ring-white/10"
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
      >
        {ticks.map((t) => {
          const p = (t - min) / (max - min || 1);
          return (
            <div
              key={t}
              className="absolute top-0 h-full w-px bg-white/10"
              style={{ left: `${p * 100}%` }}
            />
          );
        })}
        {targetPoints.map((t) => {
          const p = (t - min) / (max - min || 1);
          return (
            <div
              key={`tgt-${t}`}
              className="absolute bottom-1 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-400/40"
              style={{ left: `${p * 100}%` }}
            />
          );
        })}
        <motion.button
          type="button"
          aria-label="Drag marker"
          className="absolute top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-violet-200 bg-gradient-to-br from-violet-400 to-fuchsia-500 shadow-lg active:cursor-grabbing"
          style={{ left: `${pct * 100}%` }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
            onChange([toFrac(e.clientX)]);
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        />
      </div>
      <div className="flex justify-between text-xs font-medium text-zinc-500">
        <span>{min}</span>
        <span className="text-violet-200">marker ≈ {primary.toFixed(3)}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
