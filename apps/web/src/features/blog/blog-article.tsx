import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import type { BlogPost } from "./types";
import { BlogPostContent } from "./blog-post-content";
import { BlogShell } from "./blog-shell";
import { DuoLandingFinalCta } from "@/features/marketing/duo-landing-final-cta";
import { ScrollReveal } from "@/features/marketing/scroll-reveal";

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <BlogShell>
      <section className="border-b border-border/60 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All posts
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                {formatDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {post.readingTimeMinutes} min read
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            <p className="mt-6 text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
              {post.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-bold text-muted-foreground"
                >
                  <Tag className="h-3 w-3" aria-hidden />
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-8 text-sm font-bold text-muted-foreground">
              By {post.author.name}
              <span className="text-muted-foreground/70"> · {post.author.role}</span>
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal delay={0.06} className="mx-auto max-w-3xl">
            <BlogPostContent sections={post.sections} />
          </ScrollReveal>
        </div>
      </section>

      <DuoLandingFinalCta />
    </BlogShell>
  );
}
