import { request } from '@playwright/test';

/**
 * Creates and returns a reusable request context
 * that preserves cookies and session data across requests
 */
export async function AuthenticatedRequestContext() {
  // Create a persistent context that will maintain cookies and session
  const context = await request.newContext({
    // Base URL from your config
    baseURL: 'http://localhost:5000', // Verify this is the correct port
    
    // Important: Enable storing cookies
    storageState: {
      cookies: [],
      origins: []
    },

    ignoreHTTPSErrors: true
    
    // extraHTTPHeaders: {
    //   'Accept': 'application/json',
    //   'Authorization': `Bearer ${jwtToken}` 
    // }
  });
  
  return context;
}






/**
 * Helper function to make authenticated API requests
 * Automatically adds the Authorization header
 */
export async function authenticatedRequest(requestContext, {
  method, 
  url, 
  token,
  data = null,
  extraHeaders = {}
}) {
  // Set base headers with Authorization
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...extraHeaders
  };
  
  // Create options object
  const options = { headers };
  if (data) {
    options.data = data;
  }
  
  // Make the request with the appropriate method
  switch (method.toLowerCase()) {
    case 'get':
      return await requestContext.get(url, options);
    case 'post':
      return await requestContext.post(url, options);
    case 'put':
      return await requestContext.put(url, options);
    case 'delete':
      return await requestContext.delete(url, options);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
}