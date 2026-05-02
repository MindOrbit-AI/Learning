import { notFound, redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { loadVisualLessonById } from "@/lib/load-visual-lesson";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect(`/auth/signin?callbackUrl=/lesson/${(await params).lessonId}`);
  }

  const { lessonId } = await params;

  let lesson;
  let dbLessonId: string | null = null;
  try {
    const loaded = await loadVisualLessonById(prisma, lessonId);
    lesson = loaded.lesson;
    dbLessonId = loaded.row?.id ?? null;
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-fuchsia-950/20 px-4 py-8 text-zinc-50 sm:py-12">
      <LessonPlayer lesson={lesson} dbLessonId={dbLessonId} userId={session.user.id} />
    </div>
  );
}
