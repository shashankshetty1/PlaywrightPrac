import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login', async ({ page }) => {

  // Create LoginPage object
  const loginPage = new LoginPage(page);

  // Open login page
  await loginPage.goto();

  // Login
  await loginPage.login('Admin', 'admin123');

  // Verify dashboard
  await expect(page).toHaveURL(
    'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index'
  );
});