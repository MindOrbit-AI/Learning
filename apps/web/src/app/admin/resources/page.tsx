import { ResourcesList } from "@/features/admin-resources/resources-list";

export default function AdminResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Resource Moderation</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review and moderate community resources
        </p>
      </div>
      <ResourcesList />
    </div>
  );
}
