import { test, expect } from '@playwright/test';

test('successful login1', async ({ page }) => {

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.waitForLoadState('domcontentloaded');


  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');

  await page.locator("button[type='submit']").click();

  await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

  await expect(page).toHaveTitle('OrangeHRM');

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();


});