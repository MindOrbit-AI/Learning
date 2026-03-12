import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@mindorbit/db";
import { z } from "zod";

const schema = z.object({
  gradeLevel: z.string(),
  studyGoal: z.string(),
  favoriteSubjects: z.array(z.string()).optional(),
  targetExams: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = schema.parse(body);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        gradeLevel: data.gradeLevel,
        studyGoal: data.studyGoal,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Onboarding failed" }, { status: 500 });
  }
}
