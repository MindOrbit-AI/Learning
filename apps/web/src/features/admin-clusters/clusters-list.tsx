"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";
import { DataTable } from "@/features/admin-dashboard/data-table";

async function fetchClusters() {
  const res = await fetch("/api/admin/clusters");
  if (!res.ok) throw new Error("Failed to fetch clusters");
  return res.json();
}

export function ClustersList() {
  const { data: clusters = [], isLoading } = useQuery({
    queryKey: ["admin", "clusters"],
    queryFn: fetchClusters,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Loading clusters...</p>
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
  );
}
