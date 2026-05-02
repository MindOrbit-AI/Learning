import { notFound, redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { GameRunner } from "@/components/games/GameRunner";

export default async function GamePlayPage({ params }: { params: Promise<{ gameId: string }> }) {
  const session = await getServerSession();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/games");

  const { gameId } = await params;
  const game = await prisma.game.findFirst({
    where: { id: gameId, userId: session.user.id },
    select: { id: true },
  });
  if (!game) notFound();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { xp: true },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-zinc-50">
      <GameRunner gameId={gameId} userXp={user?.xp ?? 0} />
    </div>
  );
}
