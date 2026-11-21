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
  const descriptions = new Set<string>();
  for (const path of paths) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
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
    expect(description, path).toMatch(/[.!?]$/);
    expect(descriptions.has(description!), path + " duplicate description").toBe(false);
    descriptions.add(description!);
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
    const nodes = scripts.flatMap(script => JSON.parse(script)["@graph"] ?? []);
    expect(nodes.find(node => node["@id"] === origin + "/#organization")?.["@type"]).toContain("AccountingService");
    const pageId = (path === "/" ? origin + "/" : origin + path) + "#webpage";
    expect(nodes.filter(node => node["@id"] === pageId), path + " page identity").toHaveLength(1);
    expect(await response!.text(), path + " server-rendered page identity").toContain(`"@id":"${pageId}"`);
    if (path.startsWith("/insights/")) {
      const article = nodes.find(node => node["@type"] === "Article");
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", article.image);
      expect(article.image).toContain("/art/examples/");
      expect(article.author["@id"]).toBe(origin + "/#organization");
    }
    if (path.startsWith("/about/team/")) {
      const person = nodes.find(node => node["@type"] === "Person");
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", person.image);
      const member = team.find(member => buildPersonPath(member.name) === path);
      expect(person.image).toBe(origin + member!.image);
    }
    if (["/finance/services", "/regions", "/insights", "/finance"].includes(path)) {
      const collection = nodes.find(node => node["@type"] === "CollectionPage");
      const list = nodes.find(node => node["@id"] === collection.mainEntity["@id"]);
      expect(list.itemListElement.length).toBeGreaterThan(0);
      for (const item of list.itemListElement) {
        await expect(page.locator(`main a[href="${new URL(item.url).pathname}"]`).first()).toBeAttached();
      }
    }
  }
});

test("UAE starting offers retain the unit, jurisdiction and distinction from the team estimate", async ({ page }) => {
  await page.goto("/");
  const documents = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(script => JSON.parse(script));
  const offers = documents.flatMap(d => d["@graph"]).filter(node => node["@type"] === "Offer");
  expect(offers.map(offer => [offer.name, offer.priceSpecification.minPrice, offer.priceSpecification.unitText])).toEqual([
    ["SME Accounting & Tax Management", 500, "month"],
    ["VAT Return Filing", 750, "return"],
    ["UAE Corporate Tax Return Filing", 750, undefined],
  ]);
  for (const offer of offers) {
    expect(offer.eligibleRegion.name).toBe("United Arab Emirates");
    expect(offer.priceSpecification.priceCurrency).toBe("AED");
    await expect(page.locator("#offers")).toContainText(offer.name);
  }
  await page.goto("/build-your-finance-department");
  const builder = (await page.locator('script[type="application/ld+json"]').allTextContents())
    .flatMap(script => JSON.parse(script)["@graph"]).find(node => node["@type"] === "Service");
  expect(builder.offers.name).toContain("15 hours per month");
  expect(builder.offers.priceSpecification).toMatchObject({ price: 500, unitText: "month", valueAddedTaxIncluded: false });
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
  await expect(page.locator("footer").getByRole("link", { name: "Finance overview" })).toHaveAttribute("href", "/finance");
  await expect(page.locator("footer").getByRole("link", { name: "All 22 services" })).toHaveAttribute("href", "/finance/services");
  await expect(page.locator("main [data-service-card]")).toHaveCount(22);
  for (const service of content.services) {
    const destination = "/finance/services/" + service.slug;
    await expect(
      page.locator(`main a[href="${destination}"]`).first(),
    ).toHaveAttribute("href", destination);
  }
  for (const slug of ["accounting-automation-systems", "fractional-cfo-advisory", "payroll-wps-management"]) {
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
