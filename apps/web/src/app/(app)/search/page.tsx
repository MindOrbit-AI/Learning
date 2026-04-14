"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@mindorbit/ui";
import { Search, BookOpen, MapPin, FileText, User } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams?.get("q") ?? "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<{
    subjects: Array<{ id: string; title: string; slug: string }>;
    nodes: Array<{ id: string; title: string; subjectTitle: string }>;
    resources: Array<{ id: string; title: string }>;
    creators: Array<{ id: string; name: string | null }>;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        setResults(null);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    doSearch(q);
  }, [q, doSearch]);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    window.location.href = `/search?${params}`;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Search</h1>
        <p className="text-muted-foreground">
          Find subjects, concepts, resources, and creators
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="pl-12"
          autoFocus
        />
      </form>

      {loading && (
        <p className="text-center text-muted-foreground">Searching...</p>
      )}

      {results && !loading && (
        <div className="space-y-6">
          {results.subjects?.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-medium">
                <BookOpen className="h-4 w-4" />
                Subjects
              </h3>
              <div className="space-y-2">
                {results.subjects.map((s) => (
                  <Link
                    key={s.id}
                    href={`/subjects/${s.slug}`}
                    className="block rounded-xl border p-4 transition-colors hover:bg-muted"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.nodes?.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-medium">
                <MapPin className="h-4 w-4" />
                Concepts
              </h3>
              <div className="space-y-2">
                {results.nodes.map((n) => (
                  <Link
                    key={n.id}
                    href={`/mastery-map?node=${n.id}`}
                    className="block rounded-xl border p-4 transition-colors hover:bg-muted"
                  >
                    {n.title}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({n.subjectTitle})
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.resources?.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4" />
                Resources
              </h3>
              <div className="space-y-2">
                {results.resources.map((r) => (
                  <Link
                    key={r.id}
                    href={`/community/${r.id}`}
                    className="block rounded-xl border p-4 transition-colors hover:bg-muted"
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.creators?.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-medium">
                <User className="h-4 w-4" />
                Creators
              </h3>
              <div className="space-y-2">
                {results.creators.map((c) => (
                  <Link
                    key={c.id}
                    href={`/profile/${c.id}`}
                    className="block rounded-xl border p-4 transition-colors hover:bg-muted"
                  >
                    {c.name ?? "Anonymous"}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {[
            results.subjects?.length,
            results.nodes?.length,
            results.resources?.length,
            results.creators?.length,
          ].every((x) => !x) && (
            <p className="py-12 text-center text-muted-foreground">
              No results found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
