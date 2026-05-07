import { defineConfig } from "@playwright/test";

/**
 * Playwright config — local dev (no auth flows).
 * Dev server is expected to be running at http://localhost:3000.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    trace: "off",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1280, height: 720 } },
    },
    {
      name: "mobile",
      use: { viewport: { width: 375, height: 667 } },
    },
  ],
});
