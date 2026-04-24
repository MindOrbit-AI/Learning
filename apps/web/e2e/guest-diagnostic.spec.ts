import { test, expect } from "@playwright/test";

test.describe("Guest marketing diagnostic", () => {
  test("visitor can run diagnostic without signing in", async ({ page }) => {
    await page.goto("/try-diagnostic/chemistry");
    await page.getByRole("link", { name: /Start diagnostic/i }).click();

    await expect(page).toHaveURL(/try-diagnostic\/chemistry\/run/);
    await expect(page.getByText(/Question 1 of/)).toBeVisible({ timeout: 15000 });

    for (let i = 0; i < 20; i++) {
      const submit = page.getByRole("button", { name: "Submit" });
      const nextBtn = page.getByRole("button", { name: "Next" });

      const answerArea = page.locator('[class*="space-y-2"]').first();
      const answerBtns = answerArea.locator("button");
      if ((await answerBtns.count()) > 0) {
        await answerBtns.first().click();
      } else {
        const tfArea = page.locator('[class*="flex gap-4"]');
        const tfBtn = tfArea.getByRole("button").first();
        if (await tfBtn.isVisible()) await tfBtn.click();
      }

      if (await submit.isVisible() && !(await submit.isDisabled())) {
        await submit.click();
        break;
      }
      if (await nextBtn.isVisible()) await nextBtn.click();
      else break;
    }

    await expect(page).toHaveURL(/try-diagnostic\/chemistry\/results/);
    await expect(page.getByText(/Diagnostic complete/)).toBeVisible();
  });
});
