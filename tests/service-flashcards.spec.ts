import { expect, test } from "@playwright/test";

test("homepage flashcards keep the original eight services and work with hover or click", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const deck = page.locator(".accounting-featured [data-service-flashcards]");
  await expect(deck.locator("details")).toHaveCount(8);
  await expect(deck.locator("details[open]")).toHaveCount(1);
  await expect(deck.locator("details[open]")).toHaveAttribute("data-service-slug", "accounting-automation-systems");
  const second = deck.locator("details").nth(1);
  if ((page.viewportSize()?.width ?? 0) > 1100) {
    await second.locator("summary").hover();
    await expect(second).toHaveAttribute("open", "");
    await expect.poll(async () => (await second.boundingBox())!.width / (await deck.locator("details").nth(2).boundingBox())!.width).toBeGreaterThan(3);
  }
  await second.locator("summary").click();
  await expect(second).toHaveAttribute("open", "");
  await expect(deck.locator("details[open]")).toHaveCount(1);
  await expect(second.getByRole("link")).toHaveAttribute("href", "/finance/services/accounting-bookkeeping");
  await second.getByRole("link").click();
  await expect(page).toHaveURL(/\/finance\/services\/accounting-bookkeeping$/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("the full catalogue stays searchable and keyboard focus wins over hover", async ({ page }) => {
  await page.goto("/finance/services", { waitUntil: "networkidle" });
  await expect(page.locator("[data-service-card]")).toHaveCount(22);
  await expect(page.locator("[data-service-flashcards]")).toHaveCount(5);
  const deck = page.getByRole("group", { name: "Finance Operations", exact: true });
  const summaries = deck.locator("summary");
  await summaries.first().focus();
  await page.keyboard.press("End");
  await expect(summaries.last()).toBeFocused();
  await page.keyboard.press("Space");
  await expect(deck.locator("details[open]")).toHaveAttribute("data-service-slug", "accounts-payable");
  const link = deck.locator("details[open] a");
  await link.focus();
  if ((page.viewportSize()?.width ?? 0) > 1100) {
    await summaries.first().hover();
    await expect(link).toBeFocused();
    await expect(deck.locator("details[open]")).toHaveAttribute("data-service-slug", "accounts-payable");
  }
  await page.getByRole("searchbox").fill("registration");
  await expect(page.getByRole("link", { name: "UAE VAT Registration", exact: true }).and(page.locator("main h3 a"))).toHaveAttribute("href", "/finance/services/vat-registration");
  await expect(page.locator("main [data-service-flashcards]")).toHaveCount(0);
  await page.getByRole("searchbox").fill("");
  await page.getByLabel("Service category").selectOption("Saudi Arabia");
  await expect(page.locator("[data-service-card]")).toHaveCount(3);
  await expect(page.locator("[data-service-flashcards]")).toHaveCount(1);
});

test("plain-language searches survive a return from a selected service", async ({ page }) => {
  for (const path of ["/", "/finance/services"]) {
    await page.goto(path);
    const search = page.getByRole("searchbox");
    const titles = page.locator(".accounting-service-results h3 a");
    for (const [term, destination] of [
      ["bookkeeper", "/finance/services/accounting-bookkeeping"],
      ["cashflow", "/finance/services/cash-flow-working-capital"],
      ["CFO services", "/finance/services/fractional-cfo-advisory"],
    ]) {
      await search.fill(term);
      await expect(titles.first()).toHaveAttribute("href", destination);
    }
    const category = page.getByLabel("Service category");
    await category.selectOption("Reporting & Advisory");
    const result = titles.first();
    await result.scrollIntoViewIfNeeded();
    await result.focus();
    const top = (await result.boundingBox())!.y;
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/finance\/services\/fractional-cfo-advisory$/);
    await page.goBack();
    await expect(search).toHaveValue("CFO services");
    await expect(category).toHaveValue("Reporting & Advisory");
    await expect(result).toBeFocused();
    await expect.poll(async () => Math.abs((await result.boundingBox())!.y - top)).toBeLessThan(3);
    expect(new URL(page.url()).search).toBe("");
  }
});

test("returning twice keeps a category card open under a stationary pointer", async ({ page }) => {
  await page.goto("/finance/services");
  const category = page.getByLabel("Service category");
  await category.selectOption("Reporting & Advisory");
  const card = page.locator('[data-service-slug="fractional-cfo-advisory"]');
  await card.locator("summary").click();
  const result = card.getByRole("link");
  await result.click();
  for (let visit = 0; visit < 2; visit++) {
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Finance leadership");
    await page.goBack();
    await expect(category).toHaveValue("Reporting & Advisory");
    await expect(card).toHaveAttribute("open", "");
    await expect(result).toBeFocused();
    if (visit === 0) await page.goForward();
  }
});

test("touch layouts stack the same cards and open them by tapping", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 1100, "Desktop uses horizontal cards");
  await page.goto("/finance/services");
  const deck = page.locator("[data-service-flashcards]").first();
  const cards = deck.locator("details");
  await expect(deck).toHaveCSS("display", "grid");
  await cards.nth(2).locator("summary").click();
  await expect(cards.nth(2)).toHaveAttribute("open", "");
  await expect(deck.locator("details[open]")).toHaveCount(1);
  await expect(cards.nth(2).locator("h3")).toHaveCSS("writing-mode", "horizontal-tb");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test("@reduced cards still switch with no animated expansion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  const deck = page.locator(".accounting-featured [data-service-flashcards]");
  for (const index of [1, 4, 7, 0]) {
    await deck.locator("summary").nth(index).hover();
    await expect(deck.locator("details[open]")).toHaveAttribute("data-service-slug", await deck.locator("details").nth(index).getAttribute("data-service-slug") as string);
    expect(await deck.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  }
});

test("@nojs native flashcards remain expandable and retain all service routes", async ({ page }) => {
  await page.goto("/");
  const deck = page.locator(".accounting-featured [data-service-flashcards]");
  await deck.locator("summary").nth(1).click();
  await expect(deck.locator("details[open]")).toHaveAttribute("data-service-slug", "accounting-bookkeeping");
  await deck.locator("details[open] a").click();
  await expect(page).toHaveURL(/\/finance\/services\/accounting-bookkeeping$/);
  await page.goto("/finance/services");
  await expect(page.locator("[data-service-card]")).toHaveCount(22);
  const last = page.locator("[data-service-card]").last();
  await last.locator("summary").click();
  await expect(last.getByRole("link")).toHaveAttribute("href", "/finance/services/zatca-filing");
  await expect(last.getByRole("link")).toBeVisible();
});
