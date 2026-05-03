"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@mindorbit/ui";
import { seededShuffle } from "@/lib/deterministicShuffle";
import { isComplementaryBasePair, type BasePairToken } from "./basePairSelectValidation";

type Props = {
  tokens: BasePairToken[];
  shuffleSeed: string;
  disabled: boolean;
  onChange: (pairs: [string, string][]) => void;
};

export function BasePairSelectBoard({ tokens, shuffleSeed, disabled, onChange }: Props) {
  const ordered = useMemo(() => seededShuffle(tokens, shuffleSeed), [tokens, shuffleSeed]);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pairs, setPairs] = useState<[string, string][]>([]);
  const [badFlash, setBadFlash] = useState(false);

  useEffect(() => {
    setPendingId(null);
    setPairs([]);
  }, [tokens, shuffleSeed]);

  const pairedIds = useMemo(() => {
    const s = new Set<string>();
    for (const [a, b] of pairs) {
      s.add(a);
      s.add(b);
    }
    return s;
  }, [pairs]);

  useEffect(() => {
    onChange(pairs);
  }, [pairs, onChange]);

  const labelOf = useCallback((id: string) => ordered.find((t) => t.id === id)?.label ?? id, [ordered]);

  const tap = useCallback(
    (id: string) => {
      if (disabled) return;
      if (pairedIds.has(id)) {
        setPairs((prev) => prev.filter(([a, b]) => a !== id && b !== id));
        setPendingId(null);
        return;
      }
      if (!pendingId) {
        setPendingId(id);
        return;
      }
      if (pendingId === id) {
        setPendingId(null);
        return;
      }
      const la = labelOf(pendingId);
      const lb = labelOf(id);
      if (isComplementaryBasePair(la, lb)) {
        setPairs((prev) => [...prev, [pendingId, id]]);
        setPendingId(null);
      } else {
        setBadFlash(true);
        setTimeout(() => setBadFlash(false), 450);
        setPendingId(null);
      }
    },
    [disabled, pairedIds, pendingId, labelOf]
  );

  return (
    <div className="relative z-10 mt-3 space-y-4">
      <p className="text-sm text-muted-foreground">
        Tap two bases to pair them. <span className="font-medium text-foreground">A</span> pairs with{" "}
        <span className="font-medium text-foreground">T</span>; <span className="font-medium text-foreground">C</span>{" "}
        pairs with <span className="font-medium text-foreground">G</span>. Tap a locked base again to unpair it.
      </p>
      <div
        className={cn("flex flex-wrap justify-center gap-2 sm:gap-3", badFlash && "animate-pulse")}
      >
        {ordered.map((t) => {
          const locked = pairedIds.has(t.id);
          const selected = pendingId === t.id;
          return (
            <motion.button
              key={t.id}
              type="button"
              disabled={disabled}
              aria-pressed={selected || locked}
              onClick={() => tap(t.id)}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "min-h-[3rem] min-w-[3rem] rounded-2xl border-2 text-lg font-bold transition touch-manipulation sm:min-h-[3.25rem] sm:min-w-[3.25rem] sm:text-xl",
                locked &&
                  "border-emerald-500/70 bg-emerald-500/15 text-emerald-950 shadow-sm dark:text-emerald-50",
                !locked &&
                  selected &&
                  "border-primary bg-primary/15 text-primary shadow-md ring-2 ring-primary/25",
                !locked &&
                  !selected &&
                  "border-muted bg-background hover:border-primary/45 hover:bg-muted/40"
              )}
            >
              {t.label}
            </motion.button>
          );
        })}
      </div>
      {pairs.length > 0 ? (
        <div className="rounded-xl border border-muted/50 bg-muted/20 px-3 py-2">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Locked pairs</p>
          <ul className="flex flex-wrap gap-2 text-sm font-semibold">
            {pairs.map(([a, b]) => (
              <li
                key={`${a}-${b}`}
                className="rounded-lg bg-background/80 px-2.5 py-1 font-mono text-foreground shadow-sm"
              >
                {labelOf(a)} — {labelOf(b)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {(() => {
          const need = Math.max(1, Math.floor(tokens.length / 2));
          return `${pairs.length} of ${need} complementary pair${need === 1 ? "" : "s"} formed`;
        })()}
      </p>
    </div>
  );
}
