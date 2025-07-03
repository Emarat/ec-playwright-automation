const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ScheduleCreationPage } = require('../pages/scheduleCreation');
const { baseURL, validUser } = require('../config/testData');

test.use({ storageState: 'storage/loginAuth.json' });

test('Schedule Creation Form Submission', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const schedulePage = new ScheduleCreationPage(page);

  await page.goto(baseURL);

  // Navigate to Schedule Module
  await schedulePage.navigateToScheduleModule();

  // Click New Addition button
  await schedulePage.clickNewAdditionButton();

  // Define election details with placeholder dates and times
  const electionDetails = {
    electionType: 'জাতীয় সংসদ নির্বাচন',
    electionName: 'Test Election',
    electionArea: 'ঢাকা',
    electionDate: '2025-07-10',
    electionTime: '10:00 AM',
    nominationSubmissionDate: '2025-07-11',
    nominationSubmissionTime: '05:00 PM',
    nominationScrutinyDate: '2025-07-12',
    nominationScrutinyTime: '11:00 AM',
    appealSubmissionDate: '2025-07-13',
    appealSubmissionTime: '04:00 PM',
    appealDisposalDate: '2025-07-14',
    appealDisposalTime: '10:00 AM',
    withdrawalDate: '2025-07-15',
    withdrawalTime: '03:00 PM',
    symbolAllotmentDate: '2025-07-16',
    symbolAllotmentTime: '09:00 AM',
    votingDate: '2025-07-17',
    votingTime: '08:00 AM',
    gazettePublicationDate: '2025-07-18',
    gazettePublicationTime: '02:00 PM',
    filePath: '/home/emarat/Documents/dummy-pdf_2.pdf', // Adjust path as needed
  };

  // Fill the schedule form
  await schedulePage.fillScheduleForm(electionDetails);

  // Click next tab
  await schedulePage.clickNextTab();

  // Fill age details
  await schedulePage.fillAgeDetails('25', 'ভোট গ্রহণের তারিখ');

  // Click next tab again
  await schedulePage.clickNextTab();

  // Click next tab again
  await schedulePage.clickNextTab();

  // Click submit button
  await schedulePage.clickSubmit();

  // Add assertions here to verify successful submission or expected outcome
  // For example, check for a success message or redirection
  // await expect(page.locator('text="Successfully Submitted"')).toBeVisible();
});
