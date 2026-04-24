import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@mindorbit/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import { Clock, Target } from "lucide-react";

type Props = { params: Promise<{ subjectSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectSlug } = await params;
  const subject = await prisma.subject.findFirst({
    where: { slug: subjectSlug, createdById: null, status: "published" },
    select: { title: true },
  });
  if (!subject) return { title: "Diagnostic" };
  return {
    title: `${subject.title} diagnostic — try free`,
    description: `Run the ${subject.title} diagnostic without an account.`,
  };
}

export default async function MarketingDiagnosticStartPage({ params }: Props) {
  const { subjectSlug } = await params;
  const subject = await prisma.subject.findFirst({
    where: { slug: subjectSlug, createdById: null, status: "published" },
  });
  if (!subject) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{subject.title} diagnostic</h1>
        <p className="text-muted-foreground">A short assessment—no sign-up required</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Before you start</CardTitle>
          <CardDescription>
            This diagnostic asks about fifteen questions across key concepts. You will
            see a score snapshot at the end. Create a free account anytime to save your
            mastery map and missions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>About five minutes</span>
          </div>
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-muted-foreground" />
            <span>Questions from multiple concept clusters</span>
          </div>
          <Button size="lg" className="mt-4" asChild>
            <Link href={`/try-diagnostic/${subjectSlug}/run`}>Start diagnostic</Link>
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-sm">
        <Link href="/try-diagnostic" className="text-muted-foreground underline underline-offset-4">
          Choose a different subject
        </Link>
      </p>
    </div>
  );
}
