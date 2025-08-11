#!/usr/bin/env node

/**
 * Interactive Election Test Runner
 *
 * This script allows you to select which election type and environment
 * before running the Playwright test.
 */

const { execSync, spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Load current .env configuration
const envPath = path.join(__dirname, '..', '.env');
let currentConfig = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      currentConfig[key.trim()] = value.trim();
    }
  });
}

const electionTypes = [
  'জাতীয় সংসদ নির্বাচন',
  'উপজেলা পরিষদ নির্বাচন',
  'পৌরসভা নির্বাচন',
  'ইউনিয়ন পরিষদ নির্বাচন',
  'সিটি কর্পোরেশন নির্বাচন',
];

const environments = ['dev', 'training', 'prd'];

// Test execution configuration
// Tests will run in this order. If a test file is not in this list, it will run at the end.
const testExecutionOrder = [
  {
    file: 'scheduleCreation.spec.js',
    description: 'Schedule Creation',
    waitAfter: 5000, // Wait 5 seconds after this test
  },
  {
    file: 'settings_creation.spec.js',
    description: 'Settings Creation',
    waitAfter: 2000, // Wait 2 seconds after this test
  },
  // Add more tests here as needed
  // {
  //   file: 'newTest.spec.js',
  //   description: 'New Test',
  //   waitAfter: 3000,
  // }
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Function to open the HTML report
function openReport() {
  const reportPath = path.join(
    __dirname,
    '..',
    'playwright-report',
    'index.html'
  );
  if (fs.existsSync(reportPath)) {
    log('\n📊 Opening HTML report...', 'cyan');
    try {
      // Try to open the report in the default browser
      const open = require('child_process').spawn;
      if (process.platform === 'darwin') {
        open('open', [reportPath]);
      } else if (process.platform === 'win32') {
        open('start', [reportPath], { shell: true });
      } else {
        open('xdg-open', [reportPath]);
      }
      log(`📈 Report available at: file://${reportPath}`, 'blue');
    } catch (error) {
      log(`📈 Report available at: file://${reportPath}`, 'blue');
    }
  } else {
    log('⚠️  No HTML report found. Check test execution.', 'yellow');
  }
}

// Function to discover all test files
function discoverTestFiles() {
  const testsDir = path.join(__dirname, '..', 'tests');
  const testFiles = [];

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item !== 'setup') {
        // Recursively scan subdirectories (except setup)
        scanDirectory(fullPath);
      } else if (item.endsWith('.spec.js')) {
        const relativePath = path.relative(testsDir, fullPath);
        testFiles.push({
          file: relativePath,
          fullPath: fullPath,
          description: relativePath
            .replace('.spec.js', '')
            .replace(/[_-]/g, ' '),
        });
      }
    });
  }

  scanDirectory(testsDir);
  return testFiles;
}

// Function to organize tests by execution order
function organizeTestExecution() {
  const discoveredTests = discoverTestFiles();
  const orderedTests = [];
  const remainingTests = [...discoveredTests];

  // First, add tests in the specified order
  testExecutionOrder.forEach((orderConfig) => {
    const testIndex = remainingTests.findIndex(
      (test) => test.file === orderConfig.file
    );
    if (testIndex !== -1) {
      const test = remainingTests[testIndex];
      orderedTests.push({
        ...test,
        description: orderConfig.description,
        waitAfter: orderConfig.waitAfter || 2000,
      });
      remainingTests.splice(testIndex, 1);
    }
  });

  // Then add any remaining tests
  remainingTests.forEach((test) => {
    orderedTests.push({
      ...test,
      waitAfter: 2000, // Default wait time
    });
  });

  return orderedTests;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showCurrentConfig() {
  log('\n📋 Current Configuration:', 'cyan');
  log(`   Environment: ${currentConfig.ENVIRONMENT || 'training'}`, 'blue');
  log(`   Election Type: ${currentConfig.ELECTION_TYPE || 'Not set'}`, 'blue');
  log(`   Headless Mode: ${currentConfig.HEADLESS_MODE || 'false'}`, 'blue');
  console.log('');
}

function selectElectionType() {
  log('Please select which election type you want to create:\n', 'yellow');

  electionTypes.forEach((type, index) => {
    log(`   ${index + 1}. ${type}`, 'blue');
  });

  log(`   ${electionTypes.length + 1}. Random selection`, 'blue');
  log(
    `   ${electionTypes.length + 2}. Change environment (current: ${
      currentConfig.ENVIRONMENT || 'training'
    })`,
    'blue'
  );
  console.log('\n');

  rl.question('Enter your choice: ', (answer) => {
    const choice = parseInt(answer);

    if (choice >= 1 && choice <= electionTypes.length) {
      const selectedType = electionTypes[choice - 1];
      log(`\n✅ Selected: ${selectedType}\n`, 'green');
      confirmAndRunTests(selectedType);
    } else if (choice === electionTypes.length + 1) {
      log('\n🎲 Using random election type selection\n', 'yellow');
      confirmAndRunTests(); // No specific type, will use random
    } else if (choice === electionTypes.length + 2) {
      selectEnvironment();
    } else {
      log('\n❌ Invalid choice. Please try again.\n', 'red');
      selectElectionType();
    }
  });
}

function selectEnvironment() {
  log('\n🌍 Select environment:\n', 'cyan');
  environments.forEach((env, index) => {
    const current = env === currentConfig.ENVIRONMENT ? ' (current)' : '';
    log(`   ${index + 1}. ${env}${current}`, 'blue');
  });
  console.log('\n');

  rl.question('Enter environment choice (1-3): ', (answer) => {
    const choice = parseInt(answer);
    if (choice >= 1 && choice <= environments.length) {
      const selectedEnv = environments[choice - 1];

      // Update .env file
      updateEnvironmentInFile(selectedEnv);
      currentConfig.ENVIRONMENT = selectedEnv;

      log(`\n✅ Environment changed to: ${selectedEnv}\n`, 'green');
      selectElectionType();
    } else {
      log('\n❌ Invalid choice. Please try again.\n', 'red');
      selectEnvironment();
    }
  });
}

function updateEnvironmentInFile(newEnv) {
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
      /^ENVIRONMENT=.*$/m,
      `ENVIRONMENT=${newEnv}`
    );
    fs.writeFileSync(envPath, envContent);
    log(`📝 Updated .env file: ENVIRONMENT=${newEnv}`, 'green');
  } catch (error) {
    log(`Error updating .env file: ${error.message}`, 'red');
  }
}

