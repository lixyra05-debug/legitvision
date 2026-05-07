import { test } from "@playwright/test";

/**
 * Reference screenshots — captures key pages/states for visual review.
 * Run only on the "desktop" project to avoid duplicates.
 */
test.describe("Reference screenshots", () => {
  test("landing-dark", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop only");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "tests/e2e/screenshots/landing-dark-desktop.png",
      fullPage: true,
    });
  });

  test("landing-light", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop only");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const themeBtn = page.locator('button[aria-label*="mode"]').first();
    await themeBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: "tests/e2e/screenshots/landing-light-desktop.png",
      fullPage: true,
    });
  });

  test("landing-mobile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile only");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "tests/e2e/screenshots/landing-mobile-375.png",
      fullPage: true,
    });
  });

  test("auth-page", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop only");
    await page.goto("/auth");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "tests/e2e/screenshots/auth-page-desktop.png",
      fullPage: true,
    });
  });
});
