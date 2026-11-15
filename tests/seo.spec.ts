import { expect, test } from "@playwright/test";
import content from "../src/content/accounting.json";
import { seoPages } from "../src/content/seo";
import { team } from "../src/content";
import { buildPersonPath } from "../src/lib/person-identity";

const origin = "https://ledgerbyte.io";
const paths = [
  ...new Set([
    ...Object.keys(seoPages),
    ...team.map((p) => buildPersonPath(p.name)),
  ]),
];

test("canonical pages expose valid metadata and parseable page graphs", async ({
  page,
}) => {
  test.setTimeout(180000);
  const titles = new Set<string>();
  for (const path of paths) {
    expect(
      (await page.goto(path, { waitUntil: "domcontentloaded" }))?.status(),
      path,
    ).toBe(200);
    await expect(page.locator("main h1"), path).toHaveCount(1);
    const title = await page.title();
    expect(title.length, path).toBeGreaterThan(10);
    expect(title, path).not.toMatch(/LedgerByte\s*\|\s*LedgerByte/i);
    expect(titles.has(title), path + " duplicate title").toBe(false);
    titles.add(title);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description?.length, path).toBeGreaterThan(20);
    expect(description?.length, path).toBeLessThanOrEqual(160);
    const canonical = origin + (path === "/" ? "" : path);
    await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute(
      "href",
      canonical,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      title,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonical,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(scripts.length, path).toBeGreaterThan(0);
    for (const script of scripts)
      expect(() => JSON.parse(script), path).not.toThrow();
    expect(scripts.join(""), path).toContain('"@type":"Organization"');
  }
});

test("sitemap, permanent redirects and footer cover the current service routes", async ({
  page,
  request,
}) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  expect(urls).toHaveLength(paths.length);
  expect(new Set(urls).size).toBe(paths.length);
  for (const path of paths)
    expect(urls).toContain(origin + (path === "/" ? "" : path));
  expect(urls.join(" ")).not.toContain("/review-notes");
  await page.goto("/finance/services");
  for (const service of content.services) {
    const destination = "/finance/services/" + service.slug;
    await expect(
      page
        .locator("footer")
        .getByRole("link", { name: service.title, exact: true }),
    ).toHaveAttribute("href", destination);
  }
  for (const slug of ["fractional-cfo-advisory", "payroll-wps-management"]) {
    const redirect = await request.get("/services/" + slug + "?source=review", {
      maxRedirects: 0,
    });
    expect(redirect.status()).toBe(308);
    expect(
      new URL(redirect.headers().location, "http://127.0.0.1:4300").pathname,
    ).toBe("/finance/services/" + slug);
    expect(
      new URL(redirect.headers().location, "http://127.0.0.1:4300").search,
    ).toBe("?source=review");
  }
});

test("all supplied related links resolve to their intended mapped destination", async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const source of Object.values(content.pages)) {
    if (source.path === "/" || !source.related.length) continue;
    await page.goto(source.path, { waitUntil: "domcontentloaded" });
    for (const link of source.related) {
      const key = link.target?.page_key ?? link.route;
      const expected = (content.paths as Record<string, string>)[key];
      expect(expected, key).toBeTruthy();
      await expect(
        page
          .locator(".accounting-related")
          .getByRole("link", { name: link.label, exact: true }),
      ).toHaveAttribute("href", expected);
    }
  }
});
