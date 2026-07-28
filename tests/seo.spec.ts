import { expect, test } from "@playwright/test";
import financeServices from "../src/content/generated/finance-services.json";
import technologyServices from "../src/content/generated/technology-services.json";
import seoManifest from "../src/content/seo.json";
import { team } from "../src/content";
import { buildPersonPath } from "../src/lib/schema";

const siteUrl = "https://ledgerbyte.io";
const routes = [
  "/",
  "/finance",
  "/finance/services",
  ...financeServices.map((service) => `/finance/services/${service.slug}`),
  "/technology",
  "/technology/services",
  ...technologyServices.map(
    (service) => `/technology/services/${service.slug}`,
  ),
  "/technology/process",
  "/technology/why-ledgerbyte",
  "/about",
  ...team.map((member) => buildPersonPath(member.name)),
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
];

const marketingRoutes = routes.filter(
  (route) => route !== "/privacy-policy" && route !== "/terms-of-use",
);

function collectSchemaTypes(value: unknown, result = new Set<string>()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSchemaTypes(item, result));
    return result;
  }

  if (!value || typeof value !== "object") return result;

  for (const [key, child] of Object.entries(value)) {
    if (key === "@type") {
      const types = Array.isArray(child) ? child : [child];
      types.forEach((type) => {
        if (typeof type === "string") result.add(type);
      });
    } else {
      collectSchemaTypes(child, result);
    }
  }

  return result;
}

test.beforeEach(({}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "The complete SEO crawl runs once at the desktop viewport.",
  );
});

test("all canonical routes expose unique production metadata", async ({
  page,
}) => {
  test.setTimeout(120_000);

  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const route of routes) {
    const response = await page.goto(route, {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status(), route).toBe(200);

    const title = await page.title();
    const description =
      (await page.locator('meta[name="description"]').getAttribute("content")) ??
      "";
    const canonical =
      (await page.locator('link[rel="canonical"]').getAttribute("href")) ?? "";
    const robots =
      (await page.locator('meta[name="robots"]').getAttribute("content")) ?? "";

    expect(title, `${route} title`).not.toMatch(
      /LedgerByte\s*\|\s*LedgerByte/i,
    );
    expect(description.length, `${route} description length`).toBeGreaterThanOrEqual(
      90,
    );
    expect(description.length, `${route} description length`).toBeLessThanOrEqual(
      160,
    );
    expect(canonical.replace(/\/$/, ""), `${route} canonical`).toBe(
      new URL(route, siteUrl).toString().replace(/\/$/, ""),
    );
    expect(robots, `${route} robots`).toContain("index");
    expect(robots, `${route} robots`).toContain("follow");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      title,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonical,
    );

    expect(titles.has(title), `${route} duplicate title`).toBe(false);
    expect(
      descriptions.has(description),
      `${route} duplicate description`,
    ).toBe(false);
    titles.set(title, route);
    descriptions.set(description, route);
  }

  for (const route of marketingRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const title = await page.title();
    expect(title.length, `${route} title length`).toBeGreaterThanOrEqual(30);
    expect(title.length, `${route} title length`).toBeLessThanOrEqual(65);
  }
});

