import { expect, test } from "@playwright/test";
import accounting from "../src/content/accounting.json";

test("@nojs all finance discussions open WhatsApp with the corresponding public service", async ({ page }) => {
  test.setTimeout(100_000);
  const number = "https://wa.me/971561371569";
  let discussions = 0;
  function checkDraft(href: string, topic: string) {
    const draft = new URL(href);
    expect(draft.origin + draft.pathname).toBe(number);
    expect(draft.searchParams.get("text")).toContain(topic);
    discussions++;
  }
  await page.goto("/");
  const directory = page.locator("#all-services");
  for (const item of await directory.locator("article").all()) {
    checkDraft((await item.locator('a[aria-label^="Discuss"]').getAttribute("href"))!, await item.locator("h3").innerText());
  }
  expect(discussions).toBe(22);
  for (const [label, topic] of [
    ["Discuss accounting", "Accounting & Bookkeeping"],
    ["Discuss tax", "Tax, VAT & Compliance"],
    ["Discuss controller support", "Fractional Financial Controller"],
    ["Discuss CFO support", "Fractional CFO & Finance Advisory"],
    ["Discuss full finance support", "Full Finance Department Outsourcing"],
  ]) {
    const cta = page.getByRole("link", { name: label, exact: true });
    checkDraft((await cta.getAttribute("href"))!, topic);
  }
  const tax = page.locator(".accounting-home-pillars article").filter({ hasText: "UAE Tax & VAT" });
  await tax.locator("summary").click();
  await expect(tax.getByRole("link", { name: "VAT return scope" })).toHaveAttribute("href", "/uae-vat");
  await expect(tax.getByRole("link", { name: "Corporate tax return filing" })).toHaveAttribute("href", "/finance/services/corporate-tax-filing");
  for (const { slug, title } of accounting.services) {
    await page.goto(`/finance/services/${slug}`);
    const cta = page.locator(".accounting-detail-hero a.button");
    const href = (await cta.getAttribute("href"))!;
    checkDraft(href, title);
    if (slug === "payroll-wps-management") {
      const links = page.locator("main a").filter({ hasText: "Discuss your payroll process" });
      await expect(links).toHaveCount(3);
      for (const link of await links.all()) await expect(link).toHaveAttribute("href", href);
    }
  }
  await page.goto("/finance");
  checkDraft((await page.getByRole("link", { name: "Discuss your requirements", exact: true }).getAttribute("href"))!, "accounting, tax or finance support");
  await page.goto("/about/team/amir-ilyas");
  checkDraft((await page.getByRole("link", { name: "Discuss this service" }).getAttribute("href"))!, "KSA VAT Services");
});

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
  await expect(second.getByRole("link", { name: /^Discuss/ })).toHaveAttribute("href", /^https:\/\/wa\.me\/971561371569\?text=.*Accounting%20%26%20Bookkeeping/);
  const explore = second.getByRole("link", { name: /^Explore/ });
  await expect(explore).toHaveAttribute("href", "/finance/services/accounting-bookkeeping");
  await explore.click();
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
  const link = deck.locator("details[open]").getByRole("link", { name: /^Explore/ });
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
  const result = card.getByRole("link", { name: /^Explore/ });
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
  await deck.locator("details[open]").getByRole("link", { name: /^Explore/ }).click();
  await expect(page).toHaveURL(/\/finance\/services\/accounting-bookkeeping$/);
  await page.goto("/finance/services");
  await expect(page.locator("[data-service-card]")).toHaveCount(22);
  const last = page.locator("[data-service-card]").last();
  await last.locator("summary").click();
  const explore = last.getByRole("link", { name: /^Explore/ });
  await expect(explore).toHaveAttribute("href", "/finance/services/zatca-filing");
  await expect(explore).toBeVisible();
  await expect(last.getByRole("link", { name: /^Discuss/ })).toHaveAttribute("href", /^https:\/\/wa\.me\/971561371569\?text=.*ZATCA%20Filing%20Support.*Saudi%20Arabia/);
});
