import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { PublishStatusBadge } from "@/features/admin-dashboard/publish-status-badge";
import { Button } from "@mindorbit/ui";

export default async function ClusterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cluster = await prisma.cluster.findUnique({
    where: { id },
    include: {
      subject: true,
      conceptNodes: { orderBy: { orderIndex: "asc" } },
    },
  });

  if (!cluster) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{cluster.title}</h1>
          <p className="text-slate-500">{cluster.slug}</p>
          <PublishStatusBadge status={cluster.status} className="mt-2" />
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/subjects/${cluster.subjectId}`}>
            <Button variant="outline" size="sm">
              View Subject
            </Button>
          </Link>
          <Link href={`/admin/mastery-map/${cluster.subjectId}`}>
            <Button variant="outline" size="sm">
              Mastery Map
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-400">{cluster.description}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Concept Nodes ({cluster.conceptNodes.length})</h2>
        {cluster.conceptNodes.length === 0 ? (
          <p className="text-sm text-slate-500">No concepts in this cluster.</p>
        ) : (
          <ul className="space-y-2">
            {cluster.conceptNodes.map((n) => (
              <li key={n.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                <span className="font-medium">{n.title}</span>
                <Link href={`/admin/concepts/${n.id}`} className="text-sm text-primary hover:underline">
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
