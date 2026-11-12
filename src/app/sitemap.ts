import type { MetadataRoute } from "next";
import { seoPages } from "@/content/seo";
import { team } from "@/content";
import { buildPersonPath } from "@/lib/schema";
import { SITE_URL } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...Object.keys(seoPages),
    ...team.map((p) => buildPersonPath(p.name)),
  ];
  return [...new Set(paths)].map((path) => ({
    url: SITE_URL + (path === "/" ? "" : path),
    lastModified: new Date(
      path.startsWith("/technology") ? "2026-07-28" : "2026-11-10",
    ),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
