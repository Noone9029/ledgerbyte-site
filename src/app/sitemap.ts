import type { MetadataRoute } from "next";
import { seoPages } from "@/content/seo";
import { publicEnglishPaths } from "@/lib/public-english-paths";
import { publishedArabicPages, languageAlternates } from "@/lib/localization";
import { SITE_URL } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  const english = publicEnglishPaths.map((path) => ({
    url: SITE_URL + (path === "/" ? "" : path),
    lastModified: seoPages[path as keyof typeof seoPages]?.lastModified,
    alternates: { languages: languageAlternates(path) },
  }));
  return [...english, ...publishedArabicPages().map((page) => ({ url: SITE_URL + page.path, lastModified: new Date(page.lastModified), alternates: { languages: languageAlternates(page.path) } }))];
}
