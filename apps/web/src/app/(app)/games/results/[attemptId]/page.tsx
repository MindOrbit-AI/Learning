import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import type { GameReward } from "@prisma/client";
import { getAttemptSummary } from "@/services/interactive-games-service";
import { GameResults, type GameResultSummary } from "@/components/games/GameResults";
import { Button } from "@mindorbit/ui";

export default async function GameResultsPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const session = await getServerSession();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/games");

  const { attemptId } = await params;
  const summary = await getAttemptSummary(attemptId, session.user.id);
  if (!summary) notFound();

  const props: GameResultSummary = {
    score: summary.score,
    xpEarned: summary.xpEarned,
    accuracy: summary.accuracy,
    correctCount: summary.correctCount,
    incorrectCount: summary.incorrectCount,
    strongConcepts: summary.strongConcepts,
    weakConcepts: summary.weakConcepts,
    rewards: summary.rewards.map((r: GameReward) => ({
      id: r.id,
      type: r.type,
      name: r.name,
      description: r.description,
      icon: r.icon,
    })),
    recommendation: summary.recommendation,
    gameTitle: summary.gameTitle,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black px-4 py-12 text-zinc-50">
      <GameResults summary={props} />
      <div className="mx-auto mt-10 max-w-3xl text-center">
        <Button asChild variant="ghost" className="text-zinc-400 hover:text-zinc-200">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
