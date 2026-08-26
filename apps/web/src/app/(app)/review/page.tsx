import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { formatRelativeTime } from "@mindorbit/lib";
import { ReviewItemClient } from "./review-item-client";
import { ReviewSessionClient } from "@/features/learning-loop/review-session-client";
import { generateReviewSession } from "@/services/review-session-service";

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string; node?: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  const sp = await searchParams;
  const sessionId = sp.session;

  if (sessionId) {
    try {
      const reviewSession = await generateReviewSession(session.user.id, sessionId);
      return (
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Review session</h1>
            <p className="text-muted-foreground">Retrieval practice — answer from memory</p>
          </div>
          <ReviewSessionClient
            reviewItemId={sessionId}
            nodeTitle={reviewSession.nodeTitle}
            questions={reviewSession.questions}
          />
        </div>
      );
    } catch {
      // fall through to queue
    }
  }

  const dueItems = await prisma.reviewQueueItem.findMany({
    where: {
      userId: session.user.id,
      status: "pending",
      dueAt: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    },
    include: { node: true },
    orderBy: { dueAt: "asc" },
    take: 20,
  });

  const todayItems = dueItems.filter(
    (i) => i.dueAt <= new Date(Date.now() + 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Review Queue</h1>
        <p className="text-muted-foreground">
          Reinforce weak nodes with spaced retrieval — 3–5 questions per concept
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Due Today</CardTitle>
          <CardDescription>{todayItems.length} nodes to review</CardDescription>
        </CardHeader>
        <CardContent>
          {todayItems.length > 0 ? (
            <div className="space-y-2">
              {todayItems.map((item) => (
                <ReviewItemClient
                  key={item.id}
                  id={item.id}
                  nodeId={item.nodeId}
                  nodeTitle={item.node.title}
                  dueAt={item.dueAt}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              No reviews due today. Great job!
            </p>
          )}
        </CardContent>
      </Card>

      {dueItems.length > todayItems.length && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dueItems
                .filter((i) => !todayItems.includes(i))
                .map((item) => (
                  <Link
                    key={item.id}
                    href={`/review?session=${item.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
                  >
                    <span>{item.node.title}</span>
                    <span className="text-muted-foreground">
                      {formatRelativeTime(item.dueAt)}
                    </span>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
