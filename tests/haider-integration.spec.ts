import { expect, test } from "@playwright/test";

test("homepage offers lead to scoped contact requests and the existing sliding cards remain available", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".accounting-home-hero h1")).toHaveText("Know your numbers. Plan your next move.");
  await expect(page.locator(".accounting-home-hero")).toContainText("Why hire one accountant when you can get a finance team?");
  await expect(page.locator(".accounting-home-offer")).toHaveCount(3);
  await expect(page.locator(".accounting-offer-price").first()).toContainText("AED 500");
  await expect(page.locator(".accounting-pathways > div:last-child > article")).toHaveCount(8);
  await expect(page.locator(".accounting-featured [data-service-flashcards] > details")).toHaveCount(8);
  await page.getByRole("link", { name: "Discuss SME support", exact: true }).click();
  await expect(page.getByLabel("Support you need")).toHaveValue("Accounting & Bookkeeping");
});

test("homepage catalogue filters service scopes and restores all services after an empty search", async ({ page }) => {
  await page.goto("/");
  await page.locator("#all-services > summary").click();
  const search = page.getByRole("searchbox", { name: "Find your service", exact: true });
  await search.fill("corporate tax filing");
  await expect(page.locator("#home-result-count")).toHaveText("1 service");
  await search.fill("no-matching-finance-scope");
  await expect(page.locator("#home-result-count")).toHaveText("0 services");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("#home-result-count")).toHaveText("22 services");
  await expect(search).toBeFocused();
});

test("finance builder keeps displayed prices and all enquiry channels in sync", async ({ page }) => {
  await page.goto("/build-your-finance-department");
  await expect(page.getByLabel("Industry", { exact: true })).toBeEnabled();
  await expect(page.locator("#monthly-total")).toHaveText("500");
  await expect(page.locator("#hours")).toHaveText("15 hrs / mo");
  await expect(page.locator("#vat-included")).toContainText("VAT filing included");
  await page.getByRole("spinbutton", { name: "Senior accountant monthly hours", exact: true }).fill("5");
  await expect(page.locator("#monthly-total")).toHaveText("550");
  await expect(page.locator("#hours")).toHaveText("16 hrs / mo");
  for (const channel of ["Email", "WhatsApp", "Phone"]) {
    await page.getByLabel("Preferred contact", { exact: true }).selectOption(channel);
    const href = (await page.locator("#discuss").getAttribute("href"))!;
    expect(decodeURIComponent(href)).toContain("Estimated department cost: AED 550/month before tax.");
    expect(href.startsWith(channel === "WhatsApp" ? "https://wa.me/971561371569" : "mailto:info@ledgerbyte.io")).toBe(true);
  }
  await page.getByRole("button", { name: "Restore recommended hours" }).click();
  await expect(page.locator("#monthly-total")).toHaveText("500");
});

test("finance builder scales workload and enforces the included minimum hours", async ({ page }) => {
  await page.goto("/build-your-finance-department");
  await page.getByLabel("Industry", { exact: true }).selectOption({ label: "Retail & e-commerce" });
  expect(Number((await page.locator("#monthly-total").innerText()).replaceAll(",", ""))).toBeGreaterThan(500);
  await page.getByRole("slider", { name: "Monthly transactions", exact: true }).fill("2500");
  await page.getByRole("button", { name: "CFO advisory", exact: true }).click();
  const hours = await page.locator("#roles input").evaluateAll(nodes => nodes.map(node => Number((node as HTMLInputElement).value)));
  const total = hours.reduce((sum, value, index) => sum + value * [160, 100, 50, 30, 20][index], 0);
  await expect(page.locator("#monthly-total")).toHaveText(total.toLocaleString("en-US"));
  const senior = page.getByRole("spinbutton", { name: "Senior accountant monthly hours", exact: true });
  await senior.fill("0");
  await senior.blur();
  await expect(senior).toHaveValue("4");
});

test("@nojs finance builder keeps a usable starting estimate and enquiry draft", async ({ page }) => {
  await page.goto("/build-your-finance-department");
  await expect(page.locator("#monthly-total")).toHaveText("500");
  await expect(page.locator("#hours")).toHaveText("15 hrs / mo");
  await expect(page.getByLabel("Industry", { exact: true })).toBeDisabled();
  const href = (await page.locator("#discuss").getAttribute("href"))!;
  expect(decodeURIComponent(href)).toContain("AED 500/month before tax");
  await expect(page.getByRole("link", { name: "discuss your workload with LedgerByte" })).toHaveAttribute("href", "/contact");
});

test("@reduced finance builder remains operable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/build-your-finance-department");
  await page.getByRole("spinbutton", { name: "Senior accountant monthly hours", exact: true }).fill("5");
  await expect(page.locator("#monthly-total")).toHaveText("550");
  await expect(page.locator("main")).toBeVisible();
  // The shared reduced-motion styles use a 0.01 ms fallback, including focus colors.
  const timings = await page.locator("main").evaluate(node =>
    node.getAnimations({ subtree: true }).map(animation => animation.effect!.getComputedTiming()),
  );
  for (const timing of timings) {
    expect(Number(timing.duration)).toBeLessThanOrEqual(0.01);
    expect(timing.iterations).toBeLessThanOrEqual(1);
  }
});
