"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@mindorbit/ui";
import { Lock, Sparkles } from "lucide-react";

export function FeatureGate({
  hasAccess,
  children,
  fallback,
}: {
  hasAccess: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  if (hasAccess) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return (
    <Card className="border-2 border-dashed border-muted">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-4 font-medium">Pro feature</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Upgrade to Pro to unlock this feature
        </p>
        <Button asChild className="mt-4 gap-2">
          <Link href="/pricing">
            <Sparkles className="h-4 w-4" />
            Upgrade
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
