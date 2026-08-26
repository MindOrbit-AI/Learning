import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { generateReviewSession } from "@/services/review-session-service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const sessionData = await generateReviewSession(session.user.id, id);
    return NextResponse.json({
      reviewItemId: id,
      nodeTitle: sessionData.nodeTitle,
      nodeId: sessionData.nodeId,
      questions: sessionData.questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: q.options,
        explanation: q.explanation,
        sceneType: q.sceneType,
        // correctAnswer sent for client-side check — review is low-stakes retention
        correctAnswer: q.correctAnswer,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Review session not found" }, { status: 404 });
  }
}
