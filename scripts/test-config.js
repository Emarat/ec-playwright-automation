#!/usr/bin/env node

/**
 * Configuration Test Script
 *
 * This script tests the environment configuration to ensure
 * all settings are loaded correctly from .env file.
 */

const environmentConfig = require('../config/environmentConfig');

console.log('\n🔧 Configuration Test Results\n');
console.log('='.repeat(50));

console.log('\n📋 Current Settings:');
console.log(`   Base URL: ${environmentConfig.baseURL}`);
console.log(`   Username: ${environmentConfig.validUser.username}`);
console.log(
  `   Password: ${environmentConfig.validUser.password ? '***' : 'Not set'}`
);
console.log(`   Headless Mode: ${environmentConfig.headless}`);
console.log(`   Debug Mode: ${environmentConfig.debug}`);
console.log(`   Election Type: ${environmentConfig.electionType}`);
console.log(`   Test File Path: ${environmentConfig.testFilePath}`);

console.log('\n🌍 Environment Variables:');
console.log(`   ENVIRONMENT: ${process.env.ENVIRONMENT || 'Not set'}`);
console.log(`   ELECTION_TYPE: ${process.env.ELECTION_TYPE || 'Not set'}`);
console.log(`   HEADLESS_MODE: ${process.env.HEADLESS_MODE || 'Not set'}`);

console.log('\n✅ Configuration loaded successfully!\n');

// Test different environments
console.log('🔄 Testing environment switching...\n');

const environments = ['dev', 'training', 'prd'];
environments.forEach((env) => {
  const envVar = env.toUpperCase();
  const baseUrl = process.env[`${envVar}_BASE_URL`];
  const username = process.env[`${envVar}_USERNAME`];
  const status = baseUrl && username ? '✅' : '❌';

  console.log(`   ${env.padEnd(8)} ${status} ${baseUrl || 'Not configured'}`);
});

console.log('\n' + '='.repeat(50) + '\n');
