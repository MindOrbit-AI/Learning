"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mindorbit/ui";
import { BookMarked, Loader2, Plus } from "lucide-react";

type Props = {
  subjectId: string;
  initiallyAdded: boolean;
};

export function AddSubjectToLibraryButton({ subjectId, initiallyAdded }: Props) {
  const router = useRouter();
  const [added, setAdded] = useState(initiallyAdded);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (added) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
        <BookMarked className="h-4 w-4 shrink-0 text-primary" />
        <span>This subject is in your library (it appears on Subjects and your dashboard).</span>
      </div>
    );
  }

  const handleAdd = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/subjects/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Could not add subject");
      }
      setAdded(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3 rounded-lg border border-dashed bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Add this subject to your library so it stays listed under Subjects and on your dashboard.
        </p>
        <Button type="button" onClick={handleAdd} disabled={loading} className="shrink-0 gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add to my subjects
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
