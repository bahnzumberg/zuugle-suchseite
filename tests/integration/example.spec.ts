import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Zuugle/);
});

test("search bar is visible", async ({ page }) => {
  await page.goto("/");

  // Wait for the app to load
  // The app seems to be rendered in #root
  await page.waitForSelector("#root");

  // Wait for the city input to be visible.
  // Using the specific class from the code again.
  const searchInput = page.locator(".search-bar-input");
  await expect(searchInput).toBeVisible();
});
