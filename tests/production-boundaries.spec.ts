import { expect, test } from "@playwright/test";
import manifest from "../src/content/localization-manifest.json";
test("production rejects every unapproved Arabic page and review route despite a review flag", async ({ request }) => {
  for (const entry of manifest.pages) {
    const response = await request.get(`http://127.0.0.1:4430${entry.path}`);
    expect(response.status(), entry.path).toBe(404);
  }
  for (const [origin, paths] of [
    ["http://127.0.0.1:4430", ["/seo-review"]],
    ["http://127.0.0.1:4440", ["/seo-review", "/ar", "/us-year-end-bookkeeping-adviser-handover", "/ar/us-year-end-bookkeeping-adviser-handover"]],
  ] as const) for (const path of paths) expect((await request.get(origin + path)).status(), origin + path).toBe(404);
  for (const origin of ["http://127.0.0.1:4430", "http://127.0.0.1:4440"]) {
    const sitemap = await (await request.get(origin + "/sitemap.xml")).text();
    expect(sitemap).not.toContain("/ar"); expect(sitemap).not.toContain("/seo-review"); expect(sitemap).not.toContain("us-year-end-bookkeeping-adviser-handover");
  }
});

test("the real published CMS catalogue remains available with indexable canonical metadata", async ({ request }) => {
  const article = await request.get("http://127.0.0.1:4440/2026-sme-finance-outlook-credit-costs");
  expect(article.status()).toBe(200); const html = await article.text();
  expect(html).not.toContain("Preview dataset"); expect(html).toContain('"@type":"Article"');
  expect(html).toContain('href="https://blog.ledgerbyte.io/2026-sme-finance-outlook-credit-costs"');
  expect(html).not.toMatch(/<meta name="robots" content="[^"]*noindex/);
  const image = await request.get("http://127.0.0.1:4440/2026-sme-finance-outlook-credit-costs/opengraph-image");
  expect(image.status()).toBe(200); expect(image.headers()["content-type"]).toContain("image/png");
});

test("real Google tag respects shared opt-in, safe data, one view per navigation and withdrawal", async ({ context, page }) => {
  test.setTimeout(120000);
  const measurements: string[] = [], tagLoads: string[] = [];
  // Production hostnames are served exclusively from disposable local builds.
  await context.route(/^https:\/\/(?:blog\.)?ledgerbyte\.io\//, async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/contact") return route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ enquiryId: "qa-provider-accepted" }) });
    const port = url.hostname === "blog.ledgerbyte.io" ? 4440 : 4430;
    const response = await route.fetch({ url: `http://127.0.0.1:${port}${url.pathname}${url.search}` });
    await route.fulfill({ response });
  });
  // Collection is captured locally; no test enquiry or analytics event reaches Google.
  await context.route(/^https:\/\/[^/]*google-analytics\.com\//, async (route) => {
    measurements.push(route.request().url() + "\n" + (route.request().postData() || ""));
    await route.fulfill({ status: 204, body: "" });
  });
  page.on("request", (request) => { if (request.url().includes("googletagmanager.com/gtag/js")) tagLoads.push(request.url()); });
  await page.goto("https://ledgerbyte.io/contact?email=do-not-send%40example.com&q=do-not-send");
  expect(tagLoads).toHaveLength(0); expect(measurements).toHaveLength(0);
  await page.getByRole("button", { name: "Allow analytics", exact: true }).click();
  await expect.poll(() => measurements.some((hit) => hit.includes("en=page_view")), { timeout: 20000 }).toBe(true);
  expect(tagLoads).toHaveLength(1);
  const views = () => measurements.reduce((count, hit) => count + (hit.match(/(?:[?&\n])en=page_view/g) || []).length, 0);
  expect(views()).toBe(1);
  await page.locator(".accounting-desktop-nav").getByRole("link", { name: "About us", exact: true }).click();
  await expect.poll(views, { timeout: 20000 }).toBe(2);
  const client = (await context.cookies()).find((cookie) => cookie.name === "_ga")?.value;
  expect(client).toBeTruthy();
  await page.goto("https://blog.ledgerbyte.io/");
  await expect.poll(views, { timeout: 20000 }).toBe(3);
  expect((await context.cookies()).find((cookie) => cookie.name === "_ga")?.value).toBe(client);
  expect(measurements.join("\n")).not.toMatch(/do-not-send|example\.com|email=/);
  await page.getByRole("button", { name: "Cookie settings", exact: true }).click();
  await page.getByRole("button", { name: "Decline analytics", exact: true }).click();
  expect((await context.cookies()).find((cookie) => cookie.name === "_ga")).toBeUndefined();
  const before = tagLoads.length;
  await page.goto("https://ledgerbyte.io/about");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  expect(tagLoads.length).toBe(before);
});
