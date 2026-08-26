"use client";

import { useRouter } from "next/navigation";
import { X, Mail } from "lucide-react";
import { Button, Card, CardContent } from "@mindorbit/ui";

export function ProgressDigestBanner({
  notifications,
}: {
  notifications: Array<{ id: string; title: string; body: string | null }>;
}) {
  const router = useRouter();
  if (notifications.length === 0) return null;

  const latest = notifications[0]!;

  async function dismiss(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    router.refresh();
  }

  return (
    <Card className="border-primary/20 bg-primary/[0.04]">
      <CardContent className="flex items-start gap-3 p-4">
        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{latest.title}</p>
          {latest.body && <p className="mt-1 text-sm text-muted-foreground">{latest.body}</p>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => dismiss(latest.id)}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
