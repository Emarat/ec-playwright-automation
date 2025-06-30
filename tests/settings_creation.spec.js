const { test } = require('@playwright/test');
const { baseURL } = require('../config/testData');
const { SettingsCreationPage } = require('../pages/settings_creation.js');

test('Settings Creation', async ({ page }) => {
  await page.goto(baseURL);

  const settingsPage = new SettingsCreationPage(page);

  // Navigate to the settings creation form
  await settingsPage.navigateToSettingsCreationForm();

  // Fill in the election details
  await settingsPage.fillElectionDetails('জাতীয় সংসদ নির্বাচন', 'test');

  // Select the location
  await settingsPage.selectLocation('ঢাকা', 'ঢাকা');

  // Submit the form
  // await settingsPage.submitForm();
});
