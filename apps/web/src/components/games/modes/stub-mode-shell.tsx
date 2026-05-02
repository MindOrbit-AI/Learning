"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@mindorbit/ui";
import { GAME_MODE_CATALOG, type GameModeId } from "@/features/interactive-games/game-modes";

export function StubInteractiveMode({ modeId }: { modeId: GameModeId }) {
  const meta = GAME_MODE_CATALOG.find((m) => m.id === modeId);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 text-center shadow-xl"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Preview</p>
      <h2 className="mt-2 text-2xl font-black text-zinc-50">{meta?.label ?? modeId}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">{meta?.description}</p>
      <p className="mt-4 text-sm text-amber-200/90">
        This cognitive mode is wired into the engine — interactive UI ships next.
      </p>
      <Button asChild className="mt-8 rounded-xl bg-zinc-100 text-zinc-900 hover:bg-white" variant="secondary">
        <Link href="/games">Back to mission control</Link>
      </Button>
    </motion.div>
  );
}
