import { test, expect } from "@playwright/test";

/**
 * Landing page E2E tests.
 *
 * Scope:
 * - H1 visible & contains FR or EN copy
 * - Navbar elements (logo, ThemeToggle, LanguageToggle, UserMenu)
 * - Footer i18n links
 * - Theme toggle behavior (dark <-> light class on <html>)
 * - Language toggle behavior (FR <-> EN, h1 changes)
 * - Mobile responsive (no horizontal overflow)
 */

test.describe("Landing page", () => {
  test("landing renders with H1 and auth link", async ({ page }) => {
    await page.goto("/");

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();

    const text = (await h1.textContent())?.trim() ?? "";
    const isFr = /authentifiez/i.test(text);
    const isEn = /authenticate/i.test(text);
    expect(isFr || isEn, `H1 should match FR or EN copy, got: "${text}"`).toBeTruthy();

    // At least one link to /auth?redirect=...
    const authLink = page.locator('a[href^="/auth?redirect="]').first();
    await expect(authLink).toBeVisible();
  });

  test("navbar has logo, theme toggle, language toggle", async ({ page }) => {
    await page.goto("/");

    // Logo image
    const logo = page.locator('img[src*="legitvision-logo"]').first();
    await expect(logo).toBeVisible();

    // ThemeToggle: button with aria-label containing "mode"
    const themeBtn = page.locator('button[aria-label*="mode"]').first();
    await expect(themeBtn).toBeVisible();
    await expect(themeBtn).toHaveClass(/size-9/);

    // LanguageToggle: button with aria-label "Switch to EN" or "Switch to FR"
    const langBtn = page.locator('button[aria-label^="Switch to"]').first();
    await expect(langBtn).toBeVisible();
    const label = (await langBtn.textContent())?.trim() ?? "";
    expect(["FR", "EN"]).toContain(label);
  });

  test("footer has 3 i18n legal links", async ({ page }) => {
    await page.goto("/");

    // Each link must be present at least once and visible somewhere on the page
    const legalLink = page.locator('a[href="/mentions-legales"]').first();
    const cguLink = page.locator('a[href="/cgu"]').first();
    const privacyLink = page.locator('a[href="/confidentialite"]').first();

    // Scroll to bottom so the footer is in viewport
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(legalLink).toBeVisible();
    await expect(cguLink).toBeVisible();
    await expect(privacyLink).toBeVisible();
  });

  test("theme toggle switches dark <-> light", async ({ page }) => {
    await page.goto("/");

    // Initial state: html should have either "dark" or "light" class (set by inline script)
    const initial = await page.evaluate(() => {
      const cl = document.documentElement.classList;
      if (cl.contains("dark")) return "dark";
      if (cl.contains("light")) return "light";
      return "none";
    });
    expect(["dark", "light"]).toContain(initial);

    const themeBtn = page.locator('button[aria-label*="mode"]').first();
    await themeBtn.click();

    // After click — opposite class
    const afterFirst = await page.evaluate(() => {
      const cl = document.documentElement.classList;
      return cl.contains("light") ? "light" : cl.contains("dark") ? "dark" : "none";
    });
    expect(afterFirst).not.toBe(initial);
    expect(["dark", "light"]).toContain(afterFirst);

    // Click again — back to initial
    await themeBtn.click();
    const afterSecond = await page.evaluate(() => {
      const cl = document.documentElement.classList;
      return cl.contains("light") ? "light" : cl.contains("dark") ? "dark" : "none";
    });
    expect(afterSecond).toBe(initial);
  });

  test("language toggle switches FR <-> EN and updates H1", async ({ page }) => {
    await page.goto("/");

    const langBtn = page.locator('button[aria-label^="Switch to"]').first();
    const initialLabel = (await langBtn.textContent())?.trim();
    expect(["FR", "EN"]).toContain(initialLabel);

    const initialH1 = (await page.locator("h1").first().textContent())?.trim() ?? "";

    await langBtn.click();

    // After click, label flips
    await expect(langBtn).not.toHaveText(initialLabel ?? "");
    const newLabel = (await langBtn.textContent())?.trim();
    expect(["FR", "EN"]).toContain(newLabel);
    expect(newLabel).not.toBe(initialLabel);

    // H1 text should also have changed (FR <-> EN)
    const newH1 = (await page.locator("h1").first().textContent())?.trim() ?? "";
    expect(newH1).not.toBe(initialH1);
  });

  test("mobile responsive — no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Logo still visible
    const logo = page.locator('img[src*="legitvision-logo"]').first();
    await expect(logo).toBeVisible();

    // No horizontal overflow on document
    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      };
    });
    expect(
      overflow.scrollWidth,
      `documentElement.scrollWidth (${overflow.scrollWidth}) should be <= window.innerWidth (${overflow.innerWidth})`,
    ).toBeLessThanOrEqual(overflow.innerWidth + 1); // +1 px tolerance
  });
});
