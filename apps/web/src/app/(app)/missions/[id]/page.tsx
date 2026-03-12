import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { MissionRunner } from "./mission-runner";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@mindorbit/ui";

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  const { id } = await params;
  const mission = await prisma.mission.findUnique({
    where: { id },
    include: { node: true, tasks: { orderBy: { orderIndex: "asc" } } },
  });

  if (!mission || mission.userId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{mission.title}</h1>
        <p className="text-muted-foreground">{mission.node.title}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{mission.explanation}</p>
        </CardContent>
      </Card>

      {mission.example && (
        <Card>
          <CardHeader>
            <CardTitle>Worked Example</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{mission.example}</p>
          </CardContent>
        </Card>
      )}

      <MissionRunner
        missionId={mission.id}
        tasks={mission.tasks}
        status={mission.status}
        xpReward={mission.xpReward}
      />
    </div>
  );
}
