import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@mindorbit/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@mindorbit/ui";
import { User, Award, FileText } from "lucide-react";
import { EarnedBadgeIcon } from "@/features/badges/earned-badge-icon";

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      userBadges: { include: { badge: true } },
      _count: { select: { resources: true } },
    },
  });

  if (!user) notFound();

  const resources = await prisma.resource.findMany({
    where: { userId: id },
    include: { node: { select: { title: true } }, subject: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Card>
        <CardContent className="flex items-center gap-6 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{user.name ?? "Anonymous"}</h1>
            {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {user._count.resources} contributions
              </span>
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                {user.xp} XP
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {(user.userBadges ?? []).map((ub) => (
              <div
                key={ub.badgeId}
                className="flex flex-col items-center rounded-xl border p-4"
                title={ub.badge.description}
              >
                <EarnedBadgeIcon
                  size="lg"
                  badge={{
                    slug: ub.badge.slug,
                    icon: ub.badge.icon,
                    title: ub.badge.title,
                    description: ub.badge.description,
                  }}
                />
                <span className="mt-3 text-sm">{ub.badge.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>{user._count.resources} uploaded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {resources.map((r) => (
              <Link
                key={r.id}
                href={`/community/${r.id}`}
                className="block rounded-xl border p-4 transition-colors hover:bg-muted"
              >
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-muted-foreground">
                  {r.subject.title} • {r.node.title}
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
