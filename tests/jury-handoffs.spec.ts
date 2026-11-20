import { expect, test } from "@playwright/test";
import technologyServices from "../src/content/generated/technology-services.json";

test("technology quote links retain the service through the form and delivery fallback", async ({ page }) => {
  await page.goto("/technology/services/backend-apis");
  await page.getByRole("link", { name: "Get a Quote", exact: true }).click();
  await expect(page).toHaveURL(/division=technology&service=Backend(?:\+|%20)%26(?:\+|%20)APIs#enquiry-heading$/);
  await expect(page.getByRole("heading", { name: "Technology project enquiry" })).toBeVisible();
  const service = page.locator('select[name="service"]');
  await expect(service).toHaveValue("Backend & APIs");
  await expect(page.locator('.accounting-contact-intro a[href*="wa.me"]')).toHaveAttribute("href", /Backend%20%26%20APIs/);
  await expect(page.getByRole("link", { name: "Browse technology services" })).toHaveAttribute("href", "/technology");

  await service.selectOption("Cloud & DevOps");
  await expect(page.locator('.accounting-contact-intro a[href*="wa.me"]')).toHaveAttribute("href", /Cloud%20%26%20DevOps/);
  await page.getByLabel("Name", { exact: false }).first().fill("Audit visitor");
  await page.locator('input[name="email"]').fill("qa@example.invalid");
  await page.locator('input[name="location"]').fill("Dubai");
  await page.route("**/api/contact", (route) => route.fulfill({
    status: 503, contentType: "application/json",
    body: JSON.stringify({ message: "Email delivery is unavailable. Please email info@ledgerbyte.io or choose WhatsApp." }),
  }));
  await page.getByRole("button", { name: "Send enquiry" }).click();
  const recovery = page.getByRole("alert");
  await expect(recovery.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /Cloud%20%26%20DevOps/);
  await expect(recovery.getByRole("link", { name: "info@ledgerbyte.io" })).toHaveAttribute("href", /^mailto:/);
  await expect(service).toHaveValue("Cloud & DevOps");
});

test("the technology directory opens directly onto six illustrated service links", async ({ page }) => {
  await page.goto("/technology/services");
  const directory = page.getByRole("region", { name: "Technology services" });
  const services = directory.locator('a[href^="/technology/services/"]');
  await expect(services).toHaveCount(6);
  await expect(services.locator("img")).toHaveCount(6);
  const web = directory.getByRole("link", { name: "Web Development", exact: true });
  await expect(web).toBeInViewport();
  await web.click();
  await expect(page).toHaveURL(/\/technology\/services\/web-development$/);
});

test("the technology header and footer lead to the current service", async ({ page }) => {
  await page.goto("/technology/services/web-development");
  const target = "/contact?division=technology&service=Web+Development#enquiry-heading";
  await expect(page.locator(".accounting-header-cta")).toHaveAttribute("href", target);
  await expect(page.locator(".accounting-mobile-nav a").filter({hasText: "Get in touch"})).toHaveAttribute("href", target);
  await expect(page.locator("footer").getByRole("link", { name: /Get in touch/ })).toHaveAttribute("href", target);
  await expect(page.locator("footer").getByRole("link", { name: /Technology enquiries/ })).toHaveAttribute("href", target);
  await expect(page.getByRole("link", { name: "Try the finance team builder" })).toHaveAttribute("href", "/build-your-finance-department");
  await page.goto("/contact?service=UAE+VAT+support");
  await page.locator("select[name=service]").selectOption("Accounting & Bookkeeping");
  await expect(page.locator('.accounting-contact-intro a[href*="wa.me"]')).toHaveAttribute("href", /Accounting%20%26%20Bookkeeping/);
});

test("@nojs the service-specific header link and quote are available on a laptop", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/technology/services/web-development");
  const quote = page.getByRole("link", { name: "Get a Quote" });
  await expect(quote).toBeInViewport({ ratio: 1 });
  await page.locator(".accounting-header-cta").click();
  await expect(page.getByRole("heading", { name: "Technology project enquiry" })).toBeVisible();
  await expect(page.locator('.accounting-contact-intro a[href*="wa.me"]')).toHaveAttribute("href", /Web%20Development/);
});

test("the API recognizes every technology service on the browser origin", async ({ request, baseURL }) => {
  // The honeypot response exercises origin and schema checks without sending email.
  const origin = new URL(baseURL!).origin;
  const payload = { fullName: "Audit visitor", email: "qa@example.invalid", location: "Dubai", website: "dry-run", startedAt: Date.now() - 5000 };
  for (const service of [...technologyServices.map((item) => item.title), "Technology project"]) {
    const response = await request.post("/api/contact", { data: { ...payload, service }, headers: { Origin: origin } });
    expect(response.status(), service).toBe(202);
  }
  const wrongOrigin = await request.post("/api/contact", { data: { ...payload, service: "Technology project" }, headers: { Origin: "https://unrelated.example" } });
  expect(wrongOrigin.status()).toBe(403);
});

test("@nojs missing URLs return an HTML recovery page", async ({ page }) => {
  for (const path of ["/nonexistent-example", "/finance/services/nonexistent", "/technology/services/nonexistent", "/about/team/nonexistent", "/ar/nonexistent"]) {
    expect((await page.goto(path))?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  }
});
