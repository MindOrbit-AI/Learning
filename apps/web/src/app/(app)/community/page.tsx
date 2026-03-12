import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { Card, CardContent } from "@mindorbit/ui";
import { RESOURCE_TYPE_LABELS } from "@mindorbit/lib";
import { formatRelativeTime } from "@mindorbit/lib";
import { Heart, Bookmark, Upload } from "lucide-react";
import { CommunityFilters } from "./community-filters";

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; type?: string; sort?: string }>;
}) {
  const session = await getServerSession();
  const params = await searchParams;
  const subjectSlug = params.subject;
  const typeFilter = params.type;
  const sortBy = params.sort ?? "recent";

  const subject = subjectSlug
    ? await prisma.subject.findUnique({ where: { slug: subjectSlug } })
    : null;

  const resources = await prisma.resource.findMany({
    where: {
      ...(subject && { subjectId: subject.id }),
      ...(typeFilter && { type: typeFilter as "note" | "summary" | "flashcard_set" | "diagram" | "walkthrough" }),
    },
    include: {
      user: { select: { name: true } },
      subject: { select: { title: true } },
      node: { select: { title: true } },
      _count: { select: { likes: true, saves: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Community</h1>
          <p className="text-muted-foreground">
            Study resources from students, linked to concepts
          </p>
        </div>
        {session?.user && (
          <Link href="/community/upload">
            <button className="flex items-center gap-2 rounded-xl border bg-primary px-4 py-2 text-primary-foreground">
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </Link>
        )}
      </div>

      <CommunityFilters />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => (
          <Link key={r.id} href={`/community/${r.id}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {RESOURCE_TYPE_LABELS[r.type as keyof typeof RESOURCE_TYPE_LABELS] ?? r.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {r.subject.title} • {r.node.title}
                  </span>
                </div>
                <h3 className="font-semibold line-clamp-2">{r.title}</h3>
                {r.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {r.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{r.user.name ?? "Anonymous"}</span>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {r._count.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="h-4 w-4" />
                      {r._count.saves}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatRelativeTime(r.createdAt)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
