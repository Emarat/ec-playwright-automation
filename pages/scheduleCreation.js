const { expect } = require('@playwright/test');

class ScheduleCreationPage {
  constructor(page) {
    this.page = page;
    this.electionNameEnInput = this.page.locator('input[name="nameEn"]');
    this.nominationScrutinyEndDateInput = this.page.locator(
      'input[name="dateOfNominationSelectionEnd"]'
    );
    this.nominationScrutinyEndTimeInput = this.page.locator(
      'input[name="timeOfNominationSelectionEnd"]'
    );
    this.votingScheduleInput = this.page.locator(
      'input[name="voteCastingSchedule"]'
    );
    this.page = page;
    this.scheduleModuleLink = this.page.locator(
      'text="নির্বাচনী তফসিল ব্যবস্থাপনা"'
    );
    this.newAdditionButton = this.page.getByRole('button', {
      name: 'নতুন সংযোজন',
    });

    // Form fields
    this.electionTypeDropdown = this.page.locator(
      'div.select-wrap:has-text("নির্বাচন করুন")'
    );
    this.electionNameInput = this.page.locator('input[name="nameBn"]');
    this.electionAreaDropdown = this.page.locator(
      '//label[text()="নির্বাচনী এলাকা"]/following-sibling::div//div[@class="select-wrap d-flex align-items-center flex-wrap pointer select-wrap-md"]'
    );
    this.electionDateInput = this.page.locator(
      'input[name="dateOfDeclaration"]'
    );
    this.nominationSubmissionDateInput = this.page.locator(
      'input[name="dateOfNominationSubmission"]'
    );
    this.nominationSubmissionTimeInput = this.page.locator(
      'input[name="timeOfNominationSubmission"]'
    );
    this.nominationScrutinyDateInput = this.page.locator(
      'input[name="dateOfNominationSelectionStart"]'
    );
    this.nominationScrutinyTimeInput = this.page.locator(
      'input[name="timeOfNominationSelectionStart"]'
    );
    this.appealSubmissionDateInput = this.page.locator(
      'input[name="dateOfAppealSubmission"]'
    );
    this.appealSubmissionTimeInput = this.page.locator(
      'input[name="timeOfAppealSubmission"]'
    );
    this.appealDisposalDateInput = this.page.locator(
      'input[name="dateOfAppealJudgement"]'
    );
    this.appealDisposalTimeInput = this.page.locator(
      'input[name="timeOfAppealJudgement"]'
    );
    this.withdrawalDateInput = this.page.locator(
      'input[name="dateOfNominationWithdrawal"]'
    );
    this.withdrawalTimeInput = this.page.locator(
      'input[name="timeOfNominationWithdrawal"]'
    );
    this.symbolAllotmentDateInput = this.page.locator(
      'input[name="dateOfAssignedSymbol"]'
    );
    this.symbolAllotmentTimeInput = this.page.locator(
      'input[name="timeOfAssignedSymbol"]'
    );
    this.votingDateInput = this.page.locator('input[name="dateOfElection"]');
    this.votingTimeInput = this.page.locator(
      'input[name="voteCastingStartTime"]'
    );
    this.gazettePublicationDateInput = this.page.locator(
      'input[name="dateOfGazette"]'
    );
    this.gazettePublicationTimeInput = this.page.locator(
      'input[name="timeOfGazette"]'
    );
    this.fileUploadInput = this.page.locator('input[type="file"]');
    // Additional required fields
    this.onlineNominationActive = this.page.getByText('সচল');
    this.scheduleComment = this.page.locator('textarea');

    // Navigation buttons
    this.nextTabButton = this.page.getByRole('button', {
      name: 'পরবর্তী ট্যাব',
    });
    this.submitButton = this.page.getByRole('button', { name: 'দাখিল করুন' });

    // Age details fields
    this.minAgeInput = this.page.locator(
      '//label[text()="সর্বনিম্ন বয়স"]/following-sibling::input'
    );
    this.ageCalculationDateDropdown = this.page.locator(
      '//label[text()="যে তারিখ পর্যন্ত বয়স গণনা করা হবে"]/following-sibling::div//select'
    );
  }

