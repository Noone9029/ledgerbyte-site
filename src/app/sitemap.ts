import type { MetadataRoute } from "next";
import { seoPages } from "@/content/seo";
import { team } from "@/content";
import { buildPersonPath } from "@/lib/schema";
import { publishedArabicPages, languageAlternates } from "@/lib/localization";
import { SITE_URL } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...Object.keys(seoPages),
    ...team.map((p) => buildPersonPath(p.name)),
  ];
  const english = [...new Set(paths)].map((path) => ({
    url: SITE_URL + (path === "/" ? "" : path),
    lastModified: new Date(
      seoPages[path as keyof typeof seoPages]?.lastModified ?? "2026-11-10",
    ),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
    alternates: { languages: languageAlternates(path) },
  }));
  return [...english, ...publishedArabicPages().map((page) => ({ url: SITE_URL + page.path, lastModified: new Date(page.lastModified), alternates: { languages: languageAlternates(page.path) } }))];
}
