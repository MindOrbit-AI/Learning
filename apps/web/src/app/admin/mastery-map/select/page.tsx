import Link from "next/link";
import { prisma } from "@mindorbit/db";

export default async function MasteryMapSelectPage() {
  const subjects = await prisma.subject.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      _count: { select: { conceptNodes: true, conceptEdges: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mastery Map Builder</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Select a subject to manage its concept graph
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <Link
            key={s.id}
            href={`/admin/mastery-map/${s.id}`}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="text-3xl">{s.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{s.title}</p>
              <p className="text-sm text-slate-500">
                {s._count.conceptNodes} nodes · {s._count.conceptEdges} edges
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