test("finance page headings match their assigned search intent", async ({
  page,
}) => {
  await page.goto("/finance", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toHaveText(
    seoManifest.pages["/finance"].title,
  );

  await page.goto("/finance/services", {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("h1")).toHaveText(
    seoManifest.pages["/finance/services"].title,
  );

  for (const service of financeServices) {
    await page.goto(`/finance/services/${service.slug}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.locator("h1")).toHaveText(
      seoManifest.financeServices[
        service.slug as keyof typeof seoManifest.financeServices
      ],
    );
  }
});

test("structured data forms a stable organization and page graph", async ({
  page,
}) => {
  test.setTimeout(120_000);

  for (const route of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(scripts.length, `${route} JSON-LD scripts`).toBeGreaterThanOrEqual(2);

    const documents = scripts.map((script) => {
      expect(() => JSON.parse(script), `${route} JSON-LD parses`).not.toThrow();
      return JSON.parse(script) as unknown;
    });
    const types = collectSchemaTypes(documents);

    expect(types.has("Organization"), `${route} Organization`).toBe(true);
    expect(types.has("WebSite"), `${route} WebSite`).toBe(true);
    expect(types.has("WebPage") || types.has("CollectionPage") ||
      types.has("AboutPage") || types.has("ContactPage") ||
      types.has("ProfilePage"),
    `${route} page schema`).toBe(true);

    if (route.includes("/services/")) {
      expect(types.has("Service"), `${route} Service`).toBe(true);
      expect(types.has("BreadcrumbList"), `${route} BreadcrumbList`).toBe(true);
    }
    if (route.startsWith("/finance/services/")) {
      expect(types.has("FAQPage"), `${route} FAQPage`).toBe(true);
      expect(types.has("Person"), `${route} Person reviewer`).toBe(true);
      expect(JSON.stringify(documents), `${route} reviewedBy`).toContain(
        '"reviewedBy"',
      );
    }
    if (route === "/finance/services") {
      expect(types.has("ItemList"), `${route} ItemList`).toBe(true);
    }
    if (route === "/about") {
      expect(types.has("Person"), `${route} Person`).toBe(true);
    }
    if (route.startsWith("/about/team/")) {
      expect(types.has("ProfilePage"), `${route} ProfilePage`).toBe(true);
      expect(types.has("Person"), `${route} Person`).toBe(true);
      expect(types.has("BreadcrumbList"), `${route} BreadcrumbList`).toBe(
        true,
      );
    }
  }

  await page.goto("/");
  const globalGraph = JSON.parse(
    (await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent()) ?? "{}",
  ) as { "@graph"?: Array<{ "@id"?: string }> };
  expect(globalGraph["@graph"]?.map((node) => node["@id"])).toEqual(
    expect.arrayContaining([
      `${siteUrl}/#organization`,
      `${siteUrl}/#website`,
      `${siteUrl}/#professional-service`,
    ]),
  );
});

test("all finance services receive crawlable footer links", async ({
  page,
}) => {
  await page.goto("/finance", { waitUntil: "domcontentloaded" });

  for (const service of financeServices) {
    await expect(
      page.locator(
        `.site-footer a[href="/finance/services/${service.slug}"]`,
      ),
    ).toHaveCount(1);
  }
});

test("payroll receives relevant contextual service links", async ({
  page,
}) => {
  for (const source of [
    "accounting-bookkeeping",
    "tax-vat-compliance",
  ]) {
    await page.goto(`/finance/services/${source}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.locator(
        '.related-section a[href="/finance/services/payroll-wps-management"]',
      ),
    ).toHaveCount(1);
  }

  await page.goto("/finance/services/payroll-wps-management", {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.locator(
      '.related-section a[href="/finance/services/tax-vat-compliance"]',
    ),
  ).toHaveCount(1);
});

test("sitemap and robots expose only canonical production URLs", async ({
  request,
}) => {
  const homeResponse = await request.get("/");
  expect(homeResponse.headers()["strict-transport-security"]).toContain(
    "max-age=63072000",
  );
  expect(homeResponse.headers()["x-content-type-options"]).toBe("nosniff");
  expect(homeResponse.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(homeResponse.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.status()).toBe(200);
  const sitemap = await sitemapResponse.text();
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => match[1],
  );
  const lastModified = [...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)];

  expect(locations).toHaveLength(routes.length);
  expect(new Set(locations).size).toBe(routes.length);
  expect(lastModified).toHaveLength(routes.length);
  for (const route of routes) {
    const expected = new URL(route, siteUrl).toString().replace(/\/$/, "");
    expect(locations.map((url) => url.replace(/\/$/, ""))).toContain(expected);
  }

  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.status()).toBe(200);
  const robots = await robotsResponse.text();
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Disallow: /api/");
  expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
});

test("legacy and alternate-host requests redirect in one permanent hop", async ({
  request,
}) => {
  const redirects = new Map([
    ["/services", "/finance/services"],
    ["/services/", "/finance/services"],
    [
      "/services/accounting-bookkeeping",
      "/finance/services/accounting-bookkeeping",
    ],
    [
      "/services/accounting-bookkeeping/",
      "/finance/services/accounting-bookkeeping",
    ],
    ["/about-us", "/about"],
    ["/about-us/", "/about"],
    ["/lets-connect", "/contact"],
    ["/lets-connect/", "/contact"],
    ["/process", "/technology/process"],
    ["/process/", "/technology/process"],
    ["/why-ledgerbyte-tech", "/technology/why-ledgerbyte"],
    ["/why-ledgerbyte-tech/", "/technology/why-ledgerbyte"],
    ["/terms-of-service", "/terms-of-use"],
    ["/terms-of-service/", "/terms-of-use"],
  ]);

  for (const [source, destination] of redirects) {
    const response = await request.get(`${source}?utm_source=legacy`, {
      maxRedirects: 0,
    });
    expect(response.status(), source).toBe(308);
    const location = new URL(
      response.headers().location,
      "http://127.0.0.1:3100",
    );
    expect(location.pathname, source).toBe(destination);
    expect(location.searchParams.get("utm_source"), source).toBe("legacy");
  }

  const hostRedirects = [
    {
      host: "tech.ledgerbyte.io",
      source: "/services/",
      destination: "/technology/services",
    },
    {
      host: "tech.ledgerbyte.io",
      source: "/process/",
      destination: "/technology/process",
    },
    {
      host: "www.ledgerbyte.io",
      source: "/services/accounting-bookkeeping/",
      destination: "/finance/services/accounting-bookkeeping",
    },
    {
      host: "ledgerbyte-site.vercel.app",
      source: "/about/",
      destination: "/about",
    },
  ];

  for (const redirect of hostRedirects) {
    const response = await request.get(
      `${redirect.source}?utm_source=alternate-host`,
      {
        headers: { host: redirect.host },
        maxRedirects: 0,
      },
    );
    expect(
      response.status(),
      `${redirect.host}${redirect.source}`,
    ).toBe(308);
    const location = new URL(response.headers().location);
    expect(location.origin).toBe(siteUrl);
    expect(location.pathname).toBe(redirect.destination);
    expect(location.searchParams.get("utm_source")).toBe("alternate-host");
  }
});

test("image alternatives distinguish decorative artwork and people", async ({
  page,
}) => {
  test.setTimeout(120_000);

  for (const route of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const invalid = await page.locator("img").evaluateAll((images) =>
      images
        .filter((image) => {
          const alt = image.getAttribute("alt");
          if (alt === null) return true;
          if (alt !== "") return false;
          return !image.closest(
            '[data-cinematic-media], [aria-hidden="true"]',
          );
        })
        .map((image) => image.getAttribute("src")),
    );
    expect(invalid, `${route} image alternatives`).toEqual([]);
  }

  await page.goto("/about");
  const portraits = page.locator(".team-card img");
  await expect(portraits).toHaveCount(6);
  for (const portrait of await portraits.all()) {
    await expect(portrait).not.toHaveAttribute("alt", "");
  }
});

test("finance service insight cards point to article-level URLs", async ({
  page,
}) => {
  for (const service of financeServices) {
    await page.goto(`/finance/services/${service.slug}`, {
      waitUntil: "domcontentloaded",
    });
    const links = page
      .getByRole("heading", {
        name: /Supporting reading that connects directly/,
      })
      .locator("xpath=ancestor::section")
      .locator('a[href^="https://blog.ledgerbyte.io/"]');
    await expect(links).toHaveCount(service.relatedResources.length);
    const hrefs = await links.evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
    );
    expect(hrefs.every((href) => href !== "https://blog.ledgerbyte.io/")).toBe(
      true,
    );
  }
});
