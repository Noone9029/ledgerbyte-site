import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import content from "../src/content/accounting.json";
import { homeUpdate } from "../src/content/home-update";

const routes = [
  ...new Set([
    ...Object.values(content.pages).map((page) => page.path),
    "/finance",
    "/finance/services",
    "/contact",
    "/regions",
    "/insights",
    "/privacy-policy",
    "/terms-of-use",
    "/about/team/haider-ali",
    "/about/team/sayyam-nasir",
    "/about/team/faisal-nawaz",
    "/about/team/alina-khalid",
  ]),
];

test("every supplied page renders its complete copy with correct metadata and working related links", async ({
  page,
}, info) => {
  test.setTimeout(180000);
  test.skip(
    info.project.name === "tablet-1024",
    "Full route crawl runs at desktop and mobile sizes.",
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of routes) {
    const response = await page.goto(path, { waitUntil: "load" });
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("main h1"), path).toHaveCount(1);
    await expect(page.locator("main h1"), path).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
      path,
    ).toBeLessThanOrEqual(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://ledgerbyte.io${path === "/" ? "" : path}`,
    );
    await expect(
      page.locator('a[href*="/technology"], a[href*="division=technology"], a[href*="tech.ledgerbyte.io"]'),
      path,
    ).toHaveCount(0);
    if (path === "/")
      await page.screenshot({
        path: `.qa/home-${info.project.name}.png`,
        fullPage: true,
      });
    const source = Object.values(content.pages).find((p) => p.path === path);
    if (source) {
      await expect(page.locator("main h1")).toHaveText(source.heading);
      for (const section of source.sections)
        await expect(
          page.locator("main h2", { hasText: section.heading }).first(),
        ).toBeAttached();
      for (const faq of source.faqs)
        await expect(
          page.locator("summary", { hasText: faq.question }),
        ).toBeAttached();
    }
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((image): image is HTMLImageElement => image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0)
            .map((image) => image.src),
        ),
      path,
    ).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("@nojs the corporate tax calendar maps period-end months to the standard filing month", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 730 });
  await page.goto("/finance/services/corporate-tax-filing");
  const calendar = page.locator("#filing-calendar");
  await calendar.locator("summary").focus();
  await page.keyboard.press("Enter");
  const table = calendar.getByRole("table", { name: "Standard filing months" });
  await expect(table).toBeVisible();
  await expect(table.getByRole("row")).toHaveCount(13);
  await expect(table.getByRole("rowheader")).toHaveText([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]);
  await expect(table.getByRole("cell")).toHaveText([
    "October · same year", "November · same year", "December · same year",
    "January · next year", "February · next year", "March · next year",
    "April · next year", "May · next year", "June · next year",
    "July · next year", "August · next year", "September · next year",
  ]);
  await expect(calendar).toContainText("30 September 2026");
  await expect(calendar.getByRole("link", { name: "FTA filing reminder" })).toHaveAttribute("href", "https://tax.gov.ae/en/media.centre/news/pr.2809.aspx");
  const clearance = await table.evaluate(element => {
    const whatsapp = document.querySelector(".floating-whatsapp")!;
    return whatsapp.getBoundingClientRect().left - element.getBoundingClientRect().right;
  });
  expect(clearance).toBeGreaterThan(0);
});

