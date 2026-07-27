import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const playwrightCli = require.resolve("@playwright/test/cli");
const result = spawnSync(
  process.execPath,
  [
    playwrightCli,
    "test",
    "tests/preview-seo.spec.ts",
    "--project=desktop-1440",
  ],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      SEO_EXPECT_PREVIEW: "true",
      SEO_INDEXABLE: "false",
      VERCEL_ENV: "preview",
    },
    stdio: "inherit",
  },
);

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
