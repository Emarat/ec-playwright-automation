# EC Automation with Playwright

Bengali Election Commission Schedule Creation Test Automation

## 🚀 Quick Start

1. **Setup Environment Configuration**:

   ```bash
   cp .env.example .env
   # Edit .env with your server details and preferences
   ```

2. **Run Interactive Test**:

   ```bash
   node scripts/run-election-test.js
   ```

3. **Or Run Directly**:
   ```bash
   npx playwright test tests/scheduleCreation.spec.js
   ```

## 📋 Features

- **Multi-Environment Support**: dev, training, production servers
- **Interactive Election Type Selection**: 5 Bengali election types
- **Dynamic Schedule Creation**: Automatic date/time generation
- **Centralized Configuration**: All settings in `.env` file
- **User-Friendly Scripts**: Easy-to-use interactive menus

## 🔧 Configuration

See [USER_INPUT_GUIDE.md](./USER_INPUT_GUIDE.md) for detailed configuration options.

### Essential Setup

1. Copy environment template:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your settings:
   ```env
   ENVIRONMENT=training
   TRAINING_BASE_URL=http://your-server:port/
   TRAINING_USERNAME=your_username
   TRAINING_PASSWORD=your_password
   ELECTION_TYPE=জাতীয় সংসদ নির্বাচন
   ```

## 📁 Project Structure

```
├── .env                    # Configuration file (create from .env.example)
├── .env.example           # Environment template
├── config/
│   └── environmentConfig.js # Environment-aware configuration
├── scripts/
│   └── run-election-test.js # Interactive test runner
├── tests/
│   └── scheduleCreation.spec.js # Main test file
├── pages/
│   ├── LoginPage.js       # Login page object
│   └── scheduleCreation.js # Schedule creation page object
└── USER_INPUT_GUIDE.md   # Detailed usage guide
```