  async navigateToScheduleModule() {
    try {
      // Wait for page to load completely
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000);

      // Based on your generated code, try the SVG element first
      const svgPath = this.page.locator('g > path').first();
      if (await svgPath.isVisible({ timeout: 5000 })) {
        await svgPath.click();
        console.log('Clicked SVG path element');
      } else {
        // Try multiple approaches to find the schedule module link
        const scheduleSelectors = [
          'text="নির্বাচনী তফসিল ব্যবস্থাপনা"',
          'a:has-text("নির্বাচনী তফসিল")',
          'div:has-text("নির্বাচনী তফসিল ব্যবস্থাপনা")',
          '[href*="schedule"]',
          'li:has-text("তফসিল")',
          '.menu-item:has-text("তফসিল")',
        ];

        let linkClicked = false;
        for (const selector of scheduleSelectors) {
          try {
            const link = this.page.locator(selector).first();
            if (await link.isVisible({ timeout: 3000 })) {
              await link.click();
              linkClicked = true;
              console.log(`Clicked element with selector: ${selector}`);
              break;
            }
          } catch (e) {
            continue;
          }
        }

        if (!linkClicked) {
          // Take a screenshot for debugging
          await this.page.screenshot({
            path: 'test-artifacts/navigation-debug.png',
          });
          throw new Error('Could not find schedule module link');
        }
      }

      // Wait for navigation and new addition button to appear
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
      await this.page.waitForTimeout(2000);
      await this.newAdditionButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });
    } catch (e) {
      console.error('Failed to navigate to schedule module:', e.message);
      // Take a screenshot for debugging
      await this.page.screenshot({
        path: 'test-artifacts/navigation-error.png',
      });
      throw e;
    }
  }
  // ...existing code...
  async clickNewAdditionButton() {
    try {
      // Wait for the button to be visible and enabled
      await this.newAdditionButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      // Scroll into view if needed
      await this.newAdditionButton.scrollIntoViewIfNeeded();

      // Click the button
      await this.newAdditionButton.click({ force: true });

      // Wait for the form to load
      await this.page.waitForTimeout(2000);
      await this.page.waitForLoadState('domcontentloaded');

      // Wait for election type dropdown to be visible
      await this.electionTypeDropdown.waitFor({
        state: 'visible',
        timeout: 10000,
      });
    } catch (e) {
      console.error('Failed to click new addition button:', e.message);
      throw e;
    }
  }

  async selectElectionType(electionType) {
    try {
      console.log(`🎯 Attempting to select election type: "${electionType}"`);

      // Wait for the dropdown to be visible and clickable
      await this.electionTypeDropdown.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      // Take screenshot before clicking dropdown for debugging
      await this.page.screenshot({
        path: 'test-artifacts/before-dropdown-click.png',
      });

      await this.electionTypeDropdown.click({ force: true });
      console.log('✓ Clicked election type dropdown');

      // Wait for dropdown options to appear and load completely
      await this.page.waitForTimeout(3000);

      // Take screenshot after dropdown opens
      await this.page.screenshot({
        path: 'test-artifacts/dropdown-opened.png',
      });

      // Wait for dropdown content to be fully loaded
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });

      // More specific selectors for exact text matching with scrolling support
      const selectors = [
        `div.select-menu-item:has-text("${electionType}")`, // Custom dropdown selector
        `div[class*="select-menu-item"]:has-text("${electionType}")`,
        `text="${electionType}"`,
        `div:text-is("${electionType}")`,
        `li:text-is("${electionType}")`,
        `option:text-is("${electionType}")`,
        `div:has-text("${electionType}")`,
        `li:has-text("${electionType}")`,
        `[data-value="${electionType}"]`,
        `[value="${electionType}"]`,
      ];

      let optionClicked = false;
      let availableOptions = [];

      // First, get all available options by scrolling through the dropdown
      try {
        console.log('📋 Scanning all available options in dropdown...');

        // Find the dropdown container that might be scrollable
        const dropdownContainer = this.page
          .locator(
            'div[class*="dropdown"], div[class*="select"], ul[class*="option"]'
          )
          .first();

        // Get initial options
        const optionSelectors = [
          'div.select-menu-item', // This is the correct selector based on debug output
          'div[class*="select-menu-item"]',
          'div[class*="menu-item"]',
          'div[class*="option"]',
          'li[class*="option"]',
          'option',
          'div[role="option"]',
          'li[role="option"]',
        ];
        let allOptions = [];

        for (const optionSelector of optionSelectors) {
          try {
            const options = await this.page
              .locator(optionSelector)
              .allTextContents();
            if (options.length > 0) {
              allOptions = options.filter(
                (opt) => opt.trim().length > 0 && opt.trim() !== 'NO DATA'
              );
              console.log(
                `📋 Found ${allOptions.length} options using selector: ${optionSelector}`
              );

              // If we got good options, use them
              if (allOptions.length > 5) {
                // Assuming we should have multiple election types
                break;
              }
            }
          } catch (e) {
            continue;
          }
        }

        availableOptions = allOptions;
        console.log('📋 Available options in dropdown:', availableOptions);

        // If we have a scrollable container, scroll to ensure all options are loaded
        if (availableOptions.length === 0 || availableOptions.length < 5) {
          console.log(
            '🔄 Attempting to scroll in dropdown to load more options...'
          );

          try {
            // Try scrolling in different potential containers
            const scrollContainers = [
              'div[class*="dropdown"]',
              'div[class*="select"]',
              'ul[class*="option"]',
              'div[class*="menu"]',
              '.dropdown-menu',
              '[role="listbox"]',
            ];

            for (const containerSelector of scrollContainers) {
              try {
                const container = this.page.locator(containerSelector).first();
                if (await container.isVisible({ timeout: 2000 })) {
                  console.log(
                    `📜 Scrolling in container: ${containerSelector}`
                  );

                  // Scroll down multiple times to ensure all options are loaded
                  for (let i = 0; i < 5; i++) {
                    await container.evaluate((el) => (el.scrollTop += 200));
                    await this.page.waitForTimeout(500);
                  }

                  // Scroll back to top
                  await container.evaluate((el) => (el.scrollTop = 0));
                  await this.page.waitForTimeout(500);

                  // Re-scan options after scrolling
                  for (const optionSelector of optionSelectors) {
                    try {
                      const options = await this.page
                        .locator(optionSelector)
                        .allTextContents();
                      if (options.length > availableOptions.length) {
                        availableOptions = options.filter(
                          (opt) => opt.trim().length > 0
                        );
                        console.log(
                          `📋 After scrolling, found ${availableOptions.length} options`
                        );
                        break;
                      }
                    } catch (e) {
                      continue;
                    }
                  }
                  break;
                }
              } catch (e) {
                continue;
              }
            }
          } catch (scrollError) {
            console.log(
              '⚠️ Could not scroll in dropdown:',
              scrollError.message
            );
          }
        }
      } catch (e) {
        console.log('Could not get available options:', e.message);
      }

      // Try to find exact match with scrolling to the option
      for (const selector of selectors) {
        try {
          const option = this.page.locator(selector).first();

          // Check if option exists (even if not visible due to scrolling)
          const optionCount = await this.page.locator(selector).count();
          if (optionCount > 0) {
            console.log(
              `🎯 Found option "${electionType}" using selector: ${selector}`
            );

            // Scroll the option into view if needed
            try {
              await option.scrollIntoViewIfNeeded({ timeout: 5000 });
              await this.page.waitForTimeout(1000);
            } catch (scrollError) {
              console.log(
                '⚠️ Could not scroll option into view, attempting click anyway'
              );
            }

            // Wait for the option to be visible
            await option.waitFor({ state: 'visible', timeout: 5000 });

            const optionText = await option.textContent();
            console.log(
              `✓ Found matching option: "${optionText}" using selector: ${selector}`
            );

            await option.click({ force: true });
            optionClicked = true;
            console.log(`✅ Successfully selected: "${electionType}"`);
            break;
          }
        } catch (e) {
          console.log(`❌ Selector ${selector} failed:`, e.message);
          continue;
        }
      }

      // If exact selector match failed, try direct menu item scanning
      if (!optionClicked) {
        console.log(
          '🔍 Exact selectors failed, scanning menu items directly...'
        );
        try {
          const menuItems = this.page.locator('div.select-menu-item');
          const itemCount = await menuItems.count();
          console.log(`Found ${itemCount} menu items to scan`);

          for (let i = 0; i < itemCount; i++) {
            const item = menuItems.nth(i);
            const itemText = await item.textContent();
            const trimmedText = itemText?.trim() || '';

            console.log(`Checking item ${i + 1}: "${trimmedText}"`);

            // Use normalized text comparison to handle Bengali Unicode variations
            const normalizedItemText = trimmedText.normalize();
            const normalizedElectionType = electionType.normalize();

            if (normalizedItemText === normalizedElectionType) {
              console.log(
                `🎯 Found exact match at position ${i + 1} (normalized)`
              );
              await item.click({ force: true });
              optionClicked = true;
              console.log(`✅ Successfully selected: "${electionType}"`);
              break;
            }
          }
        } catch (e) {
          console.log('❌ Menu item scanning failed:', e.message);
        }
      }

      if (!optionClicked) {
        // Try fuzzy matching as last resort with normalized text
        console.warn(
          `⚠️ Exact match for "${electionType}" not found. Trying fuzzy matching...`
        );

        const normalizedElectionType = electionType.normalize();

        for (const availableOption of availableOptions) {
          const normalizedAvailableOption = availableOption.normalize();

          if (
            normalizedAvailableOption.includes(normalizedElectionType) ||
            normalizedElectionType.includes(normalizedAvailableOption)
          ) {
            try {
              // Try to find this option in the menu items
              const menuItems = this.page.locator('div.select-menu-item');
              const itemCount = await menuItems.count();

              for (let i = 0; i < itemCount; i++) {
                const item = menuItems.nth(i);
                const itemText = await item.textContent();
                const normalizedItemText = itemText?.trim().normalize() || '';

                if (normalizedItemText === normalizedAvailableOption) {
                  console.log(
                    `✅ Selected via fuzzy matching: "${availableOption}" for requested "${electionType}"`
                  );
                  await item.click({ force: true });
                  optionClicked = true;
                  break;
                }
              }

              if (optionClicked) break;
            } catch (e) {
              continue;
            }
          }
        }
      }

      if (!optionClicked) {
        console.error(
          `❌ Could not find election type "${electionType}" in dropdown`
        );
        console.error('Available options were:', availableOptions);

        // Take final screenshot for debugging
        await this.page.screenshot({
          path: 'test-artifacts/election-type-not-found.png',
        });

        throw new Error(
          `Election type "${electionType}" not found in dropdown. Available options: ${availableOptions.join(
            ', '
          )}`
        );
      }

      // Verify selection was successful
      await this.page.waitForTimeout(1000);

      // Take screenshot after selection
      await this.page.screenshot({
        path: 'test-artifacts/after-election-type-selection.png',
      });

      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (e) {
      console.error('❌ Failed to select election type:', e.message);
      await this.page.screenshot({
        path: 'test-artifacts/election-type-selection-error.png',
      });
      throw e;
    }
  }

  async selectElectionArea(electionArea) {
    // Try to click the area dropdown if it exists, otherwise skip
    try {
      if (await this.electionAreaDropdown.isVisible({ timeout: 2000 })) {
        await this.electionAreaDropdown.click();
        // Select the area by visible text if present
        const areaOption = this.page.locator(`text="${electionArea}"`);
        if (await areaOption.isVisible({ timeout: 2000 })) {
          await areaOption.click();
          await this.page.waitForTimeout(500); // Small wait for UI update
        }
      }
    } catch (e) {
      // If the field is not present or not visible, continue without failing
      console.warn(
        'Election area dropdown not found or not visible, skipping.'
      );
    }
  }

  async fillScheduleForm(electionDetails) {
    await this.selectElectionType(electionDetails.electionType);
    await this.electionNameInput.waitFor({ state: 'visible' });
    await this.electionNameInput.fill(electionDetails.electionName);

    // Fill English election name if present
    if (
      await this.electionNameEnInput
        .isVisible({ timeout: 1000 })
        .catch(() => false)
    ) {
      await this.electionNameEnInput.fill(
        electionDetails.electionNameEn || 'Test Election EN'
      );
    }
    await this.selectElectionArea(electionDetails.electionArea);

    // Enhanced date/time picker handler with month navigation support
    const fillDateTime = async (
      dateInputId,
      timeInputName,
      date,
      time,
      fieldIndex = 0
    ) => {
      try {
        if (!date) {
          console.warn(`No date provided for ${dateInputId}`);
          return;
        }

        // Parse target date
        const [year, month, day] = date.split('-').map(Number);
        const targetDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
        const currentDate = new Date();

        console.log(
          `Filling ${dateInputId} with date: ${date} (${day}/${month}/${year})`
        );

        // Click date input using ID with field index to handle multiple fields with same ID
        const dateInput =
          fieldIndex === 0
            ? this.page.locator(`#${dateInputId}`).first()
            : this.page.locator(`#${dateInputId}`).nth(fieldIndex);
        await dateInput.click({ force: true });

        // Wait for calendar to appear
        await this.page.waitForTimeout(500);

        // Check if we need to navigate to a different month
        const needMonthNavigation =
          targetDate.getMonth() !== currentDate.getMonth() ||
          targetDate.getFullYear() !== currentDate.getFullYear();

        if (needMonthNavigation) {
          console.log(
            `Need to navigate to ${month}/${year} for ${dateInputId}`
          );

          // Take a screenshot before month navigation for debugging
          await this.page
            .screenshot({
              path: `test-artifacts/calendar-before-${dateInputId}.png`,
            })
            .catch(() => {});

          // First, try to detect the current month header dynamically
          let currentMonthText = '';
          const monthDetectionSelectors = [
            '.react-datepicker__current-month',
            '.calendar-header',
            'h2',
            'h3',
            'h4',
            '[class*="month-year"]',
            '[class*="header"]',
          ];

          for (const selector of monthDetectionSelectors) {
            try {
              const elements = this.page.locator(selector);
              const count = await elements.count();
              for (let i = 0; i < count; i++) {
                const text = await elements.nth(i).textContent();
                if (
                  text &&
                  (text.includes('2025') ||
                    text.includes('August') ||
                    text.includes('September'))
                ) {
                  currentMonthText = text.trim();
                  console.log(
                    `Detected current month header: "${currentMonthText}" using ${selector}`
                  );
                  break;
                }
              }
              if (currentMonthText) break;
            } catch (e) {
              continue;
            }
          }

          // Enhanced month header selectors including dynamic detection
          const monthHeaderSelectors = [
            currentMonthText ? `text="${currentMonthText}"` : null,
            currentMonthText ? `button:has-text("${currentMonthText}")` : null,
            'text="August 2025"', // Fallback to known text
            'text="September 2025"',
            'text="October 2025"',
            'button:has-text("August")',
            'button:has-text("September")',
            'button:has-text("2025")',
            '.react-datepicker__current-month',
            '.calendar-header button',
            '.calendar-header',
            'button[class*="month"]',
            '[data-testid="month-selector"]',
            '.datepicker-month-header',
            'h3',
            'h2',
            'h4',
            // More generic selectors
            '[role="button"]:has-text("August")',
            '[role="button"]:has-text("2025")',
            'div[class*="picker"] button',
            '.picker-header button',
          ].filter(Boolean);

          let monthSelectorOpened = false;
          for (const selector of monthHeaderSelectors) {
            try {
              const monthHeader = this.page.locator(selector).first();
              if (await monthHeader.isVisible({ timeout: 1000 })) {
                console.log(`Trying month header selector: ${selector}`);
                await monthHeader.click();
                await this.page.waitForTimeout(800);

                // Enhanced month selector detection
                const monthChecks = [
                  'text="January"',
                  'text="February"',
                  'text="March"',
                  'text="April"',
                  'button:has-text("January")',
                  'button:has-text("February")',
                  'div:has-text("January")',
                  'div:has-text("February")',
                  '[data-month="0"]', // January = 0
                  '[data-month="1"]', // February = 1
                  '.month-option',
                  '.picker-month',
                  '[class*="month"]',
                ];

                for (const monthCheck of monthChecks) {
                  const monthOptions = this.page.locator(monthCheck);
                  if (await monthOptions.isVisible({ timeout: 1000 })) {
                    monthSelectorOpened = true;
                    console.log(
                      `Month selector opened, found months using: ${monthCheck}`
                    );
                    break;
                  }
                }

                if (monthSelectorOpened) {
                  console.log(`✓ Opened month selector using: ${selector}`);
                  // Take screenshot after opening month selector
                  await this.page
                    .screenshot({
                      path: `test-artifacts/month-selector-opened-${dateInputId}.png`,
                    })
                    .catch(() => {});
                  break;
                }
              }
            } catch (e) {
              continue;
            }
          }

          if (monthSelectorOpened) {
            // Select target month with enhanced selectors
            const monthNames = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ];
            const targetMonthName = monthNames[month - 1];

            try {
              const monthSelectors = [
                `text="${targetMonthName}"`,
                `button:has-text("${targetMonthName}")`,
                `div:has-text("${targetMonthName}")`,
                `[data-month="${month - 1}"]`,
                `[data-value="${month - 1}"]`,
                `[data-value="${targetMonthName}"]`,
                `.month-${month}`,
                `.month-${targetMonthName.toLowerCase()}`,
              ];

              let monthSelected = false;
              for (const monthSel of monthSelectors) {
                try {
                  const monthOption = this.page.locator(monthSel).first();
                  if (await monthOption.isVisible({ timeout: 2000 })) {
                    await monthOption.click();
                    await this.page.waitForTimeout(500);
                    monthSelected = true;
                    console.log(
                      `✓ Selected month: ${targetMonthName} using ${monthSel}`
                    );
                    break;
                  }
                } catch (e) {
                  continue;
                }
              }

              if (!monthSelected) {
                console.warn(`Could not select month ${targetMonthName}`);
                // Take debug screenshot
                await this.page
                  .screenshot({
                    path: `test-artifacts/month-selection-failed-${dateInputId}.png`,
                  })
                  .catch(() => {});
              }
            } catch (e) {
              console.warn(
                `Failed to select month ${targetMonthName}: ${e.message}`
              );
            }
          } else {
            console.warn(
              'Could not open month selector, trying navigation arrows and alternative methods'
            );

            // Enhanced approach: Try multiple month navigation strategies
            const currentMonth = currentDate.getMonth() + 1; // 1-indexed
            const currentYear = currentDate.getFullYear();
            const monthDiff = month - currentMonth;
            const yearDiff = year - currentYear;

            console.log(
              `Current: ${currentMonth}/${currentYear}, Target: ${month}/${year}, Diff: ${monthDiff} months, ${yearDiff} years`
            );

            // Strategy 1: Look for next/previous navigation arrows
            if (monthDiff > 0 || yearDiff > 0) {
              console.log(
                `Need to navigate ${monthDiff + yearDiff * 12} months forward`
              );

              // Enhanced next button selectors based on common calendar implementations
              const nextSelectors = [
                'div:nth-child(3) > svg', // Based on your original manual code
                'button[aria-label="Next Month"]',
                'button[aria-label="next month"]',
                'button[title="Next Month"]',
                '.react-datepicker__navigation--next',
                '.react-datepicker__navigation-icon--next',
                '.calendar-next',
                '.picker-next',
                '.datepicker-next',
                'svg[data-testid="ArrowForwardIosIcon"]',
                'button:has(svg[data-testid="ArrowForwardIosIcon"])',
                '.navigation-next',
                'button[class*="next"]',
                '[data-testid="next-month"]',
                '[data-testid="chevron-right"]',
                '.chevron-right',
                'button:has(.fa-chevron-right)',
                'button:has(.fa-angle-right)',
                'button > svg[viewBox*="chevron"]',
                'button > .icon-next',
                'button > .arrow-right',
                // Generic approaches
                'button:nth-child(3)', // Often the right arrow is 3rd button
                'svg:nth-child(3)', // Your original working selector pattern
                'div:nth-child(3) button',
                '.header button:last-child',
                '.calendar-header button:last-child',
              ];

              const totalMonthsToNavigate = Math.min(
                monthDiff + yearDiff * 12,
                12
              ); // Limit to 12 months max

              for (let i = 0; i < totalMonthsToNavigate; i++) {
                let navigated = false;

                for (const nextSel of nextSelectors) {
                  try {
                    const nextBtn = this.page.locator(nextSel).first();
                    const isVisible = await nextBtn.isVisible({ timeout: 500 });
                    const isEnabled = await nextBtn
                      .isEnabled()
                      .catch(() => true);

                    if (isVisible && isEnabled) {
                      console.log(`Trying next navigation with: ${nextSel}`);
                      await nextBtn.click({ force: true });
                      await this.page.waitForTimeout(500); // Wait for calendar to update
                      navigated = true;
                      console.log(
                        `✓ Navigated forward ${
                          i + 1
                        }/${totalMonthsToNavigate} using: ${nextSel}`
                      );
                      break;
                    }
                  } catch (e) {
                    continue;
                  }
                }

                if (!navigated) {
                  console.warn(
                    `Could not navigate forward for step ${
                      i + 1
                    }/${totalMonthsToNavigate}`
                  );
                  break;
                }
              }
            } else if (monthDiff < 0) {
              console.log(
                `Need to navigate ${Math.abs(monthDiff)} months backward`
              );

              // Enhanced previous button selectors
              const prevSelectors = [
                'button[aria-label="Previous Month"]',
                'button[aria-label="previous month"]',
                'button[title="Previous Month"]',
                '.react-datepicker__navigation--previous',
                '.react-datepicker__navigation-icon--previous',
                '.calendar-prev',
                '.picker-prev',
                '.datepicker-prev',
                'svg[data-testid="ArrowBackIosIcon"]',
                'button:has(svg[data-testid="ArrowBackIosIcon"])',
                '.navigation-prev',
                'button[class*="prev"]',
                '[data-testid="prev-month"]',
                '[data-testid="chevron-left"]',
                '.chevron-left',
                'button:has(.fa-chevron-left)',
                'button:has(.fa-angle-left)',
                'button > .icon-prev',
                'button > .arrow-left',
                // Generic approaches
                'button:first-child', // Often the left arrow is first button
                '.header button:first-child',
                '.calendar-header button:first-child',
              ];

              for (let i = 0; i < Math.min(Math.abs(monthDiff), 6); i++) {
                let navigated = false;
                for (const prevSel of prevSelectors) {
                  try {
                    const prevBtn = this.page.locator(prevSel).first();
                    if (
                      (await prevBtn.isVisible({ timeout: 500 })) &&
                      (await prevBtn.isEnabled().catch(() => true))
                    ) {
                      await prevBtn.click({ force: true });
                      await this.page.waitForTimeout(500);
                      navigated = true;
                      console.log(
                        `✓ Navigated backward ${i + 1} using: ${prevSel}`
                      );
                      break;
                    }
                  } catch (e) {
                    continue;
                  }
                }
                if (!navigated) {
                  console.warn(`Could not navigate backward for step ${i + 1}`);
                  break;
                }
              }
            }

            // Strategy 2: Try alternative month selection methods
            console.log('Trying alternative month navigation methods...');

            // Method 2a: Try clicking on month name/year separately
            const monthYearSelectors = [
              `text="${month}/${year}"`,
              `text="${year}-${month.toString().padStart(2, '0')}"`,
              `button:has-text("${year}")`,
              `select[name*="month"]`,
              `select[name*="year"]`,
              `input[name*="month"]`,
              `input[name*="year"]`,
            ];

            for (const selector of monthYearSelectors) {
              try {
                const element = this.page.locator(selector).first();
                if (await element.isVisible({ timeout: 1000 })) {
                  console.log(`Found month/year control: ${selector}`);
                  await element.click();
                  await this.page.waitForTimeout(300);
                  // Additional logic could be added here to select specific month/year
                }
              } catch (e) {
                continue;
              }
            }

            // Strategy 3: Direct header manipulation based on original manual approach
            console.log('Trying direct calendar header interaction...');

            // Based on your original working manual code patterns
            const headerSelectors = [
              'div.react-datepicker__header',
              'div[class*="calendar-header"]',
              'div[class*="picker-header"]',
              '.datepicker-header',
              '.calendar-month-header',
              '.picker-month-year',
            ];

            for (const headerSel of headerSelectors) {
              try {
                const header = this.page.locator(headerSel).first();
                if (await header.isVisible({ timeout: 1000 })) {
                  console.log(`Found calendar header: ${headerSel}`);

                  // Try to find and click navigation elements within header
                  const headerNavSelectors = [
                    `${headerSel} div:nth-child(3)`, // Your original pattern
                    `${headerSel} div:nth-child(3) > svg`,
                    `${headerSel} button:last-child`,
                    `${headerSel} svg:last-child`,
                    `${headerSel} [class*="next"]`,
                    `${headerSel} [class*="forward"]`,
                    `${headerSel} [aria-label*="next"]`,
                  ];

                  if (monthDiff > 0 || yearDiff > 0) {
                    for (const navSel of headerNavSelectors) {
                      try {
                        const navElement = this.page.locator(navSel).first();
                        if (await navElement.isVisible({ timeout: 500 })) {
                          console.log(`Clicking navigation element: ${navSel}`);
                          for (
                            let i = 0;
                            i < Math.min(monthDiff + yearDiff * 12, 12);
                            i++
                          ) {
                            await navElement.click({ force: true });
                            await this.page.waitForTimeout(400);
                            console.log(`Navigation step ${i + 1} completed`);
                          }
                          break;
                        }
                      } catch (e) {
                        continue;
                      }
                    }
                  }
                  break;
                }
              } catch (e) {
                continue;
              }
            }

            // Strategy 4: Keyboard navigation as final fallback
            console.log('Trying keyboard navigation...');
            try {
              // Focus on calendar input field
              await calendarInput.focus();

              if (monthDiff > 0) {
                // Use arrow keys to navigate months
                for (let i = 0; i < Math.min(monthDiff, 12); i++) {
                  await this.page.keyboard.press('PageDown'); // Often navigates to next month
                  await this.page.waitForTimeout(200);
                }
              } else if (monthDiff < 0) {
                for (let i = 0; i < Math.min(Math.abs(monthDiff), 12); i++) {
                  await this.page.keyboard.press('PageUp'); // Often navigates to previous month
                  await this.page.waitForTimeout(200);
                }
              }
            } catch (e) {
              console.warn('Keyboard navigation failed:', e.message);
            }
          }
        }

        // Enhanced day selection with multiple strategies
        const daySelectors = [
          `text="${day}"`,
          `button:has-text("${day}")`,
          `div:has-text("${day}"):not(:has(div))`,
          `span:has-text("${day}")`,
          `.calendar-day:has-text("${day}")`,
          `[data-day="${day}"]`,
          `[data-date="${day}"]`,
          `[data-value="${day}"]`,
          `.day-${day}`,
          `button[aria-label*="${day}"]`,
          `td:has-text("${day}")`,
          `.react-datepicker__day:has-text("${day}")`,
          `.picker-day:has-text("${day}")`,
        ];

        let dayClicked = false;
        for (const selector of daySelectors) {
          try {
            const dayElements = this.page.locator(selector);
            const count = await dayElements.count();

            // If multiple days with same number, try each one
            for (let i = 0; i < count; i++) {
              const dayElement = dayElements.nth(i);
              if (await dayElement.isVisible({ timeout: 1000 })) {
                // Additional check: make sure it's not disabled
                const isDisabled = await dayElement
                  .evaluate(
                    (el) =>
                      el.hasAttribute('disabled') ||
                      el.classList.contains('disabled') ||
                      el.classList.contains('react-datepicker__day--disabled')
                  )
                  .catch(() => false);

                if (!isDisabled) {
                  await dayElement.click({ force: true });
                  dayClicked = true;
                  console.log(
                    `✓ Selected day ${day} using selector: ${selector} (element ${i})`
                  );
                  break;
                }
              }
            }

            if (dayClicked) break;
          } catch (e) {
            continue;
          }
        }

        if (!dayClicked) {
          console.warn(`Could not select day ${day} for ${dateInputId}`);

          // Advanced fallback strategies
          console.log(`Trying advanced fallback strategies for day ${day}`);

          // Strategy 1: Try clicking anywhere on the calendar first to ensure it's active
          try {
            const calendarSelectors = [
              '.react-datepicker',
              '.calendar',
              '.picker',
              '[class*="datepicker"]',
              '[class*="calendar"]',
            ];

            for (const calSel of calendarSelectors) {
              const calendar = this.page.locator(calSel).first();
              if (await calendar.isVisible({ timeout: 1000 })) {
                await calendar.click();
                await this.page.waitForTimeout(200);
                break;
              }
            }
          } catch (e) {
            // ignore
          }

          // Strategy 2: Try using keyboard navigation
          try {
            await this.page.keyboard.press('Home'); // Go to first day of month
            await this.page.waitForTimeout(100);

            // Press Arrow Right (day-1) times to reach target day
            for (let i = 1; i < day; i++) {
              await this.page.keyboard.press('ArrowRight');
              await this.page.waitForTimeout(50);
            }

            await this.page.keyboard.press('Enter');
            console.log(`Used keyboard navigation to select day ${day}`);
            dayClicked = true;
          } catch (e) {
            console.warn(`Keyboard navigation failed: ${e.message}`);
          }

          // Strategy 3: Direct input value setting (last resort)
          if (!dayClicked) {
            try {
              await dateInput.fill(date);
              await dateInput.evaluate((el, val) => {
                el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur', { bubbles: true }));
              }, date);
              console.log(`✓ Used fallback direct input for ${dateInputId}`);

              // Verify the value was set
              const setValue = await dateInput.evaluate((el) => el.value);
              if (setValue.includes(day.toString()) || setValue === date) {
                dayClicked = true;
                console.log(`✓ Direct input value verified: ${setValue}`);
              }
            } catch (e) {
              console.warn(`Fallback input setting failed: ${e.message}`);
            }
          }

          // Final strategy: Take screenshot for debugging
          if (!dayClicked) {
            await this.page
              .screenshot({
                path: `test-artifacts/day-selection-failed-${dateInputId}-${day}.png`,
              })
              .catch(() => {});
            console.warn(
              `❌ All strategies failed for ${dateInputId} day ${day}`
            );
          }
        }

        // Click time confirmation buttons (00:, :00) that appear after date selection
        const timeButtons = ['00:', ':00'];
        for (const buttonText of timeButtons) {
          try {
            const timeButton = this.page.getByRole('button', {
              name: buttonText,
            });
            if (await timeButton.isVisible({ timeout: 1000 })) {
              await timeButton.click({ force: true });
            }
          } catch (e) {
            // Ignore if button not found
          }
        }

        // Short wait to ensure the UI updates
        await this.page.waitForTimeout(300);
      } catch (e) {
        console.warn(`Failed to fill date/time for ${dateInputId}:`, e.message);
      }
    };

    // Fill all date/time fields using the enhanced method
    await fillDateTime(
      'dateOfDeclaration',
      null,
      electionDetails.electionDate,
      null
    );
    await fillDateTime(
      'dateOfNominationSubmission',
      null,
      electionDetails.nominationSubmissionDate,
      null
    );

    // Fill nomination scrutiny dates using enhanced fillDateTime method
    await fillDateTime(
      'dateOfNominationSelectionStart',
      null,
      electionDetails.nominationScrutinyDate,
      null,
      0 // First field (index 0)
    );

    // Handle nomination scrutiny end date (second field with same ID)
    if (electionDetails.nominationScrutinyEndDate) {
      await fillDateTime(
        'dateOfNominationSelectionStart',
        null,
        electionDetails.nominationScrutinyEndDate,
        null,
        1 // Second field (index 1)
      );
    }

    await fillDateTime(
      'dateOfAppealSubmission',
      null,
      electionDetails.appealSubmissionDate,
      null
    );
    await fillDateTime(
      'dateOfAppealJudgement',
      null,
      electionDetails.appealDisposalDate,
      null
    );
    await fillDateTime(
      'dateOfNominationWithdrawal',
      null,
      electionDetails.withdrawalDate,
      null
    );
    await fillDateTime(
      'dateOfAssignedSymbol',
      null,
      electionDetails.symbolAllotmentDate,
      null
    );
    await fillDateTime(
      'dateOfElection',
      null,
      electionDetails.votingDate,
      null
    );
    await fillDateTime(
      'dateOfGazette',
      null,
      electionDetails.gazettePublicationDate,
      null
    );

    // Handle voting start and end times
    try {
      if (electionDetails.votingTime) {
        const votingStartTime = this.page
          .locator('#voteCastingStartTime')
          .first();
        if (await votingStartTime.isVisible({ timeout: 1000 })) {
          await votingStartTime.click();

          const [timePart, period] = electionDetails.votingTime.split(' ');
          const [hours] = timePart.split(':');

          await this.page.getByText(hours.padStart(2, '0')).first().click();
          await this.page.getByRole('button', { name: 'OK' }).click();
        }
      }

      // Handle voting end time if present
      const votingEndTime = this.page.locator('#voteCastingStartTime').nth(1);
      if (await votingEndTime.isVisible({ timeout: 1000 })) {
        await votingEndTime.click();
        await this.page.getByText('05').first().click();
        await this.page.getByText('00', { exact: true }).click();
        await this.page.locator('div').filter({ hasText: /^PM$/ }).click();
        await this.page.getByRole('button', { name: 'OK' }).click();
      }
    } catch (e) {
      console.warn('Failed to set voting times:', e.message);
    }

    // Handle file upload
    try {
      console.log('Attempting file upload...');

      // Strategy 1: Direct setInputFiles first (most reliable)
      const fileInputs = [
        'input[type="file"]',
        '.file-upload input[type="file"]',
        '[accept*="pdf"]',
        'input[name*="file"]',
      ];

      let fileUploaded = false;
      for (const selector of fileInputs) {
        try {
          const fileInput = this.page.locator(selector).first();
          const inputCount = await fileInput.count();
          if (inputCount > 0) {
            console.log(
              `Found ${inputCount} file input(s) with selector: ${selector}`
            );
            await fileInput.setInputFiles(electionDetails.filePath);
            fileUploaded = true;
            console.log(
              '✓ File uploaded successfully via direct setInputFiles'
            );
            break;
          }
        } catch (e) {
          console.log(`Failed with selector ${selector}: ${e.message}`);
          continue;
        }
      }

      // Strategy 2: Handle file chooser if direct approach didn't work
      if (!fileUploaded) {
        console.log('Trying file chooser approach...');
        try {
          // Look for visible upload elements that might trigger file chooser
          const uploadTriggers = [
            'button:has-text("Choose File")',
            'button:has-text("Browse")',
            '.upload-button',
            '.file-input-button',
          ];

          for (const trigger of uploadTriggers) {
            try {
              const uploadButton = this.page.locator(trigger).first();
              if (await uploadButton.isVisible({ timeout: 1000 })) {
                console.log(`Found upload trigger: ${trigger}`);

                // Set up file chooser handler before clicking
                const fileChooserPromise = this.page.waitForEvent(
                  'filechooser',
                  { timeout: 5000 }
                );

                // Click the upload trigger
                await uploadButton.click();

                // Handle the file chooser
                const fileChooser = await fileChooserPromise;
                await fileChooser.setFiles(electionDetails.filePath);

                fileUploaded = true;
                console.log('✓ File uploaded successfully via file chooser');
                break;
              }
            } catch (e) {
              console.log(`Failed with trigger ${trigger}: ${e.message}`);
              continue;
            }
          }
        } catch (e) {
          console.log(`File chooser approach failed: ${e.message}`);
        }
      }

      if (!fileUploaded) {
        console.warn('⚠️ Could not upload file - skipping file upload step');
      } else {
        // Wait for upload to process
        await this.page.waitForTimeout(1000);
      }
    } catch (e) {
      console.warn('Failed to upload file:', e.message);
    }

    // Toggle online nomination (required field)
    try {
      const toggleLabel = this.page.locator('label').nth(1);
      if (await toggleLabel.isVisible({ timeout: 1000 })) {
        await toggleLabel.click();
      }
    } catch (e) {
      console.warn('Failed to toggle online nomination:', e.message);
    }

    // Fill schedule comment (required field)
    try {
      const commentField = this.page.locator(
        'textarea[name="scheduleComment"]'
      );
      if (await commentField.isVisible({ timeout: 1000 })) {
        await commentField.click();
        await commentField.fill(
          electionDetails.scheduleComment || 'Automated test comment'
        );
      }
    } catch (e) {
      console.warn('Failed to fill schedule comment:', e.message);
    }
  }

  async clickNextTab() {
    try {
      // Wait for the page to be ready and button to be visible
      await this.page.waitForLoadState('domcontentloaded');
      await this.nextTabButton.waitFor({ state: 'visible', timeout: 5000 });

      // Scroll the button into view if needed
      await this.nextTabButton.scrollIntoViewIfNeeded();

      // Click the button with force to handle any overlays
      await this.nextTabButton.click({ force: true });

      // Wait for the next tab to load
      await this.page.waitForTimeout(1000);
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (e) {
      console.warn('Failed to click next tab button:', e.message);
      // Try alternative selector
      try {
        const altNextButton = this.page.getByRole('button', {
          name: 'পরবর্তী ট্যাব',
        });
        await altNextButton.click({ force: true });
        await this.page.waitForTimeout(1000);
      } catch (altError) {
        throw new Error(`Failed to click next tab button: ${e.message}`);
      }
    }
  }

  async fillAgeDetails(minAge, ageCalculationDate) {
    try {
      // Fill minimum age
      const minAgeInput = this.page.locator('input[name="minimumAge"]');
      if (await minAgeInput.isVisible({ timeout: 1000 })) {
        await minAgeInput.click();
        await minAgeInput.fill(minAge);
        console.log(`✓ Filled minimum age: ${minAge}`);
      }

      // Handle age calculation date dropdown - avoid strict mode by being more specific
      const ageDropdownSelectors = [
        'select[name*="age"]',
        'select:has(option:has-text("ভোট গ্রহণের তারিখ"))',
        '.age-calculation select',
        'select',
      ];

      let dropdownFound = false;
      for (const selector of ageDropdownSelectors) {
        try {
          const dropdown = this.page.locator(selector).first();
          if (await dropdown.isVisible({ timeout: 2000 })) {
            await dropdown.selectOption({ label: ageCalculationDate });
            dropdownFound = true;
            console.log(
              `✓ Selected age calculation date: ${ageCalculationDate}`
            );
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!dropdownFound) {
        // Try alternative approach - click dropdown then select option
        const ageDropdown = this.page
          .locator('[placeholder="নির্বাচন করুন"]')
          .last();
        if (await ageDropdown.isVisible({ timeout: 2000 })) {
          await ageDropdown.click();
          await this.page.waitForTimeout(500);

          // Try to click the age option
          const ageOption = this.page.locator(`text="${minAge}"`).first();
          if (await ageOption.isVisible({ timeout: 1000 })) {
            await ageOption.click();
            console.log(`✓ Selected age option: ${minAge}`);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to fill age details:', e.message);
    }
  }

  async clickSubmit() {
    try {
      console.log('Looking for submit button...');

      // Wait for the page to be ready
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000);

      const submitSelectors = [
        'button:has-text("দাখিল করুন")',
        'button:has-text("সংরক্ষণ")',
        'button:has-text("Save")',
        'button[type="submit"]',
        'input[type="submit"]',
        '.btn-primary',
        '.submit-btn',
        'button:visible:last-child',
        '[role="button"]:has-text("দাখিল")',
        '[role="button"]:has-text("সংরক্ষণ")',
      ];

      for (const selector of submitSelectors) {
        try {
          const submitBtn = this.page.locator(selector).first();
          if (await submitBtn.isVisible({ timeout: 2000 })) {
            console.log(`Found submit button with selector: ${selector}`);
            await submitBtn.scrollIntoViewIfNeeded();

            // Take screenshot before clicking submit
            await this.page.screenshot({
              path: 'test-artifacts/before-submit.png',
            });

            await submitBtn.click({ force: true });
            console.log('✓ Clicked submit button');

            // Wait for potential navigation or success message
            await this.page.waitForTimeout(3000);

            // Check for success indicators
            const successIndicators = [
              'text="সফলভাবে"', // Successfully
              'text="সংরক্ষিত"', // Saved
              'text="Success"',
              'text="Created"',
              '.alert-success',
              '.success-message',
            ];

            let successFound = false;
            for (const indicator of successIndicators) {
              try {
                const successEl = this.page.locator(indicator).first();
                if (await successEl.isVisible({ timeout: 3000 })) {
                  console.log(`✓ Found success indicator: ${indicator}`);
                  successFound = true;
                  break;
                }
              } catch (e) {
                continue;
              }
            }

            // Take screenshot after submit
            await this.page.screenshot({
              path: 'test-artifacts/after-submit.png',
            });

            if (!successFound) {
              console.warn(
                '⚠️ No success message found - submission may have failed'
              );

              // Check for error messages
              const errorSelectors = [
                'text="ত্রুটি"', // Error
                'text="Error"',
                '.alert-error',
                '.error-message',
                '.alert-danger',
              ];

              for (const errorSelector of errorSelectors) {
                try {
                  const errorEl = this.page.locator(errorSelector).first();
                  if (await errorEl.isVisible({ timeout: 2000 })) {
                    const errorText = await errorEl.textContent();
                    console.error(`❌ Error found: ${errorText}`);
                  }
                } catch (e) {
                  continue;
                }
              }
            }

            return;
          }
        } catch (e) {
          continue;
        }
      }

      // If no specific submit button found, try any visible button
      const anyButtons = this.page.locator('button:visible');
      const buttonCount = await anyButtons.count();
      console.log(`Found ${buttonCount} visible buttons`);

      if (buttonCount > 0) {
        const lastButton = anyButtons.last();
        console.log('Using last visible button as submit');
        await lastButton.scrollIntoViewIfNeeded();
        await lastButton.click({ force: true });
        console.log('✓ Clicked last visible button');
        await this.page.waitForTimeout(3000);
        return;
      }

      throw new Error('No submit button found');
    } catch (e) {
      console.warn('Failed to click submit button:', e.message);
      // Try alternative selector
      try {
        const altSubmitButton = this.page.getByRole('button', {
          name: 'দাখিল করুন',
        });
        await altSubmitButton.click({ force: true });
        await this.page.waitForTimeout(2000);
      } catch (altError) {
        throw new Error(`Failed to click submit button: ${e.message}`);
      }
    }
  }
}

module.exports = { ScheduleCreationPage };
