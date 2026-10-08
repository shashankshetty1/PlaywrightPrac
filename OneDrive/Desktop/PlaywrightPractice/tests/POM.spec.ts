// import { test, expect } from '@playwright/test';

// test('Login test without POM', async ({ page }) => {

//     // Open website
//     await page.goto('https://www.demoblaze.com/index.html');

//     // Click Login
//     await page.locator('#login2').click();

//     // Enter username
//     await page.locator('#loginusername').fill('pavanol');

//     // Enter password
//     await page.locator('#loginpassword').fill('test@123');

//     // Click Login button
//     await page.locator('//button[normalize-space()="Log in"]').click();

// });

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Login test', async ({ page }) => {

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login('Admin', 'admin123');
    

});