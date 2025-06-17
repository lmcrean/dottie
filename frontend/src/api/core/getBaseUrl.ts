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

  // PRIORITY 2: Are we in a Vercel deployment? Check environment variable first
  const isVercelDeployment = window.location.hostname.includes('vercel.app');
  if (isVercelDeployment) {
    console.log(`[getBaseUrl] VERCEL deployment detected`);
    
    const hostname = window.location.hostname;
    
    // 2a. Are we in a Vercel branch deployment? (Check this first to identify context)
    if (hostname.includes('dottie-') && hostname.includes('-lmcreans-projects.vercel.app') && hostname !== 'dottie-lmcreans-projects.vercel.app') {
      console.log(`[getBaseUrl] Branch deployment detected: ${hostname}`);
      
      // For branch deployments, prefer environment variable from CI/CD
      if (import.meta.env.VITE_API_BASE_URL) {
        console.log(`[getBaseUrl] Using CI/CD environment variable: ${import.meta.env.VITE_API_BASE_URL}`);
        return import.meta.env.VITE_API_BASE_URL;
      }
      
      // Alternative: Try to use Vercel's built-in environment variables
      const vercelUrl = import.meta.env.VITE_VERCEL_URL;
      const vercelGitCommitSha = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA;
      
      if (vercelUrl || vercelGitCommitSha) {
        console.log(`[getBaseUrl] Vercel built-in vars - URL: ${vercelUrl}, SHA: ${vercelGitCommitSha}`);
        // Try to construct backend URL using commit SHA or deployment ID
        if (vercelGitCommitSha) {
          const shortSha = vercelGitCommitSha.substring(0, 8);
          const shaBasedUrl = `https://dottie-backend-git-${shortSha}-lmcreans-projects.vercel.app`;
          console.log(`[getBaseUrl] Trying SHA-based backend URL: ${shaBasedUrl}`);
          return shaBasedUrl;
        }
      }
      
      // Fallback: construct URL (likely to fail due to different hashes)
      const branchPart = hostname.replace('dottie-', '').replace('-lmcreans-projects.vercel.app', '');
      const constructedUrl = `https://dottie-backend-${branchPart}-lmcreans-projects.vercel.app`;
      console.warn(`[getBaseUrl] CONSTRUCTED backend URL (likely to fail): ${constructedUrl}`);
      console.warn(`[getBaseUrl] Frontend and backend deployment hashes don't match!`);
      console.warn(`[getBaseUrl] This deployment needs VITE_API_BASE_URL from CI/CD`);
      return constructedUrl;
    }
    
    // 2b. Are we in the main Vercel production branch?
    if (hostname === 'dottie-lmcreans-projects.vercel.app') {
      const prodUrl = 'https://dottie-backend.vercel.app';
      console.log(`[getBaseUrl] Production branch - Using: ${prodUrl}`);
      return prodUrl;
    }
    
    // 2c. Other Vercel deployment - use environment variable if available
    if (import.meta.env.VITE_API_BASE_URL) {
      console.log(`[getBaseUrl] Using CI/CD environment variable: ${import.meta.env.VITE_API_BASE_URL}`);
      return import.meta.env.VITE_API_BASE_URL;
    }
    
    console.log(`[getBaseUrl] Unknown Vercel deployment type, no environment variable found`);
  }

  // PRIORITY 3: LocalStorage override (for manual testing/debugging)
  const savedApiUrl = localStorage.getItem('api_base_url');
  if (savedApiUrl) {
    console.log(`[getBaseUrl] Using localStorage override: ${savedApiUrl}`);
    return savedApiUrl;
  }

  // PRIORITY 4: Default fallback to production backend
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