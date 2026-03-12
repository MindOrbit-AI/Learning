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
  { href: "/profile", label: "Profile", icon: User },
];

export function AppShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name?: string | null; image?: string | null };
}) {
  const pathname = usePathname();
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
          <Link href="/dashboard" className="font-bold">
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

      <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:left-64">
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
          className="mx-4 flex flex-1 items-center gap-2 rounded-xl border bg-muted/50 px-4 py-2 text-sm text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          Search...
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:block">
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
