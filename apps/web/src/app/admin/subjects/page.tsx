import { SubjectsList } from "@/features/admin-subjects/subjects-list";

export default function AdminSubjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Subjects</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage courses and curriculum subjects
        </p>
      </div>
      <SubjectsList />
    </div>
  );
}
