#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

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

function runCommand(command, args, description) {
  return new Promise((resolve, reject) => {
    log(`\n${colors.bold}🚀 ${description}${colors.reset}`, 'cyan');
    log(`Running: ${command} ${args.join(' ')}`, 'blue');

    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname,
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

async function runSequentialTests() {
  try {
    log('\n🎯 Starting Sequential Election Test Suite', 'bold');
    log('═'.repeat(60), 'cyan');

    // Step 1: Run Schedule Creation
    await runCommand(
      'npx',
      [
        'playwright',
        'test',
        'tests/scheduleCreation.spec.js',
        '--reporter=line',
      ],
      'Step 1: Schedule Creation'
    );

    // Wait a bit between tests to ensure data is properly saved
    log('\n⏳ Waiting 5 seconds for schedule to be saved...', 'yellow');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Step 2: Run Settings Creation
    await runCommand(
      'npx',
      [
        'playwright',
        'test',
        'tests/settings_creation.spec.js',
        '--reporter=line',
      ],
      'Step 2: Settings Creation'
    );

    log('\n🎉 All tests completed successfully!', 'green');
    log('═'.repeat(60), 'cyan');
    log('✅ Schedule Created', 'green');
    log('✅ Settings Created for Schedule', 'green');
    log(
      '\n📊 Check the test artifacts folder for screenshots and debugging info.',
      'blue'
    );
  } catch (error) {
    log('\n💥 Sequential test execution failed!', 'red');
    log(`Error: ${error.message}`, 'red');
    log(
      '\n🔍 Check the individual test outputs above for more details.',
      'yellow'
    );
    process.exit(1);
  }
}

// Check if this script is being run directly
if (require.main === module) {
  log('🏁 Election Automation Sequential Test Runner', 'bold');
  log(
    'This script will run schedule creation followed by settings creation.',
    'blue'
  );

  runSequentialTests();
}

module.exports = { runSequentialTests };
