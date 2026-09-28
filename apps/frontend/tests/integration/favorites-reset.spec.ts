import { test, expect, Page } from "@playwright/test";

/**
 * The reset in the sync dialog is the way off a shared list, so what matters is
 * that it takes real effect on the device: the key and the cached tour ids both
 * have to be gone afterwards.
 */

const SEEDED_KEY = "seeded-test-key";
const SEEDED_TOUR_IDS = [101, 102, 103];
const SEEDED_IDS_JSON = JSON.stringify(SEEDED_TOUR_IDS);

/**
 * Serves the seeded list, because a real server has never heard of its key and
 * would 404. useFavorites reads that 404 as "this list is gone for good" and
 * quietly rebuilds: it creates a new list, stores the new key, and — since the
 * new list comes back empty — drops the cached tour ids. localStorage then
 * holds a key that isn't SEEDED_KEY and no ids at all, which is precisely the
 * state the reset is supposed to produce, so the cancel test fails and the
 * confirm test passes without the reset having done anything.
 *
 * Answering the calls keeps the device on its seeded list, leaving the reset as
 * the only thing that can change what the assertions read back.
 */
const stubFavoritesApi = async (page: Page) => {
  await page.route("**/api/lists/*", (route) =>
    route.fulfill({
      json: {
        success: true,
        list: { key: SEEDED_KEY, name: "Test", language: "de", tld: "at" },
        tours: SEEDED_TOUR_IDS.map((id) => ({ id })),
        total: SEEDED_TOUR_IDS.length,
        moved_to: null,
      },
    }),
  );
  // The dialog asks for a code as soon as it opens; without this it would show
  // its "could not get a code" state, which is not the dialog under test here.
  await page.route("**/api/lists/*/pairing-code", (route) =>
    route.fulfill({
      json: {
        success: true,
        code: "WXYZ5678",
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        moved_to: null,
      },
    }),
  );
};

/** Opens the sync dialog on a device that already holds a list. */
const openDialogWithSeededList = async (page: Page) => {
  await stubFavoritesApi(page);
  await page.addInitScript(
    ({ key, ids }) => {
      localStorage.setItem("zuugle_cookie_consent", "essential_only");
      localStorage.setItem("favoritesListKey", key);
      localStorage.setItem("favoriteTourIds", ids);
      // The dialog is asserted in German, so pin the language the detector reads.
      localStorage.setItem("i18nextLng", "de");
      localStorage.setItem("visited", "true");
    },
    { key: SEEDED_KEY, ids: SEEDED_IDS_JSON },
  );

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
      ids: SEEDED_IDS_JSON,
    });
  });
});
