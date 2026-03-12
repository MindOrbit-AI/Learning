"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { DataTable } from "@/features/admin-dashboard/data-table";

async function fetchUsers() {
  const res = await fetch("/api/admin/users");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function UsersList() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchUsers,
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
        { key: "name", header: "Name", render: (u) => (u as { name?: string }).name ?? "-" },
        { key: "email", header: "Email" },
        { key: "role", header: "Role" },
        {
          key: "xp",
          header: "XP",
          render: (u) => String((u as { xp?: number }).xp ?? 0),
        },
        {
          key: "resources",
          header: "Resources",
          render: (u) => String((u as { _count?: { resources: number } })._count?.resources ?? 0),
        },
        {
          key: "suspended",
          header: "Status",
          render: (u) => ((u as { suspendedAt?: string }).suspendedAt ? "Suspended" : "Active"),
        },
        {
          key: "actions",
          header: "",
          render: (u) => (
            <Link
              href={`/admin/users/${(u as { id: string }).id}`}
              className="text-primary hover:underline"
            >
              View
            </Link>
          ),
          className: "text-right",
        },
      ]}
      data={users}
      keyExtractor={(u) => (u as { id: string }).id}
      emptyMessage="No users."
    />
  );
}
