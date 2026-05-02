import { cn } from "@mindorbit/lib";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl shadow-black/40 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
