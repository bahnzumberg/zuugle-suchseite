import { test, expect, Page } from "@playwright/test";

/**
 * The reset in the sync dialog is the way off a shared list, so what matters is
 * that it takes real effect on the device: the key and the cached tour ids both
 * have to be gone afterwards. Everything here is client-side, so the assertions
 * hold regardless of what the favorites API answers.
 */

const SEEDED_KEY = "seeded-test-key";

/** Opens the sync dialog on a device that already holds a list. */
const openDialogWithSeededList = async (page: Page) => {
  await page.addInitScript((key) => {
    localStorage.setItem("zuugle_cookie_consent", "essential_only");
    localStorage.setItem("favoritesListKey", key);
    localStorage.setItem("favoriteTourIds", "[101,102,103]");
    // The dialog is asserted in German, so pin the language the detector reads.
    localStorage.setItem("i18nextLng", "de");
    localStorage.setItem("visited", "true");
  }, SEEDED_KEY);

  // /sync/:code is the QR target — it opens the dialog and hands over to search.
  await page.goto("/sync/ABCD1234");
  await expect(
    page.getByRole("heading", { name: /Favoriten mit einem anderen Gerät/i }),
  ).toBeVisible({ timeout: 20000 });
};

const resetTrigger = (page: Page) =>
  page.getByRole("button", { name: "Favoriten auf diesem Gerät zurücksetzen" });

const storedFavorites = (page: Page) =>
  page.evaluate(() => ({
    key: localStorage.getItem("favoritesListKey"),
    ids: localStorage.getItem("favoriteTourIds"),
  }));

test.describe("Reset favorites on this device", () => {
  test("confirming clears the list key and the cached tours", async ({
    page,
  }) => {
    await openDialogWithSeededList(page);

    await resetTrigger(page).click();
    await page
      .getByRole("button", { name: "Zurücksetzen", exact: true })
      .click();

    await expect(
      page.getByRole("heading", { name: /Favoriten mit einem anderen Gerät/i }),
    ).toHaveCount(0);
    await expect(
      page.getByText("Die Favoriten auf diesem Gerät wurden zurückgesetzt."),
    ).toBeVisible();
    // Both keys removed, which is the state a first-time visitor is in.
    expect(await storedFavorites(page)).toEqual({ key: null, ids: null });
  });

  test("cancelling leaves the device on its list", async ({ page }) => {
    await openDialogWithSeededList(page);

    await resetTrigger(page).click();
    await page.getByRole("button", { name: "Abbrechen" }).click();

    await expect(resetTrigger(page)).toBeVisible();
    expect(await storedFavorites(page)).toEqual({
      key: SEEDED_KEY,
      ids: "[101,102,103]",
    });
  });

  test("the confirm step fits a phone-width dialog", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openDialogWithSeededList(page);

    await resetTrigger(page).click();
    const confirm = page.getByRole("button", {
      name: "Zurücksetzen",
      exact: true,
    });
    await expect(confirm).toBeVisible();
    // Buttons wrap rather than overflow the dialog at this width.
    const dialog = page.getByRole("dialog");
    const [button, box] = await Promise.all([
      confirm.boundingBox(),
      dialog.boundingBox(),
    ]);
    expect(button!.x).toBeGreaterThanOrEqual(box!.x);
    expect(button!.x + button!.width).toBeLessThanOrEqual(box!.x + box!.width);
  });
});
