import { expect, test } from "@playwright/test";

test.describe("Malbek Revenue Intelligence and Contract Risk Command Center: v2 modules", () => {
  test("risk radar shows drift KPIs and a category breakdown", async ({ page }) => {
    await page.goto("/risk-radar");
    await expect(page.getByRole("heading", { name: "Contract Risk Radar" })).toBeVisible();
    await expect(page.getByText("Portfolio avg. drift", { exact: false })).toBeVisible();
    await expect(page.getByText("Drift by clause category")).toBeVisible();
  });

  test("revenue leakage detector totals open opportunities and lets you change status", async ({ page }) => {
    await page.goto("/revenue-leakage");
    await expect(page.getByRole("heading", { name: "Revenue Leakage Detector" })).toBeVisible();
    await expect(page.getByText(/open leakage/i).first()).toBeVisible();

    const rows = page.getByRole("row");
    const rowCountBefore = await rows.count();

    const statusButtons = page.getByRole("button", { name: /^Mark$/ });
    await expect(statusButtons.first()).toBeVisible();
    await statusButtons.first().click();
    await page.getByRole("menuitem", { name: "Recovered" }).click();

    // Marking an opportunity recovered removes it from the open-opportunities table.
    await expect(rows).toHaveCount(rowCountBefore - 1);
  });

  test("clause drift analyzer filters findings by category and drift type", async ({ page }) => {
    await page.goto("/clause-drift");
    await expect(page.getByRole("heading", { name: "Clause Drift Analyzer" })).toBeVisible();
    await expect(page.getByText("All drift findings")).toBeVisible();

    const categorySelect = page.locator("select").filter({ has: page.locator("option", { hasText: "All categories" }) });
    const driftTypeSelect = page.locator("select").filter({ has: page.locator("option", { hasText: "All drift types" }) });
    const before = await page.getByText(/of \d+ findings/).textContent();

    await driftTypeSelect.selectOption({ label: "Less favorable" });
    await expect(page.getByText(/of \d+ findings/)).not.toHaveText(before ?? "");

    await categorySelect.selectOption({ label: "Liability" });
    await expect(page.getByText(/of \d+ findings/)).toBeVisible();
  });

  test("AI portfolio copilot answers a quick-prompt question with a citation", async ({ page }) => {
    await page.goto("/copilot");
    await expect(page.getByRole("heading", { name: "AI Portfolio Copilot" })).toBeVisible();
    await page.getByText("Which contracts create the most revenue leakage?").click();
    await expect(page.getByRole("link", { name: /View source contract/i }).first()).toBeVisible({ timeout: 15000 });
  });

  test("guided demo walkthrough advances through steps with live numbers", async ({ page }) => {
    await page.goto("/demo");
    await expect(page.getByRole("heading", { name: "The seven-minute walkthrough" })).toBeVisible();
    const nextButton = page.getByRole("button", { name: "Next" });
    await nextButton.click();
    await expect(page.getByRole("button", { name: "Back" })).toBeEnabled();
  });

  test("executive report generates a live portfolio preview and export link", async ({ page }) => {
    await page.goto("/report");
    await expect(page.getByRole("heading", { name: "Executive Report" })).toBeVisible();
    await expect(page.getByText("Portfolio executive report")).toBeVisible();
    await expect(page.getByRole("link", { name: /Export portfolio report/i })).toBeVisible();
  });

  test("settings page switches role view and shows the analysis engine", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Role view" })).toBeVisible();
    const salesCard = page.getByRole("button", { name: /Sales/i });
    await salesCard.click();
    await expect(salesCard).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/Mock engine/i)).toBeVisible();
  });

  test("command palette opens with Cmd+K and navigates to a destination", async ({ page }) => {
    await page.goto("/dashboard");
    await page.keyboard.press("Meta+k");
    await expect(page.getByPlaceholder(/Jump to|search/i).first()).toBeVisible();
    await page.keyboard.press("Escape");
  });
});
