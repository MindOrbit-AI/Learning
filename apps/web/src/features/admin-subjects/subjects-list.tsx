"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@mindorbit/ui";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";
import { DataTable } from "@/features/admin-dashboard/data-table";

async function fetchSubjects() {
  const res = await fetch("/api/admin/subjects");
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
}

export function SubjectsList() {
  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ["admin", "subjects"],
    queryFn: fetchSubjects,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Subjects</h2>
        <Link href="/admin/subjects/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Subject
          </Button>
        </Link>
      </div>
      <DataTable
        columns={[
          { key: "title", header: "Title" },
          { key: "slug", header: "Slug" },
          {
            key: "status",
            header: "Status",
            render: (s) => <PublishStatusBadge status={(s as { status: string }).status} />,
          },
          {
            key: "clusters",
            header: "Clusters",
            render: (s) => String((s as { _count?: { clusters: number } })._count?.clusters ?? 0),
          },
          {
            key: "conceptNodes",
            header: "Concepts",
            render: (s) => String((s as { _count?: { conceptNodes: number } })._count?.conceptNodes ?? 0),
          },
          {
            key: "actions",
            header: "",
            render: (s) => (
              <Link
                href={`/admin/subjects/${(s as { id: string }).id}`}
                className="text-primary hover:underline"
              >
                Edit
              </Link>
            ),
            className: "text-right",
          },
        ]}
        data={subjects}
        keyExtractor={(s) => (s as { id: string }).id}
        emptyMessage="No subjects. Create one to get started."
      />
    </div>
  );
}
