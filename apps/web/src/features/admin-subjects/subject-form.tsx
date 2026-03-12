"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@mindorbit/ui";

const STATUS_OPTIONS = ["draft", "published", "archived"] as const;

interface SubjectFormProps {
  subject?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    gradeBand?: string | null;
    status: string;
  };
}

export function SubjectForm({ subject }: SubjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    slug: subject?.slug ?? "",
    title: subject?.title ?? "",
    description: subject?.description ?? "",
    icon: subject?.icon ?? "📚",
    color: subject?.color ?? "#3B82F6",
    gradeBand: subject?.gradeBand ?? "",
    status: (subject?.status ?? "draft") as string,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = { ...form, gradeBand: form.gradeBand || undefined };
      const url = subject ? `/api/admin/subjects/${subject.id}` : "/api/admin/subjects";
      const method = subject ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? err.error ?? "Failed to save");
      }
      const data = await res.json();
      router.push(`/admin/subjects/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <Input
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
          placeholder="algebra"
          disabled={!!subject}
        />
        {subject && <p className="mt-1 text-xs text-slate-500">Slug cannot be changed after creation</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <Input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Algebra"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Master variables, equations, and functions..."
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Icon</label>
          <Input
            value={form.icon}
            onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
            placeholder="📐"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              className="h-10 w-14 cursor-pointer rounded border border-slate-200"
            />
            <Input
              value={form.color}
              onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
              placeholder="#3B82F6"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Grade Band</label>
        <Input
          value={form.gradeBand}
          onChange={(e) => setForm((f) => ({ ...f, gradeBand: e.target.value }))}
          placeholder="9-12"
        />
      </div>
      {subject && (
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : subject ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
