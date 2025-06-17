/**
 * Determines the appropriate API base URL based on deployment context
 */
export const getBaseUrl = (): string => {
  // 1. Are we in localhost development?
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

    return `http://${window.location.hostname}:${API_PORT}`;
  }

  // 2. Are we in a Vercel branch deployment?
  const isVercelDeployment = window.location.hostname.includes('vercel.app');
  if (isVercelDeployment) {
    const hostname = window.location.hostname;
    
    // 2a. Are we in the main Vercel production branch?
    if (hostname === 'dottie-lmcreans-projects.vercel.app') {
      return 'https://dottie-backend.vercel.app';
    }
    
    // 2b. Are we in a Vercel branch deployment?
    if (hostname.includes('dottie-') && hostname.includes('-lmcreans-projects.vercel.app')) {
      // Extract the branch identifier from the frontend URL
      const branchPart = hostname.replace('dottie-', '').replace('-lmcreans-projects.vercel.app', '');
      return `https://dottie-backend-${branchPart}-lmcreans-projects.vercel.app`;
    }
  }

  // 3. Environment variable override (for special cases/testing)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // 4. LocalStorage override (for manual testing/debugging)
  const savedApiUrl = localStorage.getItem('api_base_url');
  if (savedApiUrl) {
    return savedApiUrl;
  }

  // 5. Default fallback to production backend
  return 'https://dottie-backend.vercel.app';
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