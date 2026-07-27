import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const outputRoot = path.join(projectRoot, ".qa", "rebuild");
const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";

fs.mkdirSync(outputRoot, { recursive: true });

const canReachServer = async () => {
  try {
    const response = await fetch(baseUrl);
    return response.ok;
  } catch {
    return false;
  }
};

let serverProcess;
if (!(await canReachServer())) {
  serverProcess = spawn(
    process.execPath,
    [
      path.join(projectRoot, "node_modules", "next", "dist", "bin", "next"),
      "dev",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3100",
    ],
    {
      cwd: projectRoot,
      windowsHide: true,
      stdio: "ignore",
    },
  );

  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await canReachServer()) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  if (!(await canReachServer())) {
    serverProcess.kill();
    throw new Error("LedgerByte QA server did not become ready.");
  }
}

const browser = await chromium.launch({ channel: "msedge" });

const captureSet = async (name, viewport, routes) => {
  const context = await browser.newContext({
    viewport,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  for (const [label, route] of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      const height = document.documentElement.scrollHeight;
      for (let y = 0; y < height; y += Math.max(window.innerHeight, 600)) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: path.join(outputRoot, `${label}-${name}.png`),
      fullPage: true,
    });
  }

  await context.close();
};

try {
  await captureSet(
    "desktop",
    { width: 1440, height: 1000 },
    [
      ["home", "/"],
      ["finance", "/finance"],
      ["technology", "/technology"],
      ["finance-service", "/finance/services/accounting-bookkeeping"],
      ["technology-service", "/technology/services/web-development"],
      ["about", "/about"],
      ["contact", "/contact"],
    ],
  );

  await captureSet(
    "mobile",
    { width: 390, height: 844 },
    [
      ["home", "/"],
      ["finance", "/finance"],
      ["technology", "/technology"],
      ["contact", "/contact"],
    ],
  );
} finally {
  await browser.close();
  serverProcess?.kill();
}

console.log(`Captured LedgerByte QA screenshots in ${outputRoot}`);
