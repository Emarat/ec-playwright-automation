const { test, expect } = require('@playwright/test');
const { baseURL } = require('../config/environmentConfig');
const { SettingsCreationPage } = require('../pages/settings_creation.js');
const environmentConfig = require('../config/environmentConfig');

test.use({ storageState: 'storage/loginAuth.json' });

// Helper function to generate expected schedule name based on current date
function generateExpectedScheduleName() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  // Get election type from environment config
  const electionType = environmentConfig.electionType || 'জাতীয় সংসদ নির্বাচন';

  // Generate the expected schedule name format that matches schedule creation
  const expectedScheduleName = `${electionType} টেস্ট ${year}-${month}-${day}`;

  return {
    electionType,
    scheduleName: expectedScheduleName,
  };
}

test('Create Settings for Recently Created Schedule', async ({ page }) => {
  test.setTimeout(90000); // Extended timeout for complex form interactions

  try {
    console.log(
      '🚀 Starting settings creation for recently created schedule...'
    );

    // Navigate to the application
    console.log(`Navigating to: ${baseURL}`);
    await page.goto(baseURL, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Generate expected data based on current date and config
    const { electionType, scheduleName } = generateExpectedScheduleName();
    console.log(`📋 Expected Election Type: ${electionType}`);
    console.log(`📅 Expected Schedule Name Pattern: ${scheduleName}`);

    // Initialize settings page
    const settingsPage = new SettingsCreationPage(page);

    // Create settings for the schedule
    // Note: We'll use a pattern match since the exact time might vary
    const schedulePattern = scheduleName.substring(0, scheduleName.length - 6); // Remove time part for pattern matching

    // Determine position based on election type
    let positionName = 'মেয়র'; // Default
    if (electionType.includes('জাতীয় সংসদ')) {
      positionName = 'সদস্য'; // For national parliament
    } else if (electionType.includes('সিটি কর্পোরেশন')) {
      positionName = 'মেয়র';
    } else if (electionType.includes('পৌরসভা')) {
      positionName = 'মেয়র';
    } else if (electionType.includes('উপজেলা')) {
      positionName = 'চেয়ারম্যান';
    } else if (electionType.includes('ইউনিয়ন')) {
      positionName = 'চেয়ারম্যান';
    }

    console.log(
      `👤 Using position: ${positionName} for election type: ${electionType}`
    );

    // Navigate to settings form
    await settingsPage.navigateToSettingsCreationForm();

    // Select election type
    await settingsPage.selectElectionType(electionType);

    // For schedule selection, we'll need to find the most recent schedule
    // Let's click the dropdown and look for schedules containing our pattern
    console.log('📅 Looking for recently created schedule...');
    await settingsPage.scheduleDropdown.click();
    await page.waitForTimeout(3000);

    // Look for schedule options and find the most recent one
    const scheduleOptions = page.locator('div.select-menu-item');
    const optionCount = await scheduleOptions.count();
    console.log(`Found ${optionCount} schedule options`);

    let selectedSchedule = false;
    for (let i = 0; i < optionCount; i++) {
      const option = scheduleOptions.nth(i);
      const optionText = await option.textContent();
      const trimmedText = optionText?.trim() || '';

      console.log(`Schedule option ${i + 1}: "${trimmedText}"`);

      // Look for schedules that match our election type and today's date
      if (
        trimmedText.includes(electionType) &&
        trimmedText.includes(
          `${new Date().getFullYear()}-${String(
            new Date().getMonth() + 1
          ).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
        )
      ) {
        console.log(`🎯 Found matching schedule: ${trimmedText}`);
        await option.click();
        selectedSchedule = true;
        break;
      }
    }

    if (!selectedSchedule) {
      // Fallback: select the last option (most recent)
      console.log(
        '⚠️ No exact match found, selecting the last option as most recent'
      );
      const lastOption = scheduleOptions.last();
      const lastOptionText = await lastOption.textContent();
      console.log(`📅 Selecting last schedule: ${lastOptionText}`);
      await lastOption.click();
    }

    await page.waitForTimeout(2000);

    // Select position
    await settingsPage.selectPosition(positionName);

    // Configure voter areas
    await settingsPage.configureVoterAreas();

    // Submit the form
    await settingsPage.submitForm();

    console.log('✅ Settings creation completed successfully!');

    // Verify submission (optional)
    await page.waitForTimeout(3000);
  } catch (error) {
    console.error('❌ Settings creation test failed:', error.message);
    await page.screenshot({ path: 'test-artifacts/settings-test-error.png' });
    throw error;
  }
});

// Alternative test that uses a specific schedule name if known
test('Create Settings with Specific Schedule Name', async ({ page }) => {
  test.setTimeout(90000);

  // Skip this test by default, enable when you have a specific schedule name
  test.skip(
    true,
    'Enable this test when you have a specific schedule name to target'
  );

  const settingsPage = new SettingsCreationPage(page);
  const specificScheduleName = 'সিটি কর্পোরেশন নির্বাচন টেস্ট 2025-08-04 18:28'; // Your example

  await page.goto(baseURL);
  await page.waitForTimeout(3000);

  await settingsPage.createSettingsForSchedule(
    'সিটি কর্পোরেশন নির্বাচন',
    specificScheduleName,
    'মেয়র'
  );
});
