import type { ReactNode } from "react";
import Link from "next/link";

/** Chunky “Duolingo-style” primary CTA — green with a bottom-edge emphasis */
export function DuoPrimaryLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-14 min-w-[200px] items-center justify-center gap-2 rounded-2xl border-b-[4px] border-[#43a005] bg-[#58cc02] px-8 text-center text-sm font-extrabold uppercase tracking-wide text-white shadow-sm transition hover:brightness-105 active:translate-y-px active:border-b-[3px] sm:text-base ${className}`}
    >
      {children}
    </Link>
  );
}