test("filing prices survive the handoff and worked examples reconcile", async ({ page }) => {
  for (const route of ["/uae-vat", "/finance/services/corporate-tax-filing"]) {
    await page.goto(route);
    await expect(page.locator(".accounting-detail-hero aside")).toContainText("AED 750");
  }
  await page.goto("/");
  await page.getByRole("link", { name: "See the calculation" }).click();
  await expect(page).toHaveURL(/\/insights\/profit-and-cash#cash-bridge$/);
  const worksheet = page.getByRole("table", { name: "Illustrative cash bridge · AED" });
  await expect(worksheet.locator("tfoot")).toContainText("-20,000");
  await page.goto("/finance/services/accounting-bookkeeping");
  const receipt = page.getByRole("table", { name: "Illustrative receipt allocation · AED" });
  await expect(receipt.locator("tfoot td")).toHaveText("0");
});

test("guide cards lead to illustrated articles and the profit guide shows its ledger once", async ({ page }) => {
  for (const path of ["/#guides", "/insights"]) {
    await page.goto(path);
    const cards = page.locator(path === "/insights" ? 'section[aria-label="Practical guides"] li' : "#guides li");
    await expect(cards).toHaveCount(3);
    for (const [slug, art] of [
      ["month-end-close", "insurance-prepayment"],
      ["profit-and-cash", "profit-to-cash"],
      ["vat-records", "vat-reconciliation"],
    ]) {
      await expect(cards.locator(`a[href="/insights/${slug}"] img[src*="${art}.webp"]`)).toBeVisible();
    }
  }
  await page.goto("/insights/profit-and-cash");
  await expect(page.locator('main img[src*="profit-to-cash.webp"]')).toHaveCount(1);
  await page.getByRole("link", { name: "See the calculation" }).click();
  await expect(page.locator("#section-2 dl")).toContainText("AED 60,000");
  await page.getByRole("link", { name: "See the cash bridge" }).click();
  await expect(page).toHaveURL(/#cash-bridge$/);
  await expect(page.getByRole("table", { name: "Illustrative cash bridge · AED" })).toBeVisible();
});

test("catalogue shows all 22 services and filters by task and category", async ({
  page,
}) => {
  await page.goto("/finance/services");
  await expect(page.locator("[data-service-card]")).toHaveCount(22);
  await page.getByRole("searchbox").fill("registration");
  await expect(
    page.getByRole("heading", { name: "UAE VAT Registration", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "UAE Corporate Tax Registration",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Accounting & Bookkeeping",
      exact: true,
    }),
  ).toHaveCount(0);
  await page.getByRole("searchbox").fill("");
  await page.getByLabel("Service category").selectOption("Saudi Arabia");
  await expect(page.locator("[data-service-card]")).toHaveCount(3);
  await page.getByRole("searchbox").fill("unmatched query");
  await expect(
    page.getByRole("heading", { name: "No matching services" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all services" }).click();
  await expect(page.locator("[data-service-card]")).toHaveCount(22);
});

test("finance navigation, homepage example and team details follow the approved layout", async ({
  page,
}) => {
  await page.goto("/");
  const nav = page.locator(
    (page.viewportSize()?.width ?? 0) > 1180
      ? ".accounting-desktop-nav"
      : ".accounting-mobile-nav nav",
  );
  if ((page.viewportSize()?.width ?? 0) <= 1180) {
    const toggle = page.getByLabel("Navigation menu", { exact: true });
    await toggle.click();
    await expect(toggle.locator(".menu-close-icon")).toBeVisible();
    await expect(toggle.locator(".menu-open-icon")).toBeHidden();
  }
  await nav.locator(".accounting-services-menu > summary").click();
  if ((page.viewportSize()?.width ?? 0) <= 1180) {
    await nav.locator("summary").filter({ hasText: "Finance Operations" }).click();
  }
  await expect(
    nav.getByRole("link", {
      name: "Full Finance Department Outsourcing",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    nav.getByRole("link", { name: "Markets", exact: true }),
  ).toBeVisible();
  await expect(
    nav.locator('a[href*="products"], a[href^="/technology"]'),
  ).toHaveCount(0);
  await page.goto("/");
  await expect(
    page.locator(".accounting-home-hero + #offers + #worked-example"),
  ).toBeVisible();
  await expect(page.locator('a[href*="trustpilot.com"]')).toHaveCount(0);
  await expect(page.locator(".accounting-home-example")).toContainText("−AED 20,000");
  await page.goto("/about");
  await expect(page.locator(".accounting-team-grid")).toContainText(
    "Financial Controller",
  );
  await expect(page.locator(".accounting-team-grid")).toContainText(
    "Fractional Controller",
  );
  await expect(page.locator(".accounting-team-grid")).toContainText(
    "Customer Success Manager",
  );
  await expect(page.locator("main")).not.toContainText("more than 20");
  for (const script of await page
    .locator('script[type="application/ld+json"]')
    .allTextContents()) {
    expect(script).not.toContain('"aggregateRating"');
    expect(script).not.toContain('"jobTitle":"Head of Accounting"');
    expect(script).not.toContain('"jobTitle":"Reporting Manager"');
  }
});

test("contact retains service context and separates email acceptance from WhatsApp", async ({
  page,
}) => {
  await page.goto("/finance/services/external-audit");
  const discussion = page.getByRole("link", { name: content.pages["services/external-audit"].cta, exact: true }).first();
  const draft = new URL((await discussion.getAttribute("href"))!);
  expect(draft.origin + draft.pathname).toBe("https://wa.me/971561371569");
  expect(draft.searchParams.get("text")).toContain("External Audit Coordination");
  await page.locator('footer a[href="/contact"]').first().click();
  await page.getByLabel("Support you need").selectOption("External Audit Coordination");
  const expectedChoices = new Set([
    "", ...content.services.map(service => service.title), ...homeUpdate.offers.map(offer => offer.name),
    "UAE VAT support", "Not sure yet",
  ]);
  const choices = await page.getByLabel("Support you need").locator("option").evaluateAll(
    options => options.map(option => (option as HTMLOptionElement).value),
  );
  expect(choices.sort()).toEqual([...expectedChoices].sort());
  const whatsapp = page.getByRole("link", { name: "WhatsApp ↗", exact: true });
  expect(
    new URL((await whatsapp.getAttribute("href")) ?? "").searchParams.get(
      "text",
    ),
  ).toContain("External Audit Coordination");
  let popup = false;
  page.on("popup", () => (popup = true));
  await page
    .getByLabel("Name", { exact: false })
    .first()
    .fill("Review visitor");
  await page
    .getByLabel("Email", { exact: false })
    .first()
    .fill("review@example.test");
  await page.getByLabel("Business location").fill("United Arab Emirates");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({
        message:
          "Email delivery is unavailable. Please email info@ledgerbyte.io or choose WhatsApp.",
      }),
    }),
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.locator(".accounting-contact-form [role='alert'] > p"),
  ).toHaveText(
    "Email delivery is unavailable. Please email info@ledgerbyte.io or choose WhatsApp.",
  );
  await expect(page.getByLabel("Business location")).toHaveValue(
    "United Arab Emirates",
  );
  expect(popup).toBe(false);
  await page.unroute("**/api/contact");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "No provider ID" }),
    }),
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.locator(".accounting-contact-form [role='alert']"),
  ).toBeVisible();
  await page.unroute("**/api/contact");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ enquiryId: "mock-provider-accepted" }),
    }),
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.locator(".accounting-contact-form [role='status']"),
  ).toContainText("accepted for email delivery");
  expect(popup).toBe(false);
});

