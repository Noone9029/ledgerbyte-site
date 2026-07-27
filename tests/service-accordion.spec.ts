import { expect, test } from "@playwright/test";

const technologyIndices = ["01", "02", "03", "04", "05", "06"];
const financeIndices = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
];

test("service accordions render deterministic numbering and routes", async ({
  page,
}) => {
  await page.goto("/technology");

  const technologyAccordion = page.locator(".service-accordion");
  await expect(technologyAccordion.locator(".service-panel")).toHaveCount(6);
  await expect(
    technologyAccordion.locator(".service-panel-index"),
  ).toHaveText(technologyIndices);
  await expect(
    technologyAccordion
      .locator(".service-panel")
      .nth(1)
      .getByRole("link", { name: "Learn more" }),
  ).toHaveAttribute(
    "href",
    "/technology/services/mobile-app-development",
  );

  await page.goto("/finance");

  const financeAccordion = page.locator(".service-accordion");
  await expect(financeAccordion.locator(".service-panel")).toHaveCount(8);
  await expect(
    financeAccordion.locator(".service-panel-index"),
  ).toHaveText(financeIndices);
  await expect(
    financeAccordion
      .locator(".service-panel")
      .last()
      .getByRole("link", { name: "Learn more" }),
  ).toHaveAttribute("href", "/finance/services/tax-vat-compliance");
});

test("desktop service rails are dense and respond to hover and focus", async ({
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) <= 1120,
    "Tablet and mobile render fully expanded service cards.",
  );

  await page.goto("/technology");

  const accordion = page.locator(".service-accordion");
  const panels = accordion.locator(".service-panel");
  const accordionBox = await accordion.boundingBox();
  expect(accordionBox?.height).toBeGreaterThanOrEqual(450);
  expect(accordionBox?.height).toBeLessThanOrEqual(470);

  await expect
    .poll(async () => (await panels.nth(1).boundingBox())?.width ?? 0)
    .toBeGreaterThanOrEqual(108);

  for (const panel of await panels.all()) {
    await expect(panel.locator("h3")).toBeVisible();
    await expect(panel.locator(".service-panel-index")).toBeVisible();
  }

  const secondPanel = panels.nth(1);
  await secondPanel.hover();
  await expect(secondPanel).toHaveAttribute("data-active", "true");
  await expect(secondPanel.locator(".service-panel-detail")).toHaveCSS(
    "opacity",
    "1",
  );

  const thirdPanel = panels.nth(2);
  await thirdPanel.getByRole("link", { name: "Learn more" }).focus();
  await expect(thirdPanel).toHaveAttribute("data-active", "true");
  await expect(thirdPanel.locator(".service-panel-detail")).toHaveCSS(
    "opacity",
    "1",
  );
});

test("responsive service cards expose their content without overflow", async ({
  page,
}) => {
  await page.goto("/technology");

  const accordion = page.locator(".service-accordion");
  const panels = accordion.locator(".service-panel");
  const viewportWidth = page.viewportSize()?.width ?? 0;

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBeFalsy();

  if (viewportWidth <= 1120) {
    for (const panel of await panels.all()) {
      await expect(panel.locator(".service-panel-detail")).toHaveCSS(
        "opacity",
        "1",
      );
      await expect(
        panel.getByRole("link", { name: "Learn more" }),
      ).toBeVisible();
    }
  }

  if (viewportWidth <= 820) {
    await expect(panels.first()).toHaveCSS("min-height", "0px");
  }
});

test("@reduced service accordion removes expansion motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/technology");

  const durations = await page
    .locator(".service-panel")
    .first()
    .evaluate((element) => getComputedStyle(element).transitionDuration);

  const seconds = durations.split(",").map((duration) => {
    const value = Number.parseFloat(duration);
    return duration.trim().endsWith("ms") ? value / 1000 : value;
  });
  expect(seconds.every((duration) => duration <= 0.001)).toBeTruthy();
});

test("@nojs service cards keep every detail and destination available", async ({
  page,
}) => {
  await page.goto("/technology", { waitUntil: "domcontentloaded" });

  const accordion = page.locator(".service-accordion");
  await expect(accordion.locator(".service-panel-index")).toHaveText(
    technologyIndices,
  );

  for (const panel of await accordion.locator(".service-panel").all()) {
    await expect(panel.locator(".service-panel-detail")).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(
      panel.getByRole("link", { name: "Learn more" }),
    ).toBeVisible();
  }
});
