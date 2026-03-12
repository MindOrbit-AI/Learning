import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { AdminAppShell } from "@/features/admin-dashboard/admin-app-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  if (!session) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  return (
    <AdminAppShell user={session.user}>
      {children}
    </AdminAppShell>
  );
}
