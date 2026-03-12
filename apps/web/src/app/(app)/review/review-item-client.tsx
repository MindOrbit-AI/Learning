"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@mindorbit/lib";
import { ClipboardList, Check, X, Loader2 } from "lucide-react";

interface ReviewItemClientProps {
  id: string;
  nodeId: string;
  nodeTitle: string;
  dueAt: Date;
}

export function ReviewItemClient({
  id,
  nodeId,
  nodeTitle,
  dueAt,
}: ReviewItemClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function completeReview(correct: boolean) {
    setLoading(true);
    try {
      const res = await fetch(`/api/review/${id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correct }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted">
      <div className="flex items-center gap-4">
        <ClipboardList className="h-10 w-10 text-primary" />
        <div>
          <p className="font-medium">{nodeTitle}</p>
          <p className="text-sm text-muted-foreground">
            Due {formatRelativeTime(dueAt)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <a
          href={`/mastery-map?node=${nodeId}`}
          className="rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
        >
          Study →
        </a>
        <button
          onClick={() => completeReview(true)}
          disabled={loading}
          className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Check className="h-4 w-4" />
              Got it
            </>
          )}
        </button>
        <button
          onClick={() => completeReview(false)}
          disabled={loading}
          className="flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-sm text-white hover:bg-amber-700 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Practice
        </button>
      </div>
    </div>
  );
}
