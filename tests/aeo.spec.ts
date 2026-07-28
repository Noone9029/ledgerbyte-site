import { expect, test } from "@playwright/test";
import { financeServices, team, technologyServices } from "../src/content";
import { buildPersonId, buildPersonPath } from "../src/lib/schema";

const indexNowKey =
  "97ca97ace89ec9975938643a29c54e5a118979431ab8718422d6a7bdf715d0b3";

function collectSchemaNodes(value: unknown, result: unknown[] = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSchemaNodes(item, result));
    return result;
  }

  if (!value || typeof value !== "object") return result;
  result.push(value);
  Object.values(value).forEach((child) => collectSchemaNodes(child, result));
  return result;
}

test.beforeEach(({}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "The complete AEO crawl runs once at the desktop viewport.",
  );
});

test("AI discovery files expose canonical services without blocking crawlers", async ({
  request,
}) => {
  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.status()).toBe(200);
  const robots = await robotsResponse.text();
  expect(robots).toContain("User-Agent: *");
  expect(robots).toContain("Allow: /");
  expect(robots.split(/\r?\n/)).not.toContain("Disallow: /");

  const llmsResponse = await request.get("/llms.txt");
  expect(llmsResponse.status()).toBe(200);
  expect(llmsResponse.headers()["content-type"]).toContain("text/plain");
  const llms = await llmsResponse.text();

  for (const service of [...financeServices, ...technologyServices]) {
    expect(llms).toContain(
      `https://ledgerbyte.io/${service.division}/services/${service.slug}`,
    );
  }

  const keyResponse = await request.get(`/${indexNowKey}.txt`);
  expect(keyResponse.status()).toBe(200);
  expect((await keyResponse.text()).trim()).toBe(indexNowKey);
});

test("finance services expose an answer-first passage and a linked reviewer", async ({
  page,
}) => {
  test.setTimeout(120_000);

  for (const service of financeServices) {
    await page.goto(`/finance/services/${service.slug}`, {
      waitUntil: "domcontentloaded",
    });

    const answer = page.locator("[data-aeo-answer]");
    await expect(answer).toHaveCount(1);
    await expect(answer.locator("h2")).toHaveText(service.faqs[0].question);
    await expect(answer.locator(":scope > p")).toHaveText(
      service.faqs[0].answer,
    );

    const reviewerPath = buildPersonPath(service.reviewer.name);
    await expect(
      page.locator(`.reviewer-band a[href="${reviewerPath}"]`),
    ).toHaveText(service.reviewer.name);

    const schemaDocuments = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).map((value) => JSON.parse(value) as unknown);
    const schema = JSON.stringify(schemaDocuments);
    expect(schema).toContain(buildPersonId(service.reviewer.name));
    expect(schema).toContain('"dateModified":"2026-07-28"');
  }
});

test("team profiles provide stable Person entities for authors and reviewers", async ({
  page,
}) => {
  test.setTimeout(120_000);

  for (const member of team) {
    const path = buildPersonPath(member.name);
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1")).toHaveText(member.name);

    const documents = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).map((value) => JSON.parse(value) as unknown);
    const nodes = collectSchemaNodes(documents) as Array<
      Record<string, unknown>
    >;
    const person = nodes.find(
      (node) =>
        node["@type"] === "Person" &&
        node["@id"] === buildPersonId(member.name),
    );
    const profile = nodes.find(
      (node) =>
        node["@type"] === "ProfilePage" &&
        node["@id"] === `https://ledgerbyte.io${path}#webpage`,
    );

    expect(person?.["@type"], `${path} Person`).toBe("Person");
    expect(person?.url, `${path} Person URL`).toBe(
      `https://ledgerbyte.io${path}`,
    );
    expect(profile?.mainEntity, `${path} Profile mainEntity`).toEqual({
      "@id": buildPersonId(member.name),
    });
  }
});

test("AI referrals are classified once without storing the referring path", async ({
  page,
}) => {
  const events: unknown[][] = [];
  await page.exposeFunction("recordAeoAnalytics", (...args: unknown[]) => {
    events.push(args);
  });
  await page.addInitScript(() => {
    const analyticsWindow = window as typeof window & {
      recordAeoAnalytics: (...args: unknown[]) => void;
    };
    window.gtag = (...args) => analyticsWindow.recordAeoAnalytics(...args);
  });

  await page.goto("/", {
    referer: "https://chatgpt.com/c/private-conversation-id",
  });

  await expect
    .poll(() =>
      events.filter(
        (event) =>
          event[0] === "event" && event[1] === "ai_referral_session",
      ),
    )
    .toHaveLength(1);

  await page.goto("/finance");
  expect(
    events.filter(
      (event) =>
        event[0] === "event" && event[1] === "ai_referral_session",
    ),
  ).toHaveLength(1);

  const serialized = JSON.stringify(events);
  expect(serialized).toContain('"ai_source":"chatgpt"');
  expect(serialized).toContain('"referral_host":"chatgpt.com"');
  expect(serialized).toContain('"landing_page":"/"');
  expect(serialized).not.toContain("private-conversation-id");
});
