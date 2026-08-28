import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { prisma } from "@mindorbit/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SEED_VISUAL_LESSONS, SEED_VISUAL_LESSON_IDS } from "@/lib/seed-lessons";

export const dynamic = "force-dynamic";

type CatalogItem = {
  id: string;
  title: string;
  topic: string;
  level: string;
  /** Display bucket for grouping (e.g. seed "Math" + DB Algebra → "Math"). */
  subjectGroup: string;
  pinned: boolean;
};

/** Align DB `Subject` rows with high-level labels used by seed lessons. */
function subjectGroupFromDb(subject: { title: string; slug: string } | null | undefined): string {
  if (!subject) return "Other";
  const slug = subject.slug.toLowerCase();
  if (slug === "algebra") return "Algebra";
  if (slug === "geometry" || slug === "sat-math") return "Math";
  return subject.title;
}

function sortSubjectGroups(keys: string[]): string[] {
  const priority = ["Math", "Algebra", "Biology", "Chemistry", "Physics", "Computer Science", "World History"];
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const p of priority) {
    if (keys.includes(p) && !seen.has(p)) {
      ordered.push(p);
      seen.add(p);
    }
  }
  const rest = keys.filter((k) => !seen.has(k)).sort((a, b) => a.localeCompare(b));
  return [...ordered, ...rest];
}

export default async function LearnPage() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/learn");
  }

  let rows: {
    id: string;
    title: string;
    topic: string;
    level: string;
    createdAt: Date;
    subject: { title: string; slug: string } | null;
  }[] = [];

  try {
    rows = await prisma.sceneLesson.findMany({
      where: { OR: [{ userId: session.user.id }, { userId: null }] },
      orderBy: { createdAt: "desc" },
      take: 40,
      select: {
        id: true,
        title: true,
        topic: true,
        level: true,
        createdAt: true,
        subject: { select: { title: true, slug: true } },
      },
    });
  } catch (e) {
    const isSchemaMissing =
      e instanceof Prisma.PrismaClientKnownRequestError &&
      (e.code === "P2021" || String(e.message).includes("does not exist"));
    if (!isSchemaMissing) throw e;
  }

  const seedItems: CatalogItem[] = SEED_VISUAL_LESSONS.map((l) => ({
    id: l.id,
    title: l.title,
    topic: l.topic,
    level: l.level,
    subjectGroup: l.subject,
    pinned: true,
  }));

  const dbItems: CatalogItem[] = rows
    .filter((r) => !SEED_VISUAL_LESSON_IDS.has(r.id))
    .map((r) => ({
      id: r.id,
      title: r.title,
      topic: r.topic,
      level: r.level,
      subjectGroup: subjectGroupFromDb(r.subject),
      pinned: false,
    }));

  const catalog: CatalogItem[] = [...seedItems, ...dbItems];

  const bySubject = new Map<string, CatalogItem[]>();
  for (const item of catalog) {
    const g = item.subjectGroup || "Other";
    const list = bySubject.get(g) ?? [];
    list.push(item);
    bySubject.set(g, list);
  }

  for (const list of bySubject.values()) {
    list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
  }

  const groupKeys = sortSubjectGroups([...bySubject.keys()]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-violet-950/30 px-4 py-10 text-zinc-50">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-2 text-center sm:text-left">
          <Badge>Visual Problem Engine</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Learn visually</h1>
          <p className="text-sm text-zinc-400 sm:text-base">
            Every lesson is a sequence of scenes. You manipulate models first — then lock in the idea.
          </p>
        </header>

        <div className="space-y-10">
          {groupKeys.map((subject) => {
            const items = bySubject.get(subject);
            if (!items?.length) return null;
            return (
              <section key={subject} className="space-y-4">
                <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2">
                  <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{subject}</h2>
                  <span className="text-xs tabular-nums text-zinc-500">{items.length} lesson{items.length === 1 ? "" : "s"}</span>
                </div>
                <div className="grid gap-3 sm:gap-4">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="flex flex-col gap-4 border-white/10 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-violet-300/90">{item.topic}</p>
                        <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                        <p className="mt-1 text-xs text-zinc-500">
                          Level <span className="text-zinc-300">{item.level}</span>
                          {item.pinned ? <span className="ml-2 text-amber-200/90">· curated seed</span> : null}
                        </p>
                      </div>
                      <Link href={`/lesson/${item.id}`} className="sm:shrink-0">
                        <Button type="button" className="w-full sm:w-auto">
                          Open
                        </Button>
                      </Link>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
