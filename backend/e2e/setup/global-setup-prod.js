/**
 * Global Setup for Production Tests
 * Sets the environment for test utilities
 */

export default function globalSetup() {
  // Set environment variables for production testing
  process.env.TEST_ENV = 'prod';
  process.env.PLAYWRIGHT_BASE_URL = 'https://dottie-backend.vercel.app';
  
  console.log('🚀 Production test environment configured');
  console.log('   Base URL:', process.env.PLAYWRIGHT_BASE_URL);
  console.log('   Test Environment:', process.env.TEST_ENV);
} 