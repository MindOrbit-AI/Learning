"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mindorbit/ui";
import { LockedFeatureOverlay } from "@/features/feature-gates/locked-feature-overlay";
import { BarChart3, TrendingUp, Target, Activity } from "lucide-react";

interface InsightsData {
  masteryDistribution: Record<string, number>;
  weakNodeTrend: Array<{
    nodeId: string;
    title: string;
    mastery: number;
    lastPracticed: string | null;
  }>;
  missionVelocity: number;
  totalNodes: number;
  totalMissionsCompleted: number;
}

export function AdvancedInsightsClient({ hasAccess }: { hasAccess: boolean }) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(hasAccess);

  useEffect(() => {
    if (!hasAccess) return;
    fetch("/api/insights/advanced")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [hasAccess]);

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Advanced Insights</h1>
          <p className="text-muted-foreground">Deeper analytics for your learning</p>
        </div>
        <div className="relative">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-32 animate-pulse bg-muted/50" />
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="h-48 animate-pulse bg-muted/50" />
            <Card className="h-48 animate-pulse bg-muted/50" />
          </div>
          <LockedFeatureOverlay
            title="Advanced Insights"
            message="Get deeper mastery analytics, retention trends, weak-node analysis, and mission velocity. Upgrade to Pro."
          />
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Advanced Insights</h1>
        <p className="text-muted-foreground">Deeper analytics for your learning progress</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Target className="h-4 w-4" />
              Total Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.totalNodes}</p>
            <p className="text-xs text-muted-foreground">Concepts tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Activity className="h-4 w-4" />
              Missions Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.totalMissionsCompleted}</p>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Mission Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.missionVelocity}</p>
            <p className="text-xs text-muted-foreground">Completed per day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4" />
              Mastery States
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {Object.entries(data.masteryDistribution).map(([state, count]) => (
                <div key={state} className="flex justify-between">
                  <span className="capitalize text-muted-foreground">{state}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weak Nodes</CardTitle>
          <CardDescription>Concepts that need more practice</CardDescription>
        </CardHeader>
        <CardContent>
          {data.weakNodeTrend.length === 0 ? (
            <p className="text-muted-foreground">No weak nodes — great progress!</p>
          ) : (
            <ul className="space-y-3">
              {data.weakNodeTrend.slice(0, 10).map((n) => (
                <li
                  key={n.nodeId}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="font-medium">{n.title}</span>
                  <span className="text-sm text-muted-foreground">
                    Mastery: {Math.round(n.mastery)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
