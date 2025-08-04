const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ScheduleCreationPage } = require('../pages/scheduleCreation');
const environmentConfig = require('../config/environmentConfig');

test.use({ storageState: 'storage/loginAuth.json' });

// Helper function to generate dynamic election data
function generateElectionData() {
  const currentDate = new Date();
  const electionTypes = [
    'জাতীয় সংসদ নির্বাচন',
    'উপজেলা পরিষদ নির্বাচন',
    'পৌরসভা নির্বাচন',
    'ইউনিয়ন পরিষদ নির্বাচন',
    'সিটি কর্পোরেশন নির্বাচন',
  ];

  // Get election type from environment variable or use random selection
  let electionType;
  const userElectionType = process.env.ELECTION_TYPE;
  
  if (userElectionType) {
    // Check if the provided election type is valid
    const foundType = electionTypes.find(type => 
      type.toLowerCase().includes(userElectionType.toLowerCase()) ||
      userElectionType.toLowerCase().includes(type.toLowerCase())
    );
    
    if (foundType) {
      electionType = foundType;
      console.log(`🗳️ Using user-specified election type: ${electionType}`);
    } else {
      console.warn(`⚠️ Invalid election type "${userElectionType}". Available types:`);
      electionTypes.forEach((type, index) => {
        console.log(`   ${index + 1}. ${type}`);
      });
      console.log('Using random selection instead...');
      electionType = electionTypes[Math.floor(Math.random() * electionTypes.length)];
    }
  } else {
    // Generate random election type if no user input
    electionType = electionTypes[Math.floor(Math.random() * electionTypes.length)];
    console.log(`�� Using random election type: ${electionType}`);
  }

  // Generate Bengali election name based on election type + টেস্ট + current date + time
  const currentDateStr = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const currentTimeStr = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }); // Format: HH:MM

  const electionName = `${electionType} টেস্ট ${currentDateStr} ${currentTimeStr}`;

  // Generate dates with proper intervals (minimum 2-3 days gap between events)
  const baseDate = new Date(currentDate);
  baseDate.setDate(baseDate.getDate() + 30); // Start 30 days from now

  const dates = {
    electionDate: new Date(baseDate),
    nominationSubmissionDate: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000), // +3 days
    nominationScrutinyDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000), // +7 days
    nominationScrutinyEndDate: new Date(baseDate.getTime() + 9 * 24 * 60 * 60 * 1000), // +9 days
    appealSubmissionDate: new Date(baseDate.getTime() + 12 * 24 * 60 * 60 * 1000), // +12 days
    appealDisposalDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000), // +15 days
    withdrawalDate: new Date(baseDate.getTime() + 18 * 24 * 60 * 60 * 1000), // +18 days
    symbolAllotmentDate: new Date(baseDate.getTime() + 21 * 24 * 60 * 60 * 1000), // +21 days
    votingDate: new Date(baseDate.getTime() + 25 * 24 * 60 * 60 * 1000), // +25 days
    gazettePublicationDate: new Date(baseDate.getTime() + 28 * 24 * 60 * 60 * 1000), // +28 days
  };

  // Format dates and times
  const formatDate = (date) => date.toISOString().split('T')[0];
  const getStandardTime = () => '10:00 AM'; // Standard time for all events

  return {
    electionType,
    electionName,
    electionNameEn: `${electionName} (Test)`, // English version with Test suffix
    electionArea: 'ঢাকা',
    electionDate: formatDate(dates.electionDate),
    electionTime: getStandardTime(),
    nominationSubmissionDate: formatDate(dates.nominationSubmissionDate),
    nominationSubmissionTime: getStandardTime(),
    nominationScrutinyDate: formatDate(dates.nominationScrutinyDate),
    nominationScrutinyTime: getStandardTime(),
    nominationScrutinyEndDate: formatDate(dates.nominationScrutinyEndDate),
    nominationScrutinyEndTime: getStandardTime(),
    appealSubmissionDate: formatDate(dates.appealSubmissionDate),
    appealSubmissionTime: getStandardTime(),
    appealDisposalDate: formatDate(dates.appealDisposalDate),
    appealDisposalTime: getStandardTime(),
    withdrawalDate: formatDate(dates.withdrawalDate),
    withdrawalTime: getStandardTime(),
    symbolAllotmentDate: formatDate(dates.symbolAllotmentDate),
    symbolAllotmentTime: getStandardTime(),
    votingDate: formatDate(dates.votingDate),
    votingTime: '9 AM to 5 PM', // Fixed voting time as requested
    gazettePublicationDate: formatDate(dates.gazettePublicationDate),
    gazettePublicationTime: getStandardTime(),
    votingSchedule: '9 AM To 5 PM',
    scheduleComment: `Automated schedule creation for ${electionName} - ${new Date().toLocaleString()}`,
    filePath: '/media/emarat/01DAFF647FDC7DE0/Test Material/pdf/dummy.pdf', // Your specified file path
  };
}

