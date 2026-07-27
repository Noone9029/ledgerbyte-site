import { expect, test } from "@playwright/test";

test("preview deployments are blocked from indexing", async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    process.env.SEO_EXPECT_PREVIEW !== "true" ||
      testInfo.project.name !== "desktop-1440",
    "Runs only through npm run test:seo:preview.",
  );

  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  expect(response?.headers()["x-robots-tag"]).toBe(
    "noindex, nofollow, noarchive",
  );
  const robotsMeta =
    (await page.locator('meta[name="robots"]').getAttribute("content")) ?? "";
  expect(robotsMeta).toContain("noindex");
  expect(robotsMeta).toContain("nofollow");

  const robotsResponse = await request.get("/robots.txt");
  const robots = await robotsResponse.text();
  expect(robots).toContain("Disallow: /");
  expect(robots).not.toContain("Sitemap:");
});
