import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { formatRelativeTime } from "@mindorbit/lib";
import { ClipboardList } from "lucide-react";

export default async function ReviewPage() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;

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
          Reinforce weak nodes with spaced repetition
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Due Today</CardTitle>
          <CardDescription>
            {todayItems.length} nodes to review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayItems.length > 0 ? (
            <div className="space-y-2">
              {todayItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/mastery-map?node=${item.nodeId}`}
                  className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <ClipboardList className="h-10 w-10 text-primary" />
                    <div>
                      <p className="font-medium">{item.node.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Due {formatRelativeTime(item.dueAt)}
                      </p>
                    </div>
                  </div>
                  <span className="text-primary">Review →</span>
                </Link>
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
                    href={`/mastery-map?node=${item.nodeId}`}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
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
