import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const representativeRoutes = [
  "/",
  "/finance",
  "/finance/services/accounting-bookkeeping",
  "/technology",
  "/technology/services/web-development",
  "/technology/process",
  "/about",
  "/about/team/haider-ali",
  "/contact",
  "/privacy-policy",
];

test("representative routes have no serious accessibility violations", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("ledgerbyte-theme", "dark");
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of representativeRoutes) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(
      (violation) =>
        violation.impact === "critical" || violation.impact === "serious",
    );
    expect(serious, route).toEqual([]);
  }
});

test("light theme has no serious accessibility violations", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("ledgerbyte-theme", "light");
  });
  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "reduce",
  });

  for (const route of [
    "/",
    "/finance/services/accounting-bookkeeping",
    "/technology/services/web-development",
    "/about",
    "/contact",
  ]) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(
      (violation) =>
        violation.impact === "critical" || violation.impact === "serious",
    );
    expect(serious, route).toEqual([]);
  }
});
