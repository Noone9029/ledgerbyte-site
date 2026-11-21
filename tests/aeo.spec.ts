import { expect, test } from "@playwright/test";
import content from "../src/content/accounting.json";
import { team } from "../src/content";
import { buildPersonId, buildPersonPath } from "../src/lib/person-identity";
import { relatedInsights } from "../src/content/insight-guides";
import { seoPages } from "../src/content/seo";

function nodes(value: unknown, result: Record<string, unknown>[] = []) {
  if (Array.isArray(value)) {
    value.forEach((v) => nodes(v, result));
    return result;
  }
  if (value && typeof value === "object") {
    result.push(value as Record<string, unknown>);
    Object.values(value).forEach((v) => nodes(v, result));
  }
  return result;
}

test.describe("crawlable finance answers", () => {
  test.use({ javaScriptEnabled: false });

  test("finance hubs describe distinct tasks and scope in their initial HTML", async ({ page }) => {
    for (const path of ["/", "/finance", "/finance/services", "/insights", "/regions", "/build-your-finance-department"] as const) {
      await page.goto(path);
      await expect(page).toHaveTitle(seoPages[path].title);
      await expect(page.locator("meta[name=description]")).toHaveAttribute("content", seoPages[path].description);
      await expect(page.locator("main [data-aeo-answer]").first()).toBeVisible();
    }
    await expect(page.locator("main [data-aeo-answer]").first()).toContainText("15 hours");
    await page.goto("/finance");
    await expect(page.locator("main a[href='/build-your-finance-department']")).toBeVisible();
    for (const pathway of content.pages.home.pathways) {
      await expect(page.getByRole("link", { name: pathway.cta })).toHaveAttribute("href", content.paths[pathway.target.page_key as keyof typeof content.paths]);
    }
  });

  test("published Insights guides have contextual links from each matching market or service", async ({ page }) => {
    test.setTimeout(120000);
    for (const article of relatedInsights) {
      for (const pageKey of article.pages) {
        await page.goto(content.pages[pageKey as keyof typeof content.pages].path);
        const link = page.locator("main").getByRole("link", { name: article.title, exact: true });
        await expect(link).toBeAttached();
        expect(new URL((await link.getAttribute("href"))!).pathname).toBe("/" + article.slug);
      }
    }
  });

  test("UAE service searches lead to the right public scope and actual office", async ({ page }) => {
    for (const slug of ["fractional-cfo-advisory", "financial-reporting-mis", "accounting-automation-systems"] as const) {
      const path = `/finance/services/${slug}` as const;
      await page.goto(path);
      await expect(page).toHaveTitle(seoPages[path].title);
      await expect(page.locator("meta[name=description]")).toHaveAttribute("content", seoPages[path].description);
      await expect(page.locator("meta[name=description]")).toHaveAttribute("content", /Sharjah/);
      await expect(page.locator("main .accounting-related a[href='/regions/uae']")).toHaveCount(1);
    }
  });
});

test("AI discovery lists accounting services and finance contact details", async ({
  request,
}) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  const text = await response.text();
  for (const service of content.services) {
    expect(text).toContain(service.title);
    expect(text).toContain(
      "https://ledgerbyte.io/finance/services/" + service.slug,
    );
  }
  expect(text).toContain("[Contact](https://ledgerbyte.io/contact)");
  expect(text).not.toContain("division=technology");
  expect(text).not.toContain("https://ledgerbyte.co");
  expect(text).not.toContain("https://ledgerbyte.io/technology");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
});

test("service answers and FAQ schema match the supplied visible copy", async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const service of content.services) {
    const source = content.pages[service.key as keyof typeof content.pages];
    await page.goto(source.path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-aeo-answer] .accounting-lead")).toHaveText(
      source.intro,
    );
    const documents = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).map((t) => JSON.parse(t));
    const graph = nodes(documents);
    expect(
      graph.some((n) => n["@type"] === "Service" && n.name === service.title),
      service.title,
    ).toBe(true);
    const faq = graph.find((n) => n["@type"] === "FAQPage");
    const answers = await page.locator(".accounting-faq details p").allTextContents();
    expect(answers).toHaveLength(source.faqs.length);
    expect(faq?.mainEntity).toEqual(
      source.faqs.map((q, index) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: answers[index] },
      })),
    );
    for (const q of source.faqs)
      await expect(
        page.locator(".accounting-faq summary", { hasText: q.question }),
      ).toBeAttached();
    expect(JSON.stringify(documents)).not.toContain('"aggregateRating"');
  }
});

test("team profiles keep stable Person identities and corrected roles", async ({
  page,
}) => {
  for (const member of team) {
    const path = buildPersonPath(member.name);
    expect(
      (await page.goto(path, { waitUntil: "domcontentloaded" }))?.status(),
    ).toBe(200);
    await expect(page.locator("main h1")).toHaveText(member.name);
    const graph = nodes(
      (
        await page
          .locator('script[type="application/ld+json"]')
          .allTextContents()
      ).map((t) => JSON.parse(t)),
    );
    const person = graph.find(
      (n) => n["@type"] === "Person" && n["@id"] === buildPersonId(member.name),
    );
    expect(person?.jobTitle).toBe(member.role);
    expect(person?.url).toBe("https://ledgerbyte.io" + path);
  }
});
