/**
 * Environment Configuration Utility for Tests
 * 
 * Provides environment-specific expected values for tests
 * to handle differences between dev (SQLite) and prod (Supabase)
 */

/**
 * Detect environment based on available indicators
 * @returns {string} Environment name ('dev' or 'prod')
 */
function detectEnvironment() {
  console.log('🔍 Detecting test environment...');
  console.log(`   process.env.TEST_ENV: ${process.env.TEST_ENV}`);
  console.log(`   process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   process.env.PLAYWRIGHT_BASE_URL: ${process.env.PLAYWRIGHT_BASE_URL}`);
  console.log(`   globalThis.DOTTIE_TEST_ENV: ${globalThis.DOTTIE_TEST_ENV}`);
  
  // Check for environment variables first
  if (process.env.TEST_ENV === 'prod' || process.env.NODE_ENV === 'production') {
    console.log('✅ Environment detected as: prod (from env vars)');
    return 'prod';
  }
  
  // Check if we're using a Vercel URL
  if (process.env.PLAYWRIGHT_BASE_URL && process.env.PLAYWRIGHT_BASE_URL.includes('vercel.app')) {
    console.log('✅ Environment detected as: prod (from Vercel URL)');
    return 'prod';
  }
  
  // Check global test context if available
  if (typeof globalThis !== 'undefined' && globalThis.DOTTIE_TEST_ENV) {
    console.log(`✅ Environment detected as: ${globalThis.DOTTIE_TEST_ENV} (from global)`);
    return globalThis.DOTTIE_TEST_ENV;
  }
  
  console.log('✅ Environment detected as: dev (default)');
  return 'dev'; // default to dev
}

/**
 * Get environment-specific expected values
 * @returns {Object} Expected values for the current environment
 */
export function getEnvironmentExpectations() {
  const environment = detectEnvironment();
  
  const expectations = {
    dev: {
      dbType: 'SQLite',
      environment: 'development',
      hasWebServer: true
    },
    prod: {
      dbType: 'Supabase', 
      environment: 'production',
      hasWebServer: false
    }
  };
  
  return {
    environment,
    ...expectations[environment]
  };
}

/**
 * Get expected database type for current environment
 * @returns {string} Expected database type
 */
export function getExpectedDbType() {
  const expectations = getEnvironmentExpectations();
  console.log(`📊 Expected DB Type for ${expectations.environment}: ${expectations.dbType}`);
  return expectations.dbType;
}

/**
 * Check if current environment is development
 * @returns {boolean} True if running against dev environment
 */
export function isDevEnvironment() {
  const expectations = getEnvironmentExpectations();
  return expectations.environment === 'development';
}

/**
 * Check if current environment is production
 * @returns {boolean} True if running against prod environment
 */
export function isProdEnvironment() {
  const expectations = getEnvironmentExpectations();
  return expectations.environment === 'production';
}

/**
 * Set the test environment manually (useful for test setup)
 * @param {string} env - Environment ('dev' or 'prod')
 */
export function setTestEnvironment(env) {
  globalThis.DOTTIE_TEST_ENV = env;
}

/**
 * Get expected values by explicitly passing the environment
 * @param {string} environment - 'dev' or 'prod'
 * @returns {Object} Expected values for the environment
 */
export function getExpectationsByEnvironment(environment) {
  const expectations = {
    dev: {
      dbType: 'SQLite',
      environment: 'development',
      hasWebServer: true
    },
    prod: {
      dbType: 'Supabase', 
      environment: 'production',
      hasWebServer: false
    }
  };
  
  return {
    environment,
    ...expectations[environment]
  };
} 