"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function CommunityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
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
        <option value="algebra">Algebra</option>
        <option value="chemistry">Chemistry</option>
        <option value="sat-math">SAT Math</option>
      </select>
      <select
        className="rounded-lg border bg-background px-3 py-2 text-sm"
        value={searchParams.get("type") ?? ""}
        onChange={(e) => setFilter("type", e.target.value)}
      >
        <option value="">All types</option>
        <option value="note">Note</option>
        <option value="summary">Summary</option>
        <option value="flashcard_set">Flashcards</option>
        <option value="diagram">Diagram</option>
        <option value="walkthrough">Walkthrough</option>
        <option value="mini_lesson">Mini-lesson</option>
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
