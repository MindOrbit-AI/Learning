"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";

export function RegenerateMissionButton({
  nodeId,
  sceneBased = true,
  onSuccess,
  onMapUpdated,
}: {
  nodeId: string;
  sceneBased?: boolean;
  onSuccess: (missionId: string) => void;
  /** Refresh mastery map node details (e.g. new mission id) without full page reload. */
  onMapUpdated?: () => void | Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);

  async function regenerate() {
    setLimitError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/missions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId, sceneBased, regenerate: true }),
      });
      const data = (await res.json()) as { missionId?: string; error?: string; upgradeRequired?: boolean };
      if (res.ok && data.missionId) {
        await onMapUpdated?.();
        onSuccess(data.missionId);
      } else if (res.status === 403 && data.upgradeRequired) {
        setLimitError(data.error ?? "Mission limit reached");
      } else {
        setLimitError(data.error ?? "Could not regenerate");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {limitError ? (
        <div className="rounded-lg bg-amber-50 p-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {limitError}
          <Link
            href="/pricing"
            className="mt-2 flex items-center justify-center gap-1 text-primary hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Upgrade to Pro
          </Link>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => void regenerate()}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/25 bg-background px-4 py-3 text-sm font-bold text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        Regenerate
      </button>
      <p className="text-center text-[10px] leading-snug text-muted-foreground">
        Replaces your in-progress mission with a freshly generated one (progress on the old version is cleared).
      </p>
    </div>
  );
}