function confirmAndRunTests(electionType = null) {
  const env = currentConfig.ENVIRONMENT || 'training';
  const type = electionType || 'random';
  const headless = currentConfig.HEADLESS_MODE || 'false';

  // Discover and organize tests
  const testsToRun = organizeTestExecution();

  log('\n🎯 Test Configuration Summary:', 'bold');
  log('═'.repeat(50), 'cyan');
  log(`   Environment: ${env}`, 'blue');
  log(`   Election Type: ${type}`, 'blue');
  log(`   Headless Mode: ${headless}`, 'blue');
  log('═'.repeat(50), 'cyan');

  log('\nDiscovered tests to run in sequence:', 'yellow');
  testsToRun.forEach((test, index) => {
    log(`   ${index + 1}. 📋 ${test.description}`, 'blue');
  });

  log('\n🎬 Test Recording Features:', 'cyan');
  log('   📹 Videos: Recorded for all tests', 'blue');
  log('   📸 Screenshots: On test failures', 'blue');
  log('   📊 HTML Report: Generated with all results', 'blue');

  console.log('\n');
  rl.question('Do you want to proceed? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      rl.question(
        'Open HTML report after completion? (Y/n): ',
        (reportAnswer) => {
          const openReportAfter =
            reportAnswer.toLowerCase() !== 'n' &&
            reportAnswer.toLowerCase() !== 'no';
          runAllTests(electionType, testsToRun, openReportAfter);
        }
      );
    } else {
      log('\n❌ Test execution cancelled.', 'yellow');
      rl.close();
    }
  });
}
function runCommand(command, args, description) {
  return new Promise((resolve, reject) => {
    log(`\n${colors.bold}🚀 ${description}${colors.reset}`, 'cyan');
    log(`Running: ${command} ${args.join(' ')}`, 'blue');

    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    process.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${description} completed successfully!`, 'green');
        resolve();
      } else {
        log(`❌ ${description} failed with exit code ${code}`, 'red');
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    process.on('error', (error) => {
      log(`❌ ${description} failed: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function runAllTests(
  electionType = null,
  testsToRun = null,
  shouldOpenReport = true
) {
  try {
    const env = { ...process.env, ...currentConfig };
    if (electionType) {
      env.ELECTION_TYPE = electionType;
    }

    // If no tests provided, discover them
    if (!testsToRun) {
      testsToRun = organizeTestExecution();
    }

    log('\n🏁 Starting Complete Election Test Suite', 'bold');
    log('═'.repeat(60), 'cyan');

    // Build list of test files to run
    const testFiles = testsToRun.map((test) => `tests/${test.file}`);

    log(
      '🎬 Running all tests in a single execution to preserve videos...',
      'blue'
    );
    log(`📝 Test files: ${testFiles.join(', ')}`, 'blue');

    // Run all tests in one command to preserve all videos
    await runCommand(
      'npx',
      ['playwright', 'test', ...testFiles],
      'All Tests (Sequential Execution)'
    );

    log('\n🎉 All tests completed successfully!', 'green');
    log('═'.repeat(60), 'cyan');
    testsToRun.forEach((test) => {
      log(`✅ ${test.description}`, 'green');
    });

    // Open the HTML report if requested
    if (shouldOpenReport) {
      openReport();
    }

    log('\n📊 Test artifacts generated:', 'blue');
    log('   📈 HTML Report: playwright-report/index.html', 'blue');

    // Count and display video files
    try {
      const videoFiles = fs
        .readdirSync('test-results', { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => {
          const videoPath = path.join(
            'test-results',
            dirent.name,
            'video.webm'
          );
          return fs.existsSync(videoPath) ? videoPath : null;
        })
        .filter(Boolean);

      if (videoFiles.length > 0) {
        log(`   � Videos (${videoFiles.length} recorded):`, 'green');
        videoFiles.forEach((video) => {
          const testName = path.dirname(video).split('/')[1];
          const simpleName = testName
            .replace(/-chromium$/, '')
            .replace(/-/g, ' ');
          log(`      • ${simpleName}`, 'blue');
        });
      } else {
        log('   📹 Videos: None recorded', 'yellow');
      }
    } catch (error) {
      log('   � Videos: Check test-results/ directory', 'blue');
    }

    log('   📸 Screenshots: Available for failed tests', 'blue');
    log('   🔍 Traces: Available for retried tests', 'blue');
  } catch (error) {
    log('\n💥 Test execution failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    log(
      '\n🔍 Check the individual test outputs above for more details.',
      'yellow'
    );
    process.exit(1);
  }

  rl.close();
}

// Start the interactive process
log('\n🗳️  Election Automation Complete Test Runner\n', 'bold');
log(
  'This script will automatically discover and run all test files in sequence.',
  'blue'
);
showCurrentConfig();
selectElectionType();
