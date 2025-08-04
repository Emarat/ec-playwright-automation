#!/usr/bin/env node

/**
 * Interactive Election Test Runner
 *
 * This script allows you to select which election type and environment
 * before running the Playwright test.
 */

const { execSync } = require('child_process');
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showCurrentConfig() {
  console.log('\n📋 Current Configuration:');
  console.log(`   Environment: ${currentConfig.ENVIRONMENT || 'training'}`);
  console.log(`   Election Type: ${currentConfig.ELECTION_TYPE || 'Not set'}`);
  console.log(`   Headless Mode: ${currentConfig.HEADLESS_MODE || 'false'}`);
  console.log('');
}

function selectElectionType() {
  console.log('Please select which election type you want to create:\n');

  electionTypes.forEach((type, index) => {
    console.log(`   ${index + 1}. ${type}`);
  });

  console.log(`   ${electionTypes.length + 1}. Random selection`);
  console.log(
    `   ${electionTypes.length + 2}. Change environment (current: ${
      currentConfig.ENVIRONMENT || 'training'
    })`
  );
  console.log('\n');

  rl.question('Enter your choice: ', (answer) => {
    const choice = parseInt(answer);

    if (choice >= 1 && choice <= electionTypes.length) {
      const selectedType = electionTypes[choice - 1];
      console.log(`\n✅ Selected: ${selectedType}\n`);
      runTest(selectedType);
    } else if (choice === electionTypes.length + 1) {
      console.log('\n🎲 Using random election type selection\n');
      runTest(); // No specific type, will use random
    } else if (choice === electionTypes.length + 2) {
      selectEnvironment();
    } else {
      console.log('\n❌ Invalid choice. Please try again.\n');
      selectElectionType();
    }
  });
}

function selectEnvironment() {
  console.log('\n🌍 Select environment:\n');
  environments.forEach((env, index) => {
    const current = env === currentConfig.ENVIRONMENT ? ' (current)' : '';
    console.log(`   ${index + 1}. ${env}${current}`);
  });
  console.log('\n');

  rl.question('Enter environment choice (1-3): ', (answer) => {
    const choice = parseInt(answer);
    if (choice >= 1 && choice <= environments.length) {
      const selectedEnv = environments[choice - 1];

      // Update .env file
      updateEnvironmentInFile(selectedEnv);
      currentConfig.ENVIRONMENT = selectedEnv;

      console.log(`\n✅ Environment changed to: ${selectedEnv}\n`);
      selectElectionType();
    } else {
      console.log('\n❌ Invalid choice. Please try again.\n');
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
    console.log(`📝 Updated .env file: ENVIRONMENT=${newEnv}`);
  } catch (error) {
    console.error('Error updating .env file:', error.message);
  }
}

function runTest(electionType = null) {
  try {
    const env = { ...process.env, ...currentConfig };
    if (electionType) {
      env.ELECTION_TYPE = electionType;
    }

    console.log(`\n🚀 Running test with:`);
    console.log(`   Environment: ${env.ENVIRONMENT || 'training'}`);
    console.log(`   Election Type: ${env.ELECTION_TYPE || 'random'}`);
    console.log(`   Headless: ${env.HEADLESS_MODE || 'false'}\n`);

    execSync(`npx playwright test tests/scheduleCreation.spec.js`, {
      stdio: 'inherit',
      env: env,
    });
  } catch (error) {
    console.error('Test execution failed:', error.message);
  }

  rl.close();
}

// Start the interactive process
console.log('\n🗳️  Election Schedule Creation Test Runner\n');
showCurrentConfig();
selectElectionType();
