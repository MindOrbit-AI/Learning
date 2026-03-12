"use client";

import { useState, useEffect, useCallback } from "react";
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
import { FileText, Youtube, BookOpen, Link2, Loader2, CheckCircle, Image as ImageIcon } from "lucide-react";

type IngestionMode = "pdf" | "image" | "youtube" | "text";

export default function UploadPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<
    Array<{ id: string; title: string; slug: string }>
  >([]);
  const [ingestSourceType, setIngestSourceType] = useState<IngestionMode>("text");
  const [ingestSubjectId, setIngestSubjectId] = useState("");
  const [ingestClusterId, setIngestClusterId] = useState("");
  const [ingestYouTubeUrl, setIngestYouTubeUrl] = useState("");
  const [ingestContent, setIngestContent] = useState("");
  const [ingestFile, setIngestFile] = useState<File | null>(null);
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestClusters, setIngestClusters] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [ingestResult, setIngestResult] = useState<{
    sourceId: string;
    nodeIds: string[];
    message: string;
  } | null>(null);
  const [ingestError, setIngestError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subjects").then(async (r) => {
      const d = await r.json();
      setSubjects(d.subjects ?? []);
    });
  }, []);

  useEffect(() => {
    if (!ingestSubjectId) {
      setIngestClusters([]);
      return;
    }
    fetch(`/api/subjects/${ingestSubjectId}/clusters`).then(async (r) => {
      const d = await r.json();
      setIngestClusters(d.clusters ?? []);
    });
  }, [ingestSubjectId]);

  const onSubmitIngest = useCallback(async () => {
    setIngestError(null);
    setIngestResult(null);
    setIngestLoading(true);

    try {
      if ((ingestSourceType === "pdf" || ingestSourceType === "image") && ingestFile) {
        const formData = new FormData();
        formData.set("file", ingestFile);
        formData.set("sourceType", ingestSourceType);
        formData.set("subjectId", ingestSubjectId);
        if (ingestClusterId) formData.set("clusterId", ingestClusterId);

        const res = await fetch("/api/ingestion/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        setIngestResult(data);
        router.push(`/community/${data?.sourceId}`)
      } else if (ingestSourceType === "youtube") {
        const res = await fetch("/api/ingestion/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceType: "youtube",
            sourceUrl: ingestYouTubeUrl,
            subjectId: ingestSubjectId,
            clusterId: ingestClusterId || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        setIngestResult(data);
        router.push(`/community/${data?.sourceId}`)
      } else {
        const res = await fetch("/api/ingestion/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceType: ingestSourceType,
            content: ingestContent,
            subjectId: ingestSubjectId,
            clusterId: ingestClusterId || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        setIngestResult(data);
        router.push(`/community/${data?.sourceId}`)
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
    ingestContent,
    ingestSubjectId,
    ingestClusterId,
  ]);

  const subjectForIngest = subjects.find((s) => s.id === ingestSubjectId);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Upload Content</h1>

      <Card>
        <CardHeader>
          <CardDescription>
            Upload PDFs, images, or YouTube videos. The system
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
                  { id: "pdf" as const, label: "PDF", icon: FileText },
                  { id: "image" as const, label: "Image", icon: ImageIcon },
                  { id: "youtube" as const, label: "YouTube", icon: Youtube },
                  { id: "text" as const, label: "Text", icon: BookOpen },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setIngestSourceType(id);
                      setIngestFile(null);
                      setIngestYouTubeUrl("");
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

            <div>
              <label className="mb-2 block text-sm font-medium">
                Subject (required)
              </label>
              <select
                value={ingestSubjectId}
                onChange={(e) => {
                  setIngestSubjectId(e.target.value);
                  setIngestClusterId("");
                }}
                className="w-full rounded-xl border px-3 py-2"
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Cluster (optional, for new concepts)
              </label>
              <select
                value={ingestClusterId}
                onChange={(e) => setIngestClusterId(e.target.value)}
                className="w-full rounded-xl border px-3 py-2"
                disabled={!ingestSubjectId}
              >
                <option value="">Use first cluster</option>
                {ingestClusters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
              </select>
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
                <div className="mt-3 flex flex-wrap gap-2">
                  {subjectForIngest && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/subjects/${subjectForIngest.slug}`)
                      }
                    >
                      View {subjectForIngest.title}
                    </Button>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={onSubmitIngest}
              disabled={
                ingestLoading ||
                !ingestSubjectId ||
                ((ingestSourceType === "pdf" || ingestSourceType === "image") && !ingestFile) ||
                (ingestSourceType === "youtube" && !ingestYouTubeUrl.trim()) ||
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
