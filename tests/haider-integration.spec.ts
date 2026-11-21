import { expect, test } from "@playwright/test";

test("sample workpapers download the records displayed on each service", async ({ page, request, isMobile }) => {
  const services = [
    "payroll-wps-management", "finance-department-outsourcing", "fractional-controller", "budgeting-forecasting", "financial-reporting-mis",
    "accounts-payable", "accounts-receivable", "corporate-tax-filing", "internal-audit", "external-audit",
  ];
  for (const slug of services) {
    await page.goto(`/finance/services/${slug}#sample-deliverable`);
    const sample = page.locator("#sample-deliverable");
    const link = sample.getByRole("link", { name: /Download sample/ });
    const file = await link.getAttribute("href");
    expect(file).toMatch(/^\/samples\/[a-z-]+\.csv$/);
    const response = await request.get(file!);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-disposition"]).toMatch(/^attachment;/);
    const labels = await sample.locator('tbody th[scope="row"]').allTextContents();
    expect(labels.length).toBeGreaterThan(0);
    const csv = await response.text();
    for (const label of labels) expect(csv).toContain(`"${label}"`);
    if (isMobile) {
      const contentRight = await sample.locator("table").evaluate(table => table.getBoundingClientRect().right);
      const whatsapp = await page.locator(".floating-whatsapp").boundingBox();
      expect(contentRight, slug).toBeLessThan(whatsapp!.x);
    }
    if (slug === "payroll-wps-management") {
      await expect(sample.getByRole("row", { name: "This month 128,000" })).toBeVisible();
      expect(csv).toContain('"This month","128000"');
    }
    if (slug === "accounts-receivable") {
      const download = page.waitForEvent("download");
      await link.click();
      expect((await download).suggestedFilename()).toBe("ledgerbyte-illustrative-receipt-allocation.csv");
    }
  }
  expect((await request.get("/samples/unknown.csv")).status()).toBe(404);
});

test("each worked example loads its own illustration at the example section", async ({ page }) => {
  const examples = [
    ["/", "worked-example", "profit-to-cash"],
    ["/insights/profit-and-cash", "section-6", "delayed-collection"],
    ["/insights/month-end-close", "section-6", "insurance-prepayment"],
    ["/insights/vat-records", "section-4", "vat-reconciliation"],
    ["/finance/services/accounting-bookkeeping", "section-5", "receipt-matching"],
    ["/finance/services/accounting-automation-systems", "section-5", "processor-settlement"],
    ["/finance/services/cash-flow-working-capital", "section-4", "cash-timing"],
    ["/finance/services/financial-reporting-mis", "section-5", "margin-erosion"],
    ["/finance/services/budgeting-forecasting", "section-5", "forecast-sensitivity"],
    ["/finance/services/payroll-wps-management", "section-6", "payroll-variance"],
    ["/finance/services/fractional-cfo-advisory", "section-4", "hiring-break-even"],
    ["/finance/services/tax-vat-compliance", "section-5", "tax-adjustment"],
  ];
  for (const [path, anchor, artwork] of examples) {
    await page.goto(`${path}#${anchor}`);
    const illustration = page.locator(`section[id="${anchor}"] img[src*="${artwork}.webp"]`);
    await illustration.scrollIntoViewIfNeeded();
    await expect(illustration, artwork).toBeVisible();
    await expect.poll(() => illustration.evaluate(el => (el as HTMLImageElement).naturalWidth), { message: artwork }).toBeGreaterThan(0);
  }
});

