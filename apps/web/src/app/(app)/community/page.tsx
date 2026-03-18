import Link from "next/link";
import { prisma, type ResourceType, ResourceStatus } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { canViewSubject } from "@/lib/subject-visibility";
import { Card, CardContent } from "@mindorbit/ui";
import { RESOURCE_TYPE_LABELS } from "@mindorbit/lib";
import { formatRelativeTime } from "@mindorbit/lib";
import { Heart, Bookmark, Upload } from "lucide-react";
import { CommunityFilters } from "./community-filters";
import { CommunityPagination } from "./community-pagination";

const PAGE_SIZE = 12;

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; type?: string; sort?: string; page?: string }>;
}) {
  const session = await getServerSession();
  const params = await searchParams;
  const subjectSlug = params.subject;
  const typeFilter = params.type;
  const sortBy = params.sort ?? "recent";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  let subject = subjectSlug
    ? await prisma.subject.findUnique({ where: { slug: subjectSlug } })
    : null;
  if (subject && !canViewSubject(subject, session?.user?.id as string | undefined)) {
    subject = null;
  }

  const typeFilterValues = ["note", "summary", "flashcard_set", "diagram", "walkthrough", "mini_lesson"] as const;
  const validType = typeFilter && typeFilterValues.includes(typeFilter as (typeof typeFilterValues)[number]);

  const where = {
    status: ResourceStatus.approved,
    ...(subject && { subjectId: subject.id }),
    ...(validType && { type: typeFilter as ResourceType }),
  };

  const include = {
    user: { select: { name: true, xp: true } },
    subject: { select: { title: true } },
    node: { select: { title: true } },
    _count: { select: { likes: true, saves: true } },
  };

  let resources: Awaited<
    ReturnType<
      typeof prisma.resource.findMany<{
        include: typeof include;
      }>
    >
  >;
  let totalCount: number;

  if (sortBy === "popular") {
    const allMatching = await prisma.resource.findMany({
      where,
      include,
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    const withScore = allMatching.map((r) => ({
      ...r,
      _score: r._count.likes * 2 + r._count.saves * 3 + (r.user.xp ?? 0) / 10,
    }));
    withScore.sort((a, b) => b._score - a._score);
    totalCount = withScore.length;
    resources = withScore.slice(skip, skip + PAGE_SIZE);
  } else {
    const [items, count] = await Promise.all([
      prisma.resource.findMany({
        where,
        include,
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.resource.count({ where }),
    ]);
    resources = items;
    totalCount = count;
  }

  function getIngestShortSummary(contentJson: string | null): string | null {
    if (!contentJson) return null;
    try {
      const parsed = JSON.parse(contentJson) as { summary?: { shortSummary?: string } };
      return parsed.summary?.shortSummary?.trim() ?? null;
    } catch {
      return null;
    }
  }

  const resourcesWithPreview = resources.map((r) => ({
    ...r,
    preview: getIngestShortSummary(r.contentJson) ?? r.description,
  }));

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
        {resourcesWithPreview.map((r) => (
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
                {r.preview && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {r.preview}
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
      <CommunityPagination totalCount={totalCount} currentPage={page} />
    </div>
  );
}
