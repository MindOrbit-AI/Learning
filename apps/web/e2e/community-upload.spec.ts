import { test, expect } from "@playwright/test";

test.describe("Community upload flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/signin");
    await page.getByPlaceholder("you@example.com").fill("demo@mindorbit.learn");
    await page.getByLabel("Password").fill("demo1234");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test("user can navigate to upload and see form", async ({ page }) => {
    await page.goto("/community");
    await page.getByRole("link", { name: "Upload" }).click();

    await expect(page).toHaveURL("/community/upload");
    await expect(page.getByText("Upload Resource")).toBeVisible();
    await expect(page.getByPlaceholder("Resource title")).toBeVisible();
  });
});
