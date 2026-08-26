import Link from "next/link";
import { Brain, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

/** Lucide does not ship a TikTok icon; use a compact glyph aligned to 24×24 icons. */
function TikTokIcon({
  className,
  strokeWidth: _strokeWidth,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    href: "https://x.com/mindorbit",
    label: "MindOrbit on X",
    Icon: Twitter,
  },
  {
    href: "https://www.facebook.com/mindorbit",
    label: "MindOrbit on Facebook",
    Icon: Facebook,
  },
  {
    href: "https://www.instagram.com/mindorbit",
    label: "MindOrbit on Instagram",
    Icon: Instagram,
  },
  {
    href: "https://www.tiktok.com/@mindorbit",
    label: "MindOrbit on TikTok",
    Icon: TikTokIcon,
  },
  {
    href: "https://www.youtube.com/@mindorbit",
    label: "MindOrbit on YouTube",
    Icon: Youtube,
  },
] as const;

export function DuoLandingFooter() {
  return (
    <footer className="border-t-2 border-border bg-secondary/30 py-10">
      <div className="container mx-auto flex flex-col gap-8 px-4">
        <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 font-extrabold text-foreground">
            <Brain className="h-5 w-5 text-primary" strokeWidth={2.5} />
            MindOrbit
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
            <a href="/#struggling" className="hover:text-foreground">
              Why it&apos;s hard
            </a>
            <a href="/#how" className="hover:text-foreground">
              How it works
            </a>
            <a href="/#subjects" className="hover:text-foreground">
              Subjects
            </a>
            <a href="/#pricing" className="hover:text-foreground">
              Pricing
            </a>
            <a href="/#faq" className="hover:text-foreground">
              FAQ
            </a>
            <Link href="/who-we-are" className="hover:text-foreground">
              Who we are
            </Link>
            <Link href="/our-vision" className="hover:text-foreground">
              Our vision
            </Link>
            <Link href="/parents" className="hover:text-foreground">
              For parents
            </Link>
            <Link href="/practice-lessons" className="hover:text-foreground">
              Practice lessons
            </Link>
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <Link href="/auth/signin" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
          <div className="flex max-w-full flex-wrap items-center justify-center gap-3 sm:justify-end">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-background/80 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border/80 pt-6 text-xs font-semibold text-muted-foreground sm:flex-row">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 sm:justify-start">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
          <p>© {new Date().getFullYear()} MindOrbit</p>
        </div>
      </div>
    </footer>
  );
}
