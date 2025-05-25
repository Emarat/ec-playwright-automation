import { test, expect } from '@playwright/test';

test('login page', async ({ page }) => {
  await page.goto('http://192.168.1.125:30333/');
  await page.locator("//input[@id='username']").fill('admin_2');
  await page.locator("//input[@id='password']").fill('L3t35!96t');
  await page.locator("//input[@id='kc-login']").click();
});
