import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@mindorbit/ui";

export type SubjectCardModel = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  _count: { clusters: number; conceptNodes: number };
};

export function SubjectCard({ s, badge }: { s: SubjectCardModel; badge?: string }) {
  return (
    <Link href={`/subjects/${s.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardContent className="p-6">
          {badge ? (
            <p className="mb-3">
              <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {badge}
              </span>
            </p>
          ) : null}
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${s.color}20` }}
          >
            {s.icon}
          </div>
          <h3 className="font-semibold">{s.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            {s._count.clusters} clusters • {s._count.conceptNodes} concepts
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function SubjectCardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
