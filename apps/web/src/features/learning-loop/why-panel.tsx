import { Eye, GitBranch, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@mindorbit/ui";
import type { WhyPanelData } from "@/services/why-panel-service";

const STATE_LABELS: Record<string, string> = {
  weak: "Needs work",
  learning: "In progress",
  mastered: "Mastered",
  untouched: "Not yet assessed",
};

export function WhyPanel({ data, compact = false }: { data: WhyPanelData; compact?: boolean }) {
  return (
    <Card className={compact ? "border-primary/20" : "border-primary/25 bg-primary/[0.03]"}>
      <CardHeader className={compact ? "pb-2" : undefined}>
        <div className="flex items-center gap-2 text-primary">
          <Eye className="h-5 w-5 shrink-0" />
          <CardTitle className={compact ? "text-base" : "text-lg"}>
            Why {data.nodeTitle}?
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-foreground">{data.summary}</p>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-muted px-2.5 py-1 font-semibold">
            {STATE_LABELS[data.state] ?? data.state}
          </span>
          {data.mastery != null && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
              {Math.round(data.mastery)}% mastery
            </span>
          )}
        </div>

        {data.misconception && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] p-3">
            <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              Likely misconception
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{data.misconception}</p>
          </div>
        )}

        {data.prerequisiteChain.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
              <GitBranch className="h-3.5 w-3.5" />
              Prerequisite chain
            </p>
            <ul className="space-y-1.5">
              {data.prerequisiteChain.map((p) => (
                <li
                  key={p.title}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                    p.isWeak ? "border-amber-500/40 bg-amber-500/[0.06]" : "border-border/80"
                  }`}
                >
                  <span className="font-medium">{p.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.isWeak ? (
                      <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="h-3 w-3" />
                        gap
                      </span>
                    ) : (
                      STATE_LABELS[p.state] ?? p.state
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
