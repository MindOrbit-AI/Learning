import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Try a diagnostic — no account",
  description:
    "Run a short skill diagnostic on a MindOrbit subject without signing up. See how it feels in a few minutes.",
};

export default async function TryDiagnosticIndexPage() {
  const subjects = await prisma.subject.findMany({
    where: { createdById: null, status: "published" },
    orderBy: [{ orderIndex: "asc" }, { title: "asc" }],
    select: { slug: true, title: true, description: true, icon: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Try a diagnostic</h1>
        <p className="mt-2 text-muted-foreground">
          Pick a subject and answer about fifteen questions. No account required—your
          snapshot appears on the next screen.
        </p>
      </div>

      {subjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No published catalog subjects are available yet. Check back soon.
        </p>
      ) : (
        <div className="space-y-4">
          {subjects.map((s) => (
            <Link key={s.slug} href={`/try-diagnostic/${s.slug}`} className="block">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                  <span className="text-2xl" aria-hidden>
                    {s.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg">{s.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-sm font-semibold text-primary">Start free →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Already learning with us?{" "}
        <Link href="/auth/signin" className="font-semibold text-primary underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
