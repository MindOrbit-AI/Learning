"use client";

import { forwardRef } from "react";
import { cn } from "@mindorbit/lib";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-40",
          size === "sm" && "min-h-9 rounded-xl px-3 text-sm",
          size === "md" && "min-h-11 rounded-2xl px-5 text-sm",
          size === "lg" && "min-h-14 rounded-2xl px-8 text-base",
          variant === "primary" &&
            "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 hover:from-violet-400 hover:to-fuchsia-400",
          variant === "secondary" &&
            "border border-white/15 bg-white/5 text-white hover:bg-white/10",
          variant === "ghost" && "text-white/80 hover:bg-white/5 hover:text-white",
          variant === "success" &&
            "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
