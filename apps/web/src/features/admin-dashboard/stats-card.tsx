"use client";

import { cn } from "@mindorbit/ui";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  onClick?: () => void;
}

export function StatsCard({ title, value, subtitle, icon, trend, className, onClick }: StatsCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow dark:border-slate-800 dark:bg-slate-900",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">{icon}</div>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "mt-2 text-xs font-medium",
            trend === "up" && "text-emerald-600",
            trend === "down" && "text-red-600",
            trend === "neutral" && "text-slate-500"
          )}
        >
          {trend === "up" && "↑"}
          {trend === "down" && "↓"}
          {trend === "neutral" && "→"}
        </div>
      )}
    </div>
  );
}
