import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MindOrbit Learn — Cognitive Mastery Network",
    template: "%s | MindOrbit Learn",
  },
  description:
    "Diagnostic-first student learning. Master subjects through personalized missions, a mastery map, and guided review.",
  applicationName: "MindOrbit Learn",
  keywords: [
    "MindOrbit",
    "adaptive learning",
    "diagnostics",
    "mastery map",
    "spaced repetition",
    "student learning",
  ],
  authors: [{ name: "MindOrbit" }],
  creator: "MindOrbit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "MindOrbit Learn",
    title: "MindOrbit Learn — Cognitive Mastery Network",
    description:
      "Diagnostic-first student learning. Master subjects through personalized missions, a mastery map, and guided review.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindOrbit Learn — Cognitive Mastery Network",
    description:
      "Diagnostic-first student learning. Master subjects through personalized missions, a mastery map, and guided review.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
