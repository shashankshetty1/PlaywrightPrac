function greet() {
    console.log("Hello!");
}

function sayHello(callback) {
    callback();
}

sayHello(greet);

// import { test } from '@playwright/test';

// test('Callback example', async ({ page }) => {

//     page.on('dialog', dialog => {
//         console.log(dialog.message());
//         dialog.accept();
//     });

//     await page.goto('https://example.com');
// });