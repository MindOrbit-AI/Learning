import { test, expect } from "@playwright/test";

test.describe("Diagnostic run flow", () => {
  test("user can start diagnostic and answer questions through to results", async ({
    page,
  }) => {
    await page.goto("/auth/signin");
    await page.getByPlaceholder("you@example.com").fill("demo@mindorbit.learn");
    await page.getByLabel("Password").fill("demo1234");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL("/dashboard");

    await page.goto("/subjects/chemistry");
    await page.getByRole("link", { name: /Start 5-min Diagnostic/i }).click();

    await expect(page).toHaveURL(/diagnostics\/chemistry/);
    await page.getByRole("link", { name: /Start diagnostic/i }).click();

    await expect(page).toHaveURL(/diagnostics\/chemistry\/run/);
    await expect(page.getByText(/Question 1 of/)).toBeVisible({ timeout: 10000 });

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

    await expect(page).toHaveURL(/diagnostics\/chemistry\/results/);
  });
});
