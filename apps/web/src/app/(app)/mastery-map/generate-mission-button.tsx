"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Rocket } from "lucide-react";

export function GenerateMissionButton({ nodeId }: { nodeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function generate() {
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
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={generate}
      disabled={loading}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90 disabled:opacity-50 disabled:hover:scale-100"
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
  );
}
