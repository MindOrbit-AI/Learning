"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input } from "@mindorbit/ui";
import { ArrowLeft, ArrowRight, Loader2, Save, ChevronDown, ChevronRight, Check } from "lucide-react";
import type { GeneratedSubjectStructure } from "@mindorbit/ai";

const ICON_OPTIONS = ["📐", "🧬", "⚗️", "💻", "🌌", "📊", "📚", "🔬", "📏"];
const COLOR_OPTIONS = ["#3B82F6", "#22C55E", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899"];

const STEPS = [
  { id: 1, label: "Details", description: "Subject info" },
  { id: 2, label: "Generate", description: "AI structure" },
  { id: 3, label: "Review", description: "Save" },
] as const;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CreateSubjectForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("📚");
  const [color, setColor] = useState("#3B82F6");
  const [gradeBand, setGradeBand] = useState("");
  const [structure, setStructure] = useState<GeneratedSubjectStructure | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set());

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slug || slug === slugify(title)) setSlug(slugify(v));
  };

  const canProceedFromStep1 = title.trim() && slug.trim();

  const handleNextFromStep1 = () => {
    setError(null);
    if (!canProceedFromStep1) {
      setError("Title and slug are required");
      return;
    }
    setStep(2);
  };

  useEffect(() => {
    if (step !== 2 || !title.trim()) return;
    let cancelled = false;
    setError(null);
    setGenerating(true);
    (async () => {
      try {
        const body: { title: string; description?: string } = { title: title.trim() };
        if (description.trim()) body.description = description.trim();
        const res = await fetch("/api/admin/subjects/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (cancelled) return;
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to generate");
        }
        const data = (await res.json()) as GeneratedSubjectStructure & { description?: string };
        if (cancelled) return;
        if (data.description) setDescription(data.description);
        const { description: _d, ...structureOnly } = data;
        setStructure(structureOnly);
        setExpandedClusters(new Set(structureOnly.clusters.map((c) => c.slug)));
        setStep(3);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to generate structure");
        }
      } finally {
        if (!cancelled) setGenerating(false);
      }
    })();
    return () => { cancelled = true; };
  }, [step, title, description]);

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required (should have been generated in step 2)");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        slug: slug.trim(),
        title: title.trim(),
        description: description.trim(),
        icon,
        color,
      };
      if (gradeBand.trim()) payload.gradeBand = gradeBand.trim();
      if (structure && structure.clusters.length > 0) {
        payload.structure = structure;
      }
      const res = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 403 && data.upgradeRequired) {
          throw new Error(`${data.error ?? "Limit reached"} Upgrade to Pro for unlimited subjects.`);
        }
        throw new Error(data.error ?? "Failed to save");
      }
      const subject = await res.json();
      router.push(`/subjects/${subject.slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save subject");
    } finally {
      setSaving(false);
    }
  };

  const toggleCluster = (slug: string) => {
    setExpandedClusters((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/subjects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Subject</h1>
          <p className="text-muted-foreground">
            Add a subject and let AI populate clusters, concepts, and edges
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step > s.id && setStep(s.id)}
              disabled={step < s.id}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                step === s.id
                  ? "bg-primary text-primary-foreground"
                  : step > s.id
                    ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {step > s.id ? <Check className="h-4 w-4" /> : s.id}
            </button>
            <span
              className={`hidden text-sm sm:inline ${
                step === s.id ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="mx-1 h-0.5 w-6 bg-muted sm:mx-2 sm:w-8" aria-hidden />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <>
              <CardHeader className="px-0">
                <CardTitle>Subject Details</CardTitle>
                <CardDescription>
                  Enter the subject name. AI will generate a description and the learning graph structure.
                </CardDescription>
              </CardHeader>
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="e.g. Algebra"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slug (URL)</label>
                    <Input
                      placeholder="e.g. algebra"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Icon</label>
                    <div className="flex gap-2">
                      {ICON_OPTIONS.map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setIcon(i)}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors ${
                            icon === i
                              ? "ring-2 ring-primary bg-primary/10"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex gap-2">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`h-10 w-10 rounded-lg transition-transform ${
                            color === c
                              ? "ring-2 ring-offset-2 ring-primary scale-110"
                              : "hover:opacity-80"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grade Band (optional)</label>
                    <Input
                      placeholder="e.g. 9-12"
                      value={gradeBand}
                      onChange={(e) => setGradeBand(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleNextFromStep1} disabled={!canProceedFromStep1} className="gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Generate (auto) */}
          {step === 2 && (
            <>
              <CardHeader className="px-0">
                <CardTitle>Generating Structure</CardTitle>
                <CardDescription>
                  AI is creating clusters, concepts, and edges from your subject.
                </CardDescription>
              </CardHeader>
              <div className="mt-6 space-y-6">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="font-medium">{title || "Untitled"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {description || "No description"}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <span className="text-muted-foreground">
                    {generating ? "Generating clusters and concepts..." : "Almost ready..."}
                  </span>
                </div>
                <div className="flex justify-start pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} disabled={generating}>
                    Back
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Review & Save */}
          {step === 3 && (
            <>
              <CardHeader className="px-0">
                <CardTitle>Review & Save</CardTitle>
                <CardDescription>
                  Review your subject and the generated structure. Click Save to create.
                </CardDescription>
              </CardHeader>
              <div className="mt-6 space-y-6">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium">Subject summary</h4>
                  <div className="mt-2 flex items-center gap-4">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      {icon}
                    </span>
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-muted-foreground">{slug}</p>
                      {gradeBand && (
                        <p className="mt-1 text-xs text-muted-foreground">Grade: {gradeBand}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{description}</p>
                </div>

                {structure && structure.clusters.length > 0 ? (
                  <div>
                    <h4 className="mb-3 font-medium">Generated structure</h4>
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <span>{structure.clusters.length} clusters</span>
                      <span>{structure.concepts.length} concepts</span>
                      <span>{structure.edges.length} edges</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {structure.clusters.map((cluster) => {
                        const concepts = structure.concepts.filter(
                          (c) => c.clusterSlug === cluster.slug
                        );
                        const isExpanded = expandedClusters.has(cluster.slug);
                        return (
                          <div
                            key={cluster.slug}
                            className="rounded-lg border bg-card"
                          >
                            <button
                              type="button"
                              onClick={() => toggleCluster(cluster.slug)}
                              className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-muted/50"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <span className="font-medium">{cluster.title}</span>
                              <span className="text-muted-foreground">
                                ({concepts.length} concepts)
                              </span>
                            </button>
                            {isExpanded && (
                              <div className="border-t px-4 py-3">
                                <p className="mb-3 text-sm text-muted-foreground">
                                  {cluster.description}
                                </p>
                                <div className="space-y-2">
                                  {concepts.map((concept) => (
                                    <div
                                      key={concept.slug}
                                      className="rounded border-l-2 border-primary/30 bg-muted/30 px-3 py-2 text-sm"
                                    >
                                      <div className="font-medium">{concept.title}</div>
                                      <div className="text-muted-foreground line-clamp-1">
                                        {concept.description}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {structure.edges.length > 0 && (
                      <div className="mt-4">
                        <h4 className="mb-2 font-medium">Concept relationships</h4>
                        <div className="flex flex-wrap gap-2">
                          {structure.edges.slice(0, 15).map((e, i) => (
                            <span
                              key={i}
                              className="rounded bg-muted px-2 py-1 text-xs"
                            >
                              {e.sourceSlug} → {e.targetSlug}
                            </span>
                          ))}
                          {structure.edges.length > 15 && (
                            <span className="rounded bg-muted px-2 py-1 text-xs">
                              +{structure.edges.length - 15} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No structure generated. You can add clusters and concepts manually after saving.
                  </p>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save to Database"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
