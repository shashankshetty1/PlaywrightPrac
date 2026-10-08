import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {

  test.beforeAll(async () => {
    console.log('Before all tests');
  });

  test.beforeEach(async ({ page }) => {
    console.log('Before each test');
    await page.goto('https://example.com');
  });

  test('Test 1', async ({ page }) => {
    console.log('Running Test 1');
  });

  test('Test 2', async ({ page }) => {
    console.log('Running Test 2');
  });

  test.afterEach(async ({ page }) => {
    console.log('After each test');
  });

  test.afterAll(async () => {
    console.log('After all tests');
  });

});