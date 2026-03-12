"use client";

import { useQuery } from "@tanstack/react-query";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";
import { DataTable } from "@/features/admin-dashboard/data-table";

async function fetchQuestions() {
  const res = await fetch("/api/admin/diagnostics");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function DiagnosticsList() {
  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["admin", "diagnostics"],
    queryFn: fetchQuestions,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={[
        {
          key: "prompt",
          header: "Prompt",
          render: (q) => (
            <span className="line-clamp-1">{(q as { prompt: string }).prompt}</span>
          ),
        },
        {
          key: "node",
          header: "Concept",
          render: (q) => (q as { node?: { title: string } }).node?.title ?? "-",
        },
        { key: "type", header: "Type" },
        {
          key: "status",
          header: "Status",
          render: (q) => <PublishStatusBadge status={(q as { status?: string }).status ?? "draft"} />,
        },
      ]}
      data={questions}
      keyExtractor={(q) => (q as { id: string }).id}
      emptyMessage="No diagnostic questions."
    />
  );
}
