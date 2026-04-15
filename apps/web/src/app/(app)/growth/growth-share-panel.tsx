"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@mindorbit/ui";
import { Copy, Share2 } from "lucide-react";

export function GrowthSharePanel({
  initialSummary,
}: {
  initialSummary: string;
}) {
  const [summary, setSummary] = useState(initialSummary);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function refreshSummary() {
    const res = await fetch("/api/growth/mastery-summary");
    if (!res.ok) return;
    const data = (await res.json()) as { summaryText: string };
    setSummary(data.summaryText);
  }

  async function createShareLink() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/growth/mastery-share", { method: "POST" });
      const data = (await res.json()) as { shareUrl?: string; error?: string };
      if (!res.ok) {
        setMessage(data.error ?? "Could not create link");
        return;
      }
      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
        await refreshSummary();
      }
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Copied to clipboard");
    } catch {
      setMessage("Copy failed — select and copy manually");
    }
  }

  async function nativeShare() {
    const text = summary;
    const url = shareUrl ?? undefined;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My MindOrbit mastery",
          text,
          url,
        });
      } catch {
        /* dismissed */
      }
    } else {
      await copy(url ? `${text}\n${url}` : text);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Shareable mastery report
        </CardTitle>
        <CardDescription>
          Generate a public link with preview image for social posts, or copy a text summary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Summary</p>
          <Input readOnly value={summary} className="font-mono text-xs" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => copy(summary)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy text
          </Button>
          <Button type="button" size="sm" onClick={createShareLink} disabled={busy}>
            {busy ? "Working…" : shareUrl ? "New share link" : "Create share link"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={nativeShare}>
            Share…
          </Button>
        </div>
        {shareUrl && (
          <div>
            <p className="mb-1 text-sm font-medium">Public link</p>
            <div className="flex gap-2">
              <Input readOnly value={shareUrl} className="text-xs" />
              <Button type="button" variant="secondary" size="sm" onClick={() => copy(shareUrl)}>
                Copy
              </Button>
            </div>
          </div>
        )}
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </CardContent>
    </Card>
  );
}