test("contact API rejects bad data and validates every service without sending mail", async ({
  request,
}) => {
  expect((await request.post("/api/contact", { data: {} })).status()).toBe(400);
  const payload = {
    fullName: "Review visitor",
    email: "review@example.test",
    location: "UAE",
    service: "Accounting & Bookkeeping",
    companyName: "",
    message: "",
    website: "honeypot-test",
    startedAt: Date.now() - 5000,
  };
  for (const service of [
    ...content.services.map((s) => s.title),
    ...homeUpdate.offers.map(offer => offer.name),
    "VAT Return Support",
    "UAE Corporate Tax Review & Filing",
    "UAE Corporate Tax Filing",
    "UAE VAT support",
    "Not sure yet",
  ])
    expect(
      (
        await request.post("/api/contact", { data: { ...payload, service } })
      ).status(),
      service,
    ).toBe(202);
  expect(
    (
      await request.post("/api/contact", {
        data: { ...payload, service: "Website development" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", { data: { ...payload, location: "" } })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/contact", {
        data: payload,
        headers: { Origin: "https://unrelated.example" },
      })
    ).status(),
  ).toBe(403);
});

test("representative layouts pass accessibility in both themes", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["dark", "light"]) {
    await page.addInitScript(
      (value) => localStorage.setItem("ledgerbyte-theme", value),
      theme,
    );
    for (const path of [
      "/",
      "/finance/services",
      "/finance/services/external-audit",
      "/contact",
    ]) {
      await page.goto(path, { waitUntil: "networkidle" });
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.filter(
          (v) => v.impact === "critical" || v.impact === "serious",
        ),
        `${theme} ${path}`,
      ).toEqual([]);
    }
  }
});

