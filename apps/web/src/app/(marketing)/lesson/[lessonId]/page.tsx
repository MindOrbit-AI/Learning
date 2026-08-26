import Link from "next/link";
import { notFound } from "next/navigation";
import { Brain } from "lucide-react";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { loadVisualLessonById } from "@/lib/load-visual-lesson";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const session = await getServerSession();

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
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-fuchsia-950/20 text-zinc-50">
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4 sm:h-16">
          <Link href="/practice-lessons" className="flex items-center gap-2 text-sm font-bold text-zinc-300 hover:text-white">
            <Brain className="h-5 w-5 text-violet-400" strokeWidth={2.5} />
            <span className="hidden sm:inline">MindOrbit</span>
            <span className="text-zinc-500">·</span>
            <span>Practice lessons</span>
          </Link>
          {session?.user?.id ? (
            <Link
              href="/learn"
              className="text-sm font-bold text-violet-300 underline decoration-2 underline-offset-4 hover:text-violet-200"
            >
              My lessons
            </Link>
          ) : (
            <Link
              href={`/auth/signup?callbackUrl=${encodeURIComponent(`/lesson/${lessonId}`)}`}
              className="text-sm font-bold text-violet-300 underline decoration-2 underline-offset-4 hover:text-violet-200"
            >
              Sign in to save progress
            </Link>
          )}
        </div>
      </header>

      <div className="px-4 py-8 sm:py-12">
        <LessonPlayer
          lesson={lesson}
          dbLessonId={dbLessonId}
          userId={session?.user?.id ?? null}
        />
      </div>
    </div>
  );
}
