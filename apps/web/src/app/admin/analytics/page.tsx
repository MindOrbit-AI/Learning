import { prisma } from "@mindorbit/db";

export default async function AdminAnalyticsPage() {
  const [
    subjectEngagement,
    diagnosticCount,
    missionCount,
  ] = await Promise.all([
    prisma.diagnosticAttempt.groupBy({
      by: ["subjectId"],
      _count: true,
    }),
    prisma.diagnosticAttempt.count(),
    prisma.mission.count({ where: { status: "completed" } }),
  ]);

  const subjects = await prisma.subject.findMany({
    select: { id: true, title: true },
  });
  const subjectMap = new Map(subjects.map((s) => [s.id, s.title]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Platform engagement and completion metrics
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Total Diagnostics</p>
          <p className="text-2xl font-bold">{diagnosticCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Missions Completed</p>
          <p className="text-2xl font-bold">{missionCount}</p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Diagnostic attempts by subject</h2>
        {subjectEngagement.length === 0 ? (
          <p className="text-sm text-slate-500">No data yet.</p>
        ) : (
          <ul className="space-y-2">
            {subjectEngagement.map((s) => (
              <li key={s.subjectId} className="flex justify-between">
                <span>{subjectMap.get(s.subjectId) ?? s.subjectId}</span>
                <span>{s._count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
