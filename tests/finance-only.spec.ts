import { expect, test } from "@playwright/test";

const retiredServices = [
  ["web-development", "Web Development"],
  ["mobile-app-development", "Mobile App Development"],
  ["backend-apis", "Backend & APIs"],
  ["ai-automation", "AI & Automation"],
  ["cloud-devops", "Cloud & DevOps"],
  ["ui-ux-design", "UI/UX Design"],
];
const retiredTitles = [
  ...retiredServices.map(([, title]) => title),
  "Technology project",
];
const retiredPaths = [
  "/technology",
  "/technology/services",
  "/technology/process",
  "/technology/why-ledgerbyte",
  "/process",
  "/why-ledgerbyte-tech",
  ...retiredServices.flatMap(([slug]) => ["/technology/services/" + slug, "/services/" + slug]),
];

test("retired offers are absent from discovery and return a direct 404", async ({ request }) => {
  for (const path of retiredPaths) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(404);
  }
  for (const path of ["/sitemap.xml", "/llms.txt"]) {
    const response = await request.get(path);
    expect(response.ok(), path).toBe(true);
    const body = await response.text();
    expect(body, path).toContain("/finance/services/accounting-bookkeeping");
    expect(body, path).toContain("/finance/services/accounting-automation-systems");
    expect(body, path).not.toMatch(/\/technology|division=technology|tech\.ledgerbyte\.io|ledgerbyte\.co\b/i);
  }
});

test("retired domain and service aliases do not expose finance or technology pages", async ({ request }) => {
  for (const path of ["/", "/services", "/contact", "/sitemap.xml"]) {
    const response = await request.get(path, { headers: { Host: "tech.ledgerbyte.io" }, maxRedirects: 0 });
    expect(response.status(), path).toBe(404);
    const html = await response.text();
    expect(html).toContain('href="https://ledgerbyte.io/"');
    expect(html).toContain('href="https://ledgerbyte.io/finance/services"');
  }
  for (const path of ["/technology/services/", "/services/web-development/", "/technology/services/ai-automation/"]) {
    const response = await request.get(path, { headers: { Host: "www.ledgerbyte.io" }, maxRedirects: 0 });
    expect(response.status(), path).toBe(404);
  }
});

test("accounting automation leads from the finance directory to a scoped enquiry", async ({ page }) => {
  await page.goto("/finance/services");
  await page.getByRole("searchbox").fill("accounting automation");
  await page.locator(".accounting-service-results").getByRole("link", { name: "Accounting Automation & Systems", exact: true }).click();
  await expect(page).toHaveURL(/\/finance\/services\/accounting-automation-systems$/);
  const discuss = page.locator("main").getByRole("link", { name: "Discuss your accounting setup", exact: true }).first();
  await expect(discuss).toHaveAttribute("href", /^https:\/\/wa\.me\/971561371569\?text=.*Accounting%20Automation%20%26%20Systems/);
});

test("old technology enquiry links show only finance choices and contact channels", async ({ page }) => {
  await page.goto("/contact?division=technology&service=Backend+%26+APIs#enquiry-heading");
  const service = page.getByLabel("Support you need");
  await expect(service).toHaveValue("");
  const options = await service.locator("option").allTextContents();
  for (const title of retiredTitles) expect(options).not.toContain(title);
  const whatsapp = page.locator('.accounting-contact-intro a[href*="wa.me"]');
  expect(decodeURIComponent(await whatsapp.getAttribute("href") ?? "")).not.toMatch(/technology|backend/i);
  await service.selectOption("Accounting & Bookkeeping");
  await expect(whatsapp).toHaveAttribute("href", /Accounting%20%26%20Bookkeeping/);

  await page.locator('[name="fullName"]').fill("Audit visitor");
  await page.locator('[name="email"]').fill("qa@example.invalid");
  await page.locator('[name="location"]').fill("Dubai");
  await page.route("**/api/contact", (route) => route.fulfill({
    status: 503, contentType: "application/json",
    body: JSON.stringify({ message: "Email delivery is unavailable. Please email info@ledgerbyte.io or choose WhatsApp." }),
  }));
  await page.getByRole("button", { name: "Send enquiry" }).click();
  const recovery = page.getByRole("alert");
  await expect(recovery.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /Accounting%20%26%20Bookkeeping/);
  await expect(recovery.getByRole("link", { name: "info@ledgerbyte.io" })).toHaveAttribute("href", /^mailto:/);
});

test("the enquiry endpoint rejects retired services and accepts finance choices", async ({ request, baseURL }) => {
  const headers = { Origin: new URL(baseURL!).origin };
  // The honeypot short-circuits a valid payload before email delivery.
  const payload = { fullName: "Audit visitor", email: "qa@example.invalid", location: "Dubai", website: "dry-run", startedAt: Date.now() - 5000 };
  for (const service of retiredTitles) {
    const response = await request.post("/api/contact", { headers, data: { ...payload, service } });
    expect(response.status(), service).toBe(400);
  }
  const data = { ...payload, service: "Accounting Automation & Systems" };
  expect((await request.post("/api/contact", { headers, data })).status()).toBe(202);
  expect((await request.post("/api/contact", { headers: { Origin: "https://unrelated.example" }, data })).status()).toBe(403);
});

test("@nojs missing and retired URLs return an HTML recovery page", async ({ page }) => {
  for (const path of ["/nonexistent-example", "/finance/services/nonexistent", "/technology", "/technology/services/web-development", "/about/team/nonexistent", "/ar/nonexistent"]) {
    expect((await page.goto(path))?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  }
});
