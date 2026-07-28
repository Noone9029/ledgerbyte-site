import type { MetadataRoute } from "next";
import { financeServices, technologyServices } from "@/content";
import { seoPages } from "@/content/seo";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = Object.entries(seoPages);
  const serviceLastModified = new Date("2026-07-28");

  return [
    ...staticRoutes.map(([route, config]) => ({
      url: `${SITE_URL}${route === "/" ? "" : route}`,
      lastModified: new Date(config.lastModified),
      changeFrequency:
        route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority:
        route === "/"
          ? 1
          : route === "/privacy-policy" || route === "/terms-of-use"
            ? 0.3
            : route.endsWith("/services")
              ? 0.85
              : 0.7,
    })),
    ...financeServices.map((service) => ({
      url: `${SITE_URL}/finance/services/${service.slug}`,
      lastModified: serviceLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...technologyServices.map((service) => ({
      url: `${SITE_URL}/technology/services/${service.slug}`,
      lastModified: serviceLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
