"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Subject = { id: string; title: string; slug: string };

export function CommunityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    fetch("/api/subjects?scope=published")
      .then((r) => r.json())
      .then((data: { subjects?: Subject[] }) => setSubjects(data.subjects ?? []))
      .catch(() => setSubjects([]));
  }, []);

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // Reset to page 1 when filters change
    router.push(`/community?${next}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select
        className="rounded-lg border bg-background px-3 py-2 text-sm"
        value={searchParams.get("subject") ?? ""}
        onChange={(e) => setFilter("subject", e.target.value)}
      >
        <option value="">All subjects</option>
        {subjects
          .filter((s) => s.slug !== "community")
          .map((s) => (
            <option key={s.id} value={s.slug}>
              {s.title}
            </option>
          ))}
      </select>
      <select
        className="rounded-lg border bg-background px-3 py-2 text-sm"
        value={searchParams.get("sort") ?? "recent"}
        onChange={(e) => setFilter("sort", e.target.value)}
      >
        <option value="recent">Recent</option>
        <option value="popular">Popular</option>
      </select>
    </div>
  );
}
