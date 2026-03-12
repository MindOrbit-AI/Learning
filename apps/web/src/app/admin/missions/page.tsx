import { prisma } from "@mindorbit/db";

export default async function AdminMissionsPage() {
  const templates = await prisma.missionTemplate.findMany({
    include: {
      node: { select: { title: true } },
      subject: { select: { title: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mission Templates</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage mission templates for concept nodes
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        {templates.length === 0 ? (
          <p className="text-sm text-slate-500">No mission templates yet. Create templates via the API.</p>
        ) : (
          <ul className="space-y-2">
            {templates.map((t) => (
              <li key={t.id} className="flex justify-between border-b border-slate-100 py-2 last:border-0 dark:border-slate-800">
                <span>{t.title} — {t.node.title}</span>
                <span className="text-slate-500">{t.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