test("homepage offers lead to scoped contact requests and the existing sliding cards remain available", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".accounting-home-hero h1")).toHaveText("Why hire one accountant when you can get a finance team?");
  await expect(page.locator(".accounting-home-hero")).toContainText("Why hire one accountant when you can get a finance team?");
  await expect(page.locator(".accounting-home-offer")).toHaveCount(3);
  await expect(page.locator(".accounting-offer-price").first()).toContainText("AED 500");
  const offers = page.locator("#offers");
  await expect(offers.locator(".accounting-home-offer details[open]")).toHaveCount(0);
  await expect(offers.getByText("Monthly books and tax work, quoted separately from the team builder.")).toBeVisible();
  const vat = offers.locator(".accounting-home-offer").filter({ has: page.getByRole("heading", { name: "VAT Return Support" }) });
  await expect(vat.locator(".accounting-offer-price")).toContainText(/750\s*\/ return/);
  await expect(vat.getByText("Standalone support for one UAE VAT return.")).toBeVisible();
  const builder = offers.getByRole("complementary", { name: "Finance team builder" });
  await expect(builder).toContainText("From AED 500/month before tax for 15 hours, including bookkeeping, senior review and VAT filing.");
  await expect(builder.getByRole("link")).toHaveAttribute("href", "/build-your-finance-department");
  const example = page.getByRole("link", { name: "See the profit-to-cash example" });
  await expect(example).toHaveAttribute("href", "#worked-example");
  await expect(page.locator("#worked-example")).toContainText("Operating cash generated");
  const clientReviews = page.getByRole("complementary", { name: "Client reviews" });
  await expect(clientReviews.getByRole("link")).toHaveAttribute("href", /trustpilot\.com\/review\//);
  await expect(clientReviews.getByText("AED 40,000", { exact: false })).toHaveCount(0);
  await expect(page.locator(".accounting-home-pillars > article")).toHaveCount(4);
  expect(await page.locator("#main-content > section").evaluateAll(sections => sections.map(section =>
    section.getAttribute("data-home-section") ?? (section.classList.contains("accounting-faq") ? "faq" : "unknown"),
  ))).toEqual(["hero", "offers", "reviews", "finance-services", "catalogue", "process", "team", "guides", "faq", "contact"]);
  await expect(page.locator(".accounting-home-process-steps > li")).toHaveCount(5);
  await expect(page.locator(".accounting-home-process-steps > li").last()).toBeVisible();
  await expect(page.locator(".accounting-featured [data-service-flashcards] > details")).toHaveCount(8);
  await page.getByRole("link", { name: "Discuss SME support", exact: true }).click();
  const service = page.getByLabel("Support you need");
  await expect(service).toHaveValue("SME Accounting & Tax Management");
  await expect(page.getByLabel("Business location")).toHaveValue("United Arab Emirates");
  await expect(page.locator("#enquiry-offer-scope")).toContainText("Monthly books and tax work");
  const whatsapp = page.locator("a.floating-whatsapp");
  await expect(whatsapp).toHaveCount(1);
  const draft = decodeURIComponent((await whatsapp.getAttribute("href"))!);
  expect(draft).toContain("SME Accounting & Tax Management");
  expect(draft).toContain("Monthly books and tax work");
  expect(draft).toContain("United Arab Emirates");
  await service.selectOption("Accounting Automation & Systems");
  await expect(page.locator("#enquiry-offer-scope")).toHaveCount(0);
  await expect(whatsapp).toHaveAttribute("href", /Accounting%20Automation/);
  await expect(whatsapp).not.toHaveAttribute("href", /SME/);
});

test("homepage catalogue filters service scopes and restores all services after an empty search", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search all 22 services", exact: true });
  await expect(page.locator("#home-result-count")).toHaveText("8 featured services");
  await search.fill("corporate tax filing");
  await expect(page.locator(".accounting-service-results h3 a").first()).toHaveAttribute("href", "/finance/services/corporate-tax-filing");
  await search.fill("no-matching-finance-scope");
  await expect(page.locator("#home-result-count")).toHaveText("0 services");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("#home-result-count")).toHaveText("8 featured services");
  await expect(search).toBeFocused();
});

