import { SubjectForm } from "@/features/admin-subjects/subject-form";

export default function NewSubjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">New Subject</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a new curriculum subject</p>
      </div>
      <SubjectForm />
    </div>
  );
}
