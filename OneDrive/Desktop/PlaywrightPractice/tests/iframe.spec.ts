import { test, expect } from '@playwright/test';

test('Handle iframe', async ({ page }) => {

  await page.goto('https://www.w3schools.com/html/html_iframe.asp');

  // Locate the iframe using title attribute
  const frame = page.frameLocator(
    'iframe[title="W3Schools HTML Tutorial"]'
  );

  // Verify text inside the iframe
  await expect(
    frame.getByText('HTML is the standard markup language for Web pages.')
  ).toBeVisible();

});