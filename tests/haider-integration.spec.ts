import { expect, test } from "@playwright/test";

test("homepage offers lead to scoped contact requests and the existing sliding cards remain available", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".accounting-home-hero h1")).toHaveText("Why hire one accountant when you can get a finance team?");
  await expect(page.locator(".accounting-home-hero")).toContainText("Why hire one accountant when you can get a finance team?");
  await expect(page.locator(".accounting-home-offer")).toHaveCount(3);
  await expect(page.locator(".accounting-offer-price").first()).toContainText("AED 500");
  await expect(page.locator(".accounting-home-pillars > article")).toHaveCount(4);
  expect(await page.locator("#main-content > section").evaluateAll(sections => sections.map(section =>
    section.getAttribute("data-home-section") ?? (section.classList.contains("accounting-faq") ? "faq" : "unknown"),
  ))).toEqual(["hero", "offers", "reviews", "finance-services", "catalogue", "process", "team", "guides", "faq", "contact"]);
  await expect(page.locator(".accounting-home-process-steps > li")).toHaveCount(5);
  await expect(page.locator(".accounting-home-process-steps > li").last()).toBeVisible();
  await expect(page.locator(".accounting-featured [data-service-flashcards] > details")).toHaveCount(8);
  await page.getByRole("link", { name: "Discuss SME support", exact: true }).click();
  await expect(page.getByLabel("Support you need")).toHaveValue("Accounting & Bookkeeping");
});

test("homepage catalogue filters service scopes and restores all services after an empty search", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Find your service", exact: true });
  await search.fill("corporate tax filing");
  await expect(page.locator(".accounting-service-results h3 a").first()).toHaveAttribute("href", "/finance/services/corporate-tax-filing");
  await search.fill("no-matching-finance-scope");
  await expect(page.locator("#home-result-count")).toHaveText("0 services");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("#home-result-count")).toHaveText("22 services");
  await expect(search).toBeFocused();
});

test("the homepage and full catalogue find the offers visitors are sold", async ({ page }) => {
  for (const path of ["/", "/finance/services"]) {
    await page.goto(path);
    const search = page.getByRole("searchbox", { name: "Find your service" });
    for (const [term, destination] of [
      ["supplier payments", "/finance/services/accounts-payable"],
      ["tax return", "/finance/services/corporate-tax-filing"],
      ["cfo fractional", "/finance/services/fractional-cfo-advisory"],
      ["VAT returns", "/uae-vat"],
      ["VAT return", "/uae-vat"],
    ]) {
      await search.fill(term);
      await expect(page.locator(".accounting-service-results h3 a").first()).toHaveAttribute("href", destination);
    }
    await page.getByRole("link", { name: "Discuss VAT Return Support", exact: true }).click();
    await expect(page.getByLabel("Support you need")).toHaveValue("UAE VAT support");
    await expect(page).toHaveURL(/#enquiry-heading$/);
  }
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

test("finance builder carries role adjustments into payroll and restores the tab's estimate", async ({ page }) => {
  await page.goto("/build-your-finance-department");
  const senior = page.getByLabel("Senior accountant monthly hours");
  await senior.fill("10");
  await page.getByRole("button", { name: "Payroll support", exact: true }).click();
  await expect(senior).toHaveValue("12");
  await expect(page.locator("#monthly-total")).toHaveText("1,080");
  await expect(page.locator("#hours")).toHaveText("27 hrs / mo");
  await page.locator("#cadence").selectOption("Weekly");
  await page.locator("#channel").selectOption("Phone");
  await page.getByRole("link", { name: "See our working process" }).click();
  await expect(page).toHaveURL(/how-we-work/);
  await page.goBack();
  await expect(senior).toHaveValue("12");
  await expect(page.locator("#cadence")).toHaveValue("Weekly");
  await expect(page.locator("#channel")).toHaveValue("Phone");
  const draft = decodeURIComponent((await page.locator("#discuss").getAttribute("href"))!);
  expect(draft).toContain("AED 1,080/month before tax");
  expect(draft).toContain("My phone number (including country code)");
  await page.getByRole("button", { name: "Restore recommended hours" }).click();
  await expect(senior).toHaveValue("6");
  await expect(page.locator("#monthly-total")).toHaveText("780");
});

test("finance builder prices only allocated work when advisory hours are missing", async ({ page }) => {
  await page.goto("/build-your-finance-department");
  await page.getByRole("button", { name: "CFO advisory", exact: true }).click();
  await expect(page.locator("#monthly-total")).toHaveText("1,240");
  await page.getByLabel("Fractional CFO monthly hours").fill("0");
  await page.getByLabel("Fractional controller monthly hours").fill("0");
  await expect(page.locator("#monthly-total")).toHaveText("500");
  await expect(page.locator("#role-gap")).toContainText("Fractional CFO (0 of 4 h)");
  await expect(page.locator("#workload-scope")).toBeVisible();
  await expect(page.locator("#scope-note")).toContainText("Requested work needing a quote: CFO advisory. The estimate covers the hours shown.");
  await expect(page.locator("#covered-work")).not.toContainText("CFO advisory");
  for (const channel of ["Email", "WhatsApp"]) {
    await page.locator("#channel").selectOption(channel);
    const draft = decodeURIComponent((await page.locator("#discuss").getAttribute("href"))!);
    expect(draft).toContain("Work covered by these hours: Bookkeeping with VAT filing\n");
    expect(draft).toContain("Requested work needing a quote: CFO advisory. The estimate covers the hours shown.");
    expect(draft).toContain("Estimated department cost: AED 500/month before tax.");
  }
  await page.getByRole("button", { name: "Restore recommended hours" }).click();
  await expect(page.locator("#scope-note")).toBeHidden();
  await expect(page.locator("#covered-work")).toContainText("CFO advisory");
});

test("mobile estimate shortcut is reserved for the calculator controls", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The shortcut is only displayed on mobile.");
  await page.goto("/build-your-finance-department");
  await expect(page.locator("#industry")).toBeEnabled();
  await expect(page.locator("#mobile")).toBeHidden();
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.locator("#mobile")).toBeVisible();
  await page.locator("#mobile a").click();
  await expect(page.locator("#mobile")).toBeHidden();
  await page.locator("#people").scrollIntoViewIfNeeded();
  await expect(page.locator("#mobile")).toBeHidden();
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
