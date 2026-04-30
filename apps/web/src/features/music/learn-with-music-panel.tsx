"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@mindorbit/ui";
import { Headphones, Loader2, Pause, Play, SkipForward, Timer } from "lucide-react";
import type { GenerateSongDifficulty, MusicLearningAsset } from "./types";
import { mapNodeDifficultyToSong } from "./map-node-difficulty";

type Props = {
  conceptId: string;
  title: string;
  explanation: string;
  /** Raw ConceptNode.difficulty from API */
  difficultyRaw: string;
};

function isAsset(x: unknown): x is MusicLearningAsset {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.conceptId === "string" &&
    o.rap !== undefined &&
    o.chant !== undefined &&
    o.melody !== undefined &&
    o.reinforcement !== undefined
  );
}

export function LearnWithMusicPanel({ conceptId, title, explanation, difficultyRaw }: Props) {
  const difficulty: GenerateSongDifficulty = useMemo(
    () => mapNodeDifficultyToSong(difficultyRaw),
    [difficultyRaw]
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<MusicLearningAsset | null>(null);

  const [rapPlaying, setRapPlaying] = useState(false);
  const [chantIndex, setChantIndex] = useState(0);
  const [chantAuto, setChantAuto] = useState(false);
  const [boostRemainingSec, setBoostRemainingSec] = useState<number | null>(null);

  useEffect(() => {
    if (!chantAuto || !asset) return;
    const t = window.setInterval(() => {
      setChantIndex((i) => {
        const next = (i + 1) % Math.max(1, asset.chant.lines.length);
        return next;
      });
    }, 2200);
    return () => window.clearInterval(t);
  }, [chantAuto, asset]);

  useEffect(() => {
    if (boostRemainingSec == null || boostRemainingSec <= 0) return;
    const t = window.setInterval(() => {
      setBoostRemainingSec((s) => (s == null ? s : s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [boostRemainingSec]);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/music/generate-song", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conceptId,
          title,
          explanation,
          difficulty,
        }),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : `Request failed (${res.status})`;
        throw new Error(msg);
      }
      if (!isAsset(data)) throw new Error("Unexpected response shape");
      setAsset(data);
      setChantIndex(0);
      setRapPlaying(false);
      setBoostRemainingSec(null);
    } catch (e) {
      setAsset(null);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [conceptId, title, explanation, difficulty]);

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-violet-500/5 p-3">
      <Button
        type="button"
        variant={open ? "secondary" : "default"}
        size="sm"
        className="w-full gap-2 font-bold"
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);
          if (nextOpen && !asset && !loading) void generate();
        }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Headphones className="h-4 w-4" />}
        🎧 Learn with Music
      </Button>

      {open && (
        <div className="mt-3 space-y-3 text-sm">
          {error && <p className="rounded-lg bg-destructive/15 px-2 py-1.5 text-destructive">{error}</p>}

          {loading && (
            <p className="text-muted-foreground flex items-center gap-2 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              Composing your memory hooks…
            </p>
          )}

          {asset && (
            <>
              <div className="rounded-xl border bg-card/80 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">Rap</p>
                  <span className="text-[10px] text-muted-foreground">
                    {asset.rap.bpm} BPM · {asset.rap.style}
                  </span>
                </div>
                <div className="flex justify-center gap-2 py-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    onClick={() => setRapPlaying((p) => !p)}
                    aria-label={rapPlaying ? "Pause" : "Play"}
                  >
                    {rapPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
                  {rapPlaying ? (
                    <>
                      <span className="font-semibold text-primary">Verse · </span>
                      {asset.rap.verse}
                      {"\n\n"}
                      <span className="font-semibold text-violet-600 dark:text-violet-400">Hook · </span>
                      {asset.rap.hook}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Tap play to reveal verse + hook (read-along player).</span>
                  )}
                </p>
              </div>

              <div className="rounded-xl border bg-card/80 p-3 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">Chant</p>
                  <label className="flex cursor-pointer items-center gap-1 text-[10px] text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={chantAuto}
                      onChange={(e) => setChantAuto(e.target.checked)}
                      className="rounded border-primary/40"
                    />
                    Repeat mode
                  </label>
                </div>
                <p className="mb-2 text-[10px] text-muted-foreground">Pattern: {asset.chant.rhythmPattern}</p>
                <p className="min-h-[3rem] rounded-lg bg-muted/40 px-3 py-2 text-center text-base font-semibold leading-snug">
                  {asset.chant.lines[chantIndex] ?? "—"}
                </p>
                <div className="mt-2 flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() =>
                      setChantIndex((i) => (i + 1) % Math.max(1, asset.chant.lines.length))
                    }
                  >
                    <SkipForward className="h-3 w-3" />
                    Next line
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border bg-card/80 p-3 shadow-sm">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Melody</p>
                <p className="text-[10px] text-muted-foreground">Tone: {asset.melody.tone}</p>
                <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed">{asset.melody.lyrics}</p>
              </div>

              <div className="rounded-xl border bg-card/80 p-3 shadow-sm">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">Reinforcement</p>
                <p className="text-xs text-muted-foreground">{asset.reinforcement.boost}</p>
                <p className="mt-2 rounded-lg bg-primary/10 px-2 py-1.5 text-xs font-medium">
                  Recall cue: <span className="italic">{asset.reinforcement.recall}</span>
                </p>
                <Button
                  type="button"
                  className="mt-3 w-full gap-2"
                  variant="secondary"
                  onClick={() => setBoostRemainingSec(300)}
                  disabled={boostRemainingSec != null && boostRemainingSec > 0}
                >
                  <Timer className="h-4 w-4" />
                  {boostRemainingSec != null && boostRemainingSec > 0
                    ? `Boost active · ${Math.floor(boostRemainingSec / 60)}:${String(boostRemainingSec % 60).padStart(2, "0")}`
                    : "Start 5-minute boost"}
                </Button>
                {boostRemainingSec === 0 && (
                  <p className="mt-2 text-center text-[10px] font-medium text-primary">Session complete — come back tomorrow.</p>
                )}
              </div>

              <Button type="button" variant="ghost" size="sm" className="w-full text-xs" onClick={() => void generate()}>
                Regenerate
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
