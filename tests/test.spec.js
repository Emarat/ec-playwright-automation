import { test, expect } from '@playwright/test';
import { baseURL } from '../config/testData';

// use previously saved login session
// test.use({ storageState: 'storage/loginAuth.json' });

test('Redirect Schedule Module', async ({ page }) => {
  await page.goto(baseURL);
  await page
    .locator(
      "div[class='d-grid grid-cols-2 grid-cols-md-3 gap-12 justify-content-center align-items-center'] div:nth-child(1)"
    )
    .click();
});
