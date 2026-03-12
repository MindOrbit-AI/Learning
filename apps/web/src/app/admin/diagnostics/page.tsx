import { DiagnosticsList } from "@/features/admin-diagnostics/diagnostics-list";

export default function AdminDiagnosticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Diagnostic Questions</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage question bank for concept diagnostics
        </p>
      </div>
      <DiagnosticsList />
    </div>
  );
}
