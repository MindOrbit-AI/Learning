"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";
import { DataTable } from "@/features/admin-dashboard/data-table";

async function fetchConcepts() {
  const res = await fetch("/api/admin/concepts");
  if (!res.ok) throw new Error("Failed to fetch concepts");
  return res.json();
}

export function ConceptsList() {
  const { data: concepts = [], isLoading } = useQuery({
    queryKey: ["admin", "concepts"],
    queryFn: fetchConcepts,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Loading concepts...</p>
      </div>
    );
  }

  return (
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
          key: "cluster",
          header: "Cluster",
          render: (c) => (c as { cluster?: { title: string } }).cluster?.title ?? "-",
        },
        {
          key: "status",
          header: "Status",
          render: (c) => <PublishStatusBadge status={(c as { status?: string }).status ?? "draft"} />,
        },
        {
          key: "diagnosticQuestions",
          header: "Questions",
          render: (c) => String((c as { _count?: { diagnosticQuestions: number } })._count?.diagnosticQuestions ?? 0),
        },
        {
          key: "actions",
          header: "",
          render: (c) => (
            <Link
              href={`/admin/concepts/${(c as { id: string }).id}`}
              className="text-primary hover:underline"
            >
              Edit
            </Link>
          ),
          className: "text-right",
        },
      ]}
      data={concepts}
      keyExtractor={(c) => (c as { id: string }).id}
      emptyMessage="No concepts."
    />
  );
}
