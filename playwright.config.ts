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
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: 4,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    channel: "msedge",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    env: {
      CONTACT_EMAIL_DISABLED: "true",
      SEO_INDEXABLE: process.env.SEO_INDEXABLE ?? "true",
      VERCEL_ENV: process.env.VERCEL_ENV ?? "",
    },
    url: "http://127.0.0.1:3100",
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
