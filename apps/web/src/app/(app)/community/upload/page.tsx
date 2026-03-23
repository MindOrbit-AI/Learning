"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@mindorbit/ui";
import { FileText, Youtube, BookOpen, Link2, Loader2, CheckCircle, Image as ImageIcon, Globe, Sparkles } from "lucide-react";

type IngestionMode = "pdf" | "image" | "youtube" | "text" | "url";

export default function UploadPage() {
  const router = useRouter();
  const [ingestSourceType, setIngestSourceType] = useState<IngestionMode>("youtube");
  const [ingestYouTubeUrl, setIngestYouTubeUrl] = useState("");
  const [ingestUrl, setIngestUrl] = useState("");
  const [ingestContent, setIngestContent] = useState("");
  const [ingestFile, setIngestFile] = useState<File | null>(null);
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestResult, setIngestResult] = useState<{
    sourceId: string;
    nodeIds: string[];
    resourceId: string | null;
    message: string;
    xpEarned?: number;
  } | null>(null);
  const [ingestError, setIngestError] = useState<string | null>(null);

  const showReward = ingestResult?.resourceId && (ingestResult?.xpEarned ?? 0) > 0;
  const hasResource = !!ingestResult?.resourceId;

  useEffect(() => {
    if (!hasResource) return;
    const t = setTimeout(() => {
      router.push(`/community/${ingestResult!.resourceId!}`);
    }, showReward ? 2500 : 500);
    return () => clearTimeout(t);
  }, [hasResource, showReward, ingestResult?.resourceId, router]);

  const onSubmitIngest = useCallback(async () => {
    setIngestError(null);
    setIngestResult(null);
    setIngestLoading(true);

    async function parseJsonResponse(res: Response): Promise<Record<string, unknown>> {
      const text = await res.text();
      if (!text?.trim()) {
        if (!res.ok) {
          throw new Error(`Upload failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""}). The server may have timed out.`);
        }
        throw new Error("Empty response from server");
      }
      try {
        return JSON.parse(text) as Record<string, unknown>;
      } catch {
        throw new Error(res.ok ? "Invalid response from server" : `Upload failed (${res.status})`);
      }
    }

    try {
      if ((ingestSourceType === "pdf" || ingestSourceType === "image") && ingestFile) {
        const formData = new FormData();
        formData.set("file", ingestFile);
        formData.set("sourceType", ingestSourceType);

        const res = await fetch("/api/ingestion/upload", {
          method: "POST",
          body: formData,
        });
        const data = await parseJsonResponse(res);
        if (!res.ok) throw new Error((data.error as string) ?? "Upload failed");
        setIngestResult(data as Parameters<typeof setIngestResult>[0]);
        if (!data?.resourceId) router.push("/community");
      } else if (ingestSourceType === "youtube") {
        const res = await fetch("/api/ingestion/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceType: "youtube",
            sourceUrl: ingestYouTubeUrl,
          }),
        });
        const data = await parseJsonResponse(res);
        if (!res.ok) throw new Error((data.error as string) ?? "Upload failed");
        setIngestResult(data as Parameters<typeof setIngestResult>[0]);
        if (!data?.resourceId) router.push("/community");
      } else if (ingestSourceType === "url") {
        const res = await fetch("/api/ingestion/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceType: "url",
            sourceUrl: ingestUrl,
          }),
        });
        const data = await parseJsonResponse(res);
        if (!res.ok) throw new Error((data.error as string) ?? "Upload failed");
        setIngestResult(data as Parameters<typeof setIngestResult>[0]);
        if (!data?.resourceId) router.push("/community");
      } else {
        const res = await fetch("/api/ingestion/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceType: ingestSourceType,
            content: ingestContent,
          }),
        });
        const data = await parseJsonResponse(res);
        if (!res.ok) throw new Error((data.error as string) ?? "Upload failed");
        setIngestResult(data as Parameters<typeof setIngestResult>[0]);
        if (!data?.resourceId) router.push("/community");
      }
    } catch (e) {
      setIngestError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setIngestLoading(false);
    }
  }, [
    ingestSourceType,
    ingestFile,
    ingestYouTubeUrl,
    ingestUrl,
    ingestContent,
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {showReward && ingestResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          role="alert"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-6 px-8">
            <div className="rounded-full bg-primary/20 p-6 animate-pulse">
              <Sparkles className="h-16 w-16 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Upload Complete!</h2>
              <p className="mt-1 text-muted-foreground">Your resource is ready</p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border-2 border-primary/30 bg-primary/10 px-8 py-4">
              <span className="text-3xl font-bold text-primary">+{ingestResult.xpEarned ?? 0} XP</span>
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Redirecting to your resource...</p>
            <Button
              size="lg"
              onClick={() => router.push(`/community/${ingestResult.resourceId}`)}
              className="mt-2"
            >
              View now
            </Button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold">Upload Content</h1>

      <Card>
        <CardHeader>
          <CardDescription>
            Upload PDFs, images, YouTube videos, or extract from URLs. The system
            converts them into concept nodes, diagnostics, missions, and
            practice questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Content Source
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "youtube" as const, label: "YouTube", icon: Youtube },
                  { id: "url" as const, label: "URL", icon: Globe },
                  { id: "pdf" as const, label: "PDF", icon: FileText },
                  { id: "image" as const, label: "Image", icon: ImageIcon },
                  { id: "text" as const, label: "Text", icon: BookOpen },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setIngestSourceType(id);
                      setIngestFile(null);
                      setIngestYouTubeUrl("");
                      setIngestUrl("");
                      setIngestContent("");
                      setIngestResult(null);
                      setIngestError(null);
                    }}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition ${
                      ingestSourceType === id
                        ? "border-primary bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {ingestSourceType === "pdf" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  PDF File
                </label>
                <div
                  className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition ${
                    ingestFile ? "border-primary/50 bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      setIngestFile(e.target.files?.[0] ?? null)
                    }
                  />
                  {ingestFile ? (
                    <>
                      <FileText className="mb-2 h-10 w-10 text-primary" />
                      <span className="font-medium">{ingestFile.name}</span>
                      <span className="text-sm text-muted-foreground">
                        Click to change
                      </span>
                    </>
                  ) : (
                    <>
                      <FileText className="mb-2 h-10 w-10 text-muted-foreground" />
                      <span>Drop a PDF or click to upload</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {ingestSourceType === "image" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Image (JPEG, PNG, WebP)
                </label>
                <div
                  className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition ${
                    ingestFile ? "border-primary/50 bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      setIngestFile(e.target.files?.[0] ?? null)
                    }
                  />
                  {ingestFile ? (
                    <>
                      <ImageIcon className="mb-2 h-10 w-10 text-primary" />
                      <span className="font-medium">{ingestFile.name}</span>
                      <span className="text-sm text-muted-foreground">
                        Diagrams, notes, screenshots — uses AI to extract concepts
                      </span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                      <span>Drop an image or click to upload</span> 
                    </>
                  )}
                </div>
              </div>
            )}

            {ingestSourceType === "youtube" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  YouTube URL
                </label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={ingestYouTubeUrl}
                  onChange={(e) => setIngestYouTubeUrl(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Transcript will be extracted automatically
                </p>
              </div>
            )}

            {ingestSourceType === "url" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Web page URL
                </label>
                <Input
                  placeholder="https://example.com/article"
                  value={ingestUrl}
                  onChange={(e) => setIngestUrl(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Text content will be extracted from the webpage
                </p>
              </div>
            )}

            {ingestSourceType === "text" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Text content
                </label>
                <textarea
                  className="w-full min-h-[200px] rounded-xl border p-4"
                  placeholder="Paste or type your content..."
                  value={ingestContent}
                  onChange={(e) => setIngestContent(e.target.value)}
                />
              </div>
            )}

            {ingestError && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {ingestError}
              </div>
            )}

            {ingestResult && (
              <div className="rounded-lg bg-primary/10 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Ingestion complete</span>
                </div>
                <p className="mt-2 text-sm">{ingestResult.message}</p>
              </div>
            )}

            <Button
              onClick={onSubmitIngest}
              disabled={
                ingestLoading ||
                ((ingestSourceType === "pdf" || ingestSourceType === "image") && !ingestFile) ||
                (ingestSourceType === "youtube" && !ingestYouTubeUrl.trim()) ||
                (ingestSourceType === "url" && !ingestUrl.trim()) ||
                (ingestSourceType === "text" &&
                  !ingestContent.trim())
              }
            >
              {ingestLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}
