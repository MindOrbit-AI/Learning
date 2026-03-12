import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/admin";

export default async function AdminSettingsPage() {
  const session = await requireSuperAdmin();
  if (!session) {
    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Platform Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Super admin configuration
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500">Settings configuration coming soon.</p>
      </div>
    </div>
  );
}
