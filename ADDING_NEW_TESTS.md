# Adding New Tests - Developer Guide

## 🎯 **Answer to Your Question:**

**When you add a new test file, it will work automatically!** ✅

You **DO NOT** need to modify the script file. The script now uses **automatic test discovery**.

## 🔄 **How Auto-Discovery Works:**

### 1. **Automatic Test Detection:**

- The script scans the `tests/` directory for all `*.spec.js` files
- It automatically includes any new test files you add
- It recursively searches subdirectories (except `setup/`)

### 2. **Execution Order Control:**

You can control the execution order by modifying the `testExecutionOrder` array in `scripts/run-all-tests.js`:

```javascript
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
  // Add your new test here for specific ordering
  {
    file: 'yourNewTest.spec.js',
    description: 'Your New Test',
    waitAfter: 3000,
  },
];
```

### 3. **Default Behavior for New Tests:**

- Tests **NOT** in the `testExecutionOrder` array will run **at the end**
- They get a default wait time of 2 seconds
- They use the filename as description (auto-generated)

## 📝 **Adding a New Test - Step by Step:**

### Option 1: Just Add the File (Simplest)

1. Create your test file: `tests/myNewTest.spec.js`
2. Run the script: `npm test`
3. ✅ **Done!** Your test will be automatically discovered and run at the end

### Option 2: Control Execution Order (Recommended)

1. Create your test file: `tests/myNewTest.spec.js`
2. Edit `scripts/run-all-tests.js`
3. Add your test to the `testExecutionOrder` array:
   ```javascript
   {
     file: 'myNewTest.spec.js',
     description: 'My New Test Description',
     waitAfter: 3000, // Wait time in milliseconds
   }
   ```
4. Run the script: `npm test`
5. ✅ **Done!** Your test runs in the specified order

## 🗂️ **Supported File Structure:**

```
tests/
├── scheduleCreation.spec.js     ✅ Discovered
├── settings_creation.spec.js    ✅ Discovered
├── myNewTest.spec.js           ✅ Discovered (new)
├── subfolder/
│   └── subTest.spec.js         ✅ Discovered
├── setup/
│   └── login.setup.js          ❌ Ignored (setup folder)
└── someOtherFile.js           ❌ Ignored (not *.spec.js)
```

## 🎬 **Example: Adding a New Test**

### 1. Create the test file:

```javascript
// tests/dataValidation.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Data Validation Tests', () => {
  test('should validate election data', async ({ page }) => {
    // Your test logic here
  });
});
```

### 2. (Optional) Add to execution order:

```javascript
// In scripts/run-all-tests.js
const testExecutionOrder = [
  {
    file: 'scheduleCreation.spec.js',
    description: 'Schedule Creation',
    waitAfter: 5000,
  },
  {
    file: 'dataValidation.spec.js', // ← Add this
    description: 'Data Validation', // ← Custom description
    waitAfter: 3000, // ← Wait 3 seconds after
  },
  {
    file: 'settings_creation.spec.js',
    description: 'Settings Creation',
    waitAfter: 2000,
  },
];
```

### 3. Run the tests:

```bash
npm test
```

### 4. See the result:

```
🎯 Test Configuration Summary:
═════════════════════════════════════════════════
   Environment: training
   Election Type: জাতীয় সংসদ নির্বাচন
   Headless Mode: false
═════════════════════════════════════════════════

Discovered tests to run in sequence:
   1. 📋 Schedule Creation
   2. 📋 Data Validation          ← Your new test!
   3. 📋 Settings Creation
```

## ⚡ **Quick Summary:**

- ✅ **New test files work automatically**
- ✅ **No script modification needed** (basic case)
- ✅ **Optional order control** available
- ✅ **Automatic discovery** of all `*.spec.js` files
- ✅ **Maintains existing functionality**

**Just add your test file and run `npm test` - it will work!** 🚀
