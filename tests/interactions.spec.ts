import { expect, test } from "@playwright/test";

test("division switching and service discovery resolve to complete routes", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");

  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Technology", exact: true })
      .click();
  } else {
    await page.getByRole("link", { name: "Technology", exact: true }).first().click();
  }

  await expect(page).toHaveURL(/\/technology$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Tech Solutions That Scale With Your Business",
    }),
  ).toBeVisible();

  await page.goto("/finance/services");
  const serviceLinks = page.locator(".service-card");
  await expect(serviceLinks).toHaveCount(8);
  await serviceLinks.first().click();
  await expect(page).toHaveURL(/\/finance\/services\/.+/);
  await expect(page.locator(".deliverables-grid")).toBeVisible();
  await expect(page.locator(".faq-list details")).toHaveCount(4);
});

test("desktop mega navigation exposes both service divisions", async ({
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) <= 1120,
    "Desktop mega navigation is replaced by the mobile menu.",
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Services" }).click();
  const menu = page.locator("#services-menu");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Finance Services" })).toBeVisible();
  await expect(
    menu.getByRole("link", { name: "Technology Services" }),
  ).toBeVisible();
});

test("header, footer, and browser metadata use the LedgerByte mark", async ({
  page,
}) => {
  await page.goto("/");

  const brandMarks = page.locator(".brand-mark img");
  await expect(brandMarks).toHaveCount(2);
  for (const mark of await brandMarks.all()) {
    await expect(mark).toHaveAttribute("src", /ledgerbyte-mark\.png/);
  }

  const favicon = page.locator('link[rel="icon"]').first();
  await expect(favicon).toHaveAttribute("href", /(?:favicon\.ico|icon.*\.png)/);
  const faviconHref = await favicon.getAttribute("href");
  const faviconResponse = await page.request.get(
    new URL(faviconHref ?? "/favicon.ico", page.url()).toString(),
  );
  expect(faviconResponse.ok()).toBe(true);
  expect(faviconResponse.headers()["content-type"]).toMatch(/^image\//);
});

test("theme control follows the system preference and persists an override", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.removeItem("ledgerbyte-theme"));
  await page.emulateMedia({ colorScheme: "light" });
  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const toggle = page.getByRole("button", { name: "Switch to dark mode" });
  await expect(toggle).toBeVisible();
  await toggle.click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() =>
      page.evaluate(() => window.localStorage.getItem("ledgerbyte-theme")),
    )
    .toBe("dark");

  await page.goto("/finance");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Switch to light mode" }),
  ).toBeVisible();
});

test("about values grid is completed by three working action cards", async ({
  page,
}) => {
  await page.goto("/about");

  const valuesGrid = page.locator(".values-grid");
  await expect(valuesGrid.locator(":scope > *")).toHaveCount(12);
  await expect(valuesGrid.locator(".value-action-card")).toHaveCount(3);

  await expect(
    valuesGrid.getByRole("link", { name: /Smart Accounting/ }),
  ).toHaveAttribute("href", "/finance/services");
  await expect(
    valuesGrid.getByRole("link", { name: /Technology Solutions/ }),
  ).toHaveAttribute("href", "/technology/services");
  await expect(
    valuesGrid.getByRole("link", {
      name: /Ready to strengthen your finance function/,
    }),
  ).toHaveAttribute("href", "/contact");
});

