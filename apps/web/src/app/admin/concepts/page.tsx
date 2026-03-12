import { ConceptsList } from "@/features/admin-concepts/concepts-list";

export default function AdminConceptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Concepts</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage concept nodes and their metadata
        </p>
      </div>
      <ConceptsList />
    </div>
  );
}
