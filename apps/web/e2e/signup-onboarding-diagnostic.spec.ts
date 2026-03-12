import { test, expect } from "@playwright/test";

test.describe("Signup, onboarding, diagnostic flow", () => {
  test("user can sign up, complete onboarding, and see dashboard", async ({
    page,
  }) => {
    const email = `test-${Date.now()}@mindorbit.learn`;
    const password = "testpass123";

    await page.goto("/");
    await page.getByRole("link", { name: "Get Started" }).click();

    await expect(page).toHaveURL("/auth/signup");
    await page.getByPlaceholder("Your name").fill("Test Student");
    await page.getByPlaceholder("you@example.com").fill(email);
    await page.getByPlaceholder("At least 8 characters").fill(password);
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL("/onboarding");

    await page.getByRole("button", { name: "10" }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "Improve grades" }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: /Chemistry/ }).first().click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "Complete" }).click();

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("user can sign in with demo account", async ({ page }) => {
    await page.goto("/auth/signin");
    await page.getByPlaceholder("you@example.com").fill("demo@mindorbit.learn");
    await page.getByLabel("Password").fill("demo1234");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL("/dashboard");
  });
});
