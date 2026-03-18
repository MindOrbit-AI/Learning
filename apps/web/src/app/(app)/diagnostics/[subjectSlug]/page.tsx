import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@mindorbit/db";
import { getServerSession } from "@/lib/auth";
import { canViewSubject } from "@/lib/subject-visibility";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import { Clock, Target } from "lucide-react";

export default async function DiagnosticStartPage({
  params,
}: {
  params: Promise<{ subjectSlug: string }>;
}) {
  const { subjectSlug } = await params;
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
  });
  if (!subject) notFound();
  if (!canViewSubject(subject, session.user.id)) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          {subject.title} Diagnostic
        </h1>
        <p className="text-muted-foreground">
          A 5-minute assessment to map your mastery
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Before you start</CardTitle>
          <CardDescription>
            This diagnostic will ask ~15 questions across key concepts. Your
            answers determine your mastery map and recommended missions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>~5 minutes</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-muted-foreground" />
            <span>Questions from multiple concept clusters</span>
          </div>
          <Link href={`/diagnostics/${subjectSlug}/run`}>
            <Button size="lg" className="mt-4">
              Start diagnostic
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
