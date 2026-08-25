import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/features/blog/blog-article";
import { getAllPostSlugs, getPostBySlug } from "@/features/blog";
import { defaultOgImages, defaultTwitterImages } from "@/lib/og-defaults";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      images: defaultOgImages,
    },
    twitter: {
      title: post.title,
      description: post.excerpt,
      images: defaultTwitterImages,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogArticle post={post} />;
}
