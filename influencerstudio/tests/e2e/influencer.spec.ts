import { test, expect } from '@playwright/test';

test('marketing page CTA navigates to sign in', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Start creating' }).click();
  await expect(page).toHaveURL(/\/signin/);
  await expect(page.getByRole('heading', { name: 'Sign in to InfluencerStudio' })).toBeVisible();
});
