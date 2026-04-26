import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { OnboardingClient } from "./onboarding-client";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent("/onboarding")}`);
  }
  return <OnboardingClient />;
}
