"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Target,
  Users,
  User,
  Search,
  ClipboardList,
  Menu,
  Shield,
  Flame,
  Zap,
  CreditCard,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { Button } from "@mindorbit/ui";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/mastery-map", label: "Mastery Map", icon: Map },
  { href: "/missions", label: "Missions", icon: Target },
  { href: "/community", label: "Community", icon: Users },
  { href: "/review", label: "Review", icon: ClipboardList },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings/billing", label: "Billing", icon: CreditCard },
];

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: {
    name?: string | null;
    image?: string | null;
    role?: string;
    xp?: number;
    level?: number;
    streakCount?: number;
    bestMissionStreak?: number;
    planTier?: "FREE" | "PRO";
  };
}) {
  const pathname = usePathname() ?? "";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-card transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-extrabold text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
              M
            </span>
            MindOrbit
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </Button>
        </div>
        <nav className="space-y-1 p-4">
          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-amber-600 transition-colors hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
            >
              <Shield className="h-5 w-5" />
              Admin
            </Link>
          )}
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 px-4 shadow-sm backdrop-blur dark:bg-background/95 lg:left-64">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link
          href="/search"
          className="mx-4 flex flex-1 items-center gap-2 rounded-duo-lg border-2 border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-white dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary/30"
        >
          <Search className="h-4 w-4" />
          Search...
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/missions"
            className="flex items-center gap-1.5 rounded-duo-lg border-2 border-orange-200 bg-white px-3 py-1.5 text-sm font-bold text-orange-600 shadow-sm transition-colors hover:bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-400 dark:hover:bg-orange-900/30"
            title={
              (user?.bestMissionStreak ?? 0) > 0
                ? `Mission streak: ${user?.streakCount ?? 0} UTC days (best ${user?.bestMissionStreak})`
                : `Mission streak: ${user?.streakCount ?? 0} UTC days in a row with a mission`
            }
          >
            <Flame className="h-5 w-5" />
            {user?.streakCount ?? 0}
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-duo-lg border-2 border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary shadow-sm transition-colors hover:bg-primary/20"
            title="Level and lifetime XP"
          >
            <Zap className="h-4 w-4 shrink-0" />
            <span className="tabular-nums">
              <span className="text-muted-foreground font-semibold">Lv {(user?.level ?? 0) + 1}</span>
              <span className="mx-1.5 text-primary/40 font-normal">·</span>
              <span>{user?.xp ?? 0} XP</span>
            </span>
          </Link>
          {user?.planTier === "PRO" && (
            <span className="flex items-center gap-1 rounded-duo-lg border-2 border-primary/50 bg-primary/20 px-2 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Pro
            </span>
          )}
          <span className="hidden text-sm font-semibold text-foreground sm:block">
            {user?.name ?? "Student"}
          </span>
          <Link href="/profile">
            <div className="h-9 w-9 overflow-hidden rounded-full bg-primary/20 flex items-center justify-center">
              {user?.image ? (
                <img src={user.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-primary" />
              )}
            </div>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign out
          </Button>
        </div>
      </div>

      <main className="flex-1 pt-16 lg:pl-64">
        <div className="p-4 md:p-6">{children}</div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 flex border-t bg-background md:hidden">
        {navItems.slice(0, 5).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs ${
              pathname === href || pathname.startsWith(href + "/")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="h-16 md:hidden" />
    </div>
  );
}
