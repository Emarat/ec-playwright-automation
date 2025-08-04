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
      await this.page.screenshot({ path: 'test-artifacts/before-dropdown-click.png' });
      
      await this.electionTypeDropdown.click({ force: true });
      console.log('✓ Clicked election type dropdown');

      // Wait for dropdown options to appear and load completely
      await this.page.waitForTimeout(3000);
      
      // Take screenshot after dropdown opens
      await this.page.screenshot({ path: 'test-artifacts/dropdown-opened.png' });

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
        const dropdownContainer = this.page.locator('div[class*="dropdown"], div[class*="select"], ul[class*="option"]').first();
        
        // Get initial options
        const optionSelectors = [
          'div.select-menu-item', // This is the correct selector based on debug output
          'div[class*="select-menu-item"]',
          'div[class*="menu-item"]',
          'div[class*="option"]', 
          'li[class*="option"]', 
          'option', 
          'div[role="option"]', 
          'li[role="option"]'
        ];
        let allOptions = [];
        
        for (const optionSelector of optionSelectors) {
          try {
            const options = await this.page.locator(optionSelector).allTextContents();
            if (options.length > 0) {
              allOptions = options.filter(opt => opt.trim().length > 0 && opt.trim() !== 'NO DATA');
              console.log(`📋 Found ${allOptions.length} options using selector: ${optionSelector}`);
              
              // If we got good options, use them
              if (allOptions.length > 5) { // Assuming we should have multiple election types
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
          console.log('🔄 Attempting to scroll in dropdown to load more options...');
          
          try {
            // Try scrolling in different potential containers
            const scrollContainers = [
              'div[class*="dropdown"]',
              'div[class*="select"]', 
              'ul[class*="option"]',
              'div[class*="menu"]',
              '.dropdown-menu',
              '[role="listbox"]'
            ];
            
            for (const containerSelector of scrollContainers) {
              try {
                const container = this.page.locator(containerSelector).first();
                if (await container.isVisible({ timeout: 2000 })) {
                  console.log(`📜 Scrolling in container: ${containerSelector}`);
                  
                  // Scroll down multiple times to ensure all options are loaded
                  for (let i = 0; i < 5; i++) {
                    await container.evaluate(el => el.scrollTop += 200);
                    await this.page.waitForTimeout(500);
                  }
                  
                  // Scroll back to top
                  await container.evaluate(el => el.scrollTop = 0);
                  await this.page.waitForTimeout(500);
                  
                  // Re-scan options after scrolling
                  for (const optionSelector of optionSelectors) {
                    try {
                      const options = await this.page.locator(optionSelector).allTextContents();
                      if (options.length > availableOptions.length) {
                        availableOptions = options.filter(opt => opt.trim().length > 0);
                        console.log(`📋 After scrolling, found ${availableOptions.length} options`);
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
            console.log('⚠️ Could not scroll in dropdown:', scrollError.message);
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
            console.log(`🎯 Found option "${electionType}" using selector: ${selector}`);
            
            // Scroll the option into view if needed
            try {
              await option.scrollIntoViewIfNeeded({ timeout: 5000 });
              await this.page.waitForTimeout(1000);
            } catch (scrollError) {
              console.log('⚠️ Could not scroll option into view, attempting click anyway');
            }
            
            // Wait for the option to be visible
            await option.waitFor({ state: 'visible', timeout: 5000 });
            
            const optionText = await option.textContent();
            console.log(`✓ Found matching option: "${optionText}" using selector: ${selector}`);
            
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
        console.log('🔍 Exact selectors failed, scanning menu items directly...');
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
              console.log(`🎯 Found exact match at position ${i + 1} (normalized)`);
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
        console.warn(`⚠️ Exact match for "${electionType}" not found. Trying fuzzy matching...`);
        
        const normalizedElectionType = electionType.normalize();
        
        for (const availableOption of availableOptions) {
          const normalizedAvailableOption = availableOption.normalize();
          
          if (normalizedAvailableOption.includes(normalizedElectionType) || normalizedElectionType.includes(normalizedAvailableOption)) {
            try {
              // Try to find this option in the menu items
              const menuItems = this.page.locator('div.select-menu-item');
              const itemCount = await menuItems.count();
              
              for (let i = 0; i < itemCount; i++) {
                const item = menuItems.nth(i);
                const itemText = await item.textContent();
                const normalizedItemText = itemText?.trim().normalize() || '';
                
                if (normalizedItemText === normalizedAvailableOption) {
                  console.log(`✅ Selected via fuzzy matching: "${availableOption}" for requested "${electionType}"`);
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
        console.error(`❌ Could not find election type "${electionType}" in dropdown`);
        console.error('Available options were:', availableOptions);
        
        // Take final screenshot for debugging
        await this.page.screenshot({ path: 'test-artifacts/election-type-not-found.png' });
        
        throw new Error(`Election type "${electionType}" not found in dropdown. Available options: ${availableOptions.join(', ')}`);
      }

      // Verify selection was successful
      await this.page.waitForTimeout(1000);
      
      // Take screenshot after selection
      await this.page.screenshot({ path: 'test-artifacts/after-election-type-selection.png' });
      
      await this.page.waitForLoadState('networkidle', { timeout: 10000 });
      
    } catch (e) {
      console.error('❌ Failed to select election type:', e.message);
      await this.page.screenshot({ path: 'test-artifacts/election-type-selection-error.png' });
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

    // Enhanced date/time picker handler based on working Playwright code
    const fillDateTime = async (dateInputId, timeInputName, date, time) => {
      try {
        // Click date input using ID with .first() to avoid strict mode
        const dateInput = this.page.locator(`#${dateInputId}`).first();
        await dateInput.click({ force: true });

        // Wait a moment for the calendar to appear
        await this.page.waitForTimeout(500);

        // Extract day from date and click it
        const day = parseInt(date.split('-')[2], 10);

        // Try different selectors for day selection with more specific targeting
        const daySelectors = [
          `role=button[name="${day}"]`,
          `text="${day}"`,
          `div:has-text("${day}"):not(:has(div))`,
          `span:has-text("${day}")`,
          `.calendar-day:has-text("${day}")`,
          `[data-day="${day}"]`,
        ];

        let dayClicked = false;
        for (const selector of daySelectors) {
          try {
            const dayElement = this.page.locator(selector).first();
            if (await dayElement.isVisible({ timeout: 1000 })) {
              await dayElement.click({ force: true });
              dayClicked = true;
              break;
            }
          } catch (e) {
            continue;
          }
        }

        if (!dayClicked) {
          // Fallback: use Today button if available
          try {
            const todayButton = this.page.getByRole('button', {
              name: 'Today',
            });
            if (await todayButton.isVisible({ timeout: 1000 })) {
              await todayButton.click();
              dayClicked = true;
            }
          } catch (e) {
            // Continue with time selection
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

    // Handle nomination scrutiny start date (first field)
    try {
      const firstNominationInput = this.page
        .locator('#dateOfNominationSelectionStart')
        .first();
      await firstNominationInput.click({ force: true });
      await this.page.waitForTimeout(500);

      const day = parseInt(
        electionDetails.nominationScrutinyDate.split('-')[2],
        10
      );
      const dayElement = this.page.locator(`text="${day}"`).first();
      if (await dayElement.isVisible({ timeout: 2000 })) {
        await dayElement.click({ force: true });
      }

      // Click time buttons
      const timeButtons = ['00:', ':00'];
      for (const buttonText of timeButtons) {
        try {
          const timeButton = this.page.getByRole('button', {
            name: buttonText,
          });
          if (await timeButton.isVisible({ timeout: 500 })) {
            await timeButton.click({ force: true });
          }
        } catch (e) {
          // Ignore
        }
      }
    } catch (e) {
      console.warn('Failed to fill first nomination scrutiny date:', e.message);
    }

    // Handle nomination scrutiny end date (second field with same ID)
    if (electionDetails.nominationScrutinyEndDate) {
      try {
        const secondNominationInput = this.page
          .locator('#dateOfNominationSelectionStart')
          .nth(1);
        await secondNominationInput.click({ force: true });
        await this.page.waitForTimeout(500);

        const day = parseInt(
          electionDetails.nominationScrutinyEndDate.split('-')[2],
          10
        );
        const dayElement = this.page.locator(`text="${day}"`).first();
        if (await dayElement.isVisible({ timeout: 2000 })) {
          await dayElement.click({ force: true });
        }

        // Click time buttons
        const timeButtons = ['00:', ':00'];
        for (const buttonText of timeButtons) {
          try {
            const timeButton = this.page.getByRole('button', {
              name: buttonText,
            });
            if (await timeButton.isVisible({ timeout: 500 })) {
              await timeButton.click({ force: true });
            }
          } catch (e) {
            // Ignore
          }
        }
      } catch (e) {
        console.warn(
          'Failed to fill second nomination scrutiny date:',
          e.message
        );
      }
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
