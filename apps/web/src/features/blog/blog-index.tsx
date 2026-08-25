import Link from "next/link";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { getAllPosts } from "./index";
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

export function BlogIndex() {
  const posts = getAllPosts();

  return (
    <BlogShell>
      <section className="border-b border-border/60 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center rounded-full border-2 border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Blog
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Ideas for durable learning
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl">
              Practical notes on diagnostics, mastery, and study systems—grounded in learning science, written for students and educators.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-8">
            {posts.map((post, index) => (
              <ScrollReveal key={post.slug} delay={0.05 * index}>
                <article className="group rounded-[2rem] border-2 border-border bg-card p-8 shadow-[0_8px_0_0_rgba(0,0,0,0.06)] transition hover:border-primary/30 sm:p-10">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" aria-hidden />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {post.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mt-4 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg">
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

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[hsl(var(--duo-blue))] underline decoration-2 underline-offset-4 hover:opacity-90"
                  >
                    Read article
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <DuoLandingFinalCta />
    </BlogShell>
  );
}
