#!/usr/bin/env node

const { spawn } = require('child_process');
require('dotenv').config();

console.log('🔧 Running Settings Creation Test...');
console.log('═'.repeat(50));

// Get election type from environment
const electionType = process.env.ELECTION_TYPE || 'জাতীয় সংসদ নির্বাচন';
const environment = process.env.ENVIRONMENT || 'training';

console.log(`📋 Election Type: ${electionType}`);
console.log(`🌍 Environment: ${environment}`);
console.log('═'.repeat(50));

const testProcess = spawn(
  'npx',
  ['playwright', 'test', 'tests/settings_creation.spec.js', '--headed'],
  {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(), // Use current working directory instead of __dirname
  }
);

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Settings creation test completed successfully!');
  } else {
    console.log(`\n❌ Settings creation test failed with exit code ${code}`);
    process.exit(code);
  }
});

testProcess.on('error', (error) => {
  console.error(`\n💥 Failed to start test: ${error.message}`);
  process.exit(1);
});
