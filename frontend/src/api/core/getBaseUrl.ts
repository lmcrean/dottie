/**
 * Determines the appropriate API base URL based on deployment context
 */
export const getBaseUrl = (): string => {
  // PRIORITY 1: Environment variable (for CI/CD deployments)
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log(`[getBaseUrl] Using environment variable: ${import.meta.env.VITE_API_BASE_URL}`);
    return import.meta.env.VITE_API_BASE_URL;
  }

  console.log(`[getBaseUrl] No VITE_API_BASE_URL found, falling back to detection logic`);

  // PRIORITY 2: Are we in localhost development?
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
    console.log(`[getBaseUrl] Using localhost: ${localUrl}`);
    return localUrl;
  }

  // PRIORITY 3: Are we in a Vercel branch deployment?
  const isVercelDeployment = window.location.hostname.includes('vercel.app');
  if (isVercelDeployment) {
    const hostname = window.location.hostname;
    
    // 3a. Are we in the main Vercel production branch?
    if (hostname === 'dottie-lmcreans-projects.vercel.app') {
      const prodUrl = 'https://dottie-backend.vercel.app';
      console.log(`[getBaseUrl] Using production backend: ${prodUrl}`);
      return prodUrl;
    }
    
    // 3b. Are we in a Vercel branch deployment? (This is likely to fail)
    if (hostname.includes('dottie-') && hostname.includes('-lmcreans-projects.vercel.app')) {
      // Extract the branch identifier from the frontend URL
      const branchPart = hostname.replace('dottie-', '').replace('-lmcreans-projects.vercel.app', '');
      const constructedUrl = `https://dottie-backend-${branchPart}-lmcreans-projects.vercel.app`;
      console.warn(`[getBaseUrl] CONSTRUCTED backend URL (likely to fail): ${constructedUrl}`);
      console.warn(`[getBaseUrl] This should use VITE_API_BASE_URL instead!`);
      return constructedUrl;
    }
  }

  // PRIORITY 4: LocalStorage override (for manual testing/debugging)
  const savedApiUrl = localStorage.getItem('api_base_url');
  if (savedApiUrl) {
    console.log(`[getBaseUrl] Using localStorage override: ${savedApiUrl}`);
    return savedApiUrl;
  }

  // PRIORITY 5: Default fallback to production backend
  const fallbackUrl = 'https://dottie-backend.vercel.app';
  console.log(`[getBaseUrl] Using fallback: ${fallbackUrl}`);
  return fallbackUrl;
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
}; 