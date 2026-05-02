import { cn } from "@mindorbit/lib";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-violet-100",
        className,
      )}
    >
      {children}
    </span>
  );
}
