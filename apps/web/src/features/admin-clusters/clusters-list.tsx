"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";
import { DataTable } from "@/features/admin-dashboard/data-table";

async function fetchClusters(params: { subjectId?: string; search?: string }) {
  const searchParams = new URLSearchParams();
  if (params.subjectId) searchParams.set("subjectId", params.subjectId);
  if (params.search) searchParams.set("search", params.search);
  const qs = searchParams.toString();
  const url = qs ? `/api/admin/clusters?${qs}` : "/api/admin/clusters";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch clusters");
  return res.json();
}

async function fetchSubjects() {
  const res = await fetch("/api/admin/subjects");
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
}

export function ClustersList() {
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const { data: subjects = [] } = useQuery({
    queryKey: ["admin", "subjects"],
    queryFn: fetchSubjects,
  });

  const { data: clusters = [], isLoading } = useQuery({
    queryKey: ["admin", "clusters", subjectFilter, search],
    queryFn: () =>
      fetchClusters({
        subjectId: subjectFilter || undefined,
        search: search.trim() || undefined,
      }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Loading clusters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="search" className="text-sm text-slate-600 dark:text-slate-400">
            Search:
          </label>
          <input
            id="search"
            type="search"
            placeholder="Title or slug..."
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="subject-filter" className="text-sm text-slate-600 dark:text-slate-400">
            Subject:
          </label>
          <select
            id="subject-filter"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="">All subjects</option>
            {(subjects as { id: string; title: string }[]).map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DataTable
      columns={[
        { key: "title", header: "Title" },
        { key: "slug", header: "Slug" },
        {
          key: "subject",
          header: "Subject",
          render: (c) => (c as { subject?: { title: string } }).subject?.title ?? "-",
        },
        {
          key: "conceptNodes",
          header: "Concepts",
          render: (c) => String((c as { _count?: { conceptNodes: number } })._count?.conceptNodes ?? 0),
        },
        {
          key: "status",
          header: "Status",
          render: (c) => <PublishStatusBadge status={(c as { status?: string }).status ?? "active"} />,
        },
        {
          key: "actions",
          header: "",
          render: (c) => (
            <Link
              href={`/admin/clusters/${(c as { id: string }).id}`}
              className="text-primary hover:underline"
            >
              Edit
            </Link>
          ),
          className: "text-right",
        },
      ]}
      data={clusters}
      keyExtractor={(c) => (c as { id: string }).id}
      emptyMessage="No clusters."
    />
    </div>
  );
}
