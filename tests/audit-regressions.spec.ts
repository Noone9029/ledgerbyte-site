import { expect, test, type Page } from "@playwright/test";

const failure =
  "We could not send your enquiry. Please try again or contact us by email.";
async function fillEnquiry(page: Page) {
  await page
    .getByLabel("Name", { exact: false })
    .first()
    .fill("Aleksandra Wiśniewska-Kowalczyk");
  await page
    .getByLabel("Email", { exact: false })
    .first()
    .fill("review@example.test");
  await page.getByLabel("Business location").fill("United Arab Emirates");
  await page.getByLabel("Support you need").selectOption("Not sure yet");
}
async function openServices(page: Page) {
  const mobile = (page.viewportSize()?.width ?? 0) <= 1180;
  if (mobile) await page.locator(".accounting-mobile-nav > summary").click();
  const nav = page.locator(
    mobile ? ".accounting-mobile-nav nav" : ".accounting-desktop-nav",
  );
  await nav.locator(".accounting-services-menu > summary").click();
  return nav;
}

test("mobile primary actions leave the WhatsApp hit target clear", async ({ page, isMobile }) => {
  test.skip(!isMobile);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
    for (const [path, selector] of [
      ["/", ".accounting-home-hero .button"],
      ["/finance", ".accounting-hub-link"],
      ["/finance/services/ksa-company-formation", ".accounting-detail-hero .button"],
      ["/technology/services/cloud-devops", ".service-detail-copy .button"],
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const button = (await page.locator("a.floating-whatsapp").boundingBox())!;
      const action = (await page.locator(selector).first().boundingBox())!;
      expect(action.x + action.width, path).toBeLessThan(button.x);
    }
  }
});

test("menus close on selection, Escape and outside interaction", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  let nav = await openServices(page);
  if ((page.viewportSize()?.width ?? 0) <= 1180) {
    await nav.locator("summary").filter({ hasText: "Finance Operations" }).click();
  }
  await nav
    .getByRole("link", { name: "Accounting & Bookkeeping", exact: true })
    .click();
  await expect(page).toHaveURL(/\/finance\/services\/accounting-bookkeeping$/);
  await expect(page.locator("header details[open]")).toHaveCount(0);
  nav = await openServices(page);
  await page.keyboard.press("Escape");
  await expect(page.locator("header details[open]")).toHaveCount(0);
  await expect(
    page.locator(
      (page.viewportSize()?.width ?? 0) <= 1180
        ? ".accounting-mobile-nav > summary"
        : ".accounting-desktop-nav .accounting-services-menu > summary",
    ),
  ).toBeFocused();
  await openServices(page);
  const viewport = page.viewportSize()!;
  await page.mouse.click(viewport.width - 4, viewport.height - 4);
  await expect(page.locator("header details[open]")).toHaveCount(0);
});

test("Markets links, singular results and mobile form sizing are correct", async ({
  page,
}) => {
  await page.goto("/about");
  const markets = page.getByRole("link", { name: "Market scope", exact: true });
  await expect(markets).toHaveAttribute("href", "/regions");
  await markets.click();
  await expect(page).toHaveURL(/\/regions$/);
  await page.goto("/finance/services");
  await page.getByRole("searchbox").fill("zatca");
  await expect(page.locator("[data-service-card]")).toHaveCount(1);
  await expect(page.locator(".accounting-results")).toHaveText("1 service");
  await page.goto("/contact");
  expect(
    await page
      .locator('[name="fullName"]')
      .evaluate((e) => parseFloat(getComputedStyle(e).fontSize)),
  ).toBeGreaterThanOrEqual(16);
  const target = await page.locator(".theme-toggle").boundingBox();
  expect(target?.width).toBeGreaterThanOrEqual(44);
  expect(target?.height).toBeGreaterThanOrEqual(44);
});