test("@nojs mobile contents links reach service and guide sections directly from the introduction", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [path, heading] of [
    ["/finance/services/accounting-bookkeeping", "What you receive"],
    ["/insights/profit-and-cash", "Build the bridge from profit to cash"],
  ]) {
    await page.goto(path);
    const contents = page.locator("details.accounting-toc-compact");
    await expect(contents).toBeVisible();
    await expect(page.locator(".accounting-toc-wide")).toBeHidden();
    await contents.locator("summary").click();
    await contents.getByRole("link", { name: heading, exact: true }).click();
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeInViewport();
  }
});

test("the homepage and full catalogue find the offers visitors are sold", async ({ page }) => {
  for (const path of ["/", "/finance/services"]) {
    await page.goto(path);
    const search = page.getByRole("searchbox", { name: path === "/" ? "Search all 22 services" : "Find your service" });
    for (const [term, destination] of [
      ["accounting automation", "/finance/services/accounting-automation-systems"],
      ["automate", "/finance/services/accounting-automation-systems"],
      ["overdue invoices", "/finance/services/accounts-receivable"],
      ["supplier bills", "/finance/services/accounts-payable"],
      ["supplier payments", "/finance/services/accounts-payable"],
      ["tax return", "/finance/services/corporate-tax-filing"],
      ["cfo fractional", "/finance/services/fractional-cfo-advisory"],
      ["KSA VAT", "/finance/services/ksa-vat"],
      ["VAT registration", "/finance/services/vat-registration"],
      ["VAT", "/uae-vat"],
      ["quarterly VAT", "/uae-vat"],
      ["VAT returns", "/uae-vat"],
      ["UAE VAT filings", "/uae-vat"],
      ["corporate tax returns", "/finance/services/corporate-tax-filing"],
      ["monthly payroll run", "/finance/services/payroll-wps-management"],
      ["register for corporate tax", "/finance/services/corporate-tax-registration"],
      ["register for VAT", "/finance/services/vat-registration"],
      ["monthly tax compliance services UAE", "/finance/services/tax-vat-compliance"],
      ["outsourced bookkeeping services", "/finance/services/accounting-bookkeeping"],
      ["outsourced accounts receivable services", "/finance/services/accounts-receivable"],
      ["cash flow forecasting services", "/finance/services/cash-flow-working-capital"],
      ["UAE company formation finance support", "/finance/services/uae-company-formation"],
      ["Saudi company formation support", "/finance/services/ksa-company-formation"],
      ["accounts payable automation UAE", "/finance/services/accounting-automation-systems"],
      ["outsourced finance team", "/finance/services/finance-department-outsourcing"],
      ["part time financial controller", "/finance/services/fractional-controller"],
      ["year end close checklist", "/finance/services/month-end-year-end-close"],
      ["A/R", "/finance/services/accounts-receivable"],
      ["A/P", "/finance/services/accounts-payable"],
      ["management reporting services in Dubai", "/finance/services/financial-reporting-mis"],
      ["rolling forecast", "/finance/services/budgeting-forecasting"],
      ["13 week cash flow forecast", "/finance/services/cash-flow-working-capital"],
      ["part time CFO", "/finance/services/fractional-cfo-advisory"],
      ["UAE mainland company setup", "/finance/services/uae-company-formation"],
      ["outsourced internal audit", "/finance/services/internal-audit"],
      ["external audit preparation", "/finance/services/external-audit"],
      ["Saudi company setup", "/finance/services/ksa-company-formation"],
      ["Saudi VAT return preparation", "/finance/services/ksa-vat"],
      ["Saudi withholding tax", "/finance/services/zatca-filing"],
      ["VAT return", "/uae-vat"],
    ]) {
      await search.fill(term);
      await expect(page.locator(".accounting-service-results h3 a").first()).toHaveAttribute("href", destination);
    }
    await page.getByRole("link", { name: "Discuss VAT Return Support", exact: true }).click();
    await expect(page.getByLabel("Support you need")).toHaveValue("VAT Return Support");
    await expect(page.locator("form.accounting-contact-form")).toHaveAttribute("data-analytics-service", "tax-vat-compliance");
    await expect(page.getByLabel("Business location")).toHaveValue("United Arab Emirates");
    await expect(page).toHaveURL(/#enquiry-heading$/);
  }
});

test("@nojs the UAE offer keeps its identity in the email and WhatsApp drafts", async ({ page }) => {
  for (const [cta, name, scope] of [
    ["Discuss SME support", "SME Accounting & Tax Management", "Monthly books and tax work"],
    ["Discuss VAT return support", "VAT Return Support", "Standalone support"],
    ["Discuss corporate tax", "UAE Corporate Tax Review & Filing", "Review and filing"],
  ]) {
    await page.goto("/");
    await page.locator("#offers").getByRole("link", { name: cta, exact: true }).click();
    const inline = page.locator('.accounting-contact-intro a[href*="wa.me"]');
    const floating = page.locator("a.floating-whatsapp");
    await expect(floating).toHaveCount(1);
    const href = (await inline.getAttribute("href"))!;
    await expect(floating).toHaveAttribute("href", href);
    for (const draft of [href, (await page.locator(".accounting-form-panel noscript a").getAttribute("href"))!]) {
      expect(decodeURIComponent(draft)).toContain(name);
      expect(decodeURIComponent(draft)).toContain(scope);
      expect(decodeURIComponent(draft)).toContain("United Arab Emirates");
    }
  }
});

test("role-hour inputs stay tappable beside WhatsApp while scrolling", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile-390", "Touch layout");
  for (const [width, height] of [[320, 568], [390, 844], [736, 414], [812, 375], [844, 390], [768, 1024], [820, 1180], [900, 600]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/build-your-finance-department");
    const fields = page.locator("#roles input");
    await expect(fields).toHaveCount(5);
    await fields.nth(2).scrollIntoViewIfNeeded();
    await expect(page.locator("#mobile")).toBeVisible();
    for (const field of await fields.all()) {
      const tappable = await field.evaluate(input => {
        const bubble = document.querySelector(".floating-whatsapp")!.getBoundingClientRect();
        const box = input.getBoundingClientRect();
        window.scrollBy({ top: box.top + box.height / 2 - bubble.top - bubble.height / 2, behavior: "instant" });
        const current = input.getBoundingClientRect();
        return document.elementFromPoint(current.left + current.width / 2, current.top + current.height / 2) === input
          && current.right <= bubble.left;
      });
      expect(tappable).toBe(true);
    }
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
    const reviewUrl = new URL(href);
    const floating = new URL((await page.locator("a.floating-whatsapp").getAttribute("href"))!);
    await expect(page.locator("footer").getByRole("link", { name: "WhatsApp", exact: true })).toHaveAttribute("href", floating.href);
    expect(floating.origin + floating.pathname).toBe("https://wa.me/971561371569");
    expect(floating.searchParams.get("text")).toBe(reviewUrl.searchParams.get(channel === "WhatsApp" ? "text" : "body"));
  }
  const callbackNumber = page.getByLabel("Callback number (optional)");
  await callbackNumber.fill("+1 202-555-0100");
  await expect(page.getByRole("link", { name: "Request a callback by email" })).toHaveAttribute("href", /%2B1%20202-555-0100/);
  await expect(page.locator("a.floating-whatsapp")).toHaveAttribute("href", /%2B1%20202-555-0100/);
  await page.getByLabel("Preferred contact", { exact: true }).selectOption("WhatsApp");
  await expect(callbackNumber).toBeHidden();
  await expect(page.locator("#discuss")).not.toHaveAttribute("href", /202-555-0100/);
  await expect(page.locator("a.floating-whatsapp")).not.toHaveAttribute("href", /202-555-0100/);
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

test("finance builder keeps base bookkeeping in the estimate and quotes only excess workload", async ({ page }) => {
  await page.goto("/build-your-finance-department");
  await page.getByLabel("Industry", { exact: true }).selectOption({ label: "Retail & e-commerce" });
  await page.getByLabel("Senior accountant monthly hours").fill("4");
  await page.getByLabel("Junior accountant monthly hours").fill("8");
  await page.getByLabel("Junior admin support monthly hours").fill("3");
  await expect(page.locator("#monthly-total")).toHaveText("500");
  await expect(page.locator("#hours")).toHaveText("15 hrs / mo");
  await expect(page.locator("#vat-included")).toBeVisible();
  const shortfall = "Additional bookkeeping and VAT filing time for this workload (6 h/month)";
  await expect(page.locator("#scope-note")).toContainText(shortfall);
  await expect(page.getByRole("status").filter({ hasText: "Requested work needing a quote" })).toContainText(shortfall);
  for (const channel of ["Email", "WhatsApp", "Phone"]) {
    await page.locator("#channel").selectOption(channel);
    const draft = decodeURIComponent((await page.locator("#discuss").getAttribute("href"))!);
    expect(draft).toContain("Work covered by these hours: Bookkeeping with VAT filing\n");
    expect(draft).toContain("Requested work needing a quote: " + shortfall);
    expect(draft).toContain("Minimum package: AED 500/month for 15 hours of bookkeeping, senior review and VAT filing.");
  }
  await page.getByRole("button", { name: "Restore recommended hours" }).click();
  await expect(page.locator("#scope-note")).toBeHidden();
  await expect(page.locator("#hours")).toHaveText("21 hrs / mo");
  const restoredDraft = decodeURIComponent((await page.locator("#discuss").getAttribute("href"))!);
  expect(restoredDraft).not.toContain("Requested work needing a quote");
});

test("mobile estimate shortcut is reserved for the calculator controls", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The shortcut is only displayed on mobile.");
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/build-your-finance-department");
    await expect(page.locator("#industry")).toBeEnabled();
    await expect(page.locator("#mobile")).toBeHidden();
    await page.locator("#work").scrollIntoViewIfNeeded();
    await expect(page.locator("#mobile")).toBeVisible();
    await page.locator("#mobile a").click();
    await expect(page.locator("#mobile")).toBeHidden();
    const shortcut = await page.locator(".floating-whatsapp").boundingBox();
    const figures = await page.locator("#estimate .comparison strong, #hours, #mix .subtotal").evaluateAll(
      elements => elements.map(element => element.getBoundingClientRect().right),
    );
    expect(Math.max(...figures)).toBeLessThan(shortcut!.x);
    await page.getByRole("link", { name: "Adjust role hours" }).click();
    await expect(page.locator("#role-hours")).toBeFocused();
    await expect(page.getByRole("heading", { name: "Roles, rates & hours" })).toBeInViewport();
  }
  await page.locator("#people").scrollIntoViewIfNeeded();
  await expect(page.locator("#mobile")).toBeHidden();
});

test("@nojs finance builder keeps a usable starting estimate and enquiry draft", async ({ page }) => {
  await page.goto("/build-your-finance-department");
  await expect(page.locator("#monthly-total")).toHaveText("500");
  await expect(page.locator("#hours")).toHaveText("15 hrs / mo");
  await expect(page.getByLabel("Industry", { exact: true })).toBeDisabled();
  const href = (await page.locator("#discuss").getAttribute("href"))!;
  const floating = new URL((await page.locator("a.floating-whatsapp").getAttribute("href"))!);
  expect(floating.searchParams.get("text")).toBe(new URL(href).searchParams.get("body"));
  expect(decodeURIComponent(href)).toContain("AED 500/month before tax");
  expect(decodeURIComponent(href)).toContain("Work covered by these hours: Bookkeeping with VAT filing");
  expect(decodeURIComponent(href)).not.toContain("Requested work needing a quote");
  await expect(page.getByRole("link", { name: "Adjust role hours" })).toBeHidden();
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
