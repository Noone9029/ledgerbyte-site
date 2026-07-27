import { expect, test } from "@playwright/test";

const cinematicRoutes = [
  "/",
  "/finance",
  "/technology",
  "/finance/services",
  "/technology/services",
  "/technology/process",
  "/technology/why-ledgerbyte",
  "/about",
  "/contact",
  "/finance/services/accounting-bookkeeping",
  "/technology/services/web-development",
] as const;

const cinematicHeroRoutes = [
  ["/", ".corporate-hero"],
  ["/finance", ".division-hero"],
  ["/technology", ".division-hero"],
  ["/finance/services", ".inner-hero"],
  ["/technology/services", ".inner-hero"],
  ["/technology/process", ".inner-hero"],
  ["/technology/why-ledgerbyte", ".inner-hero"],
  ["/about", ".inner-hero"],
  ["/contact", ".contact-hero"],
  ["/finance/services/accounting-bookkeeping", ".service-detail-hero"],
  ["/technology/services/web-development", ".service-detail-hero"],
] as const;

test("cinematic artwork keeps its complete 3:2 composition", async ({
  page,
}) => {
  test.setTimeout(90_000);

  for (const route of cinematicRoutes) {
    await page.goto(route, { waitUntil: "networkidle" });
    const frames = page.locator("[data-cinematic-media] .cinematic-media-frame");
    expect(await frames.count(), `${route} cinematic frame count`).toBeGreaterThan(0);

    for (let index = 0; index < (await frames.count()); index += 1) {
      const frame = frames.nth(index);
      await frame.scrollIntoViewIfNeeded();
      const image = frame.locator("img");
      await expect(image).toBeVisible();
      await expect
        .poll(() =>
          image.evaluate(
            (element) =>
              (element as HTMLImageElement).complete &&
              (element as HTMLImageElement).naturalWidth > 0,
          ),
        )
        .toBeTruthy();

      const geometry = await frame.evaluate((element) => {
        const image = element.querySelector("img") as HTMLImageElement;
        const box = element.getBoundingClientRect();
        const boxRatio = box.width / box.height;
        const sourceRatio = image.naturalWidth / image.naturalHeight;
        const visibleFraction =
          boxRatio < sourceRatio
            ? boxRatio / sourceRatio
            : sourceRatio / boxRatio;

        return {
          boxRatio,
          sourceRatio,
          visibleFraction,
          objectFit: getComputedStyle(image).objectFit,
          objectPosition: getComputedStyle(image).objectPosition,
        };
      });

      expect(geometry.boxRatio, `${route} frame ${index}`).toBeCloseTo(1.5, 2);
      expect(geometry.sourceRatio, `${route} source ${index}`).toBeCloseTo(
        1.5,
        2,
      );
      expect(geometry.visibleFraction, `${route} visible ${index}`).toBeGreaterThan(
        0.99,
      );
      expect(geometry.objectFit).toBe("cover");
      expect(geometry.objectPosition).toBe("50% 50%");
    }
  }
});

test("hero copy overlays artwork on larger screens and stacks safely on mobile", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const [route, heroSelector] of cinematicHeroRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const media = page.locator(
      `${heroSelector} [data-cinematic-media][data-mode="overlay"]`,
    );
    const copy = media.locator(".cinematic-media-copy");
    const copyContent = copy.locator(":scope > *");
    const frame = media.locator(".cinematic-media-frame");

    await expect(media, `${route} overlay media`).toHaveAttribute(
      "data-copy-side",
      "left",
    );
    await expect(copy, `${route} hero copy`).toBeVisible();
    await expect(frame, `${route} hero artwork`).toBeVisible();

    const geometry = await media.evaluate((element) => {
      const copy = element.querySelector(".cinematic-media-copy");
      const copyContent = copy?.firstElementChild;
      const frame = element.querySelector(".cinematic-media-frame");
      const copyBox = copy?.getBoundingClientRect();
      const contentBox = copyContent?.getBoundingClientRect();
      const frameBox = frame?.getBoundingClientRect();

      return {
        copyPosition: copy ? getComputedStyle(copy).position : "",
        textAlign: copy ? getComputedStyle(copy).textAlign : "",
        gradient: frame
          ? getComputedStyle(frame, "::after").backgroundImage
          : "none",
        separated:
          Boolean(copyBox && frameBox) &&
          (copyBox?.bottom ?? 0) <= (frameBox?.top ?? 0) + 1,
        overlaps:
          Boolean(copyBox && frameBox) &&
          (copyBox?.left ?? 0) < (frameBox?.right ?? 0) &&
          (copyBox?.right ?? 0) > (frameBox?.left ?? 0) &&
          (copyBox?.top ?? 0) < (frameBox?.bottom ?? 0) &&
          (copyBox?.bottom ?? 0) > (frameBox?.top ?? 0),
        contentFitsFrame:
          Boolean(contentBox && frameBox) &&
          (contentBox?.top ?? 0) >= (frameBox?.top ?? 0) - 1 &&
          (contentBox?.bottom ?? 0) <= (frameBox?.bottom ?? 0) + 1,
      };
    });

    expect(geometry.textAlign, `${route} alignment`).toBe("left");

    if ((page.viewportSize()?.width ?? 0) <= 820) {
      expect(geometry.copyPosition, `${route} mobile position`).toBe("static");
      expect(geometry.separated, `${route} mobile separation`).toBeTruthy();
    } else {
      expect(geometry.copyPosition, `${route} overlay position`).toBe(
        "absolute",
      );
      expect(geometry.overlaps, `${route} overlay intersection`).toBeTruthy();
      expect(geometry.gradient, `${route} readability gradient`).toContain(
        "linear-gradient",
      );
      expect(geometry.contentFitsFrame, `${route} copy bounds`).toBeTruthy();
    }

    await expect(copyContent, `${route} hero content`).toBeVisible();
  }
});

test("@reduced cinematic artwork has no motion transform", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contact");
  await expect(page.locator(".cinematic-media-image").first()).toHaveCSS(
    "transform",
    "none",
  );
});

test("@nojs cinematic artwork remains rendered without JavaScript", async ({
  page,
}) => {
  await page.goto("/technology/services/web-development", {
    waitUntil: "domcontentloaded",
  });
  const frames = page.locator(".cinematic-media-frame");
  expect(await frames.count()).toBeGreaterThanOrEqual(3);
  await expect(frames.first()).toBeVisible();
  await expect(frames.first().locator("img")).toBeVisible();
});
