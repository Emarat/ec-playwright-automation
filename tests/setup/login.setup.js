import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { baseURL, validUser } from '../../config/testData';

test('Login test using POM and config', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage(baseURL);
  await loginPage.login(validUser.username, validUser.password);

  //store session
  await page.context().storageState({
    path: 'storage/loginAuth.json',
  });
});
