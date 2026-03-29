import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { AppShell } from "@/components/app-shell";

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
      planTier: true,
      onboardingCompleted: true,
    },
  });

  if (user && !user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <AppShell
      user={{
        name: user?.name ?? session.user.name,
        image: user?.image ?? session.user.image,
        role: user?.role ?? session.user.role,
        xp: user?.xp ?? 0,
        streakCount: user?.streakCount ?? 0,
        planTier: user?.planTier ?? "FREE",
      }}
    >
      {children}
    </AppShell>
  );
}
