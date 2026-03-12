"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";
import { DataTable } from "@/features/admin-dashboard/data-table";
import { Button } from "@mindorbit/ui";

const STATUS_FILTERS = ["pending", "approved", "rejected", "flagged"];

async function fetchResources(status?: string) {
  const url = status ? `/api/admin/resources?status=${status}` : "/api/admin/resources";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function ResourcesList() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const queryClient = useQueryClient();
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["admin", "resources", statusFilter],
    queryFn: () => fetchResources(statusFilter || undefined),
  });

  const moderate = async (id: string, action: string) => {
    await fetch(`/api/admin/resources/${id}/moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter("")}
          className={`rounded-lg px-3 py-1 text-sm ${!statusFilter ? "bg-slate-900 text-white" : "bg-slate-100 dark:bg-slate-800"}`}
        >
          All
        </button>
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-1 text-sm ${statusFilter === s ? "bg-slate-900 text-white" : "bg-slate-100 dark:bg-slate-800"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <DataTable
        columns={[
          {
            key: "title",
            header: "Title",
            render: (r) => (
              <Link href={`/community/${(r as { id: string }).id}`} className="hover:underline">
                {(r as { title: string }).title}
              </Link>
            ),
          },
          {
            key: "user",
            header: "Creator",
            render: (r) => (r as { user?: { name?: string; email?: string } }).user?.name ?? (r as { user?: { email?: string } }).user?.email ?? "-",
          },
          {
            key: "node",
            header: "Concept",
            render: (r) => (r as { node?: { title: string } }).node?.title ?? "-",
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <PublishStatusBadge status={(r as { status: string }).status} />,
          },
          {
            key: "actions",
            header: "",
            render: (r) => {
              const res = r as { id: string; status: string };
              if (res.status === "pending") {
                return (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => moderate(res.id, "approve")}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => moderate(res.id, "reject")}>
                      Reject
                    </Button>
                  </div>
                );
              }
              return null;
            },
            className: "text-right",
          },
        ]}
        data={resources}
        keyExtractor={(r) => (r as { id: string }).id}
        emptyMessage="No resources."
      />
    </div>
  );
}