test("preview blocks indexing, unknown pages stay 404 and approved paths are preserved", async ({
  request,
}) => {
  const response = await request.get("/");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect((await request.get("/services/not-a-real-service")).status()).toBe(
    404,
  );
  expect((await request.get("/unknown-page")).status()).toBe(404);
  expect(
    (await request.get("/finance/services/payroll-wps-management")).status(),
  ).toBe(200);
  expect(
    (await request.get("/finance/services/fractional-cfo-advisory")).status(),
  ).toBe(200);
});

test("@nojs supplied content and all services remain available without JavaScript", async ({
  page,
}) => {
  test.setTimeout(150000);
  for (const source of Object.values(content.pages)) {
    expect((await page.goto(source.path))?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveText(source.heading);
    await expect(page.locator("main h1")).toBeVisible();
  }
  await page.goto("/finance/services");
  await expect(page.locator("[data-service-card]")).toHaveCount(22);
  await page.goto("/contact");
  await expect(
    page.getByRole("link", { name: "WhatsApp ↗", exact: true }),
  ).toBeVisible();
});

test("the supplied founder portrait and team credentials follow visitors from the homepage to profiles and the builder", async ({ page }) => {
  const portrait = /haider-ali-approved\.jpg/;
  await page.goto("/");
  const roster = page.locator("#team");
  await expect(roster.locator(".accounting-founder-note img")).toHaveAttribute("src", portrait);
  await expect(roster.locator("article h3")).toHaveText(["Muhammad Ahmad", "Faisal Nawaz", "Sayyam Nasir", "Alina Khalid"]);
  await expect(roster).toContainText("FCA with an EY background");
  await expect(roster).toContainText("MPhil in Development Studies");
  const rosterBounds = await roster.locator(".accounting-team-roster").boundingBox();
  const whatsappBounds = await page.locator(".floating-whatsapp").boundingBox();
  expect(rosterBounds!.x + rosterBounds!.width).toBeLessThan(whatsappBounds!.x);
  await roster.getByRole("link", { name: /Haider Ali/ }).click();
  await expect(page.locator(".expert-profile-image img")).toHaveAttribute("src", portrait);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", portrait);

  await page.goto("/about");
  await expect(page.locator(".accounting-team-grid article")).toHaveCount(6);
  const founderPhotos = page.locator('main a[href="/about/team/haider-ali"] img');
  await expect(founderPhotos).toHaveCount(2);
  for (const photo of await founderPhotos.all()) await expect(photo).toHaveAttribute("src", portrait);

  await page.goto("/build-your-finance-department");
  await expect(page.locator('#people a[href="/about/team/haider-ali"] img')).toHaveAttribute("src", portrait);
});

test("@reduced motion keeps the review stable and usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".accounting-home-pillars article")).toHaveCount(4);
  await page.locator(".accounting-faq summary").first().click();
  await expect(page.locator(".accounting-faq details").first()).toHaveAttribute(
    "open",
    "",
  );
});
