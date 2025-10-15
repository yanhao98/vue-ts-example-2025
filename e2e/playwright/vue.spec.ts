import { test, expect } from '@playwright/test';

test.describe('Vue App', () => {
  test('app renders correctly', async ({ page }) => {
    await page.goto('/');

    const app = page.locator('#app');
    await expect(app).toBeVisible();

    await page.locator('.app-loading').waitFor({ state: 'detached' });
  });
});
