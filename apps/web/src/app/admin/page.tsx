import Link from "next/link";
import {
  BookOpen,
  Layers,
  Network,
  GitBranch,
  ClipboardList,
  FileText,
  Users,
  Activity,
} from "lucide-react";
import { prisma } from "@mindorbit/db";
import { StatsCard } from "@/features/admin-dashboard/stats-card";
import { RecentSubjectsTable } from "@/features/admin-dashboard/recent-subjects-table";

export default async function AdminDashboardPage() {
  const [
    subjectCount,
    clusterCount,
    conceptCount,
    edgeCount,
    questionCount,
    pendingResources,
    userCount,
    recentSubjects,
  ] = await Promise.all([
    prisma.subject.count(),
    prisma.cluster.count(),
    prisma.conceptNode.count(),
    prisma.conceptEdge.count(),
    prisma.diagnosticQuestion.count(),
    prisma.resource.count({ where: { status: "pending" } }),
    prisma.user.count(),
    prisma.subject.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Curriculum, mastery maps, and content management
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/subjects">
          <StatsCard
            title="Subjects"
            value={subjectCount}
            icon={<BookOpen className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
          />
        </Link>
        <Link href="/admin/clusters">
          <StatsCard
            title="Clusters"
            value={clusterCount}
            icon={<Layers className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
          />
        </Link>
        <Link href="/admin/concepts">
          <StatsCard
            title="Concepts"
            value={conceptCount}
            icon={<Network className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
          />
        </Link>
        <StatsCard
          title="Edges"
          value={edgeCount}
          icon={<GitBranch className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
        />
        <StatsCard
          title="Diagnostic Questions"
          value={questionCount}
          icon={<ClipboardList className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
        />
        <Link href="/admin/resources?status=pending">
          <StatsCard
            title="Pending Moderation"
            value={pendingResources}
            subtitle="Resources"
            icon={<FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
            trend={pendingResources > 0 ? "up" : "neutral"}
          />
        </Link>
        <Link href="/admin/users">
          <StatsCard
            title="Users"
            value={userCount}
            icon={<Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
          />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Recently Edited Subjects</h2>
            <Link
              href="/admin/subjects"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <RecentSubjectsTable
            subjects={recentSubjects.map((s) => ({
              id: s.id,
              title: s.title,
              slug: s.slug,
              status: s.status,
            }))}
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h2>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Audit log integration coming soon. Admin actions will be tracked here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