test('Dynamic Schedule Creation Form Submission', async ({ page }) => {
  // Increase timeout for this complex test
  test.setTimeout(120000); // 2 minutes

  const schedulePage = new ScheduleCreationPage(page);

  // Generate dynamic election data
  const electionDetails = generateElectionData();
  console.log('Generated Election Details:', electionDetails);

  try {
    // Navigate to base URL and find schedule management
    console.log(`Navigating to: ${environmentConfig.baseURL}`);
    await page.goto(environmentConfig.baseURL, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    let pageLoaded = false;

    // Check if we can find the "New Addition" button directly
    const newAdditionBtn = page.getByRole('button', { name: 'নতুন সংযোজন' });
    if (await newAdditionBtn.isVisible({ timeout: 5000 })) {
      console.log('✓ Found New Addition button - we are on the schedule page');
      pageLoaded = true;
    } else {
      // Need to navigate to schedule management
      console.log('Searching for "নির্বাচনী তফসিল ব্যবস্থাপনা"...');

      const scheduleLink = page.locator('text="নির্বাচনী তফসিল ব্যবস্থাপনা"').first();
      if (await scheduleLink.isVisible({ timeout: 5000 })) {
        await scheduleLink.click();
        await page.waitForLoadState('networkidle');
        pageLoaded = true;
      }
    }

    if (!pageLoaded) {
      throw new Error('Could not find or navigate to the schedule creation page');
    }

    // Now proceed with the form creation
    console.log('✓ Successfully reached schedule page. Proceeding with form creation...');

    // Click New Addition button
    await schedulePage.clickNewAdditionButton();

    // Fill the schedule form
    console.log('Filling schedule form...');
    await schedulePage.fillScheduleForm(electionDetails);

    // ✅ VERIFICATION: Ensure election type and schedule name match
    console.log('🔍 Verifying election type and schedule name consistency...');
    console.log(`📋 Expected Election Type: "${electionDetails.electionType}"`);
    console.log(`📝 Generated Schedule Name: "${electionDetails.electionName}"`);
    
    // Verify that the schedule name contains the election type
    if (!electionDetails.electionName.includes(electionDetails.electionType)) {
      throw new Error(`❌ Mismatch! Schedule name "${electionDetails.electionName}" does not contain election type "${electionDetails.electionType}"`);
    }
    
    console.log('✅ Verification passed: Election type and schedule name are consistent');

    // Navigate through tabs
    console.log('Navigating through tabs...');
    await schedulePage.clickNextTab();
    await schedulePage.fillAgeDetails('25', 'ভোট গ্রহণের তারিখ');
    await schedulePage.clickNextTab();
    await schedulePage.clickNextTab();

    // Submit form
    console.log('Submitting form...');
    await schedulePage.clickSubmit();

    // Verify completion
    console.log('Verifying schedule creation...');
    await page.waitForTimeout(5000);

    await expect(page).toHaveURL(/.*/, { timeout: 10000 });
    console.log('✅ Schedule creation test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-artifacts/test-failure.png' });
    throw error;
  }
});
