"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Rocket, Sparkles } from "lucide-react";

export function GenerateMissionButton({ nodeId }: { nodeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);

  async function generate() {
    setLimitError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/missions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId, sceneBased: true }),
      });
      const data = await res.json();
      if (res.ok && data.missionId) {
        router.push(`/missions/${data.missionId}`);
      } else if (res.status === 403 && data.upgradeRequired) {
        setLimitError(data.error ?? "Mission limit reached");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 space-y-2">
      {limitError && (
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
      )}
      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90 disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Rocket className="h-4 w-4" />
            Generate Mission
          </>
        )}
      </button>
    </div>
  );
}
