import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { MasteryMapBuilder } from "@/features/admin-mastery-map/mastery-map-builder";
import { Button } from "@mindorbit/ui";

export default async function MasteryMapBuilderPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Mastery Map: {subject.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Edit the concept graph. Drag nodes to reposition, connect nodes to create dependencies.
          </p>
        </div>
        <Link href="/admin/mastery-map/select">
          <Button variant="outline" size="sm">
            Change Subject
          </Button>
        </Link>
      </div>

      <MasteryMapBuilder subjectId={subjectId} subjectTitle={subject.title} />
    </div>
  );
}
