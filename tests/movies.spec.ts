import { test, expect } from '@playwright/test';

test.describe('Filmlista', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/test/reset');
    await page.goto('/');
  });

  test('visar att listan är tom från början', async ({ page }) => {
    await expect(page.getByText('Inga filmer ännu')).toBeVisible();
    await expect(page.getByText('Antal filmer: 0')).toBeVisible();
  });
});
