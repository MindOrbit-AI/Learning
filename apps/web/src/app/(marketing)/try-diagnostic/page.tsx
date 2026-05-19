import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Run a free diagnostic — no account",
  description:
    "Pick a subject and answer about fifteen questions in ~5 minutes. No signup required—your mastery snapshot appears on the next screen.",
};

export default async function TryDiagnosticIndexPage() {
  const subjects = await prisma.subject.findMany({
    where: { createdById: null, status: "published" },
    orderBy: [{ orderIndex: "asc" }, { title: "asc" }],
    select: { slug: true, title: true, description: true, icon: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center sm:text-left">
        <p className="inline-flex items-center rounded-full border-2 border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
          Free · No signup
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Pick your subject
        </h1>
        <p className="mt-3 text-base font-semibold text-muted-foreground">
          About fifteen questions (~5 minutes). Your mastery snapshot appears on the next screen.
        </p>
      </div>

      {subjects.length === 0 ? (
        <p className="rounded-2xl border-2 border-border bg-card px-5 py-4 text-center text-sm font-semibold text-muted-foreground">
          No published catalog subjects are available yet. Check back soon.
        </p>
      ) : (
        <ul className="space-y-3">
          {subjects.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/try-diagnostic/${s.slug}`}
                className="flex items-center gap-4 rounded-2xl border-2 border-border bg-card px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl"
                  aria-hidden
                >
                  {s.icon}
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-lg font-extrabold text-foreground">{s.title}</span>
                  {s.description ? (
                    <span className="mt-1 line-clamp-2 block text-sm font-semibold text-muted-foreground">
                      {s.description}
                    </span>
                  ) : null}
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="text-center text-sm font-semibold text-muted-foreground">
        Already learning with us?{" "}
        <Link
          href="/auth/signin"
          className="font-extrabold text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
