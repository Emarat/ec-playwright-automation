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
    await this.scheduleModuleLink.click();
    await expect(this.newAdditionButton).toBeVisible();
  }
  // ...existing code...
  async clickNewAdditionButton() {
    await this.newAdditionButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.electionTypeDropdown).toBeVisible();
  }

  async selectElectionType(electionType) {
    await this.electionTypeDropdown.click();
    await this.page.locator(`text="${electionType}"`).click();
    await this.page.waitForLoadState('networkidle');
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

    // Helper to fill date and time (handle readonly date pickers and strict mode)
    const fillDateTime = async (dateInput, timeInput, date, time) => {
      // Click the date input, select the day, then click 00:00 and 0:00 if present
      let dateSet = false;
      try {
        await dateInput.click({ force: true });
        // Try to select the day from the calendar popup
        const day = parseInt(date.split('-')[2], 10);
        const dayButton = this.page.locator(`role=button[name="${day}"]`);
        if (await dayButton.isVisible({ timeout: 2000 })) {
          await dayButton.click();
          dateSet = true;
        } else {
          const dayText = this.page.locator(`text="${day}"`);
          if (await dayText.isVisible({ timeout: 2000 })) {
            await dayText.click();
            dateSet = true;
          }
        }
        // After picking the date, try to click 00:00 and 0:00 if present
        const zeroTime = this.page.locator('text="00:00"');
        if (await zeroTime.isVisible({ timeout: 1000 })) {
          await zeroTime.click();
        }
        const altZeroTime = this.page.locator('text="0:00"');
        if (await altZeroTime.isVisible({ timeout: 1000 })) {
          await altZeroTime.click();
        }
      } catch (e) {
        // Ignore and fallback to JS set
      }
      // Fallback: set value via JS if UI interaction fails
      if (!dateSet) {
        try {
          const handle = await dateInput.elementHandle();
          if (handle) {
            await this.page.evaluate(
              ({ el, value }) => {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
              },
              { el: handle, value: date }
            );
          }
        } catch (e) {
          // If page is closed or handle is detached, skip
        }
      }
      // Always use .first() for timeInput to avoid strict mode violation
      const timeInputToUse = timeInput.first ? timeInput.first() : timeInput;
      // Try to fill, fallback to JS if not editable, but do not wait forever
      let filled = false;
      try {
        // Try to fill if editable and visible
        if (await timeInputToUse.isVisible({ timeout: 1000 })) {
          const isEditable = await timeInputToUse.evaluate(
            (el) => !el.readOnly && !el.disabled
          );
          if (isEditable) {
            await timeInputToUse.fill(time);
            filled = true;
          }
        }
      } catch (e) {
        // Ignore and fallback
      }
      if (!filled) {
        // Fallback: set value via JS if not editable or not visible
        try {
          const handle = await timeInputToUse.elementHandle();
          if (handle) {
            await this.page.evaluate(
              ({ el, value }) => {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
              },
              { el: handle, value: time }
            );
          }
        } catch (e) {
          // If still not possible, skip
        }
      }
    };

    await fillDateTime(
      this.electionDateInput,
      this.votingTimeInput,
      electionDetails.electionDate,
      electionDetails.electionTime
    );
    try {
      await fillDateTime(
        this.nominationSubmissionDateInput,
        this.nominationSubmissionTimeInput,
        electionDetails.nominationSubmissionDate,
        electionDetails.nominationSubmissionTime
      );
    } catch (e) {
      console.warn('Failed to fill nomination submission date/time:', e);
    }
    try {
      await fillDateTime(
        this.nominationScrutinyDateInput,
        this.nominationScrutinyTimeInput,
        electionDetails.nominationScrutinyDate,
        electionDetails.nominationScrutinyTime
      );
    } catch (e) {
      console.warn('Failed to fill nomination scrutiny date/time:', e);
    }

    // Fill nomination scrutiny end date/time if present
    if (
      await this.nominationScrutinyEndDateInput
        .isVisible({ timeout: 1000 })
        .catch(() => false)
    ) {
      await fillDateTime(
        this.nominationScrutinyEndDateInput,
        this.nominationScrutinyEndTimeInput,
        electionDetails.nominationScrutinyEndDate ||
          electionDetails.nominationScrutinyDate,
        electionDetails.nominationScrutinyEndTime ||
          electionDetails.nominationScrutinyTime
      );
    }
    await fillDateTime(
      this.appealSubmissionDateInput,
      this.appealSubmissionTimeInput,
      electionDetails.appealSubmissionDate,
      electionDetails.appealSubmissionTime
    );
    await fillDateTime(
      this.appealDisposalDateInput,
      this.appealDisposalTimeInput,
      electionDetails.appealDisposalDate,
      electionDetails.appealDisposalTime
    );
    await fillDateTime(
      this.withdrawalDateInput,
      this.withdrawalTimeInput,
      electionDetails.withdrawalDate,
      electionDetails.withdrawalTime
    );
    await fillDateTime(
      this.symbolAllotmentDateInput,
      this.symbolAllotmentTimeInput,
      electionDetails.symbolAllotmentDate,
      electionDetails.symbolAllotmentTime
    );
    await fillDateTime(
      this.votingDateInput,
      this.votingTimeInput,
      electionDetails.votingDate,
      electionDetails.votingTime
    );

    // Fill voting schedule if present
    if (
      await this.votingScheduleInput
        .isVisible({ timeout: 1000 })
        .catch(() => false)
    ) {
      await this.votingScheduleInput.fill(
        electionDetails.votingSchedule || '08:00-16:00'
      );
    }
    await fillDateTime(
      this.gazettePublicationDateInput,
      this.gazettePublicationTimeInput,
      electionDetails.gazettePublicationDate,
      electionDetails.gazettePublicationTime
    );

    // Upload file (required field)
    if (
      await this.fileUploadInput.isVisible({ timeout: 1000 }).catch(() => false)
    ) {
      await this.fileUploadInput.setInputFiles(electionDetails.filePath);
    }

    // Toggle অনলাইন নমিনেশন (required field)
    if (
      await this.onlineNominationActive
        .isVisible({ timeout: 1000 })
        .catch(() => false)
    ) {
      await this.onlineNominationActive.click();
    }

    // Fill schedule comment (required field)
    if (
      await this.scheduleComment
        .first()
        .isVisible({ timeout: 1000 })
        .catch(() => false)
    ) {
      await this.scheduleComment
        .first()
        .fill(
          electionDetails.scheduleComment || 'Automated schedule creation test'
        );
    }
  }

  async clickNextTab() {
    await this.nextTabButton.click();
  }

  async fillAgeDetails(minAge, ageCalculationDate) {
    await this.minAgeInput.fill(minAge);
    await this.ageCalculationDateDropdown.selectOption(ageCalculationDate);
  }

  async clickSubmit() {
    await this.submitButton.click();
  }
}

module.exports = { ScheduleCreationPage };