test("about team places Muhammad Ahmad immediately after Haider", async ({
  page,
}) => {
  await page.goto("/about");

  const teamCards = page.locator(".team-card");
  await expect(teamCards).toHaveCount(6);
  await expect(teamCards.locator("h2")).toHaveText([
    "Haider Ali",
    "Muhammad Ahmad",
    "Faisal Nawaz",
    "Sayyam Nasir",
    "Alina Khalid",
    "Amir Ilyas",
  ]);

  const muhammadCard = teamCards.nth(1);
  await expect(muhammadCard.locator(".eyebrow")).toHaveText("BSCS");
  await expect(muhammadCard.locator(".team-copy > span")).toHaveText("CTO");
  await expect(
    muhammadCard.getByText(
      "Full-stack developer & data analyst skilled in React, Python, SQL & AI. Leads development, analytics, and digital strategy at LedgerByte.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(muhammadCard.locator("img")).toHaveAttribute(
    "src",
    /muhammad-ahmad\.png/,
  );
});

test("contact form opens a structured WhatsApp handoff and preserves data", async ({
  page,
}) => {
  const whatsappText = [
    "LedgerByte website enquiry",
    "",
    "Name: Haider Ali",
    "Email: haider@example.com",
    "Phone: +971 50 123 4567",
    "Company: Example SME",
    "Service: Web Development",
    "",
    "Message:",
    "Please tell me more about the development process.",
  ].join("\n");
  const whatsappHref = `https://wa.me/971561371569?text=${encodeURIComponent(whatsappText)}`;

  await page.context().route("https://wa.me/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<title>WhatsApp handoff</title>",
    });
  });
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "WhatsApp is ready.",
        whatsappHref,
        emailDelivered: false,
      }),
    });
  });

  await page.goto("/contact");
  await page.getByLabel("Full Name *").fill("Haider Ali");
  await page.getByLabel("Email Address *").fill("haider@example.com");
  await page.getByLabel("Phone Number").fill("+971 50 123 4567");
  await page.getByLabel("Company Name").fill("Example SME");
  await page.getByLabel("Service of Interest *").selectOption("Web Development");
  await page
    .getByLabel("Message *")
    .fill("Please tell me more about the development process.");

  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Continue to WhatsApp" }).click();
  const popup = await popupPromise;

  await expect.poll(() => popup.url()).toBe(whatsappHref);
  await expect(page.getByText("WhatsApp is ready.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open WhatsApp" })).toHaveAttribute(
    "href",
    whatsappHref,
  );
  await expect(page.getByLabel("Full Name *")).toHaveValue("Haider Ali");
});

test("contact delivery failure preserves data and exposes alternatives", async ({
  page,
}) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        message: "There was an issue sending your message. Please try again.",
      }),
    });
  });

  await page.goto("/contact");
  await page.getByLabel("Full Name *").fill("Haider Ali");
  await page.getByLabel("Email Address *").fill("haider@example.com");
  await page
    .getByLabel("Service of Interest *")
    .selectOption("Accounting & Bookkeeping");
  await page
    .getByLabel("Message *")
    .fill("Please tell me more about your accounting support.");
  await page.getByRole("button", { name: "Continue to WhatsApp" }).click();

  await expect(
    page.getByText("There was an issue sending your message. Please try again."),
  ).toBeVisible();
  await expect(page.getByLabel("Full Name *")).toHaveValue("Haider Ali");
  await expect(page.getByRole("link", { name: "WhatsApp" }).last()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "info@ledgerbyte.io" }).last(),
  ).toBeVisible();
});

test("contact API validates and formats every visitor field for WhatsApp", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    data: {
      fullName: "Haider Ali",
      email: "haider@example.com",
      phone: "+971 50 123 4567",
      companyName: "Example SME",
      service: "Accounting & Bookkeeping",
      message: "Please tell me more about your accounting support.",
      website: "",
      startedAt: Date.now() - 2_000,
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as {
    whatsappHref: string;
    emailDelivered: boolean;
  };
  const target = new URL(body.whatsappHref);
  expect(target.origin).toBe("https://wa.me");
  expect(target.pathname).toBe("/971561371569");
  expect(target.searchParams.get("text")).toBe(
    [
      "LedgerByte website enquiry",
      "",
      "Name: Haider Ali",
      "Email: haider@example.com",
      "Phone: +971 50 123 4567",
      "Company: Example SME",
      "Service: Accounting & Bookkeeping",
      "",
      "Message:",
      "Please tell me more about your accounting support.",
    ].join("\n"),
  );
  expect(body.emailDelivered).toBe(false);
});

