/**
 * Determines the appropriate API base URL based on deployment context
 */
export const getBaseUrl = (): string => {
  // PRIORITY 1: Are we in localhost development? (Never use env vars here)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Detect E2E mode - if frontend is running on port 3005, use backend port 5005
    const isE2EMode = window.location.port === '3005';
    const isMac = window.navigator.userAgent.includes('Mac');

    let API_PORT;
    if (isE2EMode) {
      API_PORT = 5005; // E2E mode uses port 5005 for backend
    } else {
      API_PORT = isMac ? 5001 : 5000; // Normal development mode
    }

    const localUrl = `http://${window.location.hostname}:${API_PORT}`;
    console.log(`[getBaseUrl] LOCALHOST detected - Using local backend: ${localUrl}`);
    return localUrl;
  }

  // PRIORITY 2: Check for CI/CD environment variable (Cloud Run via Firebase/GitHub Actions)
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log(
      `[getBaseUrl] Using CI/CD environment variable: ${import.meta.env.VITE_API_BASE_URL}`
    );
    return import.meta.env.VITE_API_BASE_URL;
  }

  // PRIORITY 3: LocalStorage override (for manual testing/debugging)
  const savedApiUrl = localStorage.getItem('api_base_url');
  if (savedApiUrl) {
    console.log(`[getBaseUrl] Using localStorage override: ${savedApiUrl}`);
    return savedApiUrl;
  }

  // PRIORITY 4: Default fallback - should not reach here in production
  console.error(
    `[getBaseUrl] CRITICAL: No API URL configured! Check VITE_API_BASE_URL environment variable.`
  );
  throw new Error('API base URL not configured. Please contact support.');
};

/**
 * Updates the API base URL at runtime
 */
export const setApiBaseUrl = (url: string): string => {
  localStorage.setItem('api_base_url', url);
  console.log(`[API Client] Base URL updated to: ${url}`);
  return url;
};

/**
 * Logs the current base URL configuration for debugging
 */
export const logBaseUrlConfig = (baseUrl: string): void => {
  console.log(`[API Client] Using base URL: ${baseUrl}`);
  console.log(`[API Client] Current hostname: ${window.location.hostname}`);

  // Log only environment variables that are actually set
  console.log(`[API Client] Environment Variables:`);

  const envVars = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE
  };

  // Only log variables that have actual values
  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      console.log(`  - ${key}: ${value}`);
    }
  });

  // Log localStorage override if exists
  const savedApiUrl = localStorage.getItem('api_base_url');
  if (savedApiUrl) {
    console.log(`[API Client] LocalStorage override available: ${savedApiUrl}`);
  }
};
