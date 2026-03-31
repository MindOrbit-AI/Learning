import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { CalendarDays, Flame, Target } from "lucide-react";

const DAILY_TARGET = 1;
const WEEKLY_TARGET = 3;

function Ring({
  value,
  max,
  label,
  met,
}: {
  value: number;
  max: number;
  label: string;
  met: boolean;
}) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative grid h-[5.5rem] w-[5.5rem] place-items-center rounded-full p-1"
        style={{
          background: `conic-gradient(var(--primary) ${pct}%, hsl(var(--muted)) ${pct}%)`,
        }}
      >
        <div className="flex h-[calc(100%-10px)] w-[calc(100%-10px)] flex-col items-center justify-center rounded-full bg-card text-center">
          <span className="text-lg font-bold tabular-nums leading-none">
            {value}/{max}
          </span>
        </div>
      </div>
      <span
        className={`text-center text-xs font-medium ${
          met ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
        {met ? " ✓" : ""}
      </span>
    </div>
  );
}

export function MissionGoalsSummary({
  missionStreak,
  bestMissionStreak,
  missionsToday,
  missionsThisWeek,
}: {
  missionStreak: number;
  bestMissionStreak: number;
  missionsToday: number;
  missionsThisWeek: number;
}) {
  const dailyMet = missionsToday >= DAILY_TARGET;
  const weeklyMet = missionsThisWeek >= WEEKLY_TARGET;

  return (
    <Card className="border-primary/15 bg-gradient-to-br from-primary/[0.06] to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Mission habits
        </CardTitle>
        <CardDescription>
          Goals use UTC days. Complete at least one mission per day to grow your streak.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="flex items-start gap-6">
          <Ring
            value={Math.min(missionsToday, DAILY_TARGET)}
            max={DAILY_TARGET}
            label="Today"
            met={dailyMet}
          />
          <Ring
            value={Math.min(missionsThisWeek, WEEKLY_TARGET)}
            max={WEEKLY_TARGET}
            label="This week"
            met={weeklyMet}
          />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 rounded-xl border bg-card/60 px-4 py-3 sm:min-w-[200px]">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Flame className="h-4 w-4 text-orange-500" />
            {missionStreak} day{missionStreak === 1 ? "" : "s"} mission streak
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            Best streak: {bestMissionStreak} day{bestMissionStreak === 1 ? "" : "s"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