test("gateway, malformed and network failures use friendly copy and retain data", async ({
  page,
}) => {
  await page.goto("/contact");
  await fillEnquiry(page);
  for (const mode of ["html", "json", "offline"]) {
    await page.route("**/api/contact", (route) =>
      mode === "offline"
        ? route.abort("failed")
        : route.fulfill({
            status: 502,
            contentType: mode === "html" ? "text/html" : "application/json",
            body:
              mode === "html"
                ? "<!doctype html><title>Bad Gateway</title>"
                : "not valid JSON",
          }),
    );
    await page
      .getByRole("button", { name: "Send enquiry", exact: true })
      .click();
    await expect(
      page.locator('.accounting-contact-form [role="alert"] > p'),
    ).toHaveText(failure);
    await expect(page.getByLabel("Name", { exact: false }).first()).toHaveValue(
      "Aleksandra Wiśniewska-Kowalczyk",
    );
    await page.unroute("**/api/contact");
  }
});

test("accepted enquiries cannot be resent unchanged", async ({ page }) => {
  let accepted = 0;
  await page.route("**/api/contact", (route) => {
    accepted++;
    return route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ enquiryId: "mock-accepted" }),
    });
  });
  await page.goto("/contact");
  await fillEnquiry(page);
  const send = page.getByRole("button", { name: "Send enquiry", exact: true });
  await send.click();
  await expect(
    page.locator('.accounting-contact-form [role="status"]'),
  ).toContainText("accepted for email delivery");
  await expect(send).toBeDisabled();
  await page.getByLabel("Business location").focus();
  await expect(send).toBeDisabled();
  await page.locator('[name="message"]').fill("A different enquiry");
  await expect(send).toBeEnabled();
  await page.locator('[name="message"]').fill("");
  await send.click();
  await expect(send).toBeDisabled();
  expect(accepted).toBe(1);
});

test("stalled requests release the form with a useful error", async ({
  page,
}) => {
  await page.clock.install();
  await page.route("**/api/contact", () => {});
  await page.goto("/contact");
  await fillEnquiry(page);
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  await page.clock.fastForward(20001);
  await expect(
    page.locator('.accounting-contact-form [role="alert"] > p'),
  ).toHaveText(failure);
  await expect(
    page.getByRole("button", { name: "Send enquiry", exact: true }),
  ).toBeEnabled();
});

test("the first technology paint uses the system palette before hydration", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.route(/\/_next\/static\/.*\.js(?:\?|$)/, route => route.abort());
  await page.goto("/technology", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("keyboard theme changes skip view and icon transitions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const w = window as typeof window & { themeTransitions: number };
    w.themeTransitions = 0;
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: (commit: () => void) => {
        w.themeTransitions++;
        commit();
      },
    });
  });
  await page.goto("/");
  const theme = page.locator(".theme-toggle");
  await theme.focus();
  await page.keyboard.press("Enter");
  await expect(theme).toHaveAttribute("data-activation", "keyboard");
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { themeTransitions: number })
          .themeTransitions,
    ),
  ).toBe(0);
  expect(
    await theme
      .locator(".theme-icon")
      .first()
      .evaluate((e) => getComputedStyle(e).transitionDuration),
  ).toBe("0s");
  await theme.click();
  expect(
    await page.evaluate(
      () =>
        (window as typeof window & { themeTransitions: number })
          .themeTransitions,
    ),
  ).toBe(1);
});

test("@nojs enquiry details cannot enter a URL and filter controls are unavailable", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(page.locator(".accounting-contact-form")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Send enquiry", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator(".accounting-contact-form")).toHaveAttribute(
    "method",
    "post",
  );
  await expect(
    page.locator("noscript a[href='mailto:info@ledgerbyte.io']"),
  ).toBeVisible();
  expect(new URL(page.url()).search).toBe("");
  await page.goto("/finance/services");
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.locator(".accounting-search")).toBeHidden();
  await expect(page.locator("[data-service-card]")).toHaveCount(22);
});

test("@reduced decorative hover effects do not move controls or cards", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const selector of [
    ".hero-actions .button",
    ".accounting-flashcard",
    ".theme-toggle",
  ]) {
    const target = page.locator(selector).first();
    await target.hover();
    await expect
      .poll(() => target.evaluate((e) => getComputedStyle(e).transform))
      .toBe("none");
  }
});
