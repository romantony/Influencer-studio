import { test, expect } from '@playwright/test';

test('avatar library shows cards', async ({ page }) => {
  await page.goto('/app/avatars');
  await expect(page.getByRole('heading', { name: 'Avatars' })).toBeVisible();
  await expect(page.getByText('Generate AI avatars')).toBeVisible();
});
