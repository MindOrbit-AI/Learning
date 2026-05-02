"use client";

import { Button } from "@mindorbit/ui";
import { cn } from "@mindorbit/ui";

export function PowerUpButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-xl border-zinc-600 bg-zinc-900/60 text-xs font-semibold text-zinc-100 hover:bg-zinc-800",
        disabled && "opacity-40"
      )}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  );
}