test("contact page and footer show the Sharjah business address", async ({
  page,
}) => {
  const address =
    "Shams Business Center, Sharjah Media City Free Zone, Al Messaned, Sharjah, UAE";
  await page.goto("/contact");
  await expect(
    page.getByText(address, { exact: true }),
  ).toHaveCount(2);

  await page.goto("/");
  const globalSchema = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').first().textContent()) ??
      "{}",
  ) as {
    "@graph"?: Array<{
      "@type"?: string | string[];
      address?: {
        streetAddress?: string;
        addressLocality?: string;
        addressRegion?: string;
        addressCountry?: string;
      };
    }>;
  };
  const organization = globalSchema["@graph"]?.find((node) => {
    const types = Array.isArray(node["@type"])
      ? node["@type"]
      : [node["@type"]];
    return types.includes("Organization");
  });
  expect(organization).toBeDefined();
  expect(organization?.address).toEqual({
    "@type": "PostalAddress",
    streetAddress:
      "Shams Business Center, Sharjah Media City Free Zone, Al Messaned",
    addressLocality: "Sharjah",
    addressRegion: "Sharjah",
    addressCountry: "AE",
  });
});

test("analytics records conversion categories without visitor PII", async ({
  page,
}) => {
  const events: unknown[][] = [];
  await page.exposeFunction(
    "recordLedgerByteAnalytics",
    (...args: unknown[]) => {
      events.push(args);
    },
  );
  await page.addInitScript(() => {
    const analyticsWindow = window as typeof window & {
      recordLedgerByteAnalytics: (...args: unknown[]) => void;
    };
    window.gtag = (...args) => {
      analyticsWindow.recordLedgerByteAnalytics(...args);
    };
  });

  const whatsappText = [
    "LedgerByte website enquiry",
    "",
    "Name: Test Visitor",
    "Email: visitor@example.com",
    "Phone: +971 50 555 0199",
    "Company: Private Company",
    "Service: Accounting & Bookkeeping",
    "",
    "Message:",
    "This private message must never be sent to analytics.",
  ].join("\n");
  const whatsappHref = `https://wa.me/971561371569?text=${encodeURIComponent(whatsappText)}`;

  await page.context().route("https://wa.me/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<title>WhatsApp handoff</title>",
    });
  });
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "WhatsApp is ready.",
        whatsappHref,
        emailDelivered: false,
      }),
    });
  });

  await page.goto("/contact");
  await page.getByLabel("Full Name *").fill("Test Visitor");
  await page.getByLabel("Email Address *").fill("visitor@example.com");
  await page.getByLabel("Phone Number").fill("+971 50 555 0199");
  await page.getByLabel("Company Name").fill("Private Company");
  await page
    .getByLabel("Service of Interest *")
    .selectOption("Accounting & Bookkeeping");
  await page
    .getByLabel("Message *")
    .fill("This private message must never be sent to analytics.");

  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Continue to WhatsApp" }).click();
  await popupPromise;

  await expect
    .poll(() =>
      events.some(
        (event) => event[0] === "event" && event[1] === "contact_form_start",
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      events.some(
        (event) => event[0] === "event" && event[1] === "generate_lead",
      ),
    )
    .toBe(true);

  const serialized = JSON.stringify(events);
  expect(serialized).not.toContain("Test Visitor");
  expect(serialized).not.toContain("visitor@example.com");
  expect(serialized).not.toContain("+971 50 555 0199");
  expect(serialized).not.toContain("Private Company");
  expect(serialized).not.toContain("This private message");
  expect(serialized).toContain("Accounting & Bookkeeping");
});

test("legacy routes redirect and invalid service slugs return 404", async ({
  page,
}) => {
  const redirects = new Map([
    ["/services", "/finance/services"],
    ["/services/accounting-bookkeeping", "/finance/services/accounting-bookkeeping"],
    ["/about-us", "/about"],
    ["/lets-connect", "/contact"],
    ["/process", "/technology/process"],
    ["/why-ledgerbyte-tech", "/technology/why-ledgerbyte"],
    ["/terms-of-service", "/terms-of-use"],
  ]);

  for (const [legacy, destination] of redirects) {
    await page.goto(legacy);
    expect(new URL(page.url()).pathname, legacy).toBe(destination);
  }

  const response = await page.goto("/finance/services/not-a-service");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("404")).toBeVisible();
});
