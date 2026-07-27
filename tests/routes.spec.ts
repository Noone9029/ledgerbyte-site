import { expect, test } from "@playwright/test";
import financeServices from "../src/content/generated/finance-services.json";
import technologyServices from "../src/content/generated/technology-services.json";

const routes = [
  "/",
  "/finance",
  "/finance/services",
  ...financeServices.map((service) => `/finance/services/${service.slug}`),
  "/technology",
  "/technology/services",
  ...technologyServices.map(
    (service) => `/technology/services/${service.slug}`,
  ),
  "/technology/process",
  "/technology/why-ledgerbyte",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
];

test("all public routes render complete, overflow-free pages", async ({
  page,
}) => {
  test.setTimeout(90_000);

  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status(), route).toBeLessThan(400);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);

    await page.evaluate(async () => {
      const height = document.documentElement.scrollHeight;
      for (let y = 0; y < height; y += Math.max(window.innerHeight, 600)) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      window.scrollTo(0, 0);
    });
    const brokenImages = await page.locator("img").evaluateAll((images) =>
      images
        .filter(
          (image) =>
            image.complete &&
            image instanceof HTMLImageElement &&
            image.naturalWidth === 0,
        )
        .map((image) => image.getAttribute("src")),
    );
    expect(brokenImages, `${route} broken images`).toEqual([]);
  }

  expect(consoleErrors).toEqual([]);
});

test("hero headings stay within three rendered lines", async ({ page }) => {
  const heroRoutes = [
    "/",
    "/finance",
    "/technology",
    "/finance/services",
    "/technology/services",
    "/technology/process",
    "/technology/why-ledgerbyte",
    "/about",
    "/contact",
  ];

  for (const route of heroRoutes) {
    await page.goto(route);
    const lines = await page.locator("h1").evaluate((heading) => {
      const style = getComputedStyle(heading);
      const lineHeight = Number.parseFloat(style.lineHeight);
      return heading.getBoundingClientRect().height / lineHeight;
    });
    expect(lines, `${route} h1 line count`).toBeLessThanOrEqual(3.15);
  }
});

test("finance service suitability labels belong to their checklists", async ({
  page,
}) => {
  test.setTimeout(60_000);

  for (const service of financeServices) {
    await page.goto(`/finance/services/${service.slug}`, {
      waitUntil: "domcontentloaded",
    });

    const overview = page.locator(".service-overview");
    const title = overview.locator(".service-overview-title");
    const fitColumn = overview.locator(".ideal-fit-column");
    const fitList = fitColumn.locator(".ideal-fit-list");

    await expect(
      fitColumn.getByText("Ideal For", { exact: true }),
      `${service.slug} checklist label`,
    ).toHaveCount(1);
    await expect(
      title.getByText("Ideal For", { exact: true }),
      `${service.slug} title label`,
    ).toHaveCount(0);
    await expect(
      fitList.locator(":scope > p"),
      `${service.slug} suitability bullets`,
    ).toHaveCount(service.idealFor.length);
  }

  const overview = page.locator(".service-overview");
  const titleBox = await overview
    .locator(".service-overview-title")
    .boundingBox();
  const fitBox = await overview.locator(".ideal-fit-column").boundingBox();

  expect(titleBox).not.toBeNull();
  expect(fitBox).not.toBeNull();

  if ((page.viewportSize()?.width ?? 0) <= 820) {
    expect(fitBox?.top ?? 0).toBeGreaterThanOrEqual((titleBox?.bottom ?? 0) - 1);
  } else {
    expect(fitBox?.left ?? 0).toBeGreaterThanOrEqual((titleBox?.right ?? 0) - 1);
  }
});

test("rendered non-shared artwork is unique across public routes", async (
  { page },
  testInfo,
) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "The cross-route image audit only needs one viewport.",
  );
  test.setTimeout(90_000);

  const seen = new Map<string, string>();
  const duplicates: string[] = [];

  for (const route of routes) {
    await page.goto(route, { waitUntil: "networkidle" });
    const artworkPaths = await page.locator("main img").evaluateAll((images) =>
      images
        .filter(
          (image) =>
            !image.closest(
              ".corporate-hero, .division-hero, .inner-hero, .contact-hero, .consultation-cta",
            ),
        )
        .map((image) => {
          const source = new URL(
            (image as HTMLImageElement).currentSrc ||
              (image as HTMLImageElement).src,
            window.location.href,
          );
          return source.searchParams.get("url") ?? source.pathname;
        }),
    );

    for (const artworkPath of artworkPaths) {
      const firstRoute = seen.get(artworkPath);
      if (firstRoute) {
        duplicates.push(`${artworkPath}: ${firstRoute} and ${route}`);
      } else {
        seen.set(artworkPath, route);
      }
    }
  }

  expect(duplicates).toEqual([]);
  expect(seen.size).toBeGreaterThanOrEqual(26);
});

test("@nojs all public routes retain visible content", async ({ page }) => {
  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBeLessThan(400);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
    const textLength = await page.locator("main").innerText();
    expect(textLength.length, route).toBeGreaterThan(120);
  }
});

test("@reduced reduced motion produces stable final layouts", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBeTruthy();
  for (const route of ["/", "/finance", "/technology", "/about"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const stickyCards = await page.locator(".stack-card").evaluateAll((cards) =>
      cards.map((card) => getComputedStyle(card).position),
    );
    expect(stickyCards.every((position) => position !== "sticky")).toBeTruthy();
  }
});
