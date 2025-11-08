import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const BASE_URL = process.env.SITE_URL || "https://ledgerbyte.io";
const ROUTES = [
  "/",
  "/services",
  "/about-us",
  "/lets-connect",
  "/blog"
];

const today = new Date().toISOString().split("T")[0];

const xmlBody = ROUTES.map(path => {
  const freq = path === "/" ? "weekly" : "monthly";
  const prio = path === "/" ? "1.0" : "0.7";
  return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${prio}</priority>
  </url>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlBody}
</urlset>`;

// Create output dir if missing
const distDir = resolve("dist");
if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

const outPath = resolve(distDir, "sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.log(`✅ Sitemap generated → ${outPath}`);
