import { test, expect } from '@playwright/test';

test('sidan laddas och visar rubriken Filmlista', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Filmlista' })).toBeVisible();
});
