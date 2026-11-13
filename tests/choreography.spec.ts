import { expect, test, type Page } from "@playwright/test";

async function openStory(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".accounting-scroll-story")).toHaveAttribute("data-motion-state", "ready");
  await expect(page.locator("[data-scene-state='pinned']")).toHaveCount(2);
}

async function seek(page: Page, scene: "hero" | "clarity", progress: number) {
  await page.locator(`[data-scroll-scene='${scene}']`).evaluate((stage, value) => {
    const spacer = stage.parentElement!;
    const top = (document.querySelector<HTMLElement>(".accounting-header")?.offsetHeight ?? 0) + 16;
    const distance = innerHeight * (stage.getAttribute("data-scroll-scene") === "hero" ? 0.6 : 1.4);
    window.scrollTo({ top: scrollY + spacer.getBoundingClientRect().top - top + distance * value, behavior: "instant" });
  }, progress);
  // ScrollTrigger updates on the browser's next rendering frame.
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

async function offset(page: Page, selector: string) {
  return page.locator(selector).evaluate((element) => parseFloat(getComputedStyle(element).strokeDashoffset));
}

test("desktop scenes follow the scroll, reverse and preserve actionable copy", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Pinned scenes are desktop only");
  await openStory(page);
  const headline = page.locator(".accounting-home-hero h1");
  await seek(page, "hero", 0.15);
  const start = await headline.boundingBox();
  await seek(page, "hero", 0.85);
  expect(Math.abs((await headline.boundingBox())!.y - start!.y)).toBeLessThan(2);
  expect(await offset(page, "[data-hero-line]")).toBeLessThan(0.02);
  await expect(page.locator(".accounting-home-hero .button")).toBeInViewport();
  await page.locator(".accounting-home-hero .button").focus();
  await expect(page.locator(".accounting-home-hero .button")).toBeFocused();
  await seek(page, "hero", 0);
  expect(await offset(page, "[data-hero-line]")).toBeGreaterThan(0.98);

  await seek(page, "clarity", 0);
  expect(await offset(page, "[data-forecast-reveal]")).toBeGreaterThan(0.98);
  await seek(page, "clarity", 0.5);
  expect(await offset(page, "[data-report-line]")).toBeLessThan(0.5);
  expect(await offset(page, "[data-forecast-reveal]")).toBeGreaterThan(0.98);
  await seek(page, "clarity", 0.95);
  expect(await offset(page, "[data-forecast-reveal]")).toBeLessThan(0.02);
  await seek(page, "clarity", 0.15);
  expect(await offset(page, "[data-forecast-reveal]")).toBeGreaterThan(0.98);
  await expect(page.locator(".accounting-clarity-copy p").last()).toHaveCSS("opacity", "1");
  await expect(page.locator(".accounting-hero-image img")).toHaveAttribute("width", "1536");
  expect(await page.locator(".accounting-hero-image img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  expect(await page.locator(".accounting-hero-image").evaluate((e) => e.clientWidth / e.clientHeight)).toBeCloseTo(1.5, 1);
});

test("desktop scene lifecycle survives resizing, text enlargement and navigation", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1200, "Pinned scenes are desktop only");
  await openStory(page);
  await seek(page, "clarity", 0.65);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await expect(page.locator(".accounting-clarity-copy h2")).toBeInViewport();
  await page.setViewportSize({ width: 1440, height: 650 });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect.poll(() => offset(page, "[data-forecast-reveal]")).toBe(0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator(".pin-spacer")).toHaveCount(2);

  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => document.documentElement.style.removeProperty("font-size"));
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await page.getByRole("link", { name: "Find your service", exact: true }).click();
  await expect(page).toHaveURL(/\/finance\/services$/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.goBack();
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
  await expect(page.locator(".accounting-pathways article")).toHaveCount(8);
  await page.goto("/about#team");
  await expect(page.locator("#team")).toBeInViewport();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("touch and tablet layouts keep the finished static story", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 1200, "Desktop choreography is covered separately");
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(await offset(page, "[data-hero-line]")).toBe(0);
  await expect.poll(() => offset(page, "[data-forecast-reveal]")).toBe(0);
  await expect(page.locator(".accounting-pathways article")).toHaveCount(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("@reduced preference changes remove pins and expose the completed diagram", async ({ page }) => {
  await openStory(page);
  await seek(page, "clarity", 0.5);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect.poll(() => offset(page, "[data-forecast-reveal]")).toBe(0);
  await expect(page.locator(".accounting-clarity-copy h2")).toBeInViewport();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pin-spacer")).toHaveCount(2);
});

test("@nojs scenes render complete with no extra scroll track", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".accounting-hero-image img")).toBeVisible();
  expect(await offset(page, "[data-forecast-reveal]")).toBe(0);
  await expect(page.locator(".accounting-clarity-copy")).toContainText("Budgets and cash forecasts");
  await page.getByRole("link", { name: "Find your service", exact: true }).click();
  await expect(page.locator("[data-service-card]")).toHaveCount(22);
});
