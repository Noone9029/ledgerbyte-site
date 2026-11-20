import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import content from "../src/content/accounting.json";

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

test("accounting navigation, Trustpilot and team changes match the handoff", async ({
  page,
}) => {
  await page.goto("/");
  const nav = page.locator(
    (page.viewportSize()?.width ?? 0) > 1180
      ? ".accounting-desktop-nav"
      : ".accounting-mobile-nav nav",
  );
  if ((page.viewportSize()?.width ?? 0) <= 1180)
    await page.getByLabel("Open navigation").click();
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
    page.locator(".accounting-home-hero + #offers + .accounting-reviews"),
  ).toBeVisible();
  await expect(page.locator(".accounting-review-link a")).toHaveAttribute(
    "href",
    "https://www.trustpilot.com/review/ledgerbyte.io",
  );
  await expect(page.locator(".accounting-review-link")).not.toContainText(
    /\d\.\d|stars/i,
  );
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
  await page
    .getByRole("link", {
      name: content.pages["services/external-audit"].cta,
      exact: true,
    })
    .first()
    .click();
  await expect(page.getByLabel("Support you need")).toHaveValue(
    "External Audit Coordination",
  );
  await expect(
    page.getByLabel("Support you need").locator("option"),
  ).toHaveCount(content.services.length + 3);
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
    "UAE VAT support",
    "Not sure yet",
  ])
    expect(
      (
        await request.post("/api/contact", { data: { ...payload, service } })
      ).status(),
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
