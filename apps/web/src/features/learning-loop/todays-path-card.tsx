import Link from "next/link";
import {
  ScanSearch,
  Target,
  RefreshCw,
  GitBranch,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@mindorbit/ui";
import type { TodaysPathStep, DecayAlert, NextBestAction } from "@/services/learning-path-service";

const KIND_ICONS = {
  diagnostic: ScanSearch,
  mission: Target,
  review: RefreshCw,
  expand: GitBranch,
} as const;

function StepIcon({ kind, status }: { kind: TodaysPathStep["kind"]; status: TodaysPathStep["status"] }) {
  const Icon = KIND_ICONS[kind];
  if (status === "done") return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  if (status === "current") return <Icon className="h-5 w-5 text-primary" />;
  return <Circle className="h-5 w-5 text-muted-foreground/40" />;
}

export function TodaysPathCard({
  steps,
  decayAlerts,
  suggestRediagnostic,
  rediagnosticHref,
  nextActions,
}: {
  steps: TodaysPathStep[];
  decayAlerts: DecayAlert[];
  suggestRediagnostic: boolean;
  rediagnosticHref?: string;
  nextActions: NextBestAction[];
}) {
  const current = steps.find((s) => s.status === "current");

  return (
    <Card className="overflow-hidden rounded-3xl border-2 border-primary/15 shadow-lg">
      <CardHeader className="border-b border-primary/10 bg-primary/[0.04]">
        <CardTitle className="text-lg sm:text-xl">Today&apos;s path</CardTitle>
        <CardDescription>
          {current
            ? `Up next: ${current.title}`
            : "Your loop is complete for today — explore or review."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={`${step.kind}-${i}`}>
              <Link
                href={step.href}
                className={`flex items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-muted ${
                  step.status === "current" ? "border-primary/40 bg-primary/[0.04]" : "border-border/80"
                } ${step.status === "done" ? "opacity-70" : ""}`}
              >
                <div className="mt-0.5 shrink-0">
                  <StepIcon kind={step.kind} status={step.status} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {step.status !== "done" && (
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </Link>
            </li>
          ))}
        </ol>

        {decayAlerts.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Knowledge at risk
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {decayAlerts.slice(0, 3).map((a) => (
                <li key={a.nodeId}>
                  <Link
                    href={`/review?node=${a.nodeId}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {a.nodeTitle}
                  </Link>
                  <span className="text-muted-foreground">
                    {" "}
                    — {Math.round(a.retention * 100)}% retention
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestRediagnostic && rediagnosticHref && (
          <div className="flex flex-col gap-2 rounded-xl border border-dashed p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Time to refresh your mastery map.</p>
            <Button asChild size="sm" variant="outline">
              <Link href={rediagnosticHref}>Re-diagnose</Link>
            </Button>
          </div>
        )}

        {nextActions.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
              Recommended next
            </p>
            <div className="space-y-2">
              {nextActions.slice(0, 2).map((action) => (
                <Link
                  key={`${action.kind}-${action.nodeId}-${action.href}`}
                  href={action.href}
                  className="block rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <span className="font-medium">{action.nodeTitle || action.subjectTitle}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{action.reason}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
