import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@mindorbit/ui";
import { RESOURCE_TYPE_LABELS } from "@mindorbit/lib";
import { User } from "lucide-react";
import { ResourceActions } from "./resource-actions";

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
      subject: { select: { title: true } },
      node: { select: { title: true, id: true } },
      _count: { select: { likes: true, saves: true } },
    },
  });

  if (!resource) notFound();

  let content = "";
  if (resource.contentJson) {
    try {
      const parsed = JSON.parse(resource.contentJson) as { markdown?: string };
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {RESOURCE_TYPE_LABELS[resource.type as keyof typeof RESOURCE_TYPE_LABELS] ?? resource.type}
            </span>
            <span className="text-sm text-muted-foreground">
              {resource.subject.title} • {resource.node.title}
            </span>
          </div>
          <CardTitle className="text-2xl">{resource.title}</CardTitle>
          {resource.description && (
            <CardDescription className="text-muted-foreground">
              {resource.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {session?.user && (
            <ResourceActions
              resourceId={resource.id}
              isLiked={!!isLiked}
              isSaved={!!isSaved}
              likeCount={resource._count.likes}
              saveCount={resource._count.saves}
            />
          )}
          <div className="prose prose-sm mt-6 dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-foreground">{content}</pre>
          </div>
        </CardContent>
      </Card>

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
            <p className="text-sm text-muted-foreground">
              Creator
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
