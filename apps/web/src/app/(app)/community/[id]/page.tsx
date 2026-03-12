import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
} from "@mindorbit/ui";
import { RESOURCE_TYPE_LABELS } from "@mindorbit/lib";
import { User, ChevronLeft } from "lucide-react";
import { ResourceActions } from "./resource-actions";
import { IngestSummaryDisplay } from "@/components/ingest-summary-display";

type ContentJson = {
  markdown?: string;
  summary?: {
    flashcards?: Array<{ front: string; back: string }>;
    shortSummary?: string;
    deepSummary?: string;
    quizzes?: Array<{
      prompt: string;
      type: string;
      options: string[] | null;
      correctAnswer: string;
      explanation: string;
    }>;
  };
};

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  const { id } = await params;

  const resource = await prisma.resource.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      subject: { select: { title: true, slug: true } },
      node: { select: { title: true, id: true } },
      _count: { select: { likes: true, saves: true } },
    },
  });

  if (!resource) notFound();

  const isAdmin = session?.user?.role && ["ADMIN", "SUPER_ADMIN"].includes(session.user.role as string);
  const canView =
    resource.status === "approved" ||
    resource.userId === session?.user?.id ||
    isAdmin;
  if (!canView) notFound();

  let content = "";
  let ingestSummary: ContentJson["summary"] | null = null;
  if (resource.contentJson) {
    try {
      const parsed = JSON.parse(resource.contentJson) as ContentJson;
      ingestSummary = parsed.summary ?? null;
      content = parsed.markdown ?? resource.contentJson;
    } catch {
      content = resource.contentJson;
    }
  }

  const isLiked = session?.user?.id
    ? await prisma.resourceLike.findUnique({
        where: {
          resourceId_userId: { resourceId: id, userId: session.user.id },
        },
      })
    : null;
  const isSaved = session?.user?.id
    ? await prisma.resourceSave.findUnique({
        where: {
          resourceId_userId: { resourceId: id, userId: session.user.id },
        },
      })
    : null;

  const hasIngestStyle =
    !!ingestSummary &&
    (!!ingestSummary.shortSummary ||
      !!ingestSummary.deepSummary ||
      (ingestSummary.flashcards?.length ?? 0) > 0 ||
      (ingestSummary.quizzes?.length ?? 0) > 0);

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/community"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Community
        </Link>
        <Link href={`/subjects/${resource.subject.slug}`}>
          <Button variant="outline" size="sm">
            View {resource.subject.title}
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="mt-2 text-2xl font-bold">{resource.title}</h1>
      </div>

      {session?.user && (
        <ResourceActions
          resourceId={resource.id}
          isLiked={!!isLiked}
          isSaved={!!isSaved}
          likeCount={resource._count.likes}
          saveCount={resource._count.saves}
        />
      )}

      {hasIngestStyle ? (
        <div className="space-y-8">
          <IngestSummaryDisplay summary={ingestSummary!} />
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-foreground">
                {content}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <Link
              href={`/profile/${resource.user.id}`}
              className="font-medium hover:underline"
            >
              {resource.user.name ?? "Anonymous"}
            </Link>
            <p className="text-sm text-muted-foreground">Creator</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
