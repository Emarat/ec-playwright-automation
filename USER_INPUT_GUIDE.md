# User Input Options for Election Test

## Configuration Overview

The test supports multi-environment configuration through `.env` file and interactive script selection.

### Current Configuration Structure:

- **Server Environments**: dev, training, prd
- **Election Types**: 5 different Bengali election types
- **Test Settings**: Headless mode, file paths, debug options

## Method 1: Interactive Script (Recommended)

Run the interactive script to select election type and environment:

```bash
npm test
# OR
node scripts/run-all-tests.js
```

This will show you a menu like:

```
🗳️  Election Schedule Creation Test Runner

📋 Current Configuration:
   Environment: training
   Election Type: জাতীয় সংসদ নির্বাচন
   Headless Mode: false

Please select which election type you want to create:

   1. জাতীয় সংসদ নির্বাচন
   2. উপজেলা পরিষদ নির্বাচন
   3. পৌরসভা নির্বাচন
   4. ইউনিয়ন পরিষদ নির্বাচন
   5. সিটি কর্পোরেশন নির্বাচন
   6. Random selection
   7. Change environment (current: training)

Enter your choice:
```

## Method 2: Environment Configuration (.env)

### Setup .env File

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Update the configuration values in `.env`:

```env
# Server Environment
ENVIRONMENT=training

# Server URLs and Credentials
TRAINING_BASE_URL=http://192.168.1.125:30333/
TRAINING_USERNAME=admin_2
TRAINING_PASSWORD=L3t35!96t

# Election Configuration
ELECTION_TYPE=জাতীয় সংসদ নির্বাচন

# Test Settings
HEADLESS_MODE=false
TEST_FILE_PATH=/path/to/your/test/file.pdf
```

### Run with .env Configuration

```bash
npx playwright test tests/scheduleCreation.spec.js
```

## Method 3: Direct Environment Variables

Set the `ELECTION_TYPE` environment variable before running the test:

```bash
# For জাতীয় সংসদ নির্বাচন
ELECTION_TYPE="জাতীয় সংসদ নির্বাচন" npx playwright test tests/scheduleCreation.spec.js --headed

# For উপজেলা পরিষদ নির্বাচন
ELECTION_TYPE="উপজেলা পরিষদ নির্বাচন" npx playwright test tests/scheduleCreation.spec.js --headed

# For পৌরসভা নির্বাচন
ELECTION_TYPE="পৌরসভা নির্বাচন" npx playwright test tests/scheduleCreation.spec.js --headed

# For ইউনিয়ন পরিষদ নির্বাচন
ELECTION_TYPE="ইউনিয়ন পরিষদ নির্বাচন" npx playwright test tests/scheduleCreation.spec.js --headed

# For সিটি কর্পোরেশন নির্বাচন
ELECTION_TYPE="সিটি কর্পোরেশন নির্বাচন" npx playwright test tests/scheduleCreation.spec.js --headed
```

## Method 4: Partial Matching

You can also use partial names (English or Bengali):

```bash
# These will all match জাতীয় সংসদ নির্বাচন
ELECTION_TYPE="জাতীয়" npx playwright test tests/scheduleCreation.spec.js
ELECTION_TYPE="সংসদ" npx playwright test tests/scheduleCreation.spec.js

# These will match উপজেলা পরিষদ নির্বাচন
ELECTION_TYPE="উপজেলা" npx playwright test tests/scheduleCreation.spec.js
ELECTION_TYPE="পরিষদ" npx playwright test tests/scheduleCreation.spec.js
```

## Available Environments

Configure different server environments in your `.env` file:

1. **dev**: Development server
2. **training**: Training server (default)
3. **prd**: Production server

## Environment Variables Reference

### Required Configuration

```env
# Environment selection
ENVIRONMENT=training

# Server configurations (set all three)
DEV_BASE_URL=http://your-dev-server:port/
TRAINING_BASE_URL=http://your-training-server:port/
PRD_BASE_URL=http://your-prod-server:port/

# Credentials for each environment
DEV_USERNAME=dev_user
TRAINING_USERNAME=training_user
PRD_USERNAME=prod_user

DEV_PASSWORD=dev_password
TRAINING_PASSWORD=training_password
PRD_PASSWORD=prod_password
```

### Optional Configuration

```env
# Election type selection
ELECTION_TYPE=জাতীয় সংসদ নির্বাচন

# Test settings
HEADLESS_MODE=false
DEBUG_MODE=false
TEST_FILE_PATH=/path/to/test/file.pdf
```

## Default Behavior

If no `ELECTION_TYPE` is provided, the test will randomly select an election type.

```bash
# Random selection
npx playwright test tests/scheduleCreation.spec.js
```

## Features

- **Multi-Environment Support**: Switch between dev, training, and production servers
- **Interactive Configuration**: Easy selection through menu interface
- **Timestamp in Name**: Each created schedule includes creation date and time for easy identification
- **Voting Time**: Always set to "9 AM to 5 PM" as requested
- **Dynamic Data**: Automatically generates realistic dates with proper intervals
- **Error Handling**: Invalid election types fall back to random selection with helpful error messages
- **Centralized Configuration**: All settings managed through `.env` file
