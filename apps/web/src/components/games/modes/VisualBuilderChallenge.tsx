"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@mindorbit/ui";
import { cn } from "@mindorbit/ui";
import { CheckCircle2, LayoutTemplate, MousePointer2, Sparkles, XCircle } from "lucide-react";
import type { InteractiveModeBaseProps } from "@/features/interactive-games/runner-types";
import { getGameConfig } from "@/features/interactive-games/runner-types";
import { DragDropCanvas } from "@/components/games/shared/DragDropCanvas";
import { FeedbackToast } from "@/components/games/shared/FeedbackToast";

type Item = { id: string; label: string; category?: string };
type DropZone = { id: string; label: string; acceptedItems: string[] };

function parseItems(raw: unknown): Item[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => {
      const o = x as Record<string, unknown>;
      return {
        id: String(o.id ?? ""),
        label: String(o.label ?? o.id ?? "Piece"),
        category: o.category != null ? String(o.category) : undefined,
      };
    })
    .filter((i) => i.id);
}

function parseZones(raw: unknown): DropZone[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => {
      const o = x as Record<string, unknown>;
      const acc = o.acceptedItems;
      const acceptedItems = Array.isArray(acc) ? acc.map((a) => String(a)) : [];
      return {
        id: String(o.id ?? ""),
        label: String(o.label ?? o.id ?? "Zone"),
        acceptedItems,
      };
    })
    .filter((z) => z.id);
}

function multiset(ids: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const id of ids) {
    m.set(id, (m.get(id) ?? 0) + 1);
  }
  return m;
}

function multisetsEqual(a: Map<string, number>, b: Map<string, number>): boolean {
  if (a.size !== b.size) return false;
  for (const [k, v] of a) {
    if (b.get(k) !== v) return false;
  }
  return true;
}

/** Each zone’s placed ids (multiset) must match that zone’s acceptedItems; pieces are unique across the board. */
function layoutIsCorrect(placements: Record<string, string[]>, zones: DropZone[]): boolean {
  if (zones.length === 0) return false;
  const seen = new Set<string>();
  for (const z of zones) {
    const placed = placements[z.id] ?? [];
    if (!multisetsEqual(multiset(placed), multiset(z.acceptedItems))) return false;
    for (const id of placed) {
      if (seen.has(id)) return false;
      seen.add(id);
    }
  }
  return true;
}

function partitionMatchesItems(items: Item[], zones: DropZone[]): boolean {
  const fromItems = multiset(items.map((i) => i.id));
  const fromZones = multiset(zones.flatMap((z) => z.acceptedItems));
  return multisetsEqual(fromItems, fromZones);
}

function categoryStyles(category?: string) {
  const c = (category ?? "").toLowerCase();
  if (c.includes("support") || c.includes("evidence")) {
    return "border-cyan-500/40 bg-cyan-950/40 text-cyan-100";
  }
  if (c.includes("concept") || c.includes("core") || c.includes("idea")) {
    return "border-violet-500/40 bg-violet-950/40 text-violet-100";
  }
  return "border-indigo-500/35 bg-indigo-950/30 text-indigo-100";
}

