import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import manifest from "../src/content/localization-manifest.json";

test("Arabic drafts render complete SSR copy with private metadata", async ({ page }) => {
  test.setTimeout(180000);
  for (const entry of manifest.pages) {
    expect((await page.goto(entry.path))?.status(), entry.path).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://ledgerbyte.io${entry.path}`);
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex");
    expect(await page.locator("body").innerText()).not.toContain("undefined");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), entry.path).toBe(true);
    await expect(page.locator('link[hreflang]')).toHaveCount(0);
  }
});

test("Arabic native service cards are readable and keyboard accessible", async ({ page }, info) => {
  await page.goto("/ar/finance/services");
  const summaries = page.locator(".accounting-flashcard > summary");
  await expect(summaries).toHaveCount(22);
  await summaries.nth(1).click();
  await expect(page.locator(".accounting-flashcard[open]")).toHaveCount(1);
  expect(await summaries.nth(1).locator("h3").evaluate((element) => getComputedStyle(element).writingMode)).toBe("horizontal-tb");
  expect(await summaries.nth(1).locator("h3").evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  if (info.project.name !== "nojs") {
    await summaries.nth(1).focus(); await page.keyboard.press("ArrowDown"); await expect(summaries.nth(2)).toBeFocused();
  }
});

test("Arabic enquiry keeps compatible values, translates failure and records no personal fields", async ({ page }, info) => {
  test.skip(info.project.name === "nojs");
  let submitted: Record<string, string> | undefined;
  await page.route("**/api/contact", async (route) => { submitted = route.request().postDataJSON(); await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "Email delivery is unavailable. Please email info@ledgerbyte.io or choose WhatsApp." }) }); });
  await page.goto("/ar/contact");
  await page.locator('[name="fullName"]').fill("QA Reviewer");
  await page.locator('[name="email"]').fill("qa@example.com");
  await page.locator('[name="location"]').fill("UAE");
  await page.locator('[name="service"]').selectOption("Accounting & Bookkeeping");
  await page.getByRole("button", { name: "أرسل الاستفسار", exact: true }).click();
  await expect(page.locator(".accounting-form-feedback[role=alert]")).toContainText("الإرسال بالبريد غير متاح");
  expect(submitted?.service).toBe("Accounting & Bookkeeping");
  await expect(page.locator('[name="fullName"]')).toHaveValue("QA Reviewer");
  expect(await page.evaluate(() => window.dataLayer || [])).toEqual([]);
});

test("preview consent never loads Google and withdrawal persists", async ({ context, page }, info) => {
  test.skip(info.project.name === "nojs");
  await context.clearCookies();
  const requests: string[] = [];
  page.on("request", (request) => { if (/google-analytics|googletagmanager/.test(request.url())) requests.push(request.url()); });
  await page.goto("/ar");
  await expect(page.locator("#analytics-choice")).toHaveCount(0);
  await page.getByRole("button", { name: "إعدادات ملفات الارتباط", exact: true }).click();
  await page.getByRole("button", { name: "السماح بالتحليلات", exact: true }).click();
  await page.getByRole("button", { name: "إعدادات ملفات الارتباط", exact: true }).click();
  await page.getByRole("button", { name: "رفض التحليلات", exact: true }).click();
  expect((await context.cookies()).find((cookie) => cookie.name === "ledgerbyte-analytics-consent")?.value).toBe("denied");
  expect(requests).toEqual([]);
  await page.goto("/"); expect(requests).toEqual([]);
});

test("Arabic contact, services and home have no serious accessibility violations", async ({ page }, info) => {
  test.skip(info.project.name === "nojs");
  test.setTimeout(120000);
  for (const path of ["/ar", "/ar/contact", "/ar/finance/services"]) {
    await page.goto(path);
    const report = await new AxeBuilder({ page }).analyze();
    expect(report.violations.filter((item) => ["serious", "critical"].includes(item.impact || "")), path).toEqual([]);
  }
});

test("unknown Arabic routes are real 404s and drafts stay out of sitemaps", async ({ page, request }) => {
  expect((await page.goto("/ar/not-a-published-page"))?.status()).toBe(404);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/ar"); expect(sitemap).not.toContain("/seo-review");
});

test("Arabic text at 200 percent remains readable without horizontal overflow", async ({ page }, info) => {
  test.skip(info.project.name === "nojs");
  await page.goto("/ar/finance/services");
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
