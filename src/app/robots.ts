import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://ledgerbyte.io/sitemap.xml",
    host: "https://ledgerbyte.io",
  };
}
