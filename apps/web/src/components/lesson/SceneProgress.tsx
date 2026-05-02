"use client";

import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";

type Props = {
  currentIndex: number;
  totalSteps: number;
  topic: string;
  level: string;
};

export function SceneProgress({ currentIndex, totalSteps, topic, level }: Props) {
  const done = Math.min(currentIndex, totalSteps - 1);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge>{topic}</Badge>
          <Badge className="border-amber-400/20 bg-amber-500/10 text-amber-100">{level}</Badge>
        </div>
        <p className="text-xs font-medium text-zinc-400">
          Step {Math.min(currentIndex + 1, totalSteps)} / {totalSteps}
        </p>
      </div>
      <Progress value={done + 1} max={totalSteps} />
    </div>
  );
}
