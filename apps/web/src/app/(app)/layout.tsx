import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { effectivePlanTier, levelFromXp } from "@mindorbit/lib";
import { AppShell } from "@/components/app-shell";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      image: true,
      role: true,
      xp: true,
      streakCount: true,
      bestMissionStreak: true,
      planTier: true,
      bonusProUntil: true,
      onboardingCompleted: true,
    },
  });

  if (user && !user.onboardingCompleted) {
    redirect("/onboarding");
  }

  const xp = user?.xp ?? 0;
  const displayPlanTier = effectivePlanTier({
    planTier: user?.planTier ?? "FREE",
    bonusProUntil: user?.bonusProUntil,
  });

  return (
    <AppShell
      user={{
        name: user?.name ?? session.user.name,
        image: user?.image ?? session.user.image,
        role: user?.role ?? session.user.role,
        xp,
        level: levelFromXp(xp),
        streakCount: user?.streakCount ?? 0,
        bestMissionStreak: user?.bestMissionStreak ?? 0,
        planTier: displayPlanTier,
      }}
    >
      {children}
    </AppShell>
  );
}
