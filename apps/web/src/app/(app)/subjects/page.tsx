import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@mindorbit/ui";
import { getServerSession } from "@/lib/auth";
import { subjectVisibilityWhere } from "@/lib/subject-visibility";
import { SubjectCard, SubjectCardGrid } from "@/features/subjects/subject-card";
import { BookMarked, Plus, Users } from "lucide-react";

const cardInclude = { _count: { select: { clusters: true, conceptNodes: true } as const } };

function libraryBadge(createdById: string | null, userId: string | undefined): string | undefined {
  if (!userId) return undefined;
  if (createdById === null) return "Catalog";
  if (createdById === userId) return "Yours";
  return "Saved";
}

export default async function SubjectsPage() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  const librarySubjects = await prisma.subject.findMany({
    where: subjectVisibilityWhere(userId as string | undefined),
    include: cardInclude,
    orderBy: { title: "asc" },
  });

  const userGeneratedSubjects =
    userId != null
      ? await prisma.subject.findMany({
          where: {
            status: "published",
            createdById: { not: null, not: userId },
            libraryAdds: { none: { userId } },
          },
          include: cardInclude,
          orderBy: { title: "asc" },
        })
      : [];

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Subjects</h1>
          <p className="text-muted-foreground">
            Choose a subject to explore, take a diagnostic, or view your mastery map
          </p>
        </div>
        {userId && (
          <Link href="/subjects/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Subject
            </Button>
          </Link>
        )}
      </div>

      {userId != null ? (
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:inline-flex sm:h-auto sm:min-h-11 sm:w-auto">
            <TabsTrigger
              value="library"
              className="gap-2 whitespace-normal py-2.5 text-center leading-snug sm:whitespace-nowrap sm:py-2"
            >
              <BookMarked className="h-4 w-4 shrink-0" aria-hidden />
              My library
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="gap-2 whitespace-normal py-2.5 text-center leading-snug sm:whitespace-nowrap sm:py-2"
            >
              <Users className="h-4 w-4 shrink-0" aria-hidden />
              Community Subjects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4" aria-labelledby="library-heading">
            <div>
              <h2 id="library-heading" className="sr-only">
                My library
              </h2>
              <p className="text-sm text-muted-foreground">
                Official catalog, subjects you created, and ones you added from the community.
              </p>
            </div>
            {librarySubjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subjects yet.</p>
            ) : (
              <SubjectCardGrid>
                {librarySubjects.map((s) => (
                  <SubjectCard
                    key={s.id}
                    s={s}
                    badge={libraryBadge(s.createdById, userId)}
                  />
                ))}
              </SubjectCardGrid>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-4" aria-labelledby="community-heading">
            <div>
              <h2 id="community-heading" className="sr-only">
                Community Subjects
              </h2>
              <p className="text-sm text-muted-foreground">
                Published community subjects from other learners. Open one and use Add to my subjects to move it
                into your library.
              </p>
            </div>
            {userGeneratedSubjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No community subjects to show yet, or you already have them in your library.
              </p>
            ) : (
              <SubjectCardGrid>
                {userGeneratedSubjects.map((s) => (
                  <SubjectCard key={s.id} s={s} badge="Community" />
                ))}
              </SubjectCardGrid>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <section className="space-y-4" aria-labelledby="library-heading">
          <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-primary" aria-hidden />
              <h2 id="library-heading" className="text-lg font-semibold tracking-tight">
                Subjects
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Sign in to create subjects and save community subjects to your library.
            </p>
          </div>
          {librarySubjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subjects yet.</p>
          ) : (
            <SubjectCardGrid>
              {librarySubjects.map((s) => (
                <SubjectCard
                  key={s.id}
                  s={s}
                  badge={libraryBadge(s.createdById, userId)}
                />
              ))}
            </SubjectCardGrid>
          )}
        </section>
      )}
    </div>
  );
}
