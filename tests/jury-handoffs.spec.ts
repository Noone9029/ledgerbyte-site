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
