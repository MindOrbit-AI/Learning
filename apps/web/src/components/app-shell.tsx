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
  Rocket,
  ChevronDown,
  LogOut,
  Puzzle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@mindorbit/ui";
import { useState } from "react";
import { ClaimGuestDiagnosticEffect } from "@/features/diagnostics/claim-guest-diagnostic-effect";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/missions", label: "Missions", icon: Target },
  { href: "/puzzles", label: "Puzzles", icon: Puzzle },
  { href: "/community", label: "Community", icon: Users },
  { href: "/review", label: "Review", icon: ClipboardList },
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

  return (
    <div className="flex min-h-screen">
      <ClaimGuestDiagnosticEffect />
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

      <div className="fixed inset-x-0 top-0 z-30 flex h-[4.25rem] min-w-0 items-center border-b bg-white/95 px-3 shadow-sm backdrop-blur dark:bg-background/95 sm:h-16 sm:px-4 lg:left-64 lg:px-4">
        <div className="flex w-full min-w-0 items-center justify-between gap-3 sm:gap-4 lg:justify-start lg:gap-2">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 lg:min-w-0 lg:flex-1 lg:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-gray-50 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-white dark:border-gray-700 dark:bg-gray-900 dark:hover:border-primary/30 lg:h-auto lg:min-w-0 lg:flex-1 lg:rounded-duo-lg lg:px-4 lg:py-2.5"
            >
              <Search className="h-[1.125rem] w-[1.125rem] shrink-0 lg:h-4 lg:w-4" />
              <span className="hidden truncate lg:inline">Search...</span>
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3 lg:gap-3">
            <Link
              href="/missions"
              className="flex h-10 min-w-[2.5rem] items-center justify-center gap-1.5 rounded-duo-lg border-2 border-orange-200 bg-white px-2.5 text-sm font-bold text-orange-600 shadow-sm transition-colors hover:bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-400 dark:hover:bg-orange-900/30 sm:h-9 sm:min-w-0 sm:px-3"
              title={
                (user?.bestMissionStreak ?? 0) > 0
                  ? `Mission streak: ${user?.streakCount ?? 0} UTC days (best ${user?.bestMissionStreak})`
                  : `Mission streak: ${user?.streakCount ?? 0} UTC days in a row with a mission`
              }
            >
              <Flame className="h-5 w-5 shrink-0 sm:h-5 sm:w-5" />
              {user?.streakCount ?? 0}
            </Link>
            <Link
              href="/profile"
              className="flex h-10 items-center gap-2 rounded-duo-lg border-2 border-primary/30 bg-primary/10 px-2.5 text-sm font-bold text-primary shadow-sm transition-colors hover:bg-primary/20 sm:h-9 sm:px-3"
              title={`Level ${(user?.level ?? 0) + 1}, ${user?.xp ?? 0} XP`}
            >
              <Zap className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
              <span className="text-xs font-bold tabular-nums leading-none lg:hidden">
                <span className="text-muted-foreground">Lv{(user?.level ?? 0) + 1}</span>
                <span className="mx-1 text-primary/45">·</span>
                <span>{user?.xp ?? 0}</span>
              </span>
              <span className="hidden tabular-nums lg:inline">
                <span className="text-muted-foreground font-semibold">Lv {(user?.level ?? 0) + 1}</span>
                <span className="mx-1.5 text-primary/40 font-normal">·</span>
                <span>{user?.xp ?? 0} XP</span>
              </span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full p-0 font-semibold text-foreground hover:bg-muted sm:h-auto sm:w-auto sm:rounded-duo-lg sm:px-2 sm:py-1.5 lg:gap-2 lg:px-2"
                  aria-label="Account menu"
                >
                  {user?.planTier === "PRO" && (
                    <span className="hidden items-center gap-1 rounded-duo-lg border-2 border-primary/50 bg-primary/20 px-2 py-1 text-xs font-bold text-primary lg:flex">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      Pro
                    </span>
                  )}
                  <div className="mx-auto flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/20 sm:mx-0 sm:h-9 sm:w-9">
                    {user?.image ? (
                      <img src={user.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <span className="hidden max-w-[10rem] truncate sm:inline">
                    {user?.name ?? "Student"}
                  </span>
                  <ChevronDown className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={10}
              alignOffset={0}
              collisionPadding={16}
              className="z-[60] w-56 rounded-xl border border-border bg-card p-2 shadow-md"
            >
              <DropdownMenuLabel className="space-y-0.5 px-2 pb-2 pt-1.5 font-normal">
                <p className="truncate text-sm font-semibold leading-tight text-foreground">
                  {user?.name ?? "Student"}
                </p>
                {user?.planTier === "PRO" && (
                  <p className="text-xs leading-tight text-muted-foreground">Pro plan</p>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-border" />
              {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-sm leading-none text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
                >
                  <Link href="/admin" className="flex items-center gap-3">
                    <Shield className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                    Admin
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm leading-none text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                <Link href="/profile" className="flex items-center gap-3">
                  <User className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm leading-none text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                <Link href="/settings/billing" className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-border" />
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm leading-none text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                <Link href="/mastery-map" className="flex items-center gap-3">
                  <Map className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
                  Mastery Map
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm leading-none text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                <Link href="/insights" className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
                  Insights
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="cursor-pointer rounded-lg px-3 py-2.5 text-sm leading-none text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
              >
                <Link href="/growth" className="flex items-center gap-3">
                  <Rocket className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2} />
                  Growth
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-border" />
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm leading-none text-destructive data-[highlighted]:bg-muted data-[highlighted]:text-destructive"
                onSelect={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4 shrink-0 opacity-80" strokeWidth={2} />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>

      <main className="flex-1 pt-[4.25rem] sm:pt-16 lg:pl-64">
        <div className="max-w-[100vw] overflow-x-hidden p-3 sm:p-4 md:p-6">{children}</div>
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

      <div className="h-[4.25rem] sm:h-16 md:hidden" />
    </div>
  );
}
