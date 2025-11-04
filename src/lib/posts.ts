import matter from "gray-matter";
import { marked } from "marked";

const files = import.meta.glob("/src/posts/*.md", { as: "raw", eager: true }) as Record<string, string>;

export type PostMeta = {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  tags?: string[];
  cover?: string;
  published?: boolean;
};
export type Post = PostMeta & { html: string };

function slugFromPath(path: string) {
  return path.split("/").pop()!.replace(".md", "");
}

export function getAllPosts(): PostMeta[] {
  const list: PostMeta[] = Object.entries(files).map(([path, raw]) => {
    const { data } = matter(raw);
    const slug = slugFromPath(path);
    return {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? "",
      date: data.date ?? "1970-01-01",
      tags: data.tags ?? [],
      cover: data.cover ?? "",
      published: data.published ?? true,
    };
  });

  return list
    .filter(p => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getPostBySlug(slug: string): Post | null {
  const entry = Object.entries(files).find(([p]) => p.endsWith(`${slug}.md`));
  if (!entry) return null;

  const raw = entry[1];
  const { data, content } = matter(raw);
  const html = marked.parse(content, { mangle: false, headerIds: true }) as string;

  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    date: data.date ?? "1970-01-01",
    tags: data.tags ?? [],
    cover: data.cover ?? "",
    published: data.published ?? true,
    html,
  };
}
