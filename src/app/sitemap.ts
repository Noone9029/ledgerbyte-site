import type { MetadataRoute } from "next";
import { financeServices, technologyServices } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ledgerbyte.io";
  const staticRoutes = [
    "",
    "/finance",
    "/finance/services",
    "/technology",
    "/technology/services",
    "/technology/process",
    "/technology/why-ledgerbyte",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-of-use",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.8,
    })),
    ...financeServices.map((service) => ({
      url: `${baseUrl}/finance/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...technologyServices.map((service) => ({
      url: `${baseUrl}/technology/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
