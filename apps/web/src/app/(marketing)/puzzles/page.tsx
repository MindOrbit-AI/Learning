import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { featureGateService } from "@/features/billing/feature-gate.service";
import { StemPuzzlesPage } from "@/features/marketing/stem-puzzles/stem-puzzles-page";

export default async function PuzzlesPage() {
  const session = await getServerSession();
  let canPlayPuzzles = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { planTier: true, bonusProUntil: true },
    });
    canPlayPuzzles = featureGateService.canPlayStemPuzzles(user);
  }

  return <StemPuzzlesPage canPlayPuzzles={canPlayPuzzles} />;
}
