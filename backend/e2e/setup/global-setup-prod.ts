/**
 * Global Setup for Production Tests
 * Sets the environment for test utilities
 */

export default function globalSetup() {
  // Set environment variables for production testing
  process.env.TEST_ENV = 'prod';

  // Only set PLAYWRIGHT_BASE_URL if not already set (CI or manual override)
  if (!process.env.PLAYWRIGHT_BASE_URL) {
    process.env.PLAYWRIGHT_BASE_URL = 'https://dottie-api-v7hdajoteq-nw.a.run.app';
  }

  console.log('🚀 Production test environment configured');
  console.log('   Base URL:', process.env.PLAYWRIGHT_BASE_URL);
  console.log('   Test Environment:', process.env.TEST_ENV);
} 