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

  test("a VAT buyer can reconcile the quoted return and download its workings", async ({ page, request }) => {
    await page.goto("/uae-vat");
    const offer = page.locator(".accounting-detail-hero aside");
    await expect(offer).toContainText("28 days after the tax period ends");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /^From AED 750 per return\./);
    await offer.getByRole("link", { name: /See a VAT reconciliation/ }).click();
    const working = page.locator("#sample-deliverable");
    await expect(working.getByRole("row", { name: /Simplified net VAT payable/ })).toContainText("2,500");
    const url = await working.getByRole("link", { name: /Download sample/ }).getAttribute("href");
    const download = await request.get(url!);
    expect(download.status()).toBe(200);
    expect(download.headers()["content-disposition"]).toContain("attachment");
    expect(await download.text()).toContain('"Simplified net VAT payable","—","2500"');
  });

  test("home tax links distinguish return support from the four UAE tax workstreams", async ({ page }) => {
    await page.goto("/");
    const vatOffer = page.locator("#offers section").filter({ has: page.getByRole("heading", { name: "VAT Return Support", exact: true }) });
    await vatOffer.locator("summary").click();
    await expect(vatOffer.getByRole("link", { name: /UAE VAT return preparation/ })).toHaveAttribute("href", "/uae-vat");

    const chooser = page.getByRole("link", { name: "UAE Tax & VAT", exact: true });
    await expect(chooser).toHaveAttribute("href", "/finance/services/tax-vat-compliance");
    await chooser.click();
    const section = page.locator(".accounting-prose section").filter({ has: page.getByRole("heading", { name: "Choose the workstream you need", exact: true }) });
    const destinations = {
      "VAT preparation and review support": "/uae-vat",
      "Corporate tax filing": "/finance/services/corporate-tax-filing",
      "VAT registration": "/finance/services/vat-registration",
      "Corporate tax registration": "/finance/services/corporate-tax-registration",
    };
    for (const [label, href] of Object.entries(destinations)) {
      await expect(section.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
    }
  });

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
