import { expect, test } from "@playwright/test";

test.describe("Contract Intelligence Copilot — golden demo path", () => {
  test("landing page renders and links into the app", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("commercial intelligence");
    await expect(page.getByText("Independent portfolio demo")).toBeVisible();
    await page.getByRole("link", { name: /Enter the demo/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("dashboard shows real portfolio KPIs", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Total Contracts", { exact: false })).toBeVisible();
    await expect(page.getByText("Risk Distribution")).toBeVisible();
  });

  test("contracts list shows seeded contracts and links to detail", async ({ page }) => {
    await page.goto("/contracts");
    await expect(page.getByRole("link", { name: /CloudForge Systems/i }).first()).toBeVisible();
    await page.getByRole("link", { name: /CloudForge Systems/i }).first().click();
    await expect(page).toHaveURL(/\/contracts\/[^/]+$/);
    await expect(page.getByRole("heading", { name: "SaaS Subscription Agreement" })).toBeVisible();
  });

  test("contract detail page shows summary, risks, and obligations tabs", async ({ page }) => {
    await page.goto("/contracts");
    await page.getByRole("link", { name: /CloudForge Systems/i }).first().click();
    await expect(page.getByRole("button", { name: /^Overview$/ })).toBeVisible();

    await page.getByRole("button", { name: /Risks \(\d+\)/ }).click();
    await expect(page.getByRole("heading", { name: "Uncapped liability exposure" })).toBeVisible();

    await page.getByRole("button", { name: /Obligations \(\d+\)/ }).click();
    await expect(page.getByText(/overdue/i).first()).toBeVisible();
  });

  test("AI chat panel answers a question about the contract", async ({ page }) => {
    await page.goto("/contracts");
    await page.getByRole("link", { name: /CloudForge Systems/i }).first().click();
    const chatInput = page.locator('textarea, input[placeholder*="Ask" i]').last();
    await chatInput.fill("What are the risks?");
    await chatInput.press("Enter");
    await expect(page.getByText(/risk/i).last()).toBeVisible({ timeout: 15000 });
  });

  test("insights (BusinessIQ) page renders real charts", async ({ page }) => {
    await page.goto("/insights");
    await expect(page.getByRole("heading", { name: "BusinessIQ" })).toBeVisible();
    await expect(page.getByText("Value by Department")).toBeVisible();
  });

  test("search finds contracts by clause content", async ({ page }) => {
    await page.goto("/search?q=liability");
    await expect(page.getByText(/results for/i)).toBeVisible();
  });

  test("approvals queue lists pending steps", async ({ page }) => {
    await page.goto("/approvals");
    await expect(page.getByRole("heading", { name: "Approvals" })).toBeVisible();
  });

  test("upload page accepts pasted contract text and ingests it", async ({ page }) => {
    await page.goto("/upload");
    await page.getByRole("button", { name: /Paste text/i }).click();
    const textarea = page.locator("textarea").first();
    await textarea.fill(
      "SAMPLE AGREEMENT\n\nThis Agreement is entered into by and between Northwind Analytics, Inc. (\"Company\") and E2E Test Vendor LLC (\"Counterparty\") as of January 1, 2026 (the \"Effective Date\").\n\n1. LIMITATION OF LIABILITY\n\nCounterparty's liability shall not be limited in any respect.\n\n2. FEES AND PAYMENT\n\nCompany shall pay the fee invoice no later than March 1, 2026."
    );
    await page.getByLabel(/^Title/i).fill("E2E Playwright Test Contract");
    await page.getByLabel(/^Counterparty/i).fill("E2E Test Vendor LLC");
    await page.getByLabel(/^Owner name/i).fill("Test Runner");
    await page.getByLabel(/^Value/i).fill("50000");
    await page.locator('input[type="date"]').first().fill("2026-01-01");

    await page.getByRole("button", { name: /Ingest contract/i }).click();
    await expect(page).toHaveURL(/\/contracts\/[^/]+$/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: "E2E Playwright Test Contract" })).toBeVisible();
  });

  test("dark mode toggle switches theme", async ({ page }) => {
    await page.goto("/dashboard");
    const toggle = page.locator('button[aria-label="Toggle dark mode"]');
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
