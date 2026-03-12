import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sourceId: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sourceId } = await params;
  const source = await prisma.uploadedSource.findFirst({
    where: { id: sourceId, userId: session.user.id },
    select: {
      id: true,
      sourceType: true,
      sourceUrl: true,
      subjectId: true,
      status: true,
      summaryJson: true,
      createdAt: true,
    },
  });

  if (!source) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }

  const subject = source.subjectId
    ? await prisma.subject.findUnique({
        where: { id: source.subjectId },
        select: { id: true, title: true, slug: true },
      })
    : null;

  const summary = source.summaryJson
    ? (JSON.parse(source.summaryJson) as {
        flashcards: Array<{ front: string; back: string }>;
        shortSummary: string;
        deepSummary: string;
        quizzes: Array<{
          prompt: string;
          type: string;
          options: string[] | null;
          correctAnswer: string;
          explanation: string;
        }>;
      })
    : null;

  return NextResponse.json({
    ...source,
    subject,
    summary,
  });
}
