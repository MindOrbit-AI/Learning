"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Network,
  Map,
  ClipboardList,
  Target,
  FileText,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  Activity,
} from "lucide-react";
import { Button } from "@mindorbit/ui";
import { cn } from "@mindorbit/ui";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
  { href: "/admin/clusters", label: "Clusters", icon: Layers },
  { href: "/admin/concepts", label: "Concepts", icon: Network },
  { href: "/admin/mastery-map/select", label: "Mastery Map", icon: Map },
  { href: "/admin/diagnostics", label: "Diagnostics", icon: ClipboardList },
  { href: "/admin/missions", label: "Missions", icon: Target },
  { href: "/admin/resources", label: "Resources", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminAppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null; role?: string };
}) {
  const pathname = usePathname() ?? "";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 w-56 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Admin</span>
          </div>
        </div>
        <nav className="space-y-0.5 p-2">
          {adminNavItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-2 dark:border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to App
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {user?.name ?? user?.email ?? "Admin"}
            </span>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              {user?.role ?? "ADMIN"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
