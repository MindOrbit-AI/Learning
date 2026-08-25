import { BLOG_POSTS } from "./posts";
import type { BlogPost } from "./types";

export type { BlogAuthor, BlogPost, BlogSection } from "./types";

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
