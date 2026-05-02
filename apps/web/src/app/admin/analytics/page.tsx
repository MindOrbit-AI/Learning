import { prisma } from "@mindorbit/db";
import { EVENT_TYPES } from "@/services/analytics-service";

const FUNNEL_EVENTS = [
  EVENT_TYPES.referral_signup,
  EVENT_TYPES.referral_qualified,
  EVENT_TYPES.funnel_onboarding_completed,
  EVENT_TYPES.mission_completed,
  EVENT_TYPES.checkout_started,
  EVENT_TYPES.checkout_completed,
  EVENT_TYPES.mastery_report_shared,
  EVENT_TYPES.pricing_viewed,
  EVENT_TYPES.upgrade_clicked,
] as const;

const GAME_LAB_EVENTS = [
  EVENT_TYPES.game_generated,
  EVENT_TYPES.game_started,
  EVENT_TYPES.game_answer,
  EVENT_TYPES.game_completed,
] as const;

export default async function AdminAnalyticsPage() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [
    subjectEngagement,
    diagnosticCount,
    missionCount,
    funnelRows,
    gameLabRows,
    referralTotals,
    userTotal,
  ] = await Promise.all([
    prisma.diagnosticAttempt.groupBy({
      by: ["subjectId"],
      _count: true,
    }),
    prisma.diagnosticAttempt.count(),
    prisma.mission.count({ where: { status: "completed" } }),
    prisma.userEvent.groupBy({
      by: ["eventType"],
      where: {
        createdAt: { gte: since },
        eventType: { in: [...FUNNEL_EVENTS] },
      },
      _count: true,
    }),
    prisma.userEvent.groupBy({
      by: ["eventType"],
      where: {
        createdAt: { gte: since },
        eventType: { in: [...GAME_LAB_EVENTS] },
      },
      _count: true,
    }),
    prisma.referral.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.user.count(),
  ]);

  const subjects = await prisma.subject.findMany({
    select: { id: true, title: true },
  });
  const subjectMap = new Map(subjects.map((s) => [s.id, s.title]));

  const funnelMap = new Map(funnelRows.map((r) => [r.eventType, r._count]));
  const gameLabMap = new Map(gameLabRows.map((r) => [r.eventType, r._count]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Platform engagement, funnel events (last 30 days), and referrals
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Registered users</p>
          <p className="text-2xl font-bold">{userTotal}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Total Diagnostics</p>
          <p className="text-2xl font-bold">{diagnosticCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Missions Completed</p>
          <p className="text-2xl font-bold">{missionCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500">Referrals qualified</p>
          <p className="text-2xl font-bold">
            {referralTotals.find((r) => r.status === "qualified")?._count ?? 0}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Funnel (last 30 days)</h2>
        <ul className="space-y-2 text-sm">
          {FUNNEL_EVENTS.map((ev) => (
            <li key={ev} className="flex justify-between gap-4">
              <span className="font-mono text-slate-600 dark:text-slate-400">{ev}</span>
              <span>{funnelMap.get(ev) ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Game Lab (last 30 days)</h2>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          Server-side <span className="font-mono">UserEvent</span> stream for generated games (also see{" "}
          <span className="font-mono">GameEvent</span> for per-attempt detail).
        </p>
        <ul className="space-y-2 text-sm">
          {GAME_LAB_EVENTS.map((ev) => (
            <li key={ev} className="flex justify-between gap-4">
              <span className="font-mono text-slate-600 dark:text-slate-400">{ev}</span>
              <span>{gameLabMap.get(ev) ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Referrals (all time)</h2>
        <ul className="space-y-2">
          {referralTotals.map((r) => (
            <li key={r.status} className="flex justify-between text-sm">
              <span className="capitalize">{r.status}</span>
              <span>{r._count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 font-semibold">Diagnostic attempts by subject</h2>
        {subjectEngagement.length === 0 ? (
          <p className="text-sm text-slate-500">No data yet.</p>
        ) : (
          <ul className="space-y-2">
            {subjectEngagement.map((s) => (
              <li key={s.subjectId} className="flex justify-between">
                <span>{subjectMap.get(s.subjectId) ?? s.subjectId}</span>
                <span>{s._count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
