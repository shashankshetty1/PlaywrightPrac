import { test, expect } from '@playwright/test';

test('Handle Alert Dialog', async ({ page }) => {

  // Open a page
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  // Listen for the dialog
  page.on('dialog', async dialog => {
    console.log(dialog.message()); // Print alert message
    await dialog.accept();         // Click OK
  });

  // Click the button that opens the alert
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();

});


// also exaple  for the Call back function for the alert dialog