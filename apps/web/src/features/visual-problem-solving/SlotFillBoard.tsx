"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@mindorbit/ui";

const MIME = "application/x-mindorbit-slot-fill";

export type SlotFillItem = { id: string; label: string };
export type SlotFillZone = { id: string; label: string };

type Props = {
  items: SlotFillItem[];
  slots: SlotFillZone[];
  disabled: boolean;
  onChange: (patch: { slotAssignments: Record<string, string> }) => void;
};

export function SlotFillBoard({ items, slots, disabled, onChange }: Props) {
  const [assign, setAssign] = useState<Record<string, string>>({});
  const dragRef = useRef<{ itemId: string; fromSlotId?: string } | null>(null);

  const itemsKey = JSON.stringify(items.map((i) => ({ id: i.id, label: i.label })));
  const slotsKey = JSON.stringify(slots.map((s) => ({ id: s.id, label: s.label })));

  useEffect(() => {
    setAssign({});
  }, [itemsKey, slotsKey]);

  useEffect(() => {
    onChange({ slotAssignments: assign });
  }, [assign, onChange]);

  const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  const endDrag = useCallback(() => {
    dragRef.current = null;
  }, []);

  const startDrag = (e: React.DragEvent, itemId: string, fromSlotId?: string) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    dragRef.current = { itemId, fromSlotId };
    try {
      e.dataTransfer.setData(MIME, JSON.stringify({ itemId, fromSlotId }));
      e.dataTransfer.effectAllowed = "move";
    } catch {
      /* ignore */
    }
  };

  const readPayload = (e: React.DragEvent): { itemId: string; fromSlotId?: string } | null => {
    try {
      const raw = e.dataTransfer.getData(MIME);
      if (raw) return JSON.parse(raw) as { itemId: string; fromSlotId?: string };
    } catch {
      /* ignore */
    }
    return dragRef.current;
  };

  const applyToSlot = (slotId: string, payload: { itemId: string; fromSlotId?: string }) => {
    setAssign((prev) => {
      const next = { ...prev };
      for (const [sid, iid] of Object.entries(next)) {
        if (iid === payload.itemId) delete next[sid];
      }
      if (payload.fromSlotId === slotId) return next;
      next[slotId] = payload.itemId;
      return next;
    });
  };

  const onSlotDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onSlotDrop = (e: React.DragEvent, slotId: string) => {
    if (disabled) return;
    e.preventDefault();
    const p = readPayload(e);
    if (!p?.itemId) return;
    applyToSlot(slotId, p);
    endDrag();
  };

  const onBankDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onBankDrop = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    const p = readPayload(e);
    if (!p?.itemId) return;
    if (p.fromSlotId) {
      setAssign((prev) => {
        const n = { ...prev };
        delete n[p.fromSlotId!];
        return n;
      });
    }
    endDrag();
  };

  const occupied = new Set(Object.values(assign));
  const bankItems = items.filter((i) => !occupied.has(i.id));

  if (items.length === 0 || slots.length === 0) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">
        This activity needs <span className="font-medium">items</span> and <span className="font-medium">slots</span> in
        the lesson data.
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-4">
      <p className="text-sm text-muted-foreground">
        Drag each card into a slot to build the array. Drop on the bank to return a card from a slot.
      </p>
      <div className="flex flex-wrap gap-3">
        {slots.map((s) => {
          const iid = assign[s.id];
          const card = iid ? itemById.get(iid) : null;
          return (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {s.label}
              </span>
              <div
                onDragOver={onSlotDragOver}
                onDrop={(e) => onSlotDrop(e, s.id)}
                className={cn(
                  "flex min-h-[3.25rem] min-w-[6.5rem] items-center justify-center rounded-2xl border-2 border-dashed px-2 py-2 text-sm transition",
                  card ? "border-primary/50 bg-primary/10" : "border-muted bg-muted/25",
                  disabled && "pointer-events-none opacity-45"
                )}
              >
                {card ? (
                  <button
                    type="button"
                    draggable={!disabled}
                    onDragStart={(e) => startDrag(e, card.id, s.id)}
                    onDragEnd={endDrag}
                    className="touch-manipulation cursor-grab rounded-xl border bg-card px-3 py-1.5 font-medium shadow-sm active:cursor-grabbing"
                  >
                    {card.label}
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">Drop</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div
        onDragOver={onBankDragOver}
        onDrop={onBankDrop}
        className={cn(
          "rounded-2xl border-2 border-dashed border-muted/70 bg-muted/15 p-3",
          disabled && "pointer-events-none opacity-45"
        )}
      >
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Bank</p>
        <div className="flex flex-wrap gap-2">
          {bankItems.length === 0 ? (
            <span className="text-xs text-muted-foreground">
              All items are in slots — drag a card out of a slot to move it here.
            </span>
          ) : (
            bankItems.map((it) => (
              <button
                key={it.id}
                type="button"
                draggable={!disabled}
                onDragStart={(e) => startDrag(e, it.id)}
                onDragEnd={endDrag}
                className="touch-manipulation cursor-grab rounded-xl border bg-card px-3 py-2 text-sm font-medium shadow-sm active:cursor-grabbing"
              >
                {it.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
