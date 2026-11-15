import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", testMatch: "seo-campaign.spec.ts", workers: 2, timeout: 60000,
  reporter: [["list"], ["json", { outputFile: ".qa/campaign-browser-results.json" }]],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4410", channel: "chrome", screenshot: "only-on-failure", trace: "retain-on-failure", storageState: { cookies: [{ name: "ledgerbyte-analytics-consent", value: "denied", domain: "127.0.0.1", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" }], origins: [] } },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "reduced", use: { viewport: { width: 1440, height: 1000 }, contextOptions: { reducedMotion: "reduce" } } },
    { name: "nojs", use: { viewport: { width: 1440, height: 1000 }, javaScriptEnabled: false } },
  ],
});
