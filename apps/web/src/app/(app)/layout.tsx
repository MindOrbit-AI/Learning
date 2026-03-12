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
      }}
    >
      {children}
    </AppShell>
  );
}