export function VisualBuilderChallenge({
  envelope,
  runtime,
  setRuntime,
  setScoreXp,
  postEvent,
  onCompleteSession,
}: InteractiveModeBaseProps) {
  const gc = getGameConfig(envelope);
  const topic = String(envelope.topic ?? "visual model");

  const items = useMemo(() => parseItems(gc.items), [gc.items]);
  const dropZones = useMemo(() => parseZones(gc.dropZones), [gc.dropZones]);
  const diagramGoal = String(gc.diagramGoal ?? "Place each piece in the correct region.");

  const [placements, setPlacements] = useState<Record<string, string[]>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; variant: "success" | "error" | "info" } | null>(null);
  const [validatedOk, setValidatedOk] = useState(false);
  const dragPayload = useRef<{ type: "item"; itemId: string } | null>(null);
  const t0 = useRef(Date.now());

  const configPartitionOk = useMemo(() => partitionMatchesItems(items, dropZones), [items, dropZones]);

  const itemLabel = useCallback((id: string) => items.find((i) => i.id === id)?.label ?? id, [items]);

  const removeItemEverywhere = useCallback((prev: Record<string, string[]>, itemId: string): Record<string, string[]> => {
    const next: Record<string, string[]> = {};
    for (const [zid, arr] of Object.entries(prev)) {
      const filtered = arr.filter((id) => id !== itemId);
      if (filtered.length > 0) next[zid] = filtered;
    }
    return next;
  }, []);

  const addItemToZone = useCallback((zoneId: string, itemId: string) => {
    setPlacements((prev) => {
      const cleared = removeItemEverywhere(prev, itemId);
      const cur = cleared[zoneId] ?? [];
      return { ...cleared, [zoneId]: [...cur, itemId] };
    });
    setValidatedOk(false);
  }, [removeItemEverywhere]);

  const onDragStartItem = (itemId: string) => (e: React.DragEvent) => {
    dragPayload.current = { type: "item", itemId };
    e.dataTransfer.setData("text/plain", JSON.stringify(dragPayload.current));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragStartZoneChip = (itemId: string) => (e: React.DragEvent) => {
    dragPayload.current = { type: "item", itemId };
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: "item", itemId }));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const parseDrop = (e: React.DragEvent) => {
    let raw = e.dataTransfer.getData("text/plain");
    if (!raw && dragPayload.current) {
      raw = JSON.stringify(dragPayload.current);
    }
    dragPayload.current = null;
    try {
      return JSON.parse(raw) as { type: string; itemId?: string };
    } catch {
      return null;
    }
  };

  const onDropZone = (zoneId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const p = parseDrop(e);
    if (!p || p.type !== "item" || !p.itemId) return;
    addItemToZone(zoneId, p.itemId);
    setSelectedItemId(null);
    setToast(null);
  };

  const returnItemToPalette = useCallback((itemId: string) => {
    setPlacements((prev) => removeItemEverywhere(prev, itemId));
    setValidatedOk(false);
  }, [removeItemEverywhere]);

  const onDropPaletteReturn = (e: React.DragEvent) => {
    e.preventDefault();
    const p = parseDrop(e);
    if (!p || p.type !== "item" || !p.itemId) return;
    returnItemToPalette(p.itemId);
    setSelectedItemId(null);
    setToast(null);
  };

  const placedIds = useMemo(() => {
    const s = new Set<string>();
    for (const arr of Object.values(placements)) {
      for (const id of arr) s.add(id);
    }
    return s;
  }, [placements]);

  const paletteItemIds = useMemo(() => items.map((i) => i.id).filter((id) => !placedIds.has(id)), [items, placedIds]);

  const onPaletteClick = (itemId: string) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
      setToast(null);
      return;
    }
    setSelectedItemId(itemId);
    setToast({ text: `Selected “${itemLabel(itemId)}”. Tap a drop zone to add it there.`, variant: "info" });
  };

  const onZoneClick = (zoneId: string) => {
    if (!selectedItemId) {
      setToast({ text: "Pick a piece from the palette first, or drag it into a zone.", variant: "info" });
      return;
    }
    addItemToZone(zoneId, selectedItemId);
    setSelectedItemId(null);
    setToast(null);
  };

  const validate = useCallback(async () => {
    const ok = layoutIsCorrect(placements, dropZones);
    const ms = Date.now() - t0.current;
    setValidatedOk(ok);
    const r = await postEvent({
      eventType: "visual_builder_validate",
      payload: {
        concept: topic,
        difficulty: "medium",
        zoneCount: dropZones.length,
        itemCount: items.length,
      },
      isCorrect: ok,
      responseTimeMs: ms,
    });
    setRuntime(r.state);
    setScoreXp(r.score, r.xp);
    if (ok) {
      setToast({ text: "Layout matches the goal — nice visual reasoning.", variant: "success" });
    } else {
      setToast({
        text: "Not yet — each zone must contain exactly the pieces listed for it in the config, with no duplicates.",
        variant: "error",
      });
    }
  }, [dropZones, items.length, placements, postEvent, setRuntime, setScoreXp, topic]);

  const finish = useCallback(async () => {
    if (!validatedOk) {
      setToast({ text: "Validate your diagram successfully first.", variant: "info" });
      return;
    }
    await onCompleteSession();
  }, [validatedOk, onCompleteSession]);

  if (items.length === 0 || dropZones.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 text-center text-sm text-amber-100">
        This visual builder is missing `items` or `dropZones` in the generated config. Regenerate the game or pick
        another topic.
      </div>
    );
  }

  const hasAnyPlacement = useMemo(() => Object.values(placements).some((a) => a.length > 0), [placements]);

  return (
    <div className="space-y-6">
      {!configPartitionOk ? (
        <div className="rounded-2xl border border-amber-500/35 bg-amber-950/25 p-4 text-sm text-amber-100/95">
          <p className="font-semibold text-amber-50">Config heads-up</p>
          <p className="mt-1 text-amber-100/85">
            The piece list and the zone targets don’t line up as a clean partition (ids in{" "}
            <code className="rounded bg-black/30 px-1">items</code> vs all{" "}
            <code className="rounded bg-black/30 px-1">acceptedItems</code>). You can still try to match each zone’s
            target multiset; if it feels impossible, regenerate the game.
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/40 to-zinc-950/80 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-300/80">Goal</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-200">{diagramGoal}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <MousePointer2 className="h-4 w-4 text-indigo-400" />
        <span>
          Zones can hold <strong className="text-zinc-200">several</strong> pieces. Drag into a zone, or tap a piece then
          a zone. Drag back to the palette to remove.
        </span>
      </div>

      <FeedbackToast message={toast?.text ?? null} variant={toast?.variant ?? "info"} />

      <DragDropCanvas className="border-indigo-500/20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/25">
        <div className="min-h-[120px]" onDragOver={onDragOver} onDrop={onDropPaletteReturn}>
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-indigo-100/90">
            <LayoutTemplate className="h-4 w-4 text-indigo-400" />
            Palette
          </div>
          <p className="mb-3 text-[11px] text-zinc-500">Drag a placed piece here to return it to the palette.</p>
          {paletteItemIds.length === 0 ? (
            <p className="text-sm text-zinc-500">All pieces are on the canvas — rearrange by dragging between zones.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {paletteItemIds.map((id) => {
                const it = items.find((x) => x.id === id)!;
                const active = selectedItemId === id;
                return (
                  <div
                    key={id}
                    draggable
                    onDragStart={onDragStartItem(id)}
                    onClick={() => onPaletteClick(id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onPaletteClick(id);
                      }
                    }}
                    className={cn(
                      "cursor-grab rounded-2xl border px-4 py-3 shadow-md transition-colors active:cursor-grabbing",
                      categoryStyles(it.category),
                      active && "ring-2 ring-cyan-400/60"
                    )}
                  >
                    <p className="text-sm font-bold">{it.label}</p>
                    {it.category ? <p className="mt-1 text-[10px] uppercase tracking-wider opacity-70">{it.category}</p> : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DragDropCanvas>

      <div className="grid gap-4 sm:grid-cols-2">
        {dropZones.map((z) => {
          const placed = placements[z.id] ?? [];
          const targetN = z.acceptedItems.length;
          return (
            <div
              key={z.id}
              onDragOver={onDragOver}
              onDrop={onDropZone(z.id)}
              onClick={() => onZoneClick(z.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onZoneClick(z.id);
                }
              }}
              className={cn(
                "min-h-[140px] rounded-2xl border-2 border-dashed p-4 text-left transition-colors",
                "border-zinc-700 bg-zinc-900/50 hover:border-indigo-500/45",
                placed.length > 0 && "border-indigo-500/50 bg-indigo-950/20"
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{z.label}</p>
                <p className="text-[10px] text-zinc-600">
                  {placed.length}/{targetN} pieces
                </p>
              </div>
              {placed.length === 0 ? (
                <p className="mt-6 text-sm text-zinc-600">Drop pieces here</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {placed.map((pid) => (
                    <div
                      key={pid}
                      draggable
                      onDragStart={onDragStartZoneChip(pid)}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "inline-block cursor-grab rounded-xl border px-3 py-2 active:cursor-grabbing",
                        categoryStyles(items.find((i) => i.id === pid)?.category)
                      )}
                    >
                      <p className="text-sm font-bold">{itemLabel(pid)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          className="rounded-xl bg-indigo-600 px-6 font-bold hover:bg-indigo-500"
          onClick={() => void validate()}
        >
          Check placement
        </Button>
        <AnimatePresence>
          {validatedOk ? (
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <Button
                type="button"
                className="rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 px-6 font-bold"
                onClick={() => void finish()}
              >
                Complete &amp; view results
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {validatedOk ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            Diagram locked in. Streak: {runtime.streak} — finish to bank XP.
          </motion.div>
        ) : hasAnyPlacement && !layoutIsCorrect(placements, dropZones) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-zinc-500"
          >
            <XCircle className="h-4 w-4 text-rose-400" />
            Tip: each zone must match its target list exactly (right pieces, right counts).
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
