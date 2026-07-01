import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE = "http://localhost:3100";
const outDir = "/tmp/claude-0/-home-user-Anything/acf79ab3-5e70-5263-9d67-a6b48a13613f/scratchpad/screenshots-v2";
fs.mkdirSync(outDir, { recursive: true });

const consoleErrors = [];
const pageErrors = [];

const executablePath = fs.existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(`[${page.url()}] ${msg.text()}`);
});
page.on("pageerror", (err) => pageErrors.push(`[${page.url()}] ${err.message}`));

async function shot(name) {
  await page.screenshot({ path: `${outDir}/${name}.png` });
  console.log(`  screenshot: ${name}.png`);
}

async function step(label, fn) {
  console.log(`\n== ${label} ==`);
  try {
    await fn();
    console.log(`  OK`);
  } catch (e) {
    console.log(`  FAIL: ${e.message}`);
  }
}

async function visit(path, name, waitText) {
  await step(`${path}`, async () => {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    if (waitText) await page.waitForSelector(`text=${waitText}`, { timeout: 10000 });
    await shot(name);
  });
}

await visit("/", "01-landing");
await visit("/dashboard", "02-dashboard");
await visit("/risk-radar", "03-risk-radar");
await visit("/revenue-leakage", "04-revenue-leakage");
await visit("/clause-drift", "05-clause-drift");
await visit("/copilot", "06-copilot");
await visit("/demo", "07-demo");
await visit("/report", "08-report");
await visit("/settings", "09-settings");
await visit("/contracts", "10-contracts");
await visit("/approvals", "11-approvals");
await visit("/upload", "12-upload");
await visit("/search?q=liability", "13-search");
await visit("/insights", "14-insights-redirect");

await step("contract detail (Horizon Retail Group MSA amendment)", async () => {
  await page.goto(`${BASE}/contracts`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.getByRole("link", { name: /Horizon Retail Group/i }).first().click();
  await page.waitForTimeout(900);
  await shot("15-contract-detail");
});

await step("copilot ask a question via quick prompt", async () => {
  await page.goto(`${BASE}/copilot`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.getByText("Which contracts create the most revenue leakage?").click();
  await page.waitForTimeout(300);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1500);
  await shot("16-copilot-answer");
});

await step("command palette (Cmd+K)", async () => {
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.keyboard.press("Meta+K");
  await page.waitForTimeout(500);
  await shot("17-command-palette");
  await page.keyboard.press("Escape");
});

await step("dark mode", async () => {
  await page.goto(`${BASE}/revenue-leakage`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.locator('button[aria-label="Toggle dark mode"]').click();
  await page.waitForTimeout(500);
  await shot("18-revenue-leakage-dark");
});

await step("mobile viewport", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await shot("19-dashboard-mobile");
});

await browser.close();

console.log("\n\n=== CONSOLE ERRORS ===");
console.log(consoleErrors.length ? consoleErrors.join("\n") : "(none)");
console.log("\n=== PAGE ERRORS ===");
console.log(pageErrors.length ? pageErrors.join("\n") : "(none)");
console.log(`\nScreenshots saved to: ${outDir}`);
