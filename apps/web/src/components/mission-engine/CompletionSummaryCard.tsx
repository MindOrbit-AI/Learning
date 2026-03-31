"use client";

import { Card, CardContent, Button, cn } from "@mindorbit/ui";
import { starRatingLabel } from "@mindorbit/lib";
import { BookOpen, Sparkles, Star, Trophy, Target } from "lucide-react";

interface CompletionSummaryCardProps {
  xpEarned: number;
  /** 1–3 from performance; omitted for older completions */
  stars?: number | null;
  /** When omitted, the score row is hidden (e.g. legacy completed mission). */
  practiceSummary?: { correct: number; total: number };
  onBack: () => void;
  missionTitle?: string;
  nodeTitle?: string;
  missionTypeLabel?: string;
}

export function CompletionSummaryCard({
  xpEarned,
  stars,
  practiceSummary,
  onBack,
  missionTitle,
  nodeTitle,
  missionTypeLabel,
}: CompletionSummaryCardProps) {
  const correctCount = practiceSummary?.correct ?? 0;
  const totalCount = practiceSummary?.total ?? 0;
  const pct = practiceSummary && totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const starTier =
    stars === 1 || stars === 2 || stars === 3 ? stars : null;

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-2xl bg-primary/10 p-4">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Mission complete</h2>
          <p className="mt-1 text-muted-foreground">Nice work — here is what you earned.</p>

          {starTier != null && (
            <div className="mt-6 flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-9 w-9",
                      i <= starTier
                        ? "fill-amber-400 text-amber-500"
                        : "text-muted-foreground/25"
                    )}
                    strokeWidth={i <= starTier ? 0 : 1.5}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                {starRatingLabel(starTier)} run
              </p>
              <p className="max-w-sm text-xs text-muted-foreground">
                3★ means first try, no hints. Using hints or extra attempts still completes the
                mission with a strong 2★.
              </p>
            </div>
          )}

          {(missionTypeLabel || missionTitle || nodeTitle) && (
            <div className="mt-6 w-full max-w-md rounded-xl border bg-card/60 px-4 py-3 text-left text-sm">
              {missionTypeLabel && (
                <p className="font-semibold text-primary">{missionTypeLabel} mission</p>
              )}
              {missionTitle && (
                <p className={`font-medium text-foreground ${missionTypeLabel ? "mt-1" : ""}`}>
                  {missionTitle}
                </p>
              )}
              {nodeTitle && (
                <p className="mt-2 flex items-start gap-2 text-muted-foreground">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Practiced: {nodeTitle}</span>
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex w-full max-w-xs flex-col gap-4">
            {practiceSummary && (
              <div className="flex items-center justify-between rounded-xl border bg-card/50 px-4 py-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  Practice score
                </span>
                <span className="font-semibold">
                  {correctCount}/{totalCount} ({pct}%)
                </span>
              </div>
            )}
            <div className="flex items-center justify-between rounded-xl border bg-card/50 px-4 py-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-4 w-4" />
                XP earned
              </span>
              <span className="font-semibold text-primary">+{xpEarned} XP</span>
            </div>
          </div>

          <Button className="mt-8" size="lg" onClick={onBack}>
            Back to Missions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
