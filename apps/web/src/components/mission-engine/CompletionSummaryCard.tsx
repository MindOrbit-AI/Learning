"use client";

import Link from "next/link";
import { Card, CardContent, Button, cn } from "@mindorbit/ui";
import { starRatingLabel } from "@mindorbit/lib";
import { BookOpen, Sparkles, Star, Trophy, Target, GitBranch, ArrowRight } from "lucide-react";
import { MasteryStateChange } from "@/features/learning-loop/mastery-state-change";

interface NextAction {
  nodeTitle: string;
  subjectTitle: string;
  reason: string;
  href: string;
}

interface CompletionSummaryCardProps {
  xpEarned: number;
  stars?: number | null;
  practiceSummary?: { correct: number; total: number };
  onBack: () => void;
  missionTitle?: string;
  nodeTitle?: string;
  missionTypeLabel?: string;
  masteryBefore?: number;
  masteryAfter?: number;
  stateBefore?: string;
  stateAfter?: string;
  unlockedNodes?: Array<{ nodeId: string; title: string; state: string }>;
  nextAction?: NextAction | null;
}

export function CompletionSummaryCard({
  xpEarned,
  stars,
  practiceSummary,
  onBack,
  missionTitle,
  nodeTitle,
  missionTypeLabel,
  masteryBefore,
  masteryAfter,
  stateBefore,
  stateAfter,
  unlockedNodes,
  nextAction,
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

          {nodeTitle && masteryBefore != null && masteryAfter != null && stateBefore && stateAfter && (
            <div className="mt-6 w-full max-w-md">
              <MasteryStateChange
                nodeTitle={nodeTitle}
                masteryBefore={masteryBefore}
                masteryAfter={masteryAfter}
                stateBefore={stateBefore}
                stateAfter={stateAfter}
              />
            </div>
          )}

          {unlockedNodes && unlockedNodes.length > 0 && (
            <div className="mt-6 w-full max-w-md rounded-xl border bg-card/60 p-4 text-left">
              <p className="flex items-center gap-2 text-sm font-bold text-primary">
                <GitBranch className="h-4 w-4" />
                What this unlocks
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {unlockedNodes.map((n) => (
                  <li key={n.nodeId}>{n.title}</li>
                ))}
              </ul>
            </div>
          )}

          {nextAction && (
            <Link
              href={nextAction.href}
              className="mt-6 flex w-full max-w-md items-center justify-between rounded-xl border-2 border-primary/30 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10"
            >
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-primary">Up next</p>
                <p className="mt-1 font-semibold">{nextAction.nodeTitle || nextAction.subjectTitle}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{nextAction.reason}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
            </Link>
          )}

          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            {nextAction && (
              <Button asChild size="lg" className="flex-1">
                <Link href={nextAction.href}>Continue path</Link>
              </Button>
            )}
            <Button className="flex-1" size="lg" variant={nextAction ? "outline" : "default"} onClick={onBack}>
              Back to Missions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
