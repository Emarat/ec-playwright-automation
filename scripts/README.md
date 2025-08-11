# Election Automation Scripts

This directory contains utility scripts for running the election automation tests.

## 📁 Available Scripts

### `run-all-tests.js` - Complete Test Runner ⭐

The main comprehensive test runner that handles everything in one place.

**Features:**

- **🔍 Automatic Test Discovery**: Automatically finds and runs all `*.spec.js` files
- Interactive menu for selecting election types (in Bengali)
- Environment switching (dev, training, prod)
- **🎯 Configurable Execution Order**: Control the order tests run in
- **🎬 Full Test Recording**: Videos for all tests, screenshots on failure
- **📊 Rich HTML Reports**: Detailed test reports with videos and traces
- Runs tests in sequence with proper wait times between them
- Colored console output for better visibility
- Confirmation before running tests
- Proper error handling and progress tracking

**Usage:**

```bash
# Interactive mode (recommended)
node scripts/run-all-tests.js

# Or using npm
npm test

# View last test report
npm run report

# View report on network (accessible from other devices)
npm run report:open
```

**What it does:**

1. **🔍 Automatically discovers** all test files in `tests/` directory
2. Shows current configuration (environment, election type, headless mode)
3. Allows you to select election type or change environment
4. **📋 Lists all discovered tests** in execution order
5. **🎬 Shows recording features** (videos, screenshots, reports)
6. Confirms your settings before running
7. **🔄 Runs all tests sequentially** with proper wait times
8. **📊 Generates comprehensive HTML reports** with videos
9. **🌐 Automatically opens report** in browser (optional)
10. Shows completion status and results

**🆕 Auto-Discovery Feature:**

- **No need to modify the script** when adding new test files!
- Just create `yourTest.spec.js` in the `tests/` folder
- The script will automatically find and run it
- See `ADDING_NEW_TESTS.md` for details

### `test-config.js` - Configuration Validator

Tests and displays the current configuration setup.

**Usage:**

```bash
node scripts/test-config.js
# Or using npm
npm run test:config
```

## 🚀 Quick Start

### For Development/Testing:

```bash
# Run the complete test suite interactively
npm test
```

### For Individual Tests:

```bash
# Run only schedule creation
npm run test:schedule

# Run only settings creation
npm run test:settings

# Run in headed mode (browser visible)
npm run test:headed
```

### For Configuration Check:

```bash
# Verify your environment setup
npm run test:config
```

## 🔧 Prerequisites

1. **Environment Configuration**: Ensure `.env` file exists with proper variables
2. **Dependencies**: Run `npm install`
3. **Playwright Setup**: Browser installation complete
4. **Login Setup**: Authentication properly configured

## 📋 Election Types Supported

- জাতীয় সংসদ নির্বাচন (National Parliament Election)
- উপজেলা পরিষদ নির্বাচন (Upazila Council Election)
- পৌরসভা নির্বাচন (Municipality Election)
- ইউনিয়ন পরিষদ নির্বাচন (Union Council Election)
- সিটি কর্পোরেশন নির্বাচন (City Corporation Election)

## 🌍 Environments

- **dev**: Development environment
- **training**: Training environment (default)
- **prd**: Production environment

---

**Recommended Workflow:**

1. Run `npm run test:config` to verify setup
2. Run `npm test` for complete interactive testing
3. Select your environment and election type
4. Let the script handle the rest automatically!
