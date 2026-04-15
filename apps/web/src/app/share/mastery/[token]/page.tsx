import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSnapshotByShareToken } from "@/services/mastery-share-service";
import { getSiteUrl } from "@/lib/site-url";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@mindorbit/ui";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const data = await getSnapshotByShareToken(token);
  if (!data) {
    return { title: "Mastery report" };
  }
  const { snapshot: s } = data;
  const title = `${s.displayName}'s MindOrbit mastery`;
  const description = `Level ${s.level + 1} · ${s.xp.toLocaleString()} XP · ${s.missionsCompleted} missions · ${s.nodesMastered} concepts mastered`;
  const site = getSiteUrl();
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${site}/share/mastery/${token}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicMasterySharePage({ params }: Props) {
  const { token } = await params;
  const data = await getSnapshotByShareToken(token);
  if (!data) notFound();

  const s = data.snapshot;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 p-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">MindOrbit Learn</p>
        <h1 className="mt-2 text-2xl font-bold">{s.displayName}&apos;s mastery snapshot</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Level</p>
            <p className="text-xl font-bold">{s.level + 1}</p>
          </div>
          <div>
            <p className="text-muted-foreground">XP</p>
            <p className="text-xl font-bold tabular-nums">{s.xp.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Missions done</p>
            <p className="text-xl font-bold tabular-nums">{s.missionsCompleted}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Concepts mastered</p>
            <p className="text-xl font-bold tabular-nums">{s.nodesMastered}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Mission streak</p>
            <p className="text-xl font-bold">
              {s.streakCount} days <span className="text-sm font-normal text-muted-foreground">(best {s.bestMissionStreak})</span>
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3">
        <Button asChild>
          <Link href="/auth/signup">Start learning</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">About MindOrbit</Link>
        </Button>
      </div>
    </div>
  );
}
