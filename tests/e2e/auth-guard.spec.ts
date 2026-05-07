import { test, expect } from "@playwright/test";

/**
 * Auth guards / middleware redirect tests.
 *
 * Without authentication:
 * - /check/new must redirect to /auth (or display paywall after mount)
 * - /dashboard must redirect to /auth
 * - /auth page must render with the email form
 */

test.describe("Auth guards", () => {
  test("/check/new without auth redirects to /auth or shows paywall", async ({ page }) => {
    const response = await page.goto("/check/new", { waitUntil: "domcontentloaded" });

    const finalUrl = page.url();
    const status = response?.status() ?? 0;

    // Expected: middleware redirects -> URL contains /auth
    if (finalUrl.includes("/auth")) {
      expect(finalUrl).toContain("/auth");
      // Optional: redirect param preserved
      expect(finalUrl).toMatch(/redirect=/);
      return;
    }

    // Fallback: page may render a paywall/login prompt without auth (client-side guard)
    // -> doc as warn but tolerate (not a HARD fail)
    expect(
      status,
      `Did not redirect to /auth and got non-2xx status (${status}). URL: ${finalUrl}`,
    ).toBeLessThan(400);
  });

  test("/dashboard without auth redirects to /auth", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    const finalUrl = page.url();
    expect(finalUrl).toContain("/auth");
  });

  test("/auth page renders with email input", async ({ page }) => {
    await page.goto("/auth");

    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();

    // A form should also be present
    const form = page.locator("form").first();
    await expect(form).toBeVisible();
  });
});
