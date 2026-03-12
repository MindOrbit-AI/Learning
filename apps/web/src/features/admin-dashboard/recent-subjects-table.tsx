"use client";

import Link from "next/link";
import { DataTable } from "@/features/admin-dashboard/data-table";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";

interface SubjectRow {
  id: string;
  title: string;
  slug: string;
  status: string;
}

export function RecentSubjectsTable({ subjects }: { subjects: SubjectRow[] }) {
  return (
    <DataTable<SubjectRow>
      columns={[
        { key: "title", header: "Title" },
        {
          key: "status",
          header: "Status",
          render: (s) => <PublishStatusBadge status={s.status} />,
        },
        {
          key: "slug",
          header: "",
          render: (s) => (
            <Link
              href={`/admin/subjects/${s.id}`}
              className="text-primary hover:underline"
            >
              Edit
            </Link>
          ),
          className: "text-right",
        },
      ]}
      data={subjects}
      keyExtractor={(s) => s.id}
      emptyMessage="No subjects yet"
    />
  );
}
