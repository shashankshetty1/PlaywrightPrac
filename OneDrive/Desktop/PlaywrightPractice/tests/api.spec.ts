import { test, expect } from '@playwright/test';

test('Get Users API', async ({ request }) => {

  // Send GET request
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/users/1'
  );

  // Check status
  expect(response.ok()).toBeTruthy();

  // Get response body as JSON
  const data = await response.json();

  // Print response in terminal
  console.log(data);

});


test('Create User API', async ({ request }) => {   //npx playwright test -g "Create User API"

  // Send POST request
  const response = await request.post(
    'https://jsonplaceholder.typicode.com/posts',
    {
      data: {
        title: 'My Test',
        body: 'This is a Playwright API test',
        userId: 1
      }
    }
  );

  // Check response status
  expect(response.ok()).toBeTruthy();

  // Get response body
  const data = await response.json();

  // Print response
  console.log(data);

  // Validate response
  expect(data.title).toBe('My Test');
  expect(data.body).toBe('This is a Playwright API test');
  expect(data.userId).toBe(1);

});


