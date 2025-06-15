// API URLs for different test environments
export const URLS = {
  DEV: 'http://localhost:5000',
  PROD: 'https://dottie-backend.vercel.app',
  MOCK: 'http://localhost:5000' // Same as DEV but will trigger mock responses
};

// Get current environment (defaults to DEV)
export const getEnvironment = () => {
  // Force MOCK environment when testing serverless/prod
  if (process.env.TEST_ENV?.toUpperCase() === 'PROD' && process.env.USE_MOCKS === 'true') {
    return 'MOCK';
  }
  return process.env.TEST_ENV?.toUpperCase() === 'PROD' ? 'PROD' : 'DEV';
};

// Get API URL for the current or specified environment
export const getApiUrl = (env = getEnvironment()) => {
  const urlType = env in URLS ? env : 'DEV';
  
  // Enable mock mode for all auth:prod tests unless explicitly disabled
  if (process.env.npm_lifecycle_script?.includes('test:auth:prod') && process.env.USE_MOCKS !== 'false') {
    process.env.USE_MOCKS = 'true';
    return URLS[urlType];
  }
  
  return URLS[urlType];
}; 