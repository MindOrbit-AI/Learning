import type { Metadata } from "next";
import { BlogIndex } from "@/features/blog/blog-index";
import { defaultOgImages, defaultTwitterImages } from "@/lib/og-defaults";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical notes on diagnostics, mastery maps, and study systems from the MindOrbit team.",
  openGraph: {
    title: "MindOrbit Blog — Ideas for durable learning",
    description:
      "Practical notes on diagnostics, mastery maps, and study systems from the MindOrbit team.",
    url: "/blog",
    images: defaultOgImages,
  },
  twitter: {
    title: "MindOrbit Blog — Ideas for durable learning",
    description:
      "Practical notes on diagnostics, mastery maps, and study systems from the MindOrbit team.",
    images: defaultTwitterImages,
  },
};

export default function BlogPage() {
  return <BlogIndex />;
}
