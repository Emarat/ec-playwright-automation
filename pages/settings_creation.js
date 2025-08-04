class SettingsCreationPage {
  constructor(page) {
    this.page = page;

    // Updated locators based on your sample code
    this.scheduleModuleLink = page
      .locator('div')
      .filter({ hasText: /^নির্বাচনী তফসিল ব্যবস্থাপনা$/ });
    this.nirbachonText = page.getByText('নির্বাচন', { exact: true });
    this.settingsLink = page.getByRole('link', { name: 'নির্বাচন সেটিংস' });
    this.createNewButton = page.getByRole('button', { name: 'নতুন সংযোজন' });

    // Form elements
    this.electionTypeDropdown = page.locator('.select-wrap').first();
    this.scheduleDropdown = page.locator(
      'div:nth-child(2) > .col-span-12.col-span-lg-6 > .position-relative > .select-wrap'
    );
    this.positionDropdown = page
      .locator('div')
      .filter({ hasText: /^নির্বাচন করুন$/ })
      .nth(2);

    // Settings checkboxes and buttons
    this.voterAreaDividedCheckbox = page.locator('#isVoterAreaDivided');
    this.addAllButton = page
      .locator('div')
      .filter({ hasText: /^সবগুলো যুক্ত করুন$/ })
      .getByRole('button');
    this.submitButton = page.getByRole('button', { name: 'দাখিল করুন' });
  }

  async navigateToSettingsCreationForm() {
    console.log('🔄 Navigating to settings creation form...');

    // Click on নির্বাচনী তফসিল ব্যবস্থাপনা
    await this.scheduleModuleLink.click();
    await this.page.waitForTimeout(2000);

    // Click on নির্বাচন
    await this.nirbachonText.click();
    await this.page.waitForTimeout(2000);

    // Click on নির্বাচন সেটিংস
    await this.settingsLink.click();
    await this.page.waitForTimeout(2000);

    // Click create new button
    await this.createNewButton.click();
    await this.page.waitForTimeout(3000);

    console.log('✅ Successfully navigated to settings creation form');
  }

  async selectElectionType(electionType) {
    console.log(`🎯 Selecting election type: ${electionType}`);

    // Click election type dropdown
    await this.electionTypeDropdown.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await this.electionTypeDropdown.click();
    await this.page.waitForTimeout(3000);

    // Wait for dropdown options to load
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });

    // Look for election type options using multiple strategies
    const selectors = [
      `div.select-menu-item:has-text("${electionType}")`,
      `div:has-text("${electionType}")`,
      `text="${electionType}"`,
      `div.select-menu-item`,
    ];

    let selected = false;

    for (const selector of selectors) {
      try {
        if (selector === 'div.select-menu-item') {
          // For the generic selector, we need to scan all options
          const options = this.page.locator(selector);
          const count = await options.count();
          console.log(`Found ${count} election type options`);

          for (let i = 0; i < count; i++) {
            const option = options.nth(i);
            const text = await option.textContent();
            const normalizedText = text?.trim().normalize() || '';
            const normalizedElectionType = electionType.normalize();

            console.log(`Option ${i + 1}: "${normalizedText}"`);

            if (normalizedText === normalizedElectionType) {
              console.log(
                `🎯 Found matching election type at position ${i + 1}`
              );
              await option.click();
              selected = true;
              break;
            }
          }
        } else {
          // Try direct selector
          const option = this.page.locator(selector).first();
          if (await option.isVisible({ timeout: 2000 })) {
            await option.click();
            selected = true;
            console.log(
              `✅ Selected election type using selector: ${selector}`
            );
            break;
          }
        }
      } catch (error) {
        console.log(`Failed with selector "${selector}": ${error.message}`);
        continue;
      }

      if (selected) break;
    }

    if (!selected) {
      throw new Error(`Could not select election type: ${electionType}`);
    }

    await this.page.waitForTimeout(2000);
  }

  async selectSchedule(scheduleName) {
    console.log(`📅 Selecting schedule: ${scheduleName}`);

    // Wait for schedule dropdown to be available
    await this.scheduleDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.scheduleDropdown.click();
    await this.page.waitForTimeout(3000);

    // Wait for options to load
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });

    // Get all schedule options
    const scheduleOptions = this.page.locator('div.select-menu-item');
    const optionCount = await scheduleOptions.count();
    console.log(`Found ${optionCount} schedule options`);

    let selected = false;

    for (let i = 0; i < optionCount; i++) {
      const option = scheduleOptions.nth(i);
      const optionText = await option.textContent();
      const trimmedText = optionText?.trim() || '';

      console.log(`Schedule option ${i + 1}: "${trimmedText}"`);

      // Check for exact match or partial match with schedule name pattern
      if (trimmedText === scheduleName || trimmedText.includes(scheduleName)) {
        console.log(`🎯 Found matching schedule: ${trimmedText}`);
        await option.click();
        selected = true;
        break;
      }
    }

    if (!selected) {
      console.log('⚠️ No exact match found, attempting pattern matching...');

      // Try pattern matching for schedules created today
      const today = new Date();
      const todayString = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      for (let i = 0; i < optionCount; i++) {
        const option = scheduleOptions.nth(i);
        const optionText = await option.textContent();
        const trimmedText = optionText?.trim() || '';

        if (
          trimmedText.includes(todayString) &&
          trimmedText.includes('টেস্ট')
        ) {
          console.log(`🎯 Found today's test schedule: ${trimmedText}`);
          await option.click();
          selected = true;
          break;
        }
      }
    }

    if (!selected) {
      throw new Error(`Could not find schedule matching: ${scheduleName}`);
    }

    console.log(`✅ Selected schedule successfully`);
    await this.page.waitForTimeout(2000);
  }

  async selectPosition(positionName) {
    console.log(`👤 Selecting position: ${positionName}`);

    // Wait for position dropdown to be available
    await this.positionDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.positionDropdown.click();
    await this.page.waitForTimeout(3000);

    // Wait for options to load
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });

    // Look for position options
    const positionOptions = this.page.locator('div.select-menu-item');
    const optionCount = await positionOptions.count();
    console.log(`Found ${optionCount} position options`);

    let selected = false;

    for (let i = 0; i < optionCount; i++) {
      const option = positionOptions.nth(i);
      const optionText = await option.textContent();
      const trimmedText = optionText?.trim() || '';

      console.log(`Position option ${i + 1}: "${trimmedText}"`);

      if (trimmedText === positionName) {
        console.log(`🎯 Found matching position: ${trimmedText}`);
        await option.click();
        selected = true;
        break;
      }
    }

    if (!selected) {
      // Fallback: try the first available position that's not "নির্বাচন করুন"
      for (let i = 0; i < optionCount; i++) {
        const option = positionOptions.nth(i);
        const optionText = await option.textContent();
        const trimmedText = optionText?.trim() || '';

        if (trimmedText !== 'নির্বাচন করুন' && trimmedText.length > 0) {
          console.log(`🎯 Using fallback position: ${trimmedText}`);
          await option.click();
          selected = true;
          break;
        }
      }
    }

    if (!selected) {
      throw new Error(`Could not select position: ${positionName}`);
    }

    console.log(`✅ Selected position successfully`);
    await this.page.waitForTimeout(2000);
  }

  async configureVoterAreas() {
    console.log('🗳️ Configuring voter areas...');

    // Check the voter area divided checkbox
    await this.voterAreaDividedCheckbox.check();
    await this.page.waitForTimeout(2000);

    // Select individual area checkboxes (based on your sample code)
    const areaCheckboxes = [
      '.p-0.px-6',
      'div:nth-child(2) > div > .d-flex.px-8 > .d-flex > .p-0',
      'div:nth-child(3) > div > .d-flex.px-8 > .d-flex > .p-0',
      'div:nth-child(4) > div > .d-flex.px-8 > .d-flex > .p-0',
      'div:nth-child(5) > div > .d-flex.px-8 > .d-flex > .p-0',
      'div:nth-child(6) > div > .d-flex.px-8 > .d-flex > .p-0',
      'div:nth-child(7) > div > .d-flex.px-8 > .d-flex > .p-0',
    ];

    // Click first area
    await this.page.locator(areaCheckboxes[0]).first().click();
    await this.page.waitForTimeout(1000);

    // Click other areas
    for (let i = 1; i < areaCheckboxes.length; i++) {
      try {
        await this.page.locator(areaCheckboxes[i]).click();
        await this.page.waitForTimeout(500);
      } catch (error) {
        console.log(
          `⚠️ Could not click area checkbox ${i + 1}: ${error.message}`
        );
      }
    }

    // Click "Add All" button
    await this.addAllButton.click();
    await this.page.waitForTimeout(2000);

    console.log('✅ Voter areas configured');
  }

  async submitForm() {
    console.log('📤 Submitting settings form...');

    // Take screenshot before submission
    await this.page.screenshot({
      path: 'test-artifacts/before-settings-submit.png',
    });

    await this.submitButton.click();
    await this.page.waitForTimeout(3000);

    // Take screenshot after submission
    await this.page.screenshot({
      path: 'test-artifacts/after-settings-submit.png',
    });

    console.log('✅ Settings form submitted');
  }

  async createSettingsForSchedule(
    electionType,
    scheduleName,
    positionName = 'মেয়র'
  ) {
    console.log(`🔧 Creating settings for schedule: ${scheduleName}`);

    try {
      // Navigate to form
      await this.navigateToSettingsCreationForm();

      // Select election type
      await this.selectElectionType(electionType);

      // Select schedule
      await this.selectSchedule(scheduleName);

      // Select position
      await this.selectPosition(positionName);

      // Configure voter areas
      await this.configureVoterAreas();

      // Submit form
      await this.submitForm();

      console.log('✅ Settings creation completed successfully!');
    } catch (error) {
      console.error('❌ Settings creation failed:', error.message);
      await this.page.screenshot({
        path: 'test-artifacts/settings-creation-error.png',
      });
      throw error;
    }
  }
}

module.exports = { SettingsCreationPage };
