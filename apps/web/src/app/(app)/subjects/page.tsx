import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { Card, CardContent } from "@mindorbit/ui";

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    include: {
      _count: { select: { clusters: true, conceptNodes: true } },
    },
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Subjects</h1>
        <p className="text-muted-foreground">
          Choose a subject to explore, take a diagnostic, or view your mastery map
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <Link key={s.id} href={`/subjects/${s.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${s.color}20` }}
                >
                  {s.icon}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {s._count.clusters} clusters • {s._count.conceptNodes} concepts
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
