const { test, expect } = require('@playwright/test');
const { baseURL } = require('../config/environmentConfig');

test.use({ storageState: 'storage/loginAuth.json' });

test('Debug File Upload', async ({ page }) => {
  test.setTimeout(60000);

  try {
    console.log(`Navigating to: ${baseURL}`);
    await page.goto(baseURL, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Navigate to schedule management
    console.log('Searching for "নির্বাচনী তফসিল ব্যবস্থাপনা"...');

    const scheduleLink = page
      .locator('text="নির্বাচনী তফসিল ব্যবস্থাপনা"')
      .first();
    if (await scheduleLink.isVisible({ timeout: 5000 })) {
      await scheduleLink.click();
      await page.waitForTimeout(2000);

      // Click New Addition
      const newAdditionBtn = page.getByRole('button', { name: 'নতুন সংযোজন' });
      if (await newAdditionBtn.isVisible({ timeout: 5000 })) {
        await newAdditionBtn.click();
        await page.waitForTimeout(3000);

        console.log('Looking for file upload elements...');

        // Take screenshot to see current state
        await page.screenshot({
          path: 'test-artifacts/debug-before-file-upload.png',
          fullPage: true,
        });

        // Find all file inputs
        const fileInputs = page.locator('input[type="file"]');
        const count = await fileInputs.count();
        console.log(`Found ${count} file input elements`);

        if (count > 0) {
          for (let i = 0; i < count; i++) {
            const input = fileInputs.nth(i);
            const isVisible = await input.isVisible();
            const isEnabled = await input.isEnabled();
            console.log(
              `File input ${i + 1}: visible=${isVisible}, enabled=${isEnabled}`
            );

            if (isVisible || !isVisible) {
              // Try both visible and hidden inputs
              try {
                console.log(`Attempting file upload on input ${i + 1}...`);

                // Method 1: Direct setInputFiles
                await input.setInputFiles(
                  '/media/emarat/01DAFF647FDC7DE0/Test Material/pdf/dummy.pdf'
                );
                console.log(
                  `✓ Successfully set files on input ${
                    i + 1
                  } using setInputFiles`
                );

                // Take screenshot after upload
                await page.screenshot({
                  path: `test-artifacts/debug-after-upload-${i + 1}.png`,
                  fullPage: true,
                });

                // Check if file was actually selected
                const fileName = await input.evaluate(
                  (el) => el.files[0]?.name || 'No file'
                );
                console.log(`File name after upload: ${fileName}`);

                break;
              } catch (e) {
                console.log(
                  `Failed to upload file on input ${i + 1}: ${e.message}`
                );

                // Method 2: Try with file chooser
                try {
                  console.log(
                    `Trying file chooser approach on input ${i + 1}...`
                  );

                  const fileChooserPromise = page.waitForEvent('filechooser', {
                    timeout: 5000,
                  });
                  await input.click();
                  const fileChooser = await fileChooserPromise;
                  await fileChooser.setFiles(
                    '/media/emarat/01DAFF647FDC7DE0/Test Material/pdf/dummy.pdf'
                  );

                  console.log(
                    `✓ Successfully uploaded via file chooser on input ${i + 1}`
                  );

                  // Take screenshot after upload
                  await page.screenshot({
                    path: `test-artifacts/debug-after-chooser-${i + 1}.png`,
                    fullPage: true,
                  });

                  break;
                } catch (chooserError) {
                  console.log(
                    `File chooser also failed on input ${i + 1}: ${
                      chooserError.message
                    }`
                  );
                }
              }
            }
          }
        } else {
          // Look for upload buttons that might trigger file picker
          console.log('No file inputs found, looking for upload buttons...');

          const uploadButtons = page.locator(
            'button:has-text("Upload"), button:has-text("Choose"), div:has-text("Click to Upload")'
          );
          const buttonCount = await uploadButtons.count();
          console.log(`Found ${buttonCount} potential upload triggers`);

          for (let i = 0; i < buttonCount; i++) {
            const button = uploadButtons.nth(i);
            const text = await button.textContent();
            console.log(`Upload trigger ${i + 1}: "${text}"`);

            try {
              const fileChooserPromise = page.waitForEvent('filechooser', {
                timeout: 5000,
              });
              await button.click();
              const fileChooser = await fileChooserPromise;
              await fileChooser.setFiles(
                '/media/emarat/01DAFF647FDC7DE0/Test Material/pdf/dummy.pdf'
              );

              console.log(`✓ Successfully uploaded via trigger "${text}"`);
              await page.screenshot({
                path: `test-artifacts/debug-after-trigger-${i + 1}.png`,
                fullPage: true,
              });
              break;
            } catch (e) {
              console.log(`Failed with trigger "${text}": ${e.message}`);
            }
          }
        }

        // Final screenshot
        await page.screenshot({
          path: 'test-artifacts/debug-final-state.png',
          fullPage: true,
        });
      } else {
        console.log('New Addition button not found');
      }
    } else {
      console.log('Schedule management link not found');
    }
  } catch (error) {
    console.error('Debug test failed:', error.message);
    await page.screenshot({
      path: 'test-artifacts/debug-error.png',
      fullPage: true,
    });
    throw error;
  }
});
