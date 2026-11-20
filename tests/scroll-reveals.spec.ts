import { expect, test, type Page } from "@playwright/test";

async function reveal(page: Page) {
  const section = page.locator(".accounting-home-process-section");
  await expect(section).toHaveAttribute("data-reveal-state", "ready");
  const frames = await section.evaluate(async (element) => {
    element.scrollIntoView({ block: "center", behavior: "instant" });
    return new Promise<ComputedKeyframe[]>((resolve, reject) => {
      const start = performance.now();
      function capture() {
        const animation = element.getAnimations()[0];
        if (animation) {
          animation.pause();
          resolve((animation.effect as KeyframeEffect).getKeyframes());
        } else if (performance.now() - start > 2000) {
          reject(new Error("The section did not reveal on entry"));
        } else requestAnimationFrame(capture);
      }
      requestAnimationFrame(capture);
    });
  });
  return { section, frames };
}

test("scroll reveals keep the original page height, stay readable and play once", async ({ page, browser }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, "Desktop reveals only");
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const baseline = await page.evaluate(() => document.documentElement.scrollHeight);
  // Both views have the search controls. The only intended layout difference here is the motion preference.
  const fallback = await browser.newContext({ reducedMotion: "reduce", viewport: page.viewportSize()! });
  const staticPage = await fallback.newPage();
  await staticPage.goto(page.url(), { waitUntil: "networkidle" });
  await staticPage.evaluate(() => document.fonts.ready);
  expect(await staticPage.evaluate(() => document.documentElement.scrollHeight)).toBe(baseline);
  await fallback.close();

  const { section, frames } = await reveal(page);
  expect(Number(frames[0].opacity)).toBeGreaterThanOrEqual(0.9);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(baseline);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await section.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));
  await expect(section).toHaveAttribute("data-reveal-state", "done");
  await expect(section).toHaveCSS("transform", "none");
  await expect(section).toHaveCSS("opacity", "1");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await section.evaluate((element) => element.scrollIntoView({ behavior: "instant" }));
  expect(await section.evaluate((element) => element.getAnimations().length)).toBe(0);
  await expect(page.locator(".accounting-home-hero")).not.toHaveAttribute("data-scroll-reveal");
});

test("keyboard focus and unavailable animation support leave content usable", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, "Desktop reveals only");
  await page.goto("/", { waitUntil: "networkidle" });
  const section = page.locator(".accounting-finance-services");
  const control = section.getByRole("link", { name: "Accounting & Bookkeeping" });
  await control.focus();
  await expect(section).toHaveAttribute("data-reveal-state", "done");
  await expect(control).toBeFocused();
  expect(await section.evaluate((element) => element.getAnimations().length)).toBe(0);
  await page.addInitScript(() => { Object.defineProperty(Element.prototype, "animate", { value: undefined }); });
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator(".accounting-home-process-section")).toHaveCSS("opacity", "1");
  await expect(page.locator(".accounting-home-process-section")).toHaveCSS("transform", "none");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("narrow screens keep the original static presentation", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 1024, "Desktop enhancement is covered separately");
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".accounting-home-process-section")).toHaveAttribute("data-reveal-state", "static");
  await expect(page.locator(".accounting-home-process-section")).toHaveCSS("transform", "none");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".accounting-home-pillars article")).toHaveCount(4);
});

test("@reduced changing the preference cancels reveals immediately", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const { section } = await reveal(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section).toHaveCSS("transform", "none");
  await expect(section).toHaveCSS("opacity", "1");
  expect(await section.evaluate((element) => element.getAnimations().length)).toBe(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("@nojs every reveal section remains fully visible without scripts", async ({ page }) => {
  await page.goto("/");
  const sections = page.locator("[data-scroll-reveal]");
  await expect(sections).toHaveCount(8);
  for (const section of await sections.all()) {
    await expect(section).toHaveCSS("opacity", "1");
    await expect(section).toHaveCSS("transform", "none");
  }
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.locator("main").getByRole("link", { name: "All 22 services", exact: true }).click();
  await expect(page.locator("[data-service-card]")).toHaveCount(22);
});
