import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testMatch: ["seo.spec.ts", "aeo.spec.ts", "preview-seo.spec.ts"],
  projects: base.projects?.filter((project) => project.name === "desktop-1440"),
  workers: 1,
  outputDir: ".qa/discovery-results",
  reporter: "list",
});
