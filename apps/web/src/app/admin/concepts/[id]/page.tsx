import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const node = await prisma.conceptNode.findUnique({
    where: { id },
    include: {
      subject: true,
      cluster: true,
      diagnosticQuestions: true,
      inEdges: { include: { sourceNode: { select: { title: true } } } },
      outEdges: { include: { targetNode: { select: { title: true } } } },
    },
  });

  if (!node) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{node.title}</h1>
          <p className="text-slate-500">{node.slug}</p>
          <PublishStatusBadge status={node.status} className="mt-2" />
        </div>
        <Link href={`/admin/mastery-map/${node.subjectId}`}>
          <span className="text-sm text-primary hover:underline">View in Mastery Map</span>
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-400">{node.description}</p>
        {node.learningObjective && (
          <p className="mt-2 text-sm">
            <strong>Learning objective:</strong> {node.learningObjective}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-2 font-semibold">Prerequisites</h2>
          {node.inEdges.length === 0 ? (
            <p className="text-sm text-slate-500">None</p>
          ) : (
            <ul className="space-y-1">
              {node.inEdges.map((e) => (
                <li key={e.id}>{e.sourceNode.title}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-2 font-semibold">Dependencies</h2>
          {node.outEdges.length === 0 ? (
            <p className="text-sm text-slate-500">None</p>
          ) : (
            <ul className="space-y-1">
              {node.outEdges.map((e) => (
                <li key={e.id}>{e.targetNode.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-2 font-semibold">Diagnostic Questions ({node.diagnosticQuestions.length})</h2>
        {node.diagnosticQuestions.length === 0 ? (
          <p className="text-sm text-slate-500">No diagnostic questions linked.</p>
        ) : (
          <ul className="space-y-2">
            {node.diagnosticQuestions.map((q) => (
              <li key={q.id} className="text-sm">{q.prompt.substring(0, 80)}...</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
