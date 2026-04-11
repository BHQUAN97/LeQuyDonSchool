import { defineConfig, devices } from '@playwright/test';

/**
 * E2E test config — LeQuyDon School CMS
 * Frontend: Next.js 14 on port 3200
 * Backend: NestJS on port 4000
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'html' : 'list',
  timeout: 30_000,

  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14'] },
    },
  ],

  // Dev server tu dong khi chay local
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        port: 3200,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
