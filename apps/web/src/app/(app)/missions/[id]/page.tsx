import { notFound } from "next/navigation";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { MissionRunner } from "./mission-runner";
import { MissionLessonRunner } from "@/features/lesson-runtime/components/MissionLessonRunner";
import { Card, CardContent, CardHeader, CardTitle } from "@mindorbit/ui";
import { missionTypeLabel } from "@/lib/mission-display";

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
    include: {
      node: true,
      tasks: { orderBy: { orderIndex: "asc" } },
      scenes: {
        orderBy: { orderIndex: "asc" },
        include: { responses: true },
      },
      progress: true,
    },
  });

  if (!mission || mission.userId !== session.user.id) notFound();

  const hasScenes = mission.scenes && mission.scenes.length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{mission.title}</h1>
        <p className="text-muted-foreground">{mission.node.title}</p>
        {mission.missionType === "challenge" && (
          <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
            {missionTypeLabel(mission.missionType)} — extra XP for pushing deeper.
          </p>
        )}
        {mission.missionType === "repair" && (
          <p className="mt-2 text-sm text-amber-800 dark:text-amber-200">
            {missionTypeLabel(mission.missionType)} — bonus XP for shoring up a weak concept.
          </p>
        )}
      </div>

      {!hasScenes && mission.explanation && (
        <Card>
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{mission.explanation}</p>
          </CardContent>
        </Card>
      )}

      {!hasScenes && mission.example && (
        <Card>
          <CardHeader>
            <CardTitle>Worked Example</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{mission.example}</p>
          </CardContent>
        </Card>
      )}

      {hasScenes ? (
        <MissionLessonRunner
          missionId={mission.id}
          missionTitle={mission.title}
          nodeTitle={mission.node.title}
          missionType={mission.missionType}
          scenes={mission.scenes}
          status={mission.status}
          xpReward={mission.xpReward}
          xpGranted={mission.xpGranted}
          starsGranted={mission.starsGranted}
          initialSceneIndex={mission.currentSceneIndex ?? 0}
          initialAnswers={
            mission.progress?.answersJson
              ? (JSON.parse(mission.progress.answersJson) as Record<string, unknown>)
              : {}
          }
        />
      ) : (
        <MissionRunner
          missionId={mission.id}
          missionTitle={mission.title}
          nodeTitle={mission.node.title}
          missionType={mission.missionType}
          tasks={mission.tasks}
          status={mission.status}
          xpReward={mission.xpReward}
          xpGranted={mission.xpGranted}
          starsGranted={mission.starsGranted}
        />
      )}
    </div>
  );
}
