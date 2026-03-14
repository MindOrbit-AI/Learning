import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";
import { SubjectForm } from "@/features/admin-subjects/subject-form";
import { Button } from "@mindorbit/ui";

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      clusters: { orderBy: { orderIndex: "asc" } },
      _count: {
        select: {
          clusters: true,
          conceptNodes: true,
          conceptEdges: true,
          diagnosticQuestions: true,
          resources: true,
        },
      },
    },
  });

  if (!subject) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{subject.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{subject.title}</h1>
              <p className="text-slate-500 dark:text-slate-400">{subject.slug}</p>
            </div>
            <PublishStatusBadge status={subject.status} />
          </div>
          <div className="mt-4 flex flex-wrap gap-6 text-sm">
            <span>{subject._count.clusters} clusters</span>
            <span>{subject._count.conceptNodes} concepts</span>
            <span>{subject._count.conceptEdges} edges</span>
            <span>{subject._count.diagnosticQuestions} diagnostics</span>
            <span>{subject._count.resources} resources</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/mastery-map/${id}`}>
            <Button variant="outline" size="sm">
              Mastery Map
            </Button>
          </Link>
          <Link href={`/admin/subjects`}>
            <Button variant="ghost" size="sm">
              Back
            </Button>
          </Link>
        </div>
      </div>

      <SubjectForm subject={subject} />

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Clusters</h2>
        {subject.clusters.length === 0 ? (
          <p className="text-sm text-slate-500">No clusters yet.</p>
        ) : (
          <ul className="space-y-2">
            {subject.clusters.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                <span className="font-medium">{c.title}</span>
                <Link href={`/admin/clusters/${c.id}`} className="text-sm text-primary hover:underline">
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
