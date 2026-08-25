export type BlogSection =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 2 | 3 }
  | { type: "list"; items: readonly string[] };

export type BlogAuthor = {
  name: string;
  role: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: BlogAuthor;
  tags: readonly string[];
  readingTimeMinutes: number;
  sections: readonly BlogSection[];
};
