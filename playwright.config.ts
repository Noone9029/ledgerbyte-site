import { defineConfig } from "@playwright/test";

const interactiveProjects = [
  {
    name: "desktop-1440",
    grepInvert: /@(nojs|reduced)/,
    use: { viewport: { width: 1440, height: 1000 } },
  },
  {
    name: "tablet-1024",
    grepInvert: /@(nojs|reduced)/,
    use: { viewport: { width: 1024, height: 768 } },
  },
  {
    name: "mobile-390",
    grepInvert: /@(nojs|reduced)/,
    use: {
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    },
  },
];

export default defineConfig({
  testDir: "./tests",
  // The November suite replaces assertions tied to the previous split-site design.
  testMatch: ["accounting.spec.ts", "audit-regressions.spec.ts", "scroll-reveals.spec.ts", "service-flashcards.spec.ts"],
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: 4,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4300",
    storageState: { cookies: [{ name: "ledgerbyte-analytics-consent", value: "denied", domain: "127.0.0.1", path: "/", expires: -1, httpOnly: false, secure: false, sameSite: "Lax" }], origins: [] },
    channel: process.platform === "win32" ? "chrome" : undefined,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: "npm run start -- --hostname 127.0.0.1 --port 4300",
    env: {
      CONTACT_EMAIL_DISABLED: "true",
      SEO_INDEXABLE: "false",
      VERCEL_ENV: "preview",
    },
    url: "http://127.0.0.1:4300",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    ...interactiveProjects,
    {
      name: "reduced-motion",
      grep: /@reduced/,
      use: {
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "javascript-disabled",
      grep: /@nojs/,
      use: {
        viewport: { width: 1440, height: 1000 },
        javaScriptEnabled: false,
      },
    },
  ],
});
