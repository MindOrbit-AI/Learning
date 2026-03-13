"use client";

import { Card, CardContent, Button } from "@mindorbit/ui";
import { Sparkles, Trophy, Target } from "lucide-react";

interface CompletionSummaryCardProps {
  xpEarned: number;
  correctCount: number;
  totalCount: number;
  onBack: () => void;
}

export function CompletionSummaryCard({
  xpEarned,
  correctCount,
  totalCount,
  onBack,
}: CompletionSummaryCardProps) {
  const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-2xl bg-primary/10 p-4">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Mission Complete!</h2>
          <p className="mt-1 text-muted-foreground">You've finished this learning path</p>

          <div className="mt-8 flex w-full max-w-xs flex-col gap-4">
            <div className="flex items-center justify-between rounded-xl border bg-card/50 px-4 py-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Trophy className="h-4 w-4" />
                Score
              </span>
              <span className="font-semibold">
                {correctCount}/{totalCount} ({pct}%)
              </span>
            </div>
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
