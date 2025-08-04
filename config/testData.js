const dotenv = require('dotenv');
dotenv.config();

// Get environment configuration based on ENVIRONMENT variable
function getEnvironmentConfig() {
  const env = process.env.ENVIRONMENT || 'training';

  const configs = {
    dev: {
      baseURL: process.env.DEV_BASE_URL,
      username: process.env.DEV_USERNAME,
      password: process.env.DEV_PASSWORD,
    },
    training: {
      baseURL: process.env.TRAINING_BASE_URL,
      username: process.env.TRAINING_USERNAME,
      password: process.env.TRAINING_PASSWORD,
    },
    prd: {
      baseURL: process.env.PRD_BASE_URL,
      username: process.env.PRD_USERNAME,
      password: process.env.PRD_PASSWORD,
    },
  };

  return configs[env] || configs.training;
}

const envConfig = getEnvironmentConfig();

module.exports = {
  baseURL: envConfig.baseURL,
  validUser: {
    username: envConfig.username,
    password: envConfig.password,
  },
  // Test settings from .env
  headless: process.env.HEADLESS_MODE === 'true',
  debug: process.env.DEBUG_MODE === 'true',
  testFilePath: process.env.TEST_FILE_PATH,
  electionType: process.env.ELECTION_TYPE,
};
