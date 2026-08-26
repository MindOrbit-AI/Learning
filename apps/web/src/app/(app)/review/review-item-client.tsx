"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@mindorbit/lib";
import { ClipboardList } from "lucide-react";
import { Button } from "@mindorbit/ui";

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

  return (
    <div className="flex flex-col gap-3 rounded-xl border p-4 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <ClipboardList className="h-10 w-10 text-primary" />
        <div>
          <p className="font-medium">{nodeTitle}</p>
          <p className="text-sm text-muted-foreground">Due {formatRelativeTime(dueAt)}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href={`/mastery-map?node=${nodeId}`}
          className="rounded-lg border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
        >
          Study map
        </Link>
        <Button size="sm" onClick={() => router.push(`/review?session=${id}`)}>
          Start review
        </Button>
      </div>
    </div>
  );
}
