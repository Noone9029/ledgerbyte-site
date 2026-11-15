import { expect, test } from "@playwright/test";
import content from "../src/content/accounting.json";
import { team } from "../src/content";
import { buildPersonId, buildPersonPath } from "../src/lib/person-identity";

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

test("AI discovery lists all accounting services and keeps technology external", async ({
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
  expect(text).toContain("https://ledgerbyte.co");
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
    expect(faq?.mainEntity).toEqual(
      source.faqs.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
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
