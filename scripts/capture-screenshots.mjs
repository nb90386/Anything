import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:3100";
const outDir = path.join(process.cwd(), "public", "screenshots");
fs.mkdirSync(outDir, { recursive: true });

const executablePath = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

async function shot(url, name, wait = 900) {
  await page.goto(`${BASE}${url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(wait);
  await page.screenshot({ path: path.join(outDir, `${name}.png`) });
  console.log(`saved ${name}.png`);
}

await shot("/", "01-landing");
await shot("/dashboard", "02-dashboard");
await shot("/contracts", "03-contracts-list");

await page.goto(`${BASE}/contracts`, { waitUntil: "networkidle" });
await page.getByRole("link", { name: /CloudForge Systems/i }).first().click();
await page.waitForTimeout(900);
await page.screenshot({ path: path.join(outDir, "04-contract-detail.png") });
console.log("saved 04-contract-detail.png");

await page.getByRole("button", { name: /Risks/ }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(outDir, "05-risk-findings.png") });
console.log("saved 05-risk-findings.png");

await shot("/insights", "06-businessiq");
await shot("/approvals", "07-approvals");

await browser.close();
console.log(`\nAll screenshots saved to ${outDir}`);
