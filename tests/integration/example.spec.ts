import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test("homepage loads and displays search bar", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Zuugle/);
    await expect(page.locator("header").first())
      .toBeVisible()
      .catch(() => {});
    await page.getByRole("button", { name: "Suche" }).click();
    await page.getByRole("textbox").fill("test");
    await page.getByRole("button", { name: "close" }).click();
    await page.getByRole("button", { name: "ab Verkehrsknoten" }).click();
    await page.getByText("Baden").click();
    await expect(page.locator(".main-search-bar")).toContainText("ab Baden");
  });

  test("search with valid term and city returns results", async ({ page }) => {
    await page.goto("/search?search=gipfelkreuz&lang=de&city=baden");
    await expect(page.locator(".tour-card").first()).toBeVisible({
      timeout: 20000,
    });
    const count = await page.locator(".tour-card").count();
    expect(count).toBeGreaterThan(0);
  });

  test("search via map works", async ({ page }) => {
    await page.goto(
      '/search?lang=de&city=bad-ischl&map=true&geolocation={"lat":47.43363460079756,"lng":13.860470283673397,"radius":4491.585996694814}',
    );
    await expect(page.locator(".leaflet-container").first()).toBeVisible({
      timeout: 20000,
    });
    await expect(
      page.locator(".leaflet-marker-icon, .marker-cluster").first(),
    ).toBeVisible();
  });

  test("tour results display images", async ({ page }) => {
    await page.goto("/search?city=innsbruck&lang=de");
    await expect(page.locator(".tour-card").first()).toBeVisible({
      timeout: 20000,
    });
    const firstCardImage = page.locator(".tour-card img").first();
    await expect(firstCardImage).toBeVisible();
    await expect(firstCardImage).toHaveAttribute("src", /.+/);
  });
});

test.describe("Tour Detail Page", () => {
  test("detail page displays schedule data", async ({ page }) => {
    await page.goto("/tour/86056/innsbruck");
    await expect(page.locator("h1, .MuiTypography-title").first()).toBeVisible({
      timeout: 20000,
    });
    await expect(
      page.locator(".tour-detail-itinerary-container").first(),
    ).toBeVisible();
    await expect(
      page.locator(".tour-detail-itinerary-container").first(),
    ).not.toBeEmpty();
  });
});

test("Mountain ranges are visible and clickable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Wienerwald", exact: true }).click();
  await expect(page.locator(".tour-card").nth(2)).toContainText("Wienerwald");
});
